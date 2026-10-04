"use client";

import { useState } from "react";
import ConfirmAction from "@/components/admin/ConfirmAction";
import SecretNotice from "./SecretNotice";

export default function ResetPassword({ action, userId, email }) {
  const [password, setPassword] = useState("");
  return (
    <div className="grid gap-4">
      <div>
        <ConfirmAction
          action={action}
          fields={{ id: userId }}
          label="إعادة تعيين كلمة المرور"
          variant="primary"
          triggerVariant="secondary"
          title="إعادة تعيين كلمة المرور؟"
          message="ستُنشأ كلمة مرور جديدة وسيخرج المستخدم من كل أجهزته."
          confirmLabel="إعادة التعيين"
          onDone={(result) => setPassword(result.password)}
        />
      </div>
      {password ? <SecretNotice email={email} password={password} /> : null}
    </div>
  );
}
