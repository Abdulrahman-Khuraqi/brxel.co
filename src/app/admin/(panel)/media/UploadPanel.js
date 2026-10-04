"use client";

import { useRouter } from "next/navigation";
import { UploadButton } from "@/components/admin/MediaPicker";

/** Upload straight into the library; the grid below refreshes when it's done. */
export default function UploadPanel() {
  const router = useRouter();
  return <UploadButton multiple label="رفع صور" onUploaded={() => router.refresh()} />;
}
