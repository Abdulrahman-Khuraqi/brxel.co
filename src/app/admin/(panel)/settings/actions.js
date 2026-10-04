"use server";

import { updateTag } from "next/cache";
import { guarded } from "@/server/auth/guard";
import { audit } from "@/server/audit";
import { TAGS } from "@/server/content/tags";
import { saveHeroStats } from "@/server/admin/site";
import { jsonField } from "@/server/admin/validation";

export async function saveStatsAction(_state, formData) {
  return guarded("settings.edit", async (user) => {
    const stats = await saveHeroStats(user, jsonField(formData, "stats", []));
    await audit(user, "settings.hero_stats", { type: "setting", id: "hero.stats", summary: `أرقام الرئيسية: ${stats.map((row) => `${row.value} ${row.label}`).join("، ")}` });
    updateTag(TAGS.settings);
    return { ok: true, message: "حُفظت الأرقام وظهرت على الموقع." };
  });
}
