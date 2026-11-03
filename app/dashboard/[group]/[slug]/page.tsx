import { notFound } from "next/navigation";
import { MenuEditor } from "@/components/dashboard/MenuEditor";
import { resolveSectionFromRoute } from "@/lib/menus/sections";

const TITLES: Record<string, string> = {
  "cove/drinks": "Drinks Menu Editor",
  "cove/kitchen": "Kitchen Menu Editor",
};

export default async function DashboardSectionEditorPage({
  params,
}: {
  params: Promise<{ group: string; slug: string }>;
}) {
  const { group, slug } = await params;
  const sectionKey = resolveSectionFromRoute(group, slug);

  if (!sectionKey) {
    notFound();
  }

  return (
    <MenuEditor
      group={group}
      slug={slug}
      sectionKey={sectionKey}
      title={TITLES[sectionKey] ?? "Menu Editor"}
    />
  );
}
