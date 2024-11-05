"use client";
import { WavyBackground } from "./ui/wavy-background";
import { useCounter } from "@/hooks/useCounter";
import { useInView } from "framer-motion";
import { useRef } from "react";

const StatCard = ({ endValue, label }: { endValue: number, label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useCounter(isInView ? endValue : 0, 2000);
  
  return (
    <div ref={ref}>
      <h3 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-1 md:mb-2">
        {count}{endValue === 100 ? '%' : '+'}
      </h3>
      <p className="text-gray-200">{label}</p>
    </div>
  );
};

export function AboutUs() {
  return (
    <section className="relative min-h-screen">
      <WavyBackground 
        colors={["#FFD700", "#FFFFFF", "#000000"]}
        waveWidth={50}
        backgroundFill="#111111"
        blur={5}
        speed="slow"
        waveOpacity={0.5}
        className="w-full"
      >
        <div className="mx-auto max-w-7xl px-4 pb-8 md:pb-16"><br /><br /><br /><br />
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-white text-center">
              About Dripping Dawgs
            </h2>
            <p className="text-gray-200 mb-4 md:mb-6 text-sm md:text-base">
              At Dripping Dawgs, we're passionate about creating unique, high-quality clothing that 
              helps you express your individual style. Our journey began with a simple idea: to 
              combine comfort with cutting-edge design.
            </p>
            <p className="text-gray-200 mb-6 text-sm md:text-base">
              Every piece in our collection is carefully crafted with attention to detail and 
              a commitment to quality. We believe that great style shouldn't compromise on comfort, 
              which is why we use only the finest materials in our products.
            </p>
            <p className="text-gray-200 mb-6 text-sm md:text-base">
              Every piece in our collection is carefully crafted with attention to detail and 
              a commitment to quality. We believe that great style shouldn't compromise on comfort, 
              which is why we use only the finest materials in our products.
            </p> <p className="text-gray-200 mb-6 text-sm md:text-base">
              Every piece in our collection is carefully crafted with attention to detail and 
              a commitment to quality. We believe that great style shouldn't compromise on comfort, 
              which is why we use only the finest materials in our products.
            </p>
            <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
              <StatCard endValue={1000} label="Happy Customers" />
              <StatCard endValue={50} label="Unique Designs" />
              <StatCard endValue={100} label="Quality Assured" />
            </div>
          </div>
        </div>
      </WavyBackground>
    </section>
  );
} 