
"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

export default function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f8f2]">
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="lg:pl-64">
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setMenuOpen(true)}
        />

        <main className="mx-auto max-w-7xl p-5 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}