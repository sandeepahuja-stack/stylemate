export type JsonSchema = {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
};

export type WebMcpTool = {
  name: string;
  title?: string;
  description: string;
  inputSchema: JsonSchema;
  annotations?: {
    readOnlyHint?: boolean;
    untrustedContentHint?: boolean;
  };
  execute: (args: Record<string, unknown>) => Promise<unknown> | unknown;
};

export type ModelContext = {
  registerTool: (
    tool: WebMcpTool,
    options?: { signal?: AbortSignal },
  ) => Promise<void> | void;
  getTools?: () => WebMcpTool[];
  executeTool?: (name: string, args?: Record<string, unknown>) => Promise<unknown>;
};

declare global {
  interface Document {
    modelContext?: ModelContext;
  }
  interface Navigator {
    modelContext?: ModelContext;
  }
  interface Window {
    __stylemateTools?: {
      getTools: () => string[];
      executeTool: (name: string, args?: Record<string, unknown>) => Promise<unknown>;
    };
  }
}
