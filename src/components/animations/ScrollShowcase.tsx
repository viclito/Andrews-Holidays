"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export function ScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // --- Pair 1 Animations (Taj Mahal & Kerala) ---
  // They start visible and float up/out faster
  const y1 = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const rotate1 = useTransform(scrollYProgress, [0, 0.3], [-5, -10]);
  const x1 = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const opacity1 = useTransform(scrollYProgress, [0.2, 0.35], [1, 0]);

  const y2 = useTransform(scrollYProgress, [0, 0.3], [50, -150]);
  const rotate2 = useTransform(scrollYProgress, [0, 0.3], [5, 10]);
  const x2 = useTransform(scrollYProgress, [0, 0.3], [0, 50]);
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.35], [1, 0]);

  // --- Pair 2 Animations (Jaipur & Varanasi) ---
  // They enter MUCH earlier now
  const y3 = useTransform(scrollYProgress, [0.15, 0.6], [800, 0]);
  const rotate3 = useTransform(scrollYProgress, [0.15, 0.6], [10, -3]);
  const x3 = useTransform(scrollYProgress, [0.15, 0.6], [100, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.15, 0.4], [0, 1]);

  const y4 = useTransform(scrollYProgress, [0.15, 0.6], [900, 0]);
  const rotate4 = useTransform(scrollYProgress, [0.15, 0.6], [-10, 3]);
  const x4 = useTransform(scrollYProgress, [0.15, 0.6], [-100, 0]);
  const opacity4 = useTransform(scrollYProgress, [0.15, 0.4], [0, 1]);

  // Text Animations - Synced with faster transitions
  const opacityText1 = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const opacityText2 = useTransform(scrollYProgress, [0.3, 0.5, 0.9], [0, 1, 1]);

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-white">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-start pt-24 overflow-hidden">
        
        {/* Headlines */}
        <div className="relative z-20 mb-8 h-24 w-full text-center">
          <motion.div style={{ opacity: opacityText1 }} className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary-600">
              Iconic Destinations
            </h2>
            <p className="mt-2 text-5xl font-semibold tracking-tight text-gray-900 md:text-7xl">
              Timeless Beauty.
            </p>
          </motion.div>
          
          <motion.div style={{ opacity: opacityText2 }} className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary-600">
              Cultural Heritage
            </h2>
            <p className="mt-2 text-5xl font-semibold tracking-tight text-gray-900 md:text-7xl">
              Stories in Stone.
            </p>
          </motion.div>
        </div>

        {/* Cards Container */}
        <div className="relative flex w-full max-w-7xl items-center justify-center gap-8 px-4 md:gap-16">
          
          {/* --- Pair 1 --- */}
          
          {/* Taj Mahal */}
          <motion.div
            style={{ y: y1, rotate: rotate1, x: x1, opacity: opacity1 }}
            className="absolute left-4 top-0 aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl md:left-20 md:w-[400px]"
          >
            <Image
              src="https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1000&auto=format&fit=crop"
              alt="Taj Mahal"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-semibold">Taj Mahal</h3>
              <p className="text-lg text-gray-200">Agra, India</p>
            </div>
          </motion.div>

          {/* Kerala */}
          <motion.div
            style={{ y: y2, rotate: rotate2, x: x2, opacity: opacity2 }}
            className="absolute right-4 top-12 aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl md:right-20 md:w-[400px]"
          >
            <Image
              src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop"
              alt="Kerala Backwaters"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-semibold">Kerala</h3>
              <p className="text-lg text-gray-200">God's Own Country</p>
            </div>
          </motion.div>


          {/* --- Pair 2 --- */}

          {/* Jaipur */}
          <motion.div
            style={{ y: y3, rotate: rotate3, x: x3, opacity: opacity3 }}
            className="absolute left-4 top-0 aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl md:left-20 md:w-[400px]"
          >
            <Image
              src="https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1000&auto=format&fit=crop"
              alt="Hawa Mahal"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-semibold">Jaipur</h3>
              <p className="text-lg text-gray-200">The Pink City</p>
            </div>
          </motion.div>

          {/* Varanasi */}
          <motion.div
            style={{ y: y4, rotate: rotate4, x: x4, opacity: opacity4 }}
            className="absolute right-4 top-12 aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl md:right-20 md:w-[400px]"
          >
            <Image
              src="https://images.unsplash.com/photo-1601821139990-9fc929db79ce?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Varanasi"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-semibold">Varanasi</h3>
              <p className="text-lg text-gray-200">Spiritual Capital</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}


