import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import {
  getVisionLookupSystemInstruction,
  formatCategoriesList,
  formatBrandsList,
  parseLlmJson,
  DEFAULT_GEMINI_MODELS,
} from "@/lib/ai/oem-assistant";
import { requireAdminApiRequest } from "@/lib/auth/admin-api";
import {
  IMAGE_MIME_TYPES,
  MAX_IMAGE_FILE_SIZE,
  MAX_IMAGE_FILE_SIZE_MB,
  MAX_IMAGES_PER_REQUEST,
  uploadImagesToConvex,
} from "@/lib/convex-image-upload";
import { sanitizeTurkishText } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdminApiRequest(req);
  if (unauthorized) return unauthorized;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY ortam değişkeni tanımlı değil." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const shelfCode = (formData.get("shelfCode") as string) || "GENEL";
    const categoryHint = sanitizeTurkishText((formData.get("categoryHint") as string) || "Oto Elektronik");
    const brandHint = sanitizeTurkishText((formData.get("brandHint") as string) || "Genel");
    const categoriesJson = (formData.get("categories") as string) || "[]";
    const brandsJson = (formData.get("brands") as string) || "[]";

    let categories: unknown[] = [];
    let brands: unknown[] = [];
    try {
      const parsedCategories: unknown = JSON.parse(categoriesJson);
      const parsedBrands: unknown = JSON.parse(brandsJson);
      if (Array.isArray(parsedCategories)) categories = parsedCategories;
      if (Array.isArray(parsedBrands)) brands = parsedBrands;
    } catch {
      // Fallback empty
    }

    const files = formData.getAll("files") as File[];
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "İşlenecek görsel dosyası bulunamadı." },
        { status: 400 }
      );
    }

    if (files.length > MAX_IMAGES_PER_REQUEST) {
      return NextResponse.json(
        { error: `Tek istekte en fazla ${MAX_IMAGES_PER_REQUEST} görsel işlenebilir.` },
        { status: 413 }
      );
    }

    if (files.some((file) => file.size > MAX_IMAGE_FILE_SIZE)) {
      return NextResponse.json(
        { error: `Her görsel en fazla ${MAX_IMAGE_FILE_SIZE_MB} MB olabilir.` },
        { status: 400 }
      );
    }

    const validatedFiles = await Promise.all(files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const metadata = await sharp(buffer, { failOn: "error" }).metadata();
      const mimeType = metadata.format
        ? IMAGE_MIME_TYPES[metadata.format as keyof typeof IMAGE_MIME_TYPES]
        : undefined;
      if (!mimeType) {
        throw new Error("Yalnızca JPEG, PNG, WebP veya AVIF görseller desteklenir.");
      }
      return { buffer, mimeType };
    }));

    // 1. İlk 4 görseli AI Vision analizi için bellekteki Buffer'dan hazırla
    const imageParts: { inlineData: { data: string; mimeType: string } }[] = [];
    for (let i = 0; i < Math.min(validatedFiles.length, 4); i++) {
      imageParts.push({
        inlineData: {
          data: validatedFiles[i].buffer.toString("base64"),
          mimeType: validatedFiles[i].mimeType,
        },
      });
    }

    // 2. Gemini Vision İle OEM Analizi Yap
    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = getVisionLookupSystemInstruction();
    const categoriesStr = formatCategoriesList(categories);
    const brandsStr = formatBrandsList(brands);

    const userPrompt = `Görsellerdeki oto elektronik parçasını ve üzerindeki etiketleri dikkatle incele.
Parçanın ön, arka veya yan tarafındaki tüm etiketlerdeki kodları oku, ana OEM numarasını ve üretici (Bosch, Continental, Delphi, Siemens, ATE, Autoliv vb.) kodlarını tespit et ve JSON çıktısını üret.

Klasör ve Dosya İpuçları:
- Raf/Stok Kodu: ${shelfCode}
- Tahmini Kategori: ${categoryHint}
- Tahmini Marka: ${brandHint}

SİSTEMDE KAYITLI KATEGORİLER:
${categoriesStr}

SİSTEMDE KAYITLI MARKALAR:
${brandsStr}`;

    const modelsToTry = DEFAULT_GEMINI_MODELS;
    let aiResponse: Awaited<ReturnType<typeof ai.models.generateContent>> | undefined;
    let lastErr: unknown;

    for (const model of modelsToTry) {
      try {
        aiResponse = await ai.models.generateContent({
          model,
          contents: [
            {
              role: "user",
              parts: [{ text: userPrompt }, ...imageParts],
            },
          ],
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        });
        if (aiResponse?.text) break;
      } catch (error: unknown) {
        lastErr = error;
      }
    }

    if (!aiResponse?.text) {
      const errorMessage = lastErr instanceof Error ? lastErr.message : "Bilinmeyen hata";
      throw new Error(`Yapay zeka analizi başarısız oldu: ${errorMessage}`);
    }

    const parsedData = parseLlmJson(aiResponse.text);
    const oem = parsedData.detectedOem?.trim();
    const isDraft = !oem || oem === shelfCode || oem === "null" || oem === "İNCELEME GEREKLİ";
    const detectedOem = isDraft ? "İNCELEME GEREKLİ" : oem;
    const cleanBrand = sanitizeTurkishText(parsedData.brand || brandHint);
    const cleanCategory = sanitizeTurkishText(parsedData.suggestedCategoryName || categoryHint);
    const detectedTitle = sanitizeTurkishText(
      isDraft
        ? `${cleanBrand} ${cleanCategory} - Raf: ${shelfCode} (İNCELEME GEREKLİ)`
        : (parsedData.title || `${cleanBrand} ${detectedOem} Oto Elektronik Beyin`)
    );

    // 3. Görselleri optimize edip Convex storage'a yükle
    const uploaded = await uploadImagesToConvex(
      validatedFiles.map((file) => file.buffer),
    );
    const uploadedUrls = uploaded.map((image) => image.url);

    return NextResponse.json({
      success: true,
      shelfCode,
      isDraft,
      oemNumber: detectedOem,
      cleanOemNumber: isDraft ? "" : (parsedData.cleanOem || detectedOem),
      title: detectedTitle,
      brand: parsedData.brand || brandHint,
      model: isDraft ? "" : (parsedData.model || "Genel Uyumlu"),
      condition: parsedData.condition || "Orijinal Çıkma",
      description: isDraft ? "" : (parsedData.description || ""),
      matchedCategoryId: parsedData.matchedCategoryId,
      suggestedCategoryName: parsedData.suggestedCategoryName,
      images: uploadedUrls,
      metaTitle: isDraft ? "" : (parsedData.metaTitle || detectedTitle.slice(0, 60)),
      metaDescription: isDraft ? "" : (parsedData.metaDescription || ""),
      metaKeywords: isDraft ? "" : (parsedData.metaKeywords || ""),
      tags: isDraft ? [] : (parsedData.tags || [detectedOem, shelfCode]),
    });
  } catch (error: unknown) {
    console.error("Batch process item error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : "Parça işlenirken beklenmeyen bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}
