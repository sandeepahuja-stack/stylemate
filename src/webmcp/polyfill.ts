import type { ModelContext, WebMcpTool } from "./types";

function readNativeContext(): ModelContext | undefined {
  try {
    return document.modelContext ?? navigator.modelContext;
  } catch {
    return navigator.modelContext;
  }
}

function tryAssign(target: object, key: string, value: unknown) {
  try {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value,
    });
    return true;
  } catch {
    return false;
  }
}

function publishOnNavigator(ctx: ModelContext) {
  const nav = navigator as Navigator & {
    modelContext?: ModelContext;
    modelContextTesting?: {
      listTools: () => WebMcpTool[];
      executeTool: (name: string, args?: Record<string, unknown>) => unknown;
    };
  };

  if (!nav.modelContext?.registerTool) {
    try {
      nav.modelContext = ctx;
    } catch {
      tryAssign(nav, "modelContext", ctx);
    }
  }

  const testing = {
    listTools: () => ctx.getTools?.() ?? [],
    executeTool: (name: string, args?: Record<string, unknown>) =>
      ctx.executeTool?.(name, args ?? {}),
  };

  try {
    nav.modelContextTesting = testing;
  } catch {
    tryAssign(nav, "modelContextTesting", testing);
  }
}

export function ensureModelContext(): ModelContext {
  const native = readNativeContext();
  const tools = new Map<string, WebMcpTool>();

  const ctx: ModelContext = {
    async registerTool(tool, options) {
      tools.set(tool.name, tool);
      options?.signal?.addEventListener("abort", () => tools.delete(tool.name));
      if (native?.registerTool) {
        try {
          await native.registerTool(tool, options);
        } catch {
          // Native schema may differ; local registry still works for the inspector.
        }
      }
    },
    getTools: () => [...tools.values()],
    async executeTool(name, args = {}) {
      const tool = tools.get(name);
      if (!tool) throw new Error(`Unknown tool: ${name}`);
      return tool.execute(args);
    },
  };

  publishOnNavigator(ctx);
  return ctx;
}
