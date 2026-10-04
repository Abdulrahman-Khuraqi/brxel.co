import { Card, PageHead } from "@/components/admin/ui";
import { requirePermission } from "@/server/auth/guard";
import { readSetting } from "@/server/admin/site";
import StatsForm from "./StatsForm";
import { saveStatsAction } from "./actions";

export const metadata = { title: "أرقام الموقع" };

export default async function SettingsPage() {
  await requirePermission("settings.edit");
  const stats = await readSetting("hero.stats");

  return (
    <div className="grid gap-6">
      <PageHead title="أرقام الموقع" description="الأرقام التي تظهر تحت العنوان في الصفحة الرئيسية." />
      <Card title="أرقام الرئيسية" description="اكتب الرقم كما تريد أن يظهر (مثل +1000) ووصفًا قصيرًا. تظهر التغييرات فور الحفظ.">
        <StatsForm action={saveStatsAction} defaultValue={stats} />
      </Card>
    </div>
  );
}
