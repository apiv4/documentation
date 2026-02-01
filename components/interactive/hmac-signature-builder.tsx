"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Check, Play, RotateCcw } from "lucide-react";

interface SignatureParameter {
  id: string;
  label: string;
  value: string;
  description: string;
  color: string;
}

const parameters: SignatureParameter[] = [
  {
    id: "method",
    label: "METHOD",
    value: "POST",
    description: "HTTP method (GET, POST, etc.)",
    color: "#002395",
  },
  {
    id: "path",
    label: "PATH",
    value: "/api/v4/payments/raisboy/deposit/create",
    description: "Request path without domain",
    color: "#0033cc",
  },
  {
    id: "body",
    label: "BODY",
    value: '{"user_id":"2564568","amount":5000}',
    description: "Raw request body string (key order matters)",
    color: "#1a47cc",
  },
  {
    id: "timestamp",
    label: "TIMESTAMP",
    value: "1706620800",
    description: "Same value as X-Timestamp header",
    color: "#2952cc",
  },
  {
    id: "api_key",
    label: "API_KEY",
    value: "your_api_key_here",
    description: "Your project API key",
    color: "#3d66d9",
  },
];

export function HMACSignatureBuilder() {
  const [activeStep, setActiveStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection observer for scroll-triggered visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.4 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-play animation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= parameters.length - 1) {
          setIsPlaying(false);
          setIsComplete(true);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleStart = () => {
    setActiveStep(-1);
    setIsComplete(false);
    setTimeout(() => {
      setIsPlaying(true);
      setActiveStep(0);
    }, 100);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStep(-1);
    setIsComplete(false);
  };

  const handleStepClick = (index: number) => {
    if (!isPlaying) {
      setActiveStep(index);
      setIsComplete(index === parameters.length - 1);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative rounded-lg border border-border bg-card overflow-hidden transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      {/* Header */}
      <div className="bg-[#002395] px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-lg mb-1">Signature String Builder</h4>
            <p className="text-sm text-white/80">
              Click play or tap each parameter to build the signature
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleStart}
              disabled={isPlaying}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all cursor-pointer",
                isPlaying
                  ? "bg-white/20 text-white/60 cursor-not-allowed"
                  : "bg-white text-[#002395] hover:bg-white/90"
              )}
            >
              <Play className="w-4 h-4" />
              Play
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {parameters.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index <= activeStep
                  ? "bg-[#002395] scale-100"
                  : "bg-border scale-75"
              )}
            />
          ))}
        </div>

        {/* Parameter Cards */}
        <div className="grid gap-3 mb-8">
          {parameters.map((param, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep || (isComplete && index <= activeStep);

            return (
              <div
                key={param.id}
                onClick={() => handleStepClick(index)}
                className={cn(
                  "relative flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-500 cursor-pointer",
                  isActive
                    ? "border-[#002395] bg-[#002395]/5 shadow-lg shadow-[#002395]/10 scale-[1.02]"
                    : isCompleted
                    ? "border-[#002395]/30 bg-[#002395]/5"
                    : "border-border bg-background hover:border-[#002395]/30 hover:bg-muted/50"
                )}
                style={{
                  transitionDelay: isPlaying ? `${index * 50}ms` : "0ms",
                }}
              >
                {/* Step indicator */}
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all duration-300",
                    isActive || isCompleted
                      ? "bg-[#002395] text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className={cn(
                        "font-mono text-sm font-bold px-2 py-0.5 rounded transition-colors duration-300",
                        isActive || isCompleted
                          ? "bg-[#002395] text-white"
                          : "bg-muted text-foreground"
                      )}
                    >
                      {param.label}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {param.description}
                    </span>
                  </div>
                  <code
                    className={cn(
                      "block font-mono text-sm truncate transition-opacity duration-300",
                      isActive || isCompleted
                        ? "text-foreground opacity-100"
                        : "text-muted-foreground opacity-60"
                    )}
                  >
                    {param.value}
                  </code>
                </div>

                {/* Arrow indicator */}
                <ChevronRight
                  className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive
                      ? "text-[#002395] translate-x-1"
                      : "text-muted-foreground"
                  )}
                />
              </div>
            );
          })}
        </div>

        {/* Result Display */}
        <div
          className={cn(
            "relative overflow-hidden rounded-lg border-2 transition-all duration-500",
            isComplete
              ? "border-[#002395] bg-[#002395]/5"
              : "border-border bg-muted/30"
          )}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
            <span className="text-sm font-medium text-foreground">
              Constructed Signature String
            </span>
            {isComplete && (
              <span className="flex items-center gap-1 text-sm text-[#002395] font-medium">
                <Check className="w-4 h-4" />
                Complete
              </span>
            )}
          </div>
          <div className="p-4">
            <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-all m-0 bg-transparent">
              {parameters.map((param, index) => {
                const isShown = index <= activeStep;
                return (
                  <span
                    key={param.id}
                    className={cn(
                      "transition-all duration-500",
                      isShown
                        ? "opacity-100"
                        : "opacity-20"
                    )}
                  >
                    <span
                      className={cn(
                        "px-1 rounded transition-colors duration-300",
                        index === activeStep && !isComplete
                          ? "bg-[#002395] text-white"
                          : isShown
                          ? "text-[#002395]"
                          : "text-muted-foreground"
                      )}
                    >
                      {`{${param.label}}`}
                    </span>
                    {index < parameters.length - 1 && (
                      <span className={cn(
                        "transition-opacity duration-300",
                        isShown ? "opacity-100" : "opacity-20"
                      )}>
                        {" \\n "}
                      </span>
                    )}
                  </span>
                );
              })}
            </pre>
          </div>
        </div>

        {/* Example output when complete */}
        {isComplete && (
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-sm font-medium text-foreground mb-2">
              Example with actual values:
            </p>
            <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap break-all text-muted-foreground m-0 bg-transparent">
{`POST
/api/v4/payments/raisboy/deposit/create
{"user_id":"2564568","amount":5000}
1706620800
your_api_key_here`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
