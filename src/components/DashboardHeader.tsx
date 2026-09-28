
"use client";

import { Menu, Sprout } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
};

export default function DashboardHeader({
  title,
  subtitle,
  onMenuClick,
}: Props) {
  return (
    <header className="flex items-center justify-between border-b border-[#e5e9df] bg-white px-6 py-5 md:px-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={23} />
        </button>

        <div>
          <h1 className="text-xl font-bold md:text-2xl">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-800">
        <Sprout size={22} />
      </div>
    </header>
  );
}