import "dotenv/config";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/mongodb";
import { Package } from "@/models/Package";
import { AgencyUser } from "@/models/AgencyUser";

async function seed() {
  await dbConnect();
  await Package.deleteMany({});
  await AgencyUser.deleteMany({});

  await Package.insertMany([
    {
      title: "Malabar Coastal Luxe",
      slug: "malabar-coastal-luxe",
      heroImage: "/images/packages/malabar-hero.svg",
      gallery: [
        "/images/packages/malabar-hero.svg",
        "/images/placeholder.svg",
      ],
      region: "Kerala",
      duration: 7,
      priceFrom: 185000,
      tags: ["Backwaters", "Wellness", "Cuisine"],
      summary:
        "Sail through Alleppey backwaters, spice plantations, and Malabar coastal cuisine masterclasses.",
      inclusions: [
        "Dedicated concierge",
        "Premium houseboat",
        "All breakfasts & curated dinners",
      ],
      exclusions: ["Flights", "Visa support"],
      itinerary: [
        {
          day: 1,
          title: "Fort Kochi Arrival",
          description:
            "Sunset Kathakali performance and chef-led seafood degustation.",
          highlights: ["Chinese fishing nets", "Art cafés"],
        },
      ],
      isFeatured: true,
    },
  ]);

  await AgencyUser.create({
    name: "Demo Admin",
    email: "admin@andrewsholiday.com",
    password: await bcrypt.hash("Pass@123", 10),
    role: "admin",
  });

  console.log("Seed data inserted ✔");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

