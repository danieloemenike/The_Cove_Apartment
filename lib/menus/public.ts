import type { MenuCategory, MenuSection } from "@/app/_components/Menu";
import { kitchenMenu } from "@/Kitchen-Menu";
import { TheCoveMenu } from "@/Menu";
import type { SectionKey } from "@/lib/menus/sections";

// Drinks first, then kitchen — same order the public page has always used.
const PUBLIC_SECTIONS: { key: SectionKey; section: MenuSection }[] = [
  { key: "cove/drinks", section: "drinks" },
  { key: "cove/kitchen", section: "kitchen" },
];

function staticMenu(): MenuCategory[] {
  const toItems = (prefix: string, items: { name: string; price: string; image: string }[]) =>
    items.map((item, index) => ({ ...item, id: `${prefix}-${index}`, price: `₦${item.price}` }));

  return [
    ...TheCoveMenu.map((c, i) => ({
      id: `drinks-${i}`,
      section: "drinks" as const,
      category: c.category,
      items: toItems(`drinks-${i}`, c.drinks),
    })),
    ...kitchenMenu.map((c, i) => ({
      id: `kitchen-${i}`,
      section: "kitchen" as const,
      category: c.category,
      items: toItems(`kitchen-${i}`, c.food),
    })),
  ];
}

/** Menu for the public page, read from Neon. Falls back to the bundled menu if the DB is unset or unseeded. */
export async function getPublicMenu(): Promise<MenuCategory[]> {
  if (!process.env.DATABASE_URL) {
    return staticMenu();
  }

  try {
    // Imported lazily: lib/db throws at import time when DATABASE_URL is missing.
    const { getSectionMenuByKey } = await import("@/lib/menus/queries");
    const sections = await Promise.all(PUBLIC_SECTIONS.map(({ key }) => getSectionMenuByKey(key)));
    const categories = sections.flatMap((section, index) =>
      (section?.categories ?? []).map((category) => ({
        id: category.id,
        section: PUBLIC_SECTIONS[index].section,
        category: category.name,
        items: category.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.imageUrl,
        })),
      }))
    );

    return categories.length ? categories : staticMenu();
  } catch (error) {
    console.error("Failed to load menu from database:", error);
    return staticMenu();
  }
}
