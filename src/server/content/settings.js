import "server-only";
import { unstable_cache } from "next/cache";
import { getDb, schema } from "@/server/db/client";
import { TAGS } from "@/server/content/tags";

/** Defaults used until a value is saved from the dashboard. */
export const SETTING_DEFAULTS = {
  "hero.stats": [
    { value: "+1000", label: "مشروع مُنجز" },
    { value: "+200", label: "عميل" },
    { value: "+60", label: "هوية بصرية" },
  ],
};

const loadAll = unstable_cache(
  async () => {
    const rows = await getDb().select().from(schema.settings);
    return Object.fromEntries(
      rows.map((row) => {
        try {
          return [row.key, JSON.parse(row.value)];
        } catch {
          return [row.key, null];
        }
      })
    );
  },
  ["settings-v1"],
  { tags: [TAGS.settings], revalidate: 3600 }
);

export async function getSetting(key) {
  const all = await loadAll();
  return all[key] ?? SETTING_DEFAULTS[key];
}
