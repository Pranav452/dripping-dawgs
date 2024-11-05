"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { createNoise2D } from "simplex-noise";

interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: unknown;
}

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors = ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"],
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: WavyBackgroundProps) => {
  const noise = createNoise2D();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>();
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    contextRef.current = ctx;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.filter = `blur(${blur}px)`;
    
    setDimensions({ width, height });
  }, [blur]);

  const drawWave = useCallback((n: number, time: number) => {
    const ctx = contextRef.current;
    if (!ctx) return;

    const { width, height } = dimensions;
    
    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = colors[i % colors.length];
      
      for (let x = 0; x < width; x += 10) {
        const y = noise(x / 800, 0.3 * i + time) * 100;
        ctx.lineTo(x, y + height * 0.5);
      }
      ctx.stroke();
      ctx.closePath();
    }
  }, [colors, dimensions, noise, waveWidth]);

  const render = useCallback(() => {
    const ctx = contextRef.current;
    if (!ctx) return;

    const { width, height } = dimensions;
    
    ctx.fillStyle = backgroundFill || "black";
    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.fillRect(0, 0, width, height);
    
    const time = Date.now() * getSpeed();
    drawWave(3, time);
    
    animationIdRef.current = requestAnimationFrame(render);
  }, [backgroundFill, dimensions, drawWave, getSpeed, waveOpacity]);

  useEffect(() => {
    init();
    const handleResize = () => {
      init();
    };
    window.addEventListener('resize', handleResize);
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [init, render]);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "h-full flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      />
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
}; 