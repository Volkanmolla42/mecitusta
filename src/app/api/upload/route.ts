import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiRequest } from "@/lib/auth/admin-api";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_FILE_SIZE,
  MAX_IMAGE_FILE_SIZE_MB,
  MAX_IMAGES_PER_REQUEST,
  uploadImagesToConvex,
} from "@/lib/convex-image-upload";

const MAX_REQUEST_SIZE = 16 * 1024 * 1024;
const MAX_CONTENT_LENGTH = 17 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdminApiRequest(req);
  if (unauthorized) return unauthorized;

  const contentLength = Number(req.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_CONTENT_LENGTH) {
    return NextResponse.json(
      { success: false, message: "Tek istekte en fazla 16 MB görsel yüklenebilir." },
      { status: 413 },
    );
  }

  try {
    const formData = await req.formData();
    const filesToProcess = formData.getAll("files") as File[];

    if (filesToProcess.length === 0) {
      return NextResponse.json(
        { success: false, message: "Yüklenecek dosya bulunamadı." },
        { status: 400 }
      );
    }

    if (filesToProcess.length > MAX_IMAGES_PER_REQUEST) {
      return NextResponse.json(
        {
          success: false,
          message: `Tek istekte en fazla ${MAX_IMAGES_PER_REQUEST} görsel yüklenebilir.`,
        },
        { status: 413 },
      );
    }

    if (filesToProcess.reduce((total, file) => total + file.size, 0) > MAX_REQUEST_SIZE) {
      return NextResponse.json(
        { success: false, message: "Tek istekte en fazla 16 MB görsel yüklenebilir." },
        { status: 413 },
      );
    }

    for (const file of filesToProcess) {
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        return NextResponse.json(
          { success: false, message: "Yalnızca JPG, PNG, WebP veya AVIF görsel yüklenebilir." },
          { status: 400 }
        );
      }
      if (file.size > MAX_IMAGE_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: `Her görsel en fazla ${MAX_IMAGE_FILE_SIZE_MB} MB olabilir.`,
          },
          { status: 400 }
        );
      }
    }

    const buffers = await Promise.all(
      filesToProcess.map(async (file) => Buffer.from(await file.arrayBuffer())),
    );
    const uploaded = await uploadImagesToConvex(buffers);

    return NextResponse.json({
      success: true,
      items: uploaded,
    });
  } catch (error: unknown) {
    console.error("Convex upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Dosya yüklenirken hata oluştu.",
      },
      { status: 500 }
    );
  }
}
