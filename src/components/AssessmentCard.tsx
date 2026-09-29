
import Link from "next/link";
import {
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import type { Assessment } from "@/lib/assessments";

export default function AssessmentCard({
  assessment,
}: {
  assessment: Assessment;
}) {
  return (
    <article className="flex items-start gap-4 rounded-2xl border border-[#e5e9df] bg-white p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
        <ClipboardList size={23} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold">{assessment.crop}</h3>

          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            {assessment.status}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-500">
          {new Date(assessment.date).toLocaleDateString()}
          {assessment.location &&
            ` · ${assessment.location}`}
        </p>

        <p className="mt-3 line-clamp-2 text-sm text-gray-600">
          {assessment.symptoms}
        </p>

        <Link
          href="/history"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-700"
        >
          View record <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}