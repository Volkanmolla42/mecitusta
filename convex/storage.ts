import { mutation, query, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { requireAdmin } from "./authz";

export async function storageUrl(ctx: QueryCtx, storageId: Id<"_storage">) {
  return (await ctx.storage.getUrl(storageId)) ?? "";
}

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const getStorageUrls = query({
  args: { storageIds: v.array(v.id("_storage")) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await Promise.all(
      args.storageIds.map((storageId) => storageUrl(ctx, storageId)),
    );
  },
});
