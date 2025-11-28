import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="container mx-auto px-6 py-20">
      <h1 className="mb-8 text-5xl font-display text-gray-900">About Andrews Holiday</h1>
      <p className="mb-6 text-lg text-gray-600">
        Andrews Holiday is a premium DMC platform dedicated to curating unforgettable travel experiences across South India. Our mission is to connect travelers with authentic, high‑quality journeys while providing agencies with powerful tools to manage bookings, inquiries, and payments.
      </p>
      <p className="mb-6 text-lg text-gray-600">
        Founded by travel enthusiasts, we combine local expertise with cutting‑edge technology to deliver seamless, personalized itineraries.
      </p>
      <Link href="/contact" className="btn-apple btn-primary">
        Get in Touch
      </Link>
    </section>
  );
}
