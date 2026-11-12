import Invitation from "@/components/Invitation";

export default async function Page({ searchParams }: { searchParams: Promise<{ g?: string }> }) {
  const { g } = await searchParams;
  const guests = (g ?? "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 20);
  return <Invitation guests={guests} invite={g ?? null} />;
}
