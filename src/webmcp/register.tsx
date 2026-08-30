"use client";

import { useEffect } from "react";
import {
  addToCart,
  addToWishlist,
  applyCoupon,
  buildOutfitTool,
  checkInventoryTool,
  checkSizeAvailabilityTool,
  compareProductsTool,
  getAvailableCoupons,
  getProductDetailsTool,
  getRecommendationsTool,
  getUserStyleProfile,
  searchProductsTool,
  updateCart,
} from "@/domain/store";
import { ensureModelContext } from "./polyfill";
import type { WebMcpTool } from "./types";

function result(data: unknown) {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    structuredContent: data,
  };
}

const TOOLS: WebMcpTool[] = [
  {
    name: "getUserStyleProfile",
    title: "Get style profile",
    description:
      "Return the private client's style identity, preferred colors, silhouettes, materials, occasions, and budget.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: () => result(getUserStyleProfile()),
  },
  {
    name: "searchProducts",
    title: "Search the collection",
    description:
      "Search or refine the live collection. Use conversational constraints such as category, materials, styles, occasions, excludeBright, and free text.",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string" },
        category: {
          type: "string",
          enum: ["shoes", "shirts", "trousers", "jackets", "suits", "accessories"],
        },
        materials: { type: "array", items: { type: "string" } },
        styles: { type: "array", items: { type: "string" } },
        occasions: { type: "array", items: { type: "string" } },
        excludeBright: { type: "boolean" },
        maxPrice: { type: "number" },
      },
    },
    annotations: { readOnlyHint: true },
    execute: (args) => result(searchProductsTool(args)),
  },
  {
    name: "getProductDetails",
    title: "Get product details",
    description: "Return the full editorial details for a catalog product by id.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
    annotations: { readOnlyHint: true },
    execute: (args) => result(getProductDetailsTool(String(args.id))),
  },
  {
    name: "getRecommendations",
    title: "Recommend pieces",
    description:
      "Rank products against the client's style profile and a natural-language brief. Updates the live website with the recommendations.",
    inputSchema: {
      type: "object",
      properties: {
        intent: { type: "string", description: "What the client is dressing for." },
        limit: { type: "number" },
      },
      required: ["intent"],
    },
    annotations: { readOnlyHint: true },
    execute: (args) =>
      result(getRecommendationsTool(String(args.intent ?? ""), Number(args.limit) || 3)),
  },
  {
    name: "compareProducts",
    title: "Compare products",
    description: "Compare two or three products and return a stylist's verdict.",
    inputSchema: {
      type: "object",
      properties: {
        ids: { type: "array", items: { type: "string" } },
      },
      required: ["ids"],
    },
    annotations: { readOnlyHint: true },
    execute: (args) => result(compareProductsTool((args.ids as string[]) ?? [])),
  },
  {
    name: "checkInventory",
    title: "Check inventory",
    description: "Check atelier availability for a product.",
    inputSchema: {
      type: "object",
      properties: { productId: { type: "string" } },
      required: ["productId"],
    },
    annotations: { readOnlyHint: true },
    execute: (args) => result(checkInventoryTool(String(args.productId))),
  },
  {
    name: "checkSizeAvailability",
    title: "Check size",
    description: "Check whether a specific size is available.",
    inputSchema: {
      type: "object",
      properties: {
        productId: { type: "string" },
        size: { type: "string" },
      },
      required: ["productId", "size"],
    },
    annotations: { readOnlyHint: true },
    execute: (args) =>
      result(checkSizeAvailabilityTool(String(args.productId), String(args.size))),
  },
  {
    name: "buildOutfit",
    title: "Complete the look",
    description: "Compose a complete outfit around an optional anchor product.",
    inputSchema: {
      type: "object",
      properties: { anchorId: { type: "string" } },
    },
    annotations: { readOnlyHint: true },
    execute: (args) => result(buildOutfitTool(args.anchorId ? String(args.anchorId) : undefined)),
  },
  {
    name: "addToWishlist",
    title: "Add to wardrobe",
    description:
      "Propose adding a product to the client's wardrobe. Requires human confirmation before it persists.",
    inputSchema: {
      type: "object",
      properties: { productId: { type: "string" } },
      required: ["productId"],
    },
    execute: (args) => result(addToWishlist(String(args.productId))),
  },
  {
    name: "addToCart",
    title: "Add to cart",
    description:
      "Propose adding a product and size to the cart. Requires human confirmation. Never places an order.",
    inputSchema: {
      type: "object",
      properties: {
        productId: { type: "string" },
        size: { type: "string" },
      },
      required: ["productId"],
    },
    execute: (args) => result(addToCart(String(args.productId), args.size ? String(args.size) : undefined)),
  },
  {
    name: "updateCart",
    title: "Update cart",
    description: "Update quantity for an existing cart line. Quantity 0 removes the line.",
    inputSchema: {
      type: "object",
      properties: {
        productId: { type: "string" },
        size: { type: "string" },
        quantity: { type: "number" },
      },
      required: ["productId", "size", "quantity"],
    },
    execute: (args) =>
      result(updateCart(String(args.productId), String(args.size), Number(args.quantity))),
  },
  {
    name: "getAvailableCoupons",
    title: "List courtesies",
    description: "Return private-client courtesies. Applying one requires confirmation.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: () => result(getAvailableCoupons()),
  },
  {
    name: "applyCoupon",
    title: "Apply courtesy",
    description: "Propose applying a private courtesy code. Requires confirmation.",
    inputSchema: {
      type: "object",
      properties: { code: { type: "string" } },
      required: ["code"],
    },
    execute: (args) => result(applyCoupon(String(args.code))),
  },
];

export function WebMcpRegistrar() {
  useEffect(() => {
    const ctx = ensureModelContext();
    const controller = new AbortController();
    TOOLS.forEach((tool) => {
      void ctx.registerTool(tool, { signal: controller.signal });
    });
    window.__stylemateTools = {
      getTools: () => TOOLS.map((t) => t.name),
      executeTool: async (name, args) => {
        const tool = TOOLS.find((t) => t.name === name);
        if (!tool) throw new Error(`Unknown tool: ${name}`);
        return tool.execute(args ?? {});
      },
    };
    return () => controller.abort();
  }, []);

  return null;
}
