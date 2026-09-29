
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ScanLine,
  CloudSun,
  History,
  Sprout,
  X,
} from "lucide-react";

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Crop Analysis",
    href: "/analyze",
    icon: ScanLine,
  },
  {
    name: "Field Intelligence",
    href: "/fields",
    icon: CloudSun,
  },
  {
    name: "History",
    href: "/history",
    icon: History,
  },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({
  open,
  onClose,
}: Props) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <button
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#203c2c] text-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-7">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 text-2xl font-bold"
            onClick={onClose}
          >
            <Sprout size={30} className="text-[#a8d5a2]" />
            CropSense
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-6 pt-8 pb-4 text-xs font-semibold tracking-[0.2em] text-white/40">
          WORKSPACE
        </div>

        <nav className="flex-1 space-y-2 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  active
                    ? "bg-[#a8d5a2] font-semibold text-[#203c2c]"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="m-4 rounded-2xl bg-white/10 p-5">
          <Sprout className="mb-3 text-[#a8d5a2]" />

          <h3 className="font-semibold">
            Growing smarter, together.
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Understand your crops with evidence-based
            field intelligence.
          </p>
        </div>
      </aside>
    </>
  );
}