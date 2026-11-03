export const SECTION_GROUPS = ["cove"] as const;

export type SectionGroup = (typeof SECTION_GROUPS)[number];

export const SECTION_KEYS = ["cove/drinks", "cove/kitchen"] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export function normalizeSectionKey(input: string): SectionKey | null {
  if ((SECTION_KEYS as readonly string[]).includes(input)) {
    return input as SectionKey;
  }
  return null;
}

export function resolveSectionFromRoute(group: string, slug: string): SectionKey | null {
  return normalizeSectionKey(`${group}/${slug}`);
}

export const SECTION_TITLES: Record<SectionKey, string> = {
  "cove/drinks": "Drinks Menu",
  "cove/kitchen": "Kitchen Menu",
};
