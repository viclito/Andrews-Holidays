import { dbConnect } from "@/lib/mongodb";
import { Package } from "@/models/Package";
import { PackagesManager } from "@/components/dashboard/PackagesManager";

export default async function DashboardPackagesPage() {
  await dbConnect();
  const packages = await Package.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div>
        <p className="section-heading">Packages</p>
        <h1 className="font-display text-4xl text-midnight">
          Manage signature departures
        </h1>
        <p className="text-sm text-slate-500">
          Create, edit, or remove itineraries across South India.
        </p>
      </div>
      <PackagesManager initialPackages={JSON.parse(JSON.stringify(packages))} />
    </div>
  );
}

