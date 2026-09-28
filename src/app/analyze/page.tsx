
"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  ArrowLeft,
  ArrowRight,
  Check,
  CloudSun,
  ClipboardCheck,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import {
  saveAssessment,
  type Assessment,
} from "@/lib/assessments";

export default function AnalyzePage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [irrigation, setIrrigation] = useState("");
  const [soil, setSoil] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [error, setError] = useState("");

  function uploadImage(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (
      !["image/jpeg", "image/png", "image/webp"].includes(
        file.type
      )
    ) {
      setError("Please select a JPG, PNG or WebP image.");
      return;
    }

    // Keep the stored image small enough for browser storage.
    if (file.size > 5 * 1024 * 1024) {
      setError("Please choose an image smaller than 5 MB.");
      return;
    }

    setError("");

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(
          1,
          1000 / Math.max(img.width, img.height)
        );

        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          setError("Could not process this image.");
          return;
        }

        ctx.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        );

        setImage(canvas.toDataURL("image/jpeg", 0.7));
      };

      img.onerror = () => {
        setError("This image could not be opened.");
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  function nextStep() {
    setError("");

    if (step === 1 && !image) {
      setError("Please upload a crop photograph.");
      return;
    }

    if (
      step === 2 &&
      (!irrigation || !soil || !symptoms.trim())
    ) {
      setError("Please complete all required field details.");
      return;
    }

    setStep((previous) => Math.min(previous + 1, 3));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const assessment: Assessment = {
      id: crypto.randomUUID(),
      crop: "Tomato",
      date: new Date().toISOString(),
      location: location.trim(),
      irrigation,
      soil,
      symptoms: symptoms.trim(),
      image,
      status: "Pending AI analysis",
    };

    try {
      saveAssessment(assessment);
      router.push("/history");
    } catch {
      setError(
        "Unable to save this assessment. Browser storage may be full."
      );
    }
  }

  const steps = [
    { number: 1, name: "Crop Image", icon: Camera },
    { number: 2, name: "Field Details", icon: CloudSun },
    { number: 3, name: "Review", icon: ClipboardCheck },
  ];

  return (
    <AppShell
      title="Crop Analysis"
      subtitle="Start a new crop investigation"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-9">
          <span className="text-sm font-semibold uppercase tracking-widest text-green-700">
            New assessment
          </span>

          <h2 className="mt-3 text-3xl font-bold">
            Let's investigate your crop.
          </h2>

          <p className="mt-3 text-gray-500">
            Complete the three steps below to prepare your
            crop assessment.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-3 gap-3">
          {steps.map((item) => {
            const Icon = item.icon;
            const active = step >= item.number;

            return (
              <div
                key={item.number}
                className={`rounded-xl border p-4 ${
                  active
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Icon
                  size={22}
                  className={
                    active ? "text-green-700" : "text-gray-400"
                  }
                />

                <p className="mt-3 text-sm font-semibold">
                  {item.name}
                </p>

                <div
                  className={`mt-3 h-1 rounded-full ${
                    active ? "bg-green-600" : "bg-gray-100"
                  }`}
                />
              </div>
            );
          })}
        </div>

        <form
          onSubmit={submit}
          className="rounded-2xl border border-[#e5e9df] bg-white p-6 md:p-9"
        >
          {step === 1 && (
            <section>
              <h3 className="text-2xl font-bold">
                Upload your crop photograph
              </h3>

              <p className="mt-3 text-gray-500">
                Take a clear photograph of the affected
                tomato plant or leaf.
              </p>

              <label className="mt-7 flex min-h-80 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-green-300 bg-green-50 p-6 text-center">
                {image ? (
                  <img
                    src={image}
                    alt="Selected crop"
                    className="max-h-72 rounded-xl object-contain"
                  />
                ) : (
                  <>
                    <Camera
                      size={46}
                      className="text-green-600"
                    />

                    <p className="mt-5 font-semibold">
                      Click to select a photograph
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      JPG, PNG or WebP · Maximum 5 MB
                    </p>
                  </>
                )}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={uploadImage}
                  className="hidden"
                />
              </label>

              {image && (
                <p className="mt-4 flex items-center gap-2 text-sm text-green-700">
                  <Check size={17} />
                  Photograph ready. Click the image to replace it.
                </p>
              )}
            </section>
          )}

          {step === 2 && (
            <section className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold">
                  Tell us about your field
                </h3>

                <p className="mt-3 text-gray-500">
                  Field observations help distinguish between
                  different possible causes of crop stress.
                </p>
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Crop
                </label>

                <input
                  value="Tomato"
                  readOnly
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Location
                </label>

                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Pune, Maharashtra"
                  className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Last irrigation
                </label>

                <select
                  value={irrigation}
                  onChange={(e) => setIrrigation(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white p-3"
                >
                  <option value="">Select an option</option>
                  <option>Today</option>
                  <option>Yesterday</option>
                  <option>2–3 days ago</option>
                  <option>More than 3 days ago</option>
                  <option>Not sure</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Soil condition
                </label>

                <select
                  value={soil}
                  onChange={(e) => setSoil(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white p-3"
                >
                  <option value="">Select an option</option>
                  <option>Dry</option>
                  <option>Slightly moist</option>
                  <option>Wet</option>
                  <option>Waterlogged</option>
                  <option>Not sure</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Visible symptoms
                </label>

                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={5}
                  placeholder="Describe yellowing, spots, wilting, visible insects or other changes..."
                  className="w-full resize-none rounded-xl border border-gray-200 p-3 outline-none focus:border-green-600"
                />
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <h3 className="text-2xl font-bold">
                Review your assessment
              </h3>

              <p className="mt-3 text-gray-500">
                Check your information before saving.
              </p>

              {image && (
                <img
                  src={image}
                  alt="Crop preview"
                  className="mt-6 h-60 w-full rounded-xl bg-gray-50 object-contain"
                />
              )}

              <div className="mt-6 space-y-4 rounded-xl bg-[#f7f8f2] p-6">
                {[
                  ["Crop", "Tomato"],
                  ["Location", location || "Not provided"],
                  ["Last irrigation", irrigation],
                  ["Soil condition", soil],
                  ["Symptoms", symptoms],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="border-b border-gray-200 pb-3 last:border-0"
                  >
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      {label}
                    </p>

                    <p className="mt-1 font-medium">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
                This saves your observations only. AI
                diagnosis and weather-based reasoning
                are not connected yet.
              </div>
            </section>
          )}

          {error && (
            <p
              role="alert"
              className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <div className="mt-9 flex items-center justify-between border-t border-gray-100 pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setStep(step - 1);
                }}
                className="flex items-center gap-2 font-semibold text-gray-600"
              >
                <ArrowLeft size={19} />
                Back
              </button>
            ) : (
              <span />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 rounded-xl bg-[#285943] px-6 py-3 font-semibold text-white"
              >
                Continue
                <ArrowRight size={19} />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-[#285943] px-6 py-3 font-semibold text-white"
              >
                Save Assessment
                <Check size={19} />
              </button>
            )}
          </div>
        </form>
      </div>
    </AppShell>
  );
}