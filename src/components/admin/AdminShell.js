"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  BookOpen,
  ExternalLink,
  FolderKanban,
  Gauge,
  Images,
  LogOut,
  Menu,
  Settings2,
  ShieldCheck,
  Tags,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

/** Icons by key, so the server can describe the menu without sending components. */
const ICONS = { Gauge, FolderKanban, BookOpen, Tags, Images, Settings2, Users, ShieldCheck, Activity, UserRound };

/**
 * The dashboard frame: a sidebar with only the sections this user may open,
 * and a slim top bar on phones. `nav` is a list of { href, label, icon, section }.
 */
export default function AdminShell({ user, nav, signOut, children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openPath, setOpenPath] = useState(pathname);
  if (openPath !== pathname) {
    setOpenPath(pathname);
    setOpen(false);
  }

  const isActive = (href) => (href === "/admin/" ? pathname === "/admin" || pathname === "/admin/" : pathname.startsWith(href.replace(/\/$/, "")));

  const sidebar = (
    <nav aria-label="أقسام اللوحة" className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-hairline px-5">
        <Link href="/admin/" className="flex items-center gap-2" aria-label="لوحة التحكم">
          <Logo className="h-5 w-auto" />
          <span className="rounded-md bg-brand/15 px-1.5 py-0.5 text-[11px] font-bold text-brand-bright">لوحة</span>
        </Link>
        <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-ice-muted lg:hidden" aria-label="إغلاق القائمة">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <ul className="flex-1 overflow-y-auto px-3 py-4">
        {nav.map((item, index) => {
          const Icon = ICONS[item.icon] || Gauge;
          const heading = index === 0 || nav[index - 1].section !== item.section ? item.section : null;
          return (
            <li key={item.href}>
              {heading ? <p className="mb-1 mt-4 px-3 text-[11px] font-semibold text-ice-faint first:mt-0">{heading}</p> : null}
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition motion-reduce:transition-none",
                  isActive(item.href) ? "bg-brand/12 text-brand-bright" : "text-ice-muted hover:bg-surface-hover hover:text-ice"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" strokeWidth={1.9} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-hairline p-3">
        <Link href="/" target="_blank" className="flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm text-ice-muted hover:bg-surface-hover hover:text-ice">
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          عرض الموقع
        </Link>
        <div className="mt-2 flex items-center gap-3 rounded-xl bg-surface px-3 py-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/15 text-sm font-bold text-brand-bright">
            {user.name.trim().charAt(0)}
          </span>
          <Link href="/admin/account/" className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-ice">{user.name}</span>
            <span className="block truncate text-xs text-ice-faint">{user.roleName}</span>
          </Link>
          <form action={signOut}>
            <button type="submit" className="rounded-lg p-2 text-ice-faint hover:bg-surface-hover hover:text-error" aria-label="تسجيل الخروج" title="تسجيل الخروج">
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-dvh bg-void">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:font-semibold focus:text-[#150C09]"
      >
        تخطَّ إلى المحتوى
      </a>

      <aside className="fixed inset-y-0 start-0 z-40 hidden w-64 border-e border-hairline bg-navy lg:block">{sidebar}</aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/60" aria-label="إغلاق القائمة" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 start-0 w-72 max-w-[85vw] border-e border-hairline bg-navy">{sidebar}</aside>
        </div>
      ) : null}

      <div className="lg:ps-64">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-hairline bg-void/90 px-4 backdrop-blur lg:hidden">
          <button type="button" onClick={() => setOpen(true)} className="rounded-lg p-2 text-ice" aria-label="فتح القائمة" aria-expanded={open}>
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <Logo className="h-4 w-auto" />
          <span className="w-9" />
        </header>
        <main id="admin-main" className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
