"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
export interface APIParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface APIResponse {
  label: string;
  status: "success" | "pending" | "error";
  statusCode: number;
  body: object;
}

export interface APIRequestResponseViewerProps {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  description?: string;
  requestBody?: object;
  parameters: APIParameter[];
  responses: APIResponse[];
}

// Copy button with feedback
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-2 rounded-md bg-background/80 hover:bg-background border border-border/50 transition-all duration-200 cursor-pointer group"
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      )}
    </button>
  );
}

// Syntax highlighted JSON viewer
function JSONViewer({ data, collapsed = false }: { data: object; collapsed?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(!collapsed);
  const jsonString = JSON.stringify(data, null, 2);

  const highlightJSON = (json: string) => {
    return json.split("\n").map((line, index) => {
      // Highlight keys
      const highlightedLine = line
        .replace(/"([^"]+)":/g, '<span class="text-[#002395] font-medium">"$1"</span>:')
        .replace(/: "([^"]*)"(,?)/g, ': <span class="text-emerald-700">"$1"</span>$2')
        .replace(/: (\d+\.?\d*)(,?)/g, ': <span class="text-amber-700">$1</span>$2')
        .replace(/: (true|false)(,?)/g, ': <span class="text-rose-600">$1</span>$2')
        .replace(/: (null)(,?)/g, ': <span class="text-gray-500">$1</span>$2');

      return (
        <span key={index} className="block">
          <span dangerouslySetInnerHTML={{ __html: highlightedLine }} />
        </span>
      );
    });
  };

  if (collapsed && !isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
        <span className="text-sm">Show response body</span>
      </button>
    );
  }

  return (
    <div className="relative">
      {collapsed && (
        <button
          onClick={() => setIsExpanded(false)}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-2 cursor-pointer"
        >
          <ChevronDown className="w-4 h-4" />
          <span className="text-sm">Hide response body</span>
        </button>
      )}
      <div className="relative group">
        <pre className="font-mono text-sm leading-relaxed overflow-x-auto p-4 rounded-md bg-[#f5f5f5] border border-border/50">
          <code>{highlightJSON(jsonString)}</code>
        </pre>
        <CopyButton text={jsonString} />
      </div>
    </div>
  );
}

// Method badge with color coding
function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-emerald-100 text-emerald-800 border-emerald-200",
    POST: "bg-blue-100 text-blue-800 border-blue-200",
    PUT: "bg-amber-100 text-amber-800 border-amber-200",
    DELETE: "bg-rose-100 text-rose-800 border-rose-200",
    PATCH: "bg-purple-100 text-purple-800 border-purple-200",
  };

  return (
    <span
      className={cn(
        "px-2 py-1 text-xs font-bold rounded border font-mono",
        colors[method] || "bg-gray-100 text-gray-800 border-gray-200"
      )}
    >
      {method}
    </span>
  );
}

// Status badge for responses
function StatusBadge({ status, statusCode }: { status: string; statusCode: number }) {
  const variants: Record<string, { bg: string; text: string; dot: string }> = {
    success: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    error: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
  };

  const v = variants[status] || variants.error;

  return (
    <span className={cn("inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium", v.bg, v.text)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", v.dot)} />
      {statusCode}
    </span>
  );
}

// Parameters table
function ParametersTable({ parameters }: { parameters: APIParameter[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-sm m-0">
        <thead>
          <tr className="bg-[#f0f0f0] border-b border-border">
            <th className="text-left px-4 py-3 font-semibold text-foreground">Parameter</th>
            <th className="text-left px-4 py-3 font-semibold text-foreground">Type</th>
            <th className="text-left px-4 py-3 font-semibold text-foreground">Required</th>
            <th className="text-left px-4 py-3 font-semibold text-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((param, index) => (
            <tr
              key={param.name}
              className={cn(
                "border-b border-border last:border-b-0 transition-colors hover:bg-muted/50",
                index % 2 === 1 && "bg-[#fafafa]"
              )}
            >
              <td className="px-4 py-3">
                <code className="text-sm font-mono bg-[#f5f5f5] px-1.5 py-0.5 rounded text-[#002395]">
                  {param.name}
                </code>
              </td>
              <td className="px-4 py-3">
                <span className="text-muted-foreground font-mono text-xs">{param.type}</span>
              </td>
              <td className="px-4 py-3">
                {param.required ? (
                  <Badge variant="default" className="bg-[#002395] text-white text-xs">
                    Required
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    Optional
                  </Badge>
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{param.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Main component
export function APIRequestResponseViewer({
  endpoint,
  method,
  description,
  requestBody,
  parameters,
  responses,
}: APIRequestResponseViewerProps) {
  const [activeTab, setActiveTab] = useState("request");

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card shadow-sm">
      {/* Header with endpoint info */}
      <div className="px-5 py-4 bg-gradient-to-r from-[#f8f9fa] to-[#f0f2f5] border-b border-border">
        <div className="flex flex-wrap items-center gap-3">
          <MethodBadge method={method} />
          <code className="text-sm font-mono text-foreground break-all">{endpoint}</code>
        </div>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-5 pt-3 border-b border-border bg-background">
          <TabsList className="h-10 p-1 bg-muted/50">
            <TabsTrigger
              value="request"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 cursor-pointer"
            >
              Request
            </TabsTrigger>
            {responses.map((response) => (
              <TabsTrigger
                key={response.label}
                value={response.label}
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 gap-2 cursor-pointer"
              >
                <span>{response.label}</span>
                <StatusBadge status={response.status} statusCode={response.statusCode} />
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Request Tab Content */}
        <TabsContent value="request" className="p-5 space-y-6 mt-0">
          {requestBody && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#002395]" />
                Request Body
              </h4>
              <JSONViewer data={requestBody} />
            </div>
          )}

          {parameters.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#002395]" />
                Parameters
              </h4>
              <ParametersTable parameters={parameters} />
            </div>
          )}
        </TabsContent>

        {/* Response Tab Contents */}
        {responses.map((response) => (
          <TabsContent key={response.label} value={response.label} className="p-5 mt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      response.status === "success" && "bg-emerald-500",
                      response.status === "pending" && "bg-amber-500",
                      response.status === "error" && "bg-rose-500"
                    )}
                  />
                  Response Body
                </h4>
                <StatusBadge status={response.status} statusCode={response.statusCode} />
              </div>
              <JSONViewer data={response.body} />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
