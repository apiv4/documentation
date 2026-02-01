"use client";

import React from "react"

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export interface TableParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
  notes?: string;
}

export interface TableHeader {
  name: string;
  value: string;
  description: string;
  example?: string;
}

interface StyledParametersTableProps {
  parameters: TableParameter[];
  title?: string;
  className?: string;
}

interface StyledHeadersTableProps {
  headers: TableHeader[];
  title?: string;
  className?: string;
}

/**
 * A styled table component for displaying API request/response parameters.
 * Follows Swiss modernism aesthetic with clean lines, generous whitespace,
 * and alternating subtle gray row backgrounds.
 */
export function StyledParametersTable({
  parameters,
  title,
  className,
}: StyledParametersTableProps) {
  return (
    <div className={cn("my-6", className)}>
      {title && (
        <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
          {title}
        </h4>
      )}
      <div className="overflow-hidden rounded-sm border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--table-header)] border-b-2 border-border">
                <th className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">
                  Parameter
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">
                  Type
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">
                  Required
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((param, index) => (
                <tr
                  key={param.name}
                  className={cn(
                    "border-b border-border last:border-b-0 transition-colors",
                    index % 2 === 1 && "bg-[var(--table-row-alt)]",
                    "hover:bg-muted/60"
                  )}
                >
                  <td className="px-4 py-3 align-top">
                    <code className="text-[13px] font-mono bg-secondary px-1.5 py-0.5 rounded text-primary font-medium">
                      {param.name}
                    </code>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className="text-muted-foreground font-mono text-[13px]">
                      {param.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Badge
                      variant={param.required ? "default" : "secondary"}
                      className={cn(
                        "text-xs font-medium",
                        param.required
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {param.required ? "Yes" : "No"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-start gap-2">
                      <span className="text-foreground leading-relaxed">
                        {param.description}
                      </span>
                      {(param.example || param.notes) && (
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className="flex-shrink-0 mt-0.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                                aria-label="More information"
                              >
                                <Info className="h-4 w-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-xs bg-foreground text-background p-3"
                            >
                              <div className="space-y-2 text-sm">
                                {param.example && (
                                  <div>
                                    <span className="font-semibold">Example: </span>
                                    <code className="text-xs bg-background/20 px-1 py-0.5 rounded">
                                      {param.example}
                                    </code>
                                  </div>
                                )}
                                {param.notes && (
                                  <div className="text-background/90">
                                    {param.notes}
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * A styled table component for displaying API headers.
 * Follows Swiss modernism aesthetic with clean lines.
 */
export function StyledHeadersTable({
  headers,
  title,
  className,
}: StyledHeadersTableProps) {
  return (
    <div className={cn("my-6", className)}>
      {title && (
        <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
          {title}
        </h4>
      )}
      <div className="overflow-hidden rounded-sm border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--table-header)] border-b-2 border-border">
                <th className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">
                  Header
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">
                  Value
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {headers.map((header, index) => (
                <tr
                  key={header.name}
                  className={cn(
                    "border-b border-border last:border-b-0 transition-colors",
                    index % 2 === 1 && "bg-[var(--table-row-alt)]",
                    "hover:bg-muted/60"
                  )}
                >
                  <td className="px-4 py-3 align-top">
                    <code className="text-[13px] font-mono bg-secondary px-1.5 py-0.5 rounded text-primary font-medium">
                      {header.name}
                    </code>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <code className="text-[13px] font-mono text-muted-foreground">
                      {header.value}
                    </code>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-start gap-2">
                      <span className="text-foreground leading-relaxed">
                        {header.description}
                      </span>
                      {header.example && (
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className="flex-shrink-0 mt-0.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                                aria-label="View example"
                              >
                                <Info className="h-4 w-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-xs bg-foreground text-background p-3"
                            >
                              <div className="text-sm">
                                <span className="font-semibold">Example: </span>
                                <code className="text-xs bg-background/20 px-1 py-0.5 rounded break-all">
                                  {header.example}
                                </code>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * A combined variant that can display both headers and parameters
 * in a unified format with visual separation.
 */
interface CombinedTableProps {
  headers?: TableHeader[];
  parameters?: TableParameter[];
  headersTitle?: string;
  parametersTitle?: string;
  className?: string;
}

export function StyledAPITable({
  headers,
  parameters,
  headersTitle = "Headers",
  parametersTitle = "Request Parameters",
  className,
}: CombinedTableProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {headers && headers.length > 0 && (
        <StyledHeadersTable headers={headers} title={headersTitle} />
      )}
      {parameters && parameters.length > 0 && (
        <StyledParametersTable parameters={parameters} title={parametersTitle} />
      )}
    </div>
  );
}

/**
 * A simple generic table for error codes and other content
 * with the same Swiss modernism styling.
 */
interface GenericTableColumn {
  key: string;
  header: string;
  className?: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface StyledGenericTableProps<T extends Record<string, unknown>> {
  columns: GenericTableColumn[];
  data: T[];
  title?: string;
  className?: string;
}

export function StyledGenericTable<T extends Record<string, unknown>>({
  columns,
  data,
  title,
  className,
}: StyledGenericTableProps<T>) {
  return (
    <div className={cn("my-6", className)}>
      {title && (
        <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
          {title}
        </h4>
      )}
      <div className="overflow-hidden rounded-sm border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--table-header)] border-b-2 border-border">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-left font-semibold text-foreground",
                      col.className
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className={cn(
                    "border-b border-border last:border-b-0 transition-colors",
                    index % 2 === 1 && "bg-[var(--table-row-alt)]",
                    "hover:bg-muted/60"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-4 py-3 align-top", col.className)}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : (row[col.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
