import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { menuCategories, menuItems, menuSections } from "../lib/db/schema";
import { TheCoveMenu } from "../Menu";
import { kitchenMenu } from "../Kitchen-Menu";

type LegacyCategory = {
  category: string;
  drinks?: Array<{ name: string; price: string; image?: string }>;
  food?: Array<{ name: string; price: string; image?: string }>;
};

const sources: Array<{
  key: string;
  group: "cove";
  slug: string;
  title: string;
  categories: LegacyCategory[];
}> = [
  {
    key: "cove/drinks",
    group: "cove",
    slug: "drinks",
    title: "Drinks Menu",
    categories: TheCoveMenu as LegacyCategory[],
  },
  {
    key: "cove/kitchen",
    group: "cove",
    slug: "kitchen",
    title: "Kitchen Menu",
    categories: kitchenMenu as LegacyCategory[],
  },
];

/** Legacy prices are bare numbers ("1,200,000"); store them with the Naira sign like the dashboard does. */
function withNaira(price: string): string {
  const trimmed = price.trim();
  return trimmed.startsWith("N") || trimmed.startsWith("₦") ? trimmed : `₦${trimmed}`;
}

async function upsertSection(source: (typeof sources)[number]) {
  const existing = await db.query.menuSections.findFirst({
    where: eq(menuSections.key, source.key),
  });

  const section =
    existing ??
    (
      await db
        .insert(menuSections)
        .values({
          key: source.key,
          group: source.group,
          slug: source.slug,
          title: source.title,
        })
        .returning()
    )[0];

  if (existing) {
    await db
      .update(menuSections)
      .set({
        title: source.title,
        group: source.group,
        slug: source.slug,
        updatedAt: new Date(),
      })
      .where(eq(menuSections.id, section.id));
  }

  await db.delete(menuCategories).where(eq(menuCategories.sectionId, section.id));

  for (let categoryIndex = 0; categoryIndex < source.categories.length; categoryIndex += 1) {
    const categorySource = source.categories[categoryIndex];

    const [category] = await db
      .insert(menuCategories)
      .values({
        sectionId: section.id,
        name: categorySource.category,
        sortOrder: categoryIndex,
      })
      .returning();

    const items = (categorySource.drinks ?? categorySource.food ?? []).filter((item) => item?.name && item?.price);

    if (!items.length) {
      continue;
    }

    await db.insert(menuItems).values(
      items.map((item, itemIndex) => ({
        categoryId: category.id,
        name: item.name,
        price: withNaira(item.price),
        imageKey: item.image ?? null,
        sortOrder: itemIndex,
      }))
    );
  }
}

async function main() {
  for (const source of sources) {
    // eslint-disable-next-line no-console
    console.log(`Seeding ${source.key}...`);
    await upsertSection(source);
  }
  // eslint-disable-next-line no-console
  console.log("Done.");
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
