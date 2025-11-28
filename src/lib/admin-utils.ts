import { dbConnect } from "@/lib/mongodb";
import { AgencyUser } from "@/models/AgencyUser";

export async function getAdminEmails(): Promise<string[]> {
  await dbConnect();
  const admins = await AgencyUser.find({ role: "admin" }).select("email");
  return admins.map((admin) => admin.email);
}
