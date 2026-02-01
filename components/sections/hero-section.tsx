"use client";

import { FileText } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-[#002395] text-white overflow-hidden">
      {/* Swiss modernism geometric accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#001a6e] opacity-50" aria-hidden="true" />
      
      <div className="swiss-container relative z-10">
        <div className="py-20 md:py-24 lg:py-28">
          {/* Version badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded text-sm font-medium mb-8 fade-in">
            <FileText className="w-4 h-4" />
            <span>Version 4.0</span>
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 fade-in max-w-3xl text-balance">
            API Documentation
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl font-light text-white/90 mb-8 fade-in max-w-2xl">
            Complete Technical Reference Guide
          </p>
          
          {/* Description */}
          <p className="text-base md:text-lg text-white/70 max-w-xl fade-in">
            Comprehensive guidance for integrating payment services into your platform. 
            Includes user validation, deposits, payouts, and real-time webhooks.
          </p>
        </div>
      </div>
      
      {/* Bottom border accent */}
      <div className="h-1 bg-white/20" aria-hidden="true" />
    </section>
  );
}
