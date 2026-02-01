"use client";

import React from "react"

import { useEffect, useRef, useState } from "react";

interface DocSectionProps {
  id: string;
  number: number;
  title: string;
  children: React.ReactNode;
}

export function DocSection({ id, number, title, children }: DocSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`section border-b border-border scroll-mt-8 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="flex items-baseline gap-4 mb-8">
        <span className="text-5xl font-bold text-[#002395]">{number}</span>
        <h2 className="text-3xl font-bold text-foreground !mt-0 !mb-0">{title}</h2>
      </div>

      <div className="max-w-4xl">{children}</div>
    </section>
  );
}
