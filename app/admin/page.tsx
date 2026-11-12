import "./admin.css";
import { rsvps } from "@/lib/mongodb";
import Dashboard, { type Item } from "./Dashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin – RSVPs", robots: { index: false } };

export default async function AdminPage() {
  let items: Item[] = [];
  let error: string | null = null;
  try {
    const list = await (await rsvps()).find().sort({ createdAt: -1 }).limit(2000).toArray();
    items = list.map((r) => ({
      id: r._id.toString(),
      guests: r.guests,
      message: r.message,
      invite: r.invite,
      lang: r.lang,
      createdAt: r.createdAt.toISOString(),
    }));
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }
  return <Dashboard initial={items} error={error} />;
}
