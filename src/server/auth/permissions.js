/**
 * Every permission the dashboard knows about, grouped by area. A role is a set
 * of these keys; the roles screen renders this catalogue as a checklist, and
 * every server action checks one of them before it touches data.
 *
 * Plain module (no "@/" imports, no server-only) so the seed script can use it.
 */
export const PERMISSION_GROUPS = [
  {
    key: "work",
    label: "الأعمال",
    permissions: [
      { key: "work.view", label: "عرض الأعمال" },
      { key: "work.create", label: "إضافة عمل" },
      { key: "work.edit", label: "تعديل الأعمال" },
      { key: "work.publish", label: "نشر وإخفاء الأعمال" },
      { key: "work.delete", label: "حذف الأعمال" },
    ],
  },
  {
    key: "blog",
    label: "المدونة",
    permissions: [
      { key: "blog.view", label: "عرض المقالات" },
      { key: "blog.write", label: "كتابة مقالات وتعديل مقالاته" },
      { key: "blog.edit_all", label: "تعديل مقالات الآخرين" },
      { key: "blog.publish", label: "نشر وإلغاء نشر المقالات" },
      { key: "blog.delete", label: "حذف المقالات" },
      { key: "blog.categories", label: "إدارة تصنيفات المدونة" },
    ],
  },
  {
    key: "media",
    label: "مكتبة الوسائط",
    permissions: [
      { key: "media.upload", label: "رفع الصور" },
      { key: "media.delete", label: "حذف الصور" },
    ],
  },
  {
    key: "site",
    label: "الموقع",
    permissions: [{ key: "settings.edit", label: "تعديل أرقام الموقع والإعدادات" }],
  },
  {
    key: "team",
    label: "الفريق والصلاحيات",
    permissions: [
      { key: "users.view", label: "عرض المستخدمين" },
      { key: "users.manage", label: "إضافة وتعديل وتعطيل المستخدمين" },
      { key: "roles.manage", label: "إدارة الأدوار والصلاحيات" },
      { key: "audit.view", label: "عرض سجل النشاط" },
    ],
  },
];

export const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((group) => group.permissions.map((item) => item.key));

const KNOWN = new Set(ALL_PERMISSIONS);

export const isKnownPermission = (key) => KNOWN.has(key);

/** Some permissions only make sense with another; saving a role adds the prerequisites. */
const IMPLIES = {
  "work.create": ["work.view"],
  "work.edit": ["work.view"],
  "work.publish": ["work.view"],
  "work.delete": ["work.view"],
  "blog.write": ["blog.view"],
  "blog.edit_all": ["blog.view", "blog.write"],
  "blog.publish": ["blog.view"],
  "blog.delete": ["blog.view"],
  "blog.categories": ["blog.view"],
  "users.manage": ["users.view"],
  "roles.manage": ["users.view"],
};

/** Drops unknown keys and adds implied ones, so stored roles are always coherent. */
export function normalizePermissions(keys) {
  const result = new Set();
  for (const key of keys) {
    if (!KNOWN.has(key)) continue;
    result.add(key);
    for (const implied of IMPLIES[key] || []) result.add(implied);
  }
  return ALL_PERMISSIONS.filter((key) => result.has(key));
}

/** The roles a fresh install starts with. The owner role is locked; the rest can be edited or removed. */
export const DEFAULT_ROLES = [
  {
    name: "المالك",
    description: "كل الصلاحيات، ولا يمكن تعديله أو حذفه.",
    isOwner: true,
    permissions: ALL_PERMISSIONS,
  },
  {
    name: "مدير",
    description: "يدير المحتوى والفريق والأدوار.",
    permissions: ALL_PERMISSIONS,
  },
  {
    name: "محرر",
    description: "يدير الأعمال والمدونة والوسائط وأرقام الموقع، دون إدارة الفريق.",
    permissions: [
      "work.view", "work.create", "work.edit", "work.publish", "work.delete",
      "blog.view", "blog.write", "blog.edit_all", "blog.publish", "blog.delete", "blog.categories",
      "media.upload", "media.delete", "settings.edit",
    ],
  },
  {
    name: "كاتب",
    description: "يكتب مقالاته ويرسلها للمراجعة، ولا ينشر.",
    permissions: ["blog.view", "blog.write", "media.upload"],
  },
  {
    name: "مصمم",
    description: "يضيف الأعمال ويعدّلها كمسودات، والنشر للمحرر.",
    permissions: ["work.view", "work.create", "work.edit", "media.upload"],
  },
  {
    name: "مشاهد",
    description: "يطّلع على المحتوى دون تعديل.",
    permissions: ["work.view", "blog.view"],
  },
];
