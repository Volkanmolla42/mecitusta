import type { Id } from "@convex/_generated/dataModel";

export type UploadedAdminImage = {
  storageId: Id<"_storage">;
  url: string;
};

async function uploadFiles(files: File[]): Promise<UploadedAdminImage[]> {
  const formData = new FormData();
  for (const file of files) formData.append("files", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as {
    success?: boolean;
    items?: Array<{ storageId?: string; url?: string }>;
    message?: string;
  };

  if (!response.ok || !data.success || !Array.isArray(data.items)) {
    throw new Error(data.message || "Görsel yüklenemedi.");
  }

  if (data.items.length !== files.length) {
    throw new Error("Görsel yükleme yanıtı geçersiz.");
  }

  return data.items.map((item) => {
    if (!item.storageId || !item.url) {
      throw new Error("Görsel yükleme yanıtı geçersiz.");
    }
    return {
      storageId: item.storageId as Id<"_storage">,
      url: item.url,
    };
  });
}

export async function uploadAdminImage(
  file: File,
): Promise<UploadedAdminImage> {
  const [image] = await uploadFiles([file]);
  if (!image) throw new Error("Görsel yüklenemedi.");
  return image;
}

export async function uploadAdminImages(
  files: File[],
): Promise<UploadedAdminImage[]> {
  return await uploadFiles(files);
}
