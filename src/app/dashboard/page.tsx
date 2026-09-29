
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  ScanLine,
  Sprout,
  AlertCircle,
  Plus,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import WeatherCard from "@/components/WeatherCard";
import AssessmentCard from "@/components/AssessmentCard";
import {
  Assessment,
  getAssessments,
} from "@/lib/assessments";

export default function Dashboard() {
  const [records, setRecords] = useState<Assessment[]>([]);

  useEffect(() => {
    setRecords(getAssessments());
  }, []);

  const stats = [
    {
      label: "Supported crops",
      value: "1",
      icon: Sprout,
    },
    {
      label: "Assessment records",
      value: records.length,
      icon: ClipboardList,
    },
    {
      label: "Completed AI analyses",
      value: "0",
      icon: ScanLine,
    },
    {
      label: "Pending analysis",
      value: records.length,
      icon: AlertCircle,
    },
  ];

  return (
    <AppShell
      title="Farm Overview"
      subtitle="Your crop health workspace"
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
            Your workspace
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Welcome to CropSense.
          </h2>

          <p className="mt-2 text-gray-500">
            Start an investigation or revisit your field records.
          </p>
        </div>

        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 rounded-xl bg-[#285943] px-5 py-3 font-semibold text-white hover:bg-[#203c2c]"
        >
          <Plus size={19} />
          New Assessment
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#e5e9df] bg-white p-6"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <Icon size={24} />
              </div>

              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="mt-2 text-sm text-gray-500">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <section className="relative overflow-hidden rounded-2xl bg-[#285943] p-8 text-white xl:col-span-2">
          <div className="relative z-10 max-w-lg">
            <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold">
              CROP INTELLIGENCE
            </span>

            <h2 className="mt-7 text-3xl font-bold leading-tight">
              Your next crop investigation starts here.
            </h2>

            <p className="mt-4 leading-relaxed text-white/75">
              Upload a photograph, record field conditions
              and prepare an evidence-based crop assessment.
            </p>

            <Link
              href="/analyze"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[#285943]"
            >
              Analyze a Crop
              <ArrowRight size={19} />
            </Link>
          </div>

          <Sprout
            size={230}
            strokeWidth={0.7}
            className="absolute -bottom-12 -right-8 text-white/10"
          />
        </section>

        <WeatherCard />
      </div>

      <section className="mt-9">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Recent Activity
          </h2>

          <Link
            href="/history"
            className="text-sm font-semibold text-green-700"
          >
            View all →
          </Link>
        </div>

        {records.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-green-200 bg-white px-6 py-14 text-center">
            <ClipboardList
              size={38}
              className="mx-auto text-green-400"
            />

            <h3 className="mt-5 text-xl font-bold">
              No assessments yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-gray-500">
              Your crop assessment records will appear here
              after you complete your first intake.
            </p>

            <Link
              href="/analyze"
              className="mt-6 inline-block font-semibold text-green-700"
            >
              Start an assessment →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {records.slice(0, 4).map((record) => (
              <AssessmentCard
                key={record.id}
                assessment={record}
              />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}