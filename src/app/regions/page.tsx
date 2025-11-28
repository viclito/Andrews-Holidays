import Link from "next/link";

export default function RegionsPage() {
  return (
    <section className="container mx-auto px-6 py-20">
      <h1 className="mb-8 text-5xl font-display text-gray-900">Regions</h1>
      <p className="mb-6 text-lg text-gray-600">
        Explore the diverse regions of South India – Kerala, Tamil Nadu, Karnataka, and Goa.
      </p>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {[
          { name: "Kerala", description: "Backwaters, Ayurveda, Spices" },
          { name: "Tamil Nadu", description: "Temples, Heritage, Arts" },
          { name: "Karnataka", description: "Coffee, Safaris, Heritage" },
          { name: "Goa", description: "Beaches, Cuisine, Nightlife" },
        ].map((region) => (
          <div key={region.name} className="rounded-2xl bg-white p-6 shadow-soft">
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">{region.name}</h2>
            <p className="text-gray-600">{region.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
