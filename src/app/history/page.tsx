
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  MapPin,
  Sprout,
  Trash2,
  TriangleAlert,
} from "lucide-react";

import AppShell from "@/components/AppShell";
import {
  deleteAssessment,
  getAssessments,
  type Assessment,
} from "@/lib/assessments";

function formatLabel(label: string): string {
  return label
    .replace(/^A tomato leaf with\s*/i, "")
    .replace(/^Tomato___/i, "")
    .replace(/_/g, " ")
    .trim();
}

function formatDate(date: string): string {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown date";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatScore(score: number): string {
  return `${(Math.max(0, Math.min(1, score)) * 100).toFixed(2)}%`;
}

export default function HistoryPage() {
  const [assessments, setAssessments] = useState<
    Assessment[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [expandedId, setExpandedId] = useState<
    string | null
  >(null);

  useEffect(() => {
    setAssessments(getAssessments());
    setLoading(false);
  }, []);

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Delete this assessment? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      deleteAssessment(id);

      setAssessments((previous) =>
        previous.filter((item) => item.id !== id)
      );

      if (expandedId === id) {
        setExpandedId(null);
      }
    } catch {
      window.alert(
        "Could not delete this assessment. Please try again."
      );
    }
  }

  const analyzedCount = assessments.filter(
    (item) =>
      item.predictions &&
      item.predictions.length > 0
  ).length;

  return (
    <AppShell
      title="Assessment History"
      subtitle="Review your previous crop investigations"
    >
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Page heading */}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-green-700">
              Crop monitoring
            </span>

            <h2 className="mt-3 text-3xl font-bold">
              Your assessment history
            </h2>

            <p className="mt-3 text-gray-500">
              Review previous photographs, AI
              predictions and field observations.
            </p>
          </div>

          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 rounded-xl bg-[#285943] px-5 py-3 font-semibold text-white"
          >
            New assessment
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Summary */}

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <ClipboardList
              className="text-green-700"
              size={25}
            />

            <p className="mt-4 text-sm text-gray-500">
              Total assessments
            </p>

            <p className="mt-1 text-3xl font-bold">
              {assessments.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <BrainCircuit
              className="text-green-700"
              size={25}
            />

            <p className="mt-4 text-sm text-gray-500">
              AI-analyzed images
            </p>

            <p className="mt-1 text-3xl font-bold">
              {analyzedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <Sprout
              className="text-green-700"
              size={25}
            />

            <p className="mt-4 text-sm text-gray-500">
              Crop monitored
            </p>

            <p className="mt-1 text-3xl font-bold">
              Tomato
            </p>
          </div>
        </div>

        {/* Loading */}

        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500">
            Loading assessments...
          </div>
        )}

        {/* Empty state */}

        {!loading && assessments.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
              <ClipboardList
                size={32}
                className="text-green-700"
              />
            </div>

            <h3 className="mt-6 text-2xl font-bold">
              No assessments yet
            </h3>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              Upload your first tomato leaf
              photograph to start building your
              crop assessment history.
            </p>

            <Link
              href="/analyze"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#285943] px-6 py-3 font-semibold text-white"
            >
              Start an assessment
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {/* Assessment records */}

        {!loading && assessments.length > 0 && (
          <div className="space-y-5">
            {assessments.map((assessment) => {
              const predictions =
                assessment.predictions ?? [];

              const topPrediction =
                predictions.length > 0
                  ? [...predictions].sort(
                      (a, b) => b.score - a.score
                    )[0]
                  : null;

              const expanded =
                expandedId === assessment.id;

              return (
                <article
                  key={assessment.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                  {/* Assessment preview */}

                  <div className="flex flex-col gap-5 p-5 md:flex-row md:p-7">
                    <div className="h-48 w-full shrink-0 overflow-hidden rounded-xl bg-green-50 md:h-40 md:w-44">
                      {assessment.image ? (
                        <img
                          src={assessment.image}
                          alt="Saved tomato crop"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Sprout
                            size={40}
                            className="text-green-300"
                          />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                          {assessment.crop}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            topPrediction
                              ? "bg-emerald-50 text-emerald-800"
                              : "bg-amber-50 text-amber-800"
                          }`}
                        >
                          {topPrediction
                            ? "AI analyzed"
                            : "No AI results"}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-bold">
                        {topPrediction
                          ? formatLabel(
                              topPrediction.label
                            )
                          : "Crop observation"}
                      </h3>

                      {topPrediction && (
                        <p className="mt-2 text-sm text-green-800">
                          {formatScore(
                            topPrediction.score
                          )}{" "}
                          model score
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays size={16} />
                          {formatDate(
                            assessment.date
                          )}
                        </span>

                        {assessment.location && (
                          <span className="inline-flex items-center gap-2">
                            <MapPin size={16} />
                            {assessment.location}
                          </span>
                        )}
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId(
                              expanded
                                ? null
                                : assessment.id
                            )
                          }
                          aria-expanded={expanded}
                          className="inline-flex items-center gap-2 rounded-xl border border-green-700 px-4 py-2 text-sm font-semibold text-green-800"
                        >
                          {expanded
                            ? "Hide details"
                            : "View report"}

                          {expanded ? (
                            <ChevronUp size={17} />
                          ) : (
                            <ChevronDown size={17} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              assessment.id
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded report */}

                  {expanded && (
                    <div className="space-y-7 border-t border-gray-100 bg-[#fcfdf9] p-5 md:p-7">
                      {predictions.length > 0 ? (
                        <section>
                          <div className="flex items-center gap-2">
                            <BrainCircuit
                              size={22}
                              className="text-green-700"
                            />

                            <h4 className="text-lg font-bold">
                              AI model predictions
                            </h4>
                          </div>

                          <p className="mt-2 text-sm text-gray-500">
                            These are image
                            classification scores,
                            not confirmed disease
                            probabilities.
                          </p>

                          <div className="mt-6 space-y-5">
                            {[...predictions]
                              .sort(
                                (a, b) =>
                                  b.score - a.score
                              )
                              .map(
                                (
                                  prediction,
                                  index
                                ) => {
                                  const percentage =
                                    Math.max(
                                      0,
                                      Math.min(
                                        100,
                                        prediction.score *
                                          100
                                      )
                                    );

                                  return (
                                    <div
                                      key={`${prediction.label}-${index}`}
                                    >
                                      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                                        <span className="font-semibold">
                                          {formatLabel(
                                            prediction.label
                                          )}
                                        </span>

                                        <span className="font-bold text-green-800">
                                          {percentage.toFixed(
                                            2
                                          )}
                                          %
                                        </span>
                                      </div>

                                      <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                                        <div
                                          className="h-full rounded-full bg-green-600"
                                          style={{
                                            width: `${percentage}%`,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                          </div>

                          {assessment.model && (
                            <p className="mt-5 break-all text-xs text-gray-400">
                              Model:{" "}
                              {assessment.model}
                            </p>
                          )}
                        </section>
                      ) : (
                        <div className="rounded-xl bg-amber-50 p-5 text-sm text-amber-900">
                          This assessment was saved
                          before AI analysis was
                          connected. No model
                          predictions are available.
                        </div>
                      )}

                      <section className="rounded-xl border border-gray-200 bg-white p-6">
                        <h4 className="text-lg font-bold">
                          Field observations
                        </h4>

                        <div className="mt-5 grid gap-5 sm:grid-cols-2">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                              Crop
                            </p>

                            <p className="mt-1 font-medium">
                              {assessment.crop}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                              Location
                            </p>

                            <p className="mt-1 font-medium">
                              {assessment.location ||
                                "Not provided"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                              Last irrigation
                            </p>

                            <p className="mt-1 font-medium">
                              {assessment.irrigation ||
                                "Not provided"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                              Soil condition
                            </p>

                            <p className="mt-1 font-medium">
                              {assessment.soil ||
                                "Not provided"}
                            </p>
                          </div>

                          <div className="sm:col-span-2">
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                              Visible symptoms
                            </p>

                            <p className="mt-1 whitespace-pre-wrap font-medium">
                              {assessment.symptoms ||
                                "Not provided"}
                            </p>
                          </div>
                        </div>
                      </section>

                      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
                        <TriangleAlert
                          size={21}
                          className="shrink-0 text-amber-700"
                        />

                        <p className="text-sm leading-relaxed text-amber-900">
                          AI image predictions
                          require field
                          verification. The
                          irrigation, soil and
                          symptom observations
                          shown here have not
                          yet been incorporated
                          into the model.
                          Consult a qualified
                          agricultural expert
                          before applying
                          treatments.
                        </p>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}