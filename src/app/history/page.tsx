
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Trash2,
  Plus,
  MapPin,
  CalendarDays,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import {
  Assessment,
  getAssessments,
  deleteAssessment,
} from "@/lib/assessments";

export default function HistoryPage() {
  const [records, setRecords] = useState<Assessment[]>([]);
  const [selected, setSelected] = useState<string | null>(
    null
  );

  useEffect(() => {
    setRecords(getAssessments());
  }, []);

  function removeRecord(id: string) {
    if (!window.confirm("Delete this assessment record?")) {
      return;
    }

    deleteAssessment(id);

    setRecords(getAssessments());

    if (selected === id) {
      setSelected(null);
    }
  }

  return (
    <AppShell
      title="Assessment History"
      subtitle="Your saved crop observations"
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">
            Your Assessments
          </h2>

          <p className="mt-2 text-gray-500">
            Review previously submitted crop observations.
          </p>
        </div>

        <Link
          href="/analyze"
          className="flex items-center gap-2 rounded-xl bg-[#285943] px-5 py-3 font-semibold text-white"
        >
          <Plus size={19} />
          New Assessment
        </Link>
      </div>

      {records.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-green-200 bg-white p-14 text-center">
          <ClipboardList
            size={45}
            className="mx-auto text-green-400"
          />

          <h3 className="mt-5 text-2xl font-bold">
            No records yet
          </h3>

          <p className="mx-auto mt-3 max-w-sm text-gray-500">
            Your completed assessment forms will appear here.
          </p>

          <Link
            href="/analyze"
            className="mt-7 inline-block rounded-xl bg-green-700 px-6 py-3 font-semibold text-white"
          >
            Start Your First Assessment
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {records.map((record) => (
            <article
              key={record.id}
              className="overflow-hidden rounded-2xl border border-[#e5e9df] bg-white"
            >
              <div className="flex flex-col gap-5 p-6 sm:flex-row">
                {record.image && (
                  <img
                    src={record.image}
                    alt="Submitted crop"
                    className="h-36 w-full rounded-xl bg-gray-50 object-cover sm:w-40"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold">
                      {record.crop}
                    </h3>

                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      {record.status}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-5 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {new Date(
                        record.date
                      ).toLocaleDateString()}
                    </span>

                    {record.location && (
                      <span className="flex items-center gap-2">
                        <MapPin size={16} />
                        {record.location}
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-gray-600">
                    {record.symptoms}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-4">
                    <button
                      onClick={() =>
                        setSelected(
                          selected === record.id
                            ? null
                            : record.id
                        )
                      }
                      className="font-semibold text-green-700"
                    >
                      {selected === record.id
                        ? "Hide details"
                        : "View details"}
                    </button>

                    <button
                      onClick={() => removeRecord(record.id)}
                      className="flex items-center gap-2 text-sm font-medium text-red-600"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {selected === record.id && (
                <div className="grid gap-5 border-t border-gray-100 bg-[#fafbf7] p-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">
                      Last irrigation
                    </p>
                    <p className="mt-1 font-semibold">
                      {record.irrigation}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Soil condition
                    </p>
                    <p className="mt-1 font-semibold">
                      {record.soil}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-500">
                      Symptoms
                    </p>
                    <p className="mt-1">{record.symptoms}</p>
                  </div>

                  <p className="text-sm text-amber-800 sm:col-span-2">
                    AI analysis is not connected yet.
                    This record contains farmer observations,
                    not a diagnosis.
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </AppShell>
  );
}