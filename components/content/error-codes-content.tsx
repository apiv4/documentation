"use client";

import React from "react"

import { useState, useMemo, useCallback } from "react";
import { Search, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ErrorCode {
  code: string;
  errorType: string;
  description: string;
}

const userValidationErrors: ErrorCode[] = [
  { code: "404", errorType: "USER_NOT_FOUND", description: "User not found in system" },
  { code: "404", errorType: "PROJECT_NOT_FOUND", description: "Project not found" },
  { code: "403", errorType: "PROHIBITED_FOR_USER", description: "User must contact project support" },
  { code: "401", errorType: "INVALID_SIGNATURE", description: "Request signature is invalid" },
  { code: "415", errorType: "UNSUPPORTED_CONTENT_TYPE", description: "Content-Type not supported" },
  { code: "400", errorType: "VALIDATION_ERROR", description: "Field validation failed" },
];

const depositCreationErrors: ErrorCode[] = [
  { code: "404", errorType: "PROJECT_NOT_FOUND", description: "Project not found" },
  { code: "401", errorType: "INVALID_SIGNATURE", description: "Invalid signature" },
  { code: "403", errorType: "EXCEEDS_MAX_AMOUNT", description: "Amount exceeds maximum allowed" },
  { code: "400", errorType: "CURRENCY_NOT_SUPPORTED", description: "Currency not supported" },
  { code: "400", errorType: "DEPOSIT_ALREADY_PROCESSED", description: "Deposit already created for user" },
  { code: "400", errorType: "INVALID_STATUS", description: "Invalid status value" },
  { code: "400", errorType: "UNSUPPORTED_PAYMENT_METHOD", description: "Payment method not supported" },
  { code: "400", errorType: "VALIDATION_ERROR", description: "Field validation failed" },
  { code: "415", errorType: "UNSUPPORTED_MEDIA_TYPE", description: "Unsupported data type" },
];

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span
            key={index}
            className="text-[#002395] font-semibold bg-[#002395]/10 px-0.5 rounded"
          >
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}

function ErrorTable({
  title,
  errors,
  query,
  icon: Icon,
}: {
  title: string;
  errors: ErrorCode[];
  query: string;
  icon: React.ElementType;
}) {
  const filteredErrors = useMemo(() => {
    if (!query.trim()) return errors;
    const lowerQuery = query.toLowerCase();
    return errors.filter(
      (error) =>
        error.code.toLowerCase().includes(lowerQuery) ||
        error.errorType.toLowerCase().includes(lowerQuery) ||
        error.description.toLowerCase().includes(lowerQuery)
    );
  }, [errors, query]);

  const hasResults = filteredErrors.length > 0;

  return (
    <div className="scroll-mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-[#002395]" />
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        {query && (
          <span className="text-sm text-muted-foreground ml-2">
            ({filteredErrors.length} of {errors.length})
          </span>
        )}
      </div>

      {hasResults ? (
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full m-0">
            <thead>
              <tr>
                <th className="w-20 text-left">Code</th>
                <th className="text-left">Error Type</th>
                <th className="text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredErrors.map((error, index) => (
                <tr
                  key={`${error.errorType}-${index}`}
                  className="transition-all duration-200 hover:bg-[#002395]/5"
                >
                  <td className="font-mono text-sm">
                    <span
                      className={`inline-flex items-center justify-center w-12 py-0.5 rounded text-xs font-semibold ${
                        error.code === "400"
                          ? "bg-amber-100 text-amber-800"
                          : error.code === "401"
                          ? "bg-red-100 text-red-800"
                          : error.code === "403"
                          ? "bg-orange-100 text-orange-800"
                          : error.code === "404"
                          ? "bg-slate-100 text-slate-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      <HighlightedText text={error.code} query={query} />
                    </span>
                  </td>
                  <td className="font-mono text-sm text-foreground">
                    <HighlightedText text={error.errorType} query={query} />
                  </td>
                  <td className="text-muted-foreground">
                    <HighlightedText text={error.description} query={query} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 border border-border rounded-md bg-muted/30 text-center">
          <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            No matching errors found for &quot;{query}&quot;
          </p>
        </div>
      )}
    </div>
  );
}

export function ErrorCodesContent() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleClear = useCallback(() => {
    setSearchQuery("");
  }, []);

  const totalResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const lowerQuery = searchQuery.toLowerCase();
    const userCount = userValidationErrors.filter(
      (e) =>
        e.code.toLowerCase().includes(lowerQuery) ||
        e.errorType.toLowerCase().includes(lowerQuery) ||
        e.description.toLowerCase().includes(lowerQuery)
    ).length;
    const depositCount = depositCreationErrors.filter(
      (e) =>
        e.code.toLowerCase().includes(lowerQuery) ||
        e.errorType.toLowerCase().includes(lowerQuery) ||
        e.description.toLowerCase().includes(lowerQuery)
    ).length;
    return userCount + depositCount;
  }, [searchQuery]);

  return (
    <div className="space-y-8">
      <p className="text-foreground">
        Reference guide for all error codes returned by the API. Use the search to quickly find
        specific error codes and their descriptions.
      </p>

      {/* Search Input */}
      <div className="scroll-mt-8">
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search by error code, type, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-11 text-base"
              />
            </div>
            {searchQuery && (
              <Button
                variant="outline"
                size="default"
                onClick={handleClear}
                className="h-11 px-4 gap-2 shrink-0 cursor-pointer bg-transparent"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Search Results Summary */}
          {searchQuery && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              {totalResults !== null && totalResults > 0 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-foreground">
                    Found <strong className="text-[#002395]">{totalResults}</strong> matching{" "}
                    {totalResults === 1 ? "error" : "errors"}
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-muted-foreground">No results found</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Validation Errors */}
      <ErrorTable
        title="User Validation Errors"
        errors={userValidationErrors}
        query={searchQuery}
        icon={AlertCircle}
      />

      {/* Deposit Creation Errors */}
      <div className="mt-8">
        <ErrorTable
          title="Deposit Creation Errors"
          errors={depositCreationErrors}
          query={searchQuery}
          icon={AlertCircle}
        />
      </div>

      {/* Support Contact */}
      <div className="p-4 bg-muted rounded border-l-4 border-[#002395] mt-8">
        <p className="text-foreground font-semibold">Support Contact</p>
        <p className="text-muted-foreground text-sm mt-1">
          For API key requests or technical assistance, please contact your account manager.
        </p>
      </div>
    </div>
  );
}
