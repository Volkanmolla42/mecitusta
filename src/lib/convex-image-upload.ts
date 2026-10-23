import "server-only";

import sharp from "sharp";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export const IMAGE_MIME_TYPES = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
} as const;

export const ALLOWED_IMAGE_TYPES = new Set<string>(
  Object.values(IMAGE_MIME_TYPES),
);
export const MAX_IMAGE_FILE_SIZE_MB = 10;
export const MAX_IMAGE_FILE_SIZE = MAX_IMAGE_FILE_SIZE_MB * 1024 * 1024;
export const MAX_IMAGES_PER_REQUEST = 20;

const MAX_IMAGE_DIMENSION = 1600;
const WEBP_QUALITY = 80;

export type UploadedImage = {
  storageId: Id<"_storage">;
  url: string;
};

async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer, { failOn: "error" })
    .rotate()
    .resize({
      width: MAX_IMAGE_DIMENSION,
      height: MAX_IMAGE_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();
}

async function uploadBuffer(
  token: string,
  buffer: Buffer,
): Promise<Id<"_storage">> {
  const uploadUrl = await fetchMutation(
    api.storage.generateUploadUrl,
    {},
    { token },
  );

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": "image/webp" },
    body: new Uint8Array(buffer),
  });

  if (!response.ok) {
    throw new Error(`Görsel Convex storage'a yüklenemedi (${response.status}).`);
  }

  const payload: unknown = await response.json();
  const storageId =
    typeof payload === "object" &&
    payload !== null &&
    "storageId" in payload &&
    typeof payload.storageId === "string"
      ? payload.storageId
      : null;

  if (!storageId) {
    throw new Error("Convex storage yükleme yanıtı geçersiz.");
  }

  return storageId as Id<"_storage">;
}

export async function uploadImagesToConvex(
  images: readonly Buffer[],
): Promise<UploadedImage[]> {
  if (images.length === 0) return [];
  if (images.length > MAX_IMAGES_PER_REQUEST) {
    throw new Error(
      `Tek istekte en fazla ${MAX_IMAGES_PER_REQUEST} görsel yüklenebilir.`,
    );
  }
  if (images.some((buffer) => buffer.length > MAX_IMAGE_FILE_SIZE)) {
    throw new Error(
      `Görsel en fazla ${MAX_IMAGE_FILE_SIZE_MB} MB olabilir.`,
    );
  }

  const token = await convexAuthNextjsToken();
  if (!token) {
    throw new Error("Görsel yüklemek için oturum açmanız gerekiyor.");
  }

  const storageIds = await Promise.all(
    images.map(async (buffer) => {
      const optimized = await optimizeImage(buffer);
      return await uploadBuffer(token, optimized);
    }),
  );

  const urls = await fetchQuery(
    api.storage.getStorageUrls,
    { storageIds },
    { token },
  );

  if (urls.length !== images.length || urls.some((url) => !url)) {
    throw new Error("Yüklenen görsellerin adresleri alınamadı.");
  }

  return storageIds.map((storageId, index) => ({
    storageId,
    url: urls[index],
  }));
}
