"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeIn, StaggerContainer, staggerItem, MotionDiv } from "@/components/animations/FadeIn";
import { Session } from "next-auth";

const stats = [
  { label: "Destinations", value: "50+" },
  { label: "Happy Travelers", value: "10K+" },
  { label: "Success Rate", value: "99%" },
];

interface HeroSectionProps {
  session: Session | null;
}

export function HeroSection({ session }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Animate width from 90% to 100vw
  const width = useTransform(scrollY, [0, 300], ["90%", "100vw"]);
  
  // Animate border radius from 2rem to 0
  const borderRadius = useTransform(scrollY, [0, 300], ["1rem", "0rem"]);
  
  // Animate margin top to create a floating effect initially? 
  // The user asked for width covering the screen.
  // We'll keep it centered.
  
  return (
    <div className="flex w-full justify-center bg-white pt-4 pb-0 overflow-x-hidden">
      <motion.section
        ref={containerRef}
        style={{ width, borderRadius }}
        className="relative h-screen overflow-hidden text-white shadow-2xl"
      >
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source
              src="https://www.pexels.com/download/video/4073979/"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-center">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-4xl text-center">
              <FadeIn delay={0.2}>
                <h1 className="mb-6 text-5xl font-semibold leading-tight tracking-tight md:text-6xl lg:text-7xl">
                  Discover South India.
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Like never before.
                  </span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.4}>
                <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-200 md:text-2xl">
                  Curated travel experiences across Kerala, Tamil Nadu, Karnataka, and Goa.
                </p>
              </FadeIn>
              <FadeIn delay={0.6}>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/packages"
                    className="btn-apple btn-primary w-full sm:w-auto"
                  >
                    Explore Packages
                  </Link>
                  {!session ? (
                    <Link
                      href="/customer/register"
                      className="btn-apple border-2 border-white/20 bg-white/10 text-white hover:bg-white/20 w-full sm:w-auto"
                    >
                      Get Started
                    </Link>
                  ) : (
                    <Link
                      href={session.user.userType === "admin" ? "/dashboard" : "/customer/dashboard"}
                      className="btn-apple border-2 border-white/20 bg-white/10 text-white hover:bg-white/20 w-full sm:w-auto"
                    >
                      Go to Dashboard
                    </Link>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Stats Bar - Pushed to bottom */}
          <div className="absolute bottom-0 w-full border-t border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="container mx-auto px-6 py-8">
              <StaggerContainer className="grid grid-cols-3 gap-8 text-center">
                {stats.map((stat) => (
                  <MotionDiv key={stat.label} variants={staggerItem}>
                    <div className="text-3xl font-semibold md:text-4xl">{stat.value}</div>
                    <div className="mt-1 text-sm text-gray-300">{stat.label}</div>
                  </MotionDiv>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
