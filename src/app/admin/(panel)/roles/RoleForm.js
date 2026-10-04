"use client";

import { ActionForm, Field, Input, SubmitButton } from "@/components/admin/form";
import { Card } from "@/components/admin/ui";

/**
 * Role name, description and its permissions as a checklist grouped by area.
 * Permissions the admin doesn't hold are shown but locked (they can't grant them).
 */
export default function RoleForm({ action, role = null, groups, grantable, readOnly = false }) {
  const held = new Set(role?.permissions || []);
  const allowed = new Set(grantable);
  return (
    <ActionForm action={action} className="grid gap-5">
      <fieldset disabled={readOnly} className="grid gap-5">
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name" label="اسم الدور">
              <Input name="name" defaultValue={role?.name} required maxLength={64} />
            </Field>
            <Field name="description" label="الوصف" optional>
              <Input name="description" defaultValue={role?.description} maxLength={255} />
            </Field>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <Card key={group.key} title={group.label}>
              <ul className="grid gap-2">
                {group.permissions.map((permission) => {
                  const locked = !allowed.has(permission.key);
                  return (
                    <li key={permission.key}>
                      <label className={`flex items-center gap-3 rounded-xl border border-hairline px-3 py-2.5 ${locked ? "opacity-50" : "cursor-pointer hover:border-hairline-strong"}`}>
                        <input
                          type="checkbox"
                          name="permissions"
                          value={permission.key}
                          defaultChecked={held.has(permission.key)}
                          disabled={locked}
                          className="h-4 w-4 shrink-0 accent-[var(--color-brand)]"
                        />
                        <span className="flex-1 text-sm text-ice">{permission.label}</span>
                        <code className="latin text-[10px] text-ice-faint">{permission.key}</code>
                      </label>
                      {locked && held.has(permission.key) ? <input type="hidden" name="permissions" value={permission.key} /> : null}
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </div>

        <p className="text-xs leading-6 text-ice-faint">
          بعض الصلاحيات تضيف ما تحتاجه تلقائيًا؛ مثلًا «تعديل الأعمال» تضيف «عرض الأعمال».
        </p>
        {readOnly ? null : (
          <div className="flex justify-end">
            <SubmitButton>{role ? "حفظ الدور" : "إنشاء الدور"}</SubmitButton>
          </div>
        )}
      </fieldset>
    </ActionForm>
  );
}
