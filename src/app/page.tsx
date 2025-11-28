import Link from "next/link";
import { PackageCard } from "@/components/cards/PackageCard";
import { getFeaturedPackages } from "@/lib/data/package-service";
import { fallbackPackages } from "@/data/fallback-packages";
import { auth } from "@/auth";
import { FadeIn, StaggerContainer, staggerItem, MotionDiv } from "@/components/animations/FadeIn";
import { ScrollShowcase } from "@/components/animations/ScrollShowcase";
import { HeroSection } from "@/components/home/HeroSection";

const stats = [
  { label: "Destinations", value: "50+" },
  { label: "Happy Travelers", value: "10K+" },
  { label: "Success Rate", value: "99%" },
];

export default async function Home() {
  const session = await auth();
  const packages =
    (await getFeaturedPackages(6).catch(() => [])) ?? fallbackPackages;
  const featured = packages.length ? packages : fallbackPackages;

  return (
    <div className="bg-white">
      {/* Hero Section - Apple Style */}
      <HeroSection session={session} />

      {/* Scroll Showcase Section */}
      <ScrollShowcase />

      {/* Featured Section */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
                Featured Experiences
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-gray-600">
                Hand-picked journeys that showcase the best of South India
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((pkg) => (
              <MotionDiv key={pkg.slug} variants={staggerItem}>
                <PackageCard
                  slug={pkg.slug!}
                  title={pkg.title!}
                  heroImage={pkg.heroImage ?? "/images/placeholder.jpg"}
                  region={pkg.region!}
                  duration={pkg.duration!}
                  priceFrom={pkg.priceFrom!}
                  tags={pkg.tags ?? []}
                  summary={pkg.summary!}
                />
              </MotionDiv>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.4}>
            <div className="mt-12 text-center">
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 text-lg font-medium text-primary-500 hover:text-primary-600"
              >
                View all packages
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <StaggerContainer className="grid gap-16 lg:grid-cols-3">
            <MotionDiv variants={staggerItem} className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <svg className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-semibold">Instant Booking</h3>
              <p className="text-lg text-gray-600">
                Real-time availability and instant confirmations for all packages
              </p>
            </MotionDiv>

            <MotionDiv variants={staggerItem} className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <svg className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-semibold">Curated Experiences</h3>
              <p className="text-lg text-gray-600">
                Hand-picked destinations and authentic local experiences
              </p>
            </MotionDiv>

            <MotionDiv variants={staggerItem} className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <svg className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-semibold">24/7 Support</h3>
              <p className="text-lg text-gray-600">
                On-ground assistance across all South Indian states
              </p>
            </MotionDiv>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-20 text-white md:py-28">
        <div className="container mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="mb-6 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              Ready to explore?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-400">
              Join thousands of travelers who have discovered the beauty of South India
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/packages"
                className="btn-apple bg-white text-gray-900 hover:bg-gray-100 w-full sm:w-auto"
              >
                Browse Packages
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
      </section>
    </div>
  );
}
