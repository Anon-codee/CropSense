
"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Camera,
  Check,
  CloudSun,
  Loader2,
  AlertTriangle,
} from "lucide-react";

import AppShell from "@/components/AppShell";
import {
  saveAssessment,
  type Assessment,
  type Prediction,
} from "@/lib/assessments";
import {
  crops,
  type CropId,
} from "@/lib/crops";

type AnalysisResult = {
  crop: string;
  filename: string;
  model: string;
  predictions: Prediction[];
};

function cleanLabel(label: string) {
  return label
    .replace(/^A tomato leaf with\s*/i, "")
    .replace(/^Tomato___/i, "")
    .replace(/_/g, " ")
    .trim();
}

export default function AnalyzePage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [crop, setCrop] =
    useState<CropId>("tomato");

  const [image, setImage] = useState("");
  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [location, setLocation] = useState("");
  const [irrigation, setIrrigation] = useState("");
  const [soil, setSoil] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<AnalysisResult | null>(null);
  const [saved, setSaved] = useState(false);

  const selectedCrop = crops.find(
    (item) => item.id === crop
  )!;

  function uploadImage(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setImage("");
    setImageFile(null);
    setResult(null);

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {
      setError("Choose a JPG, PNG or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Maximum image size is 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const canvas =
          document.createElement("canvas");

        const scale = Math.min(
          1,
          1000 / Math.max(img.width, img.height)
        );

        canvas.width = Math.max(
          1,
          Math.round(img.width * scale)
        );

        canvas.height = Math.max(
          1,
          Math.round(img.height * scale)
        );

        const context =
          canvas.getContext("2d");

        if (!context) {
          setError("Could not process the image.");
          return;
        }

        context.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        );

        setImage(
          canvas.toDataURL("image/jpeg", 0.7)
        );
        setImageFile(file);
      };

      img.onerror = () => {
        setError("Could not open the image.");
      };

      img.src = reader.result as string;
    };

    reader.onerror = () => {
      setError("Could not read the file.");
    };

    reader.readAsDataURL(file);
  }

  function nextStep() {
    setError("");

    if (!selectedCrop.supported) {
      setError(
        `${selectedCrop.name} analysis is coming soon. Select Tomato to continue.`
      );
      return;
    }

    if (step === 1 && (!image || !imageFile)) {
      setError("Please upload a crop photograph.");
      return;
    }

    if (
      step === 2 &&
      (!irrigation || !soil || !symptoms.trim())
    ) {
      setError(
        "Please complete the required field details."
      );
      return;
    }

    setStep((current) =>
      Math.min(current + 1, 3)
    );
  }

  async function analyze(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      loading ||
      result ||
      !imageFile ||
      !selectedCrop.supported
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("file", imageFile);
      formData.append("crop", crop);

      const response = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "AI analysis failed."
        );
      }

      if (
        data.success !== true ||
        data.crop !== crop ||
        !Array.isArray(data.predictions)
      ) {
        throw new Error(
          "Unexpected response from the backend."
        );
      }

      const predictions: Prediction[] =
        data.predictions
          .filter(
            (item: unknown): item is Prediction =>
              typeof item === "object" &&
              item !== null &&
              "label" in item &&
              "score" in item &&
              typeof item.label === "string" &&
              typeof item.score === "number" &&
              Number.isFinite(item.score)
          )
          .sort(
            (a: Prediction, b: Prediction) =>
              b.score - a.score
          );

      if (predictions.length === 0) {
        throw new Error(
          "The model returned no predictions."
        );
      }

      setResult({
        crop: data.crop,
        filename: data.filename,
        model: data.model,
        predictions,
      });

      const assessment: Assessment = {
        id: crypto.randomUUID(),
        crop: selectedCrop.name,
        date: new Date().toISOString(),
        location: location.trim(),
        irrigation,
        soil,
        symptoms: symptoms.trim(),
        image,
        status: "AI analysis completed",
        predictions,
        model: data.model,
      };

      try {
        saveAssessment(assessment);
        setSaved(true);
      } catch {
        setError(
          "Analysis succeeded, but browser storage is full. This assessment was not saved."
        );
      }
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Cannot reach FastAPI. Check that your backend is running on port 8000."
          : err instanceof Error
            ? err.message
            : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep(1);
    setCrop("tomato");
    setImage("");
    setImageFile(null);
    setLocation("");
    setIrrigation("");
    setSoil("");
    setSymptoms("");
    setError("");
    setResult(null);
    setSaved(false);
  }

  return (
    <AppShell
      title="Crop Analysis"
      subtitle="Multi-crop intelligence"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
            New investigation
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Investigate your crop
          </h2>

          <p className="mt-3 text-gray-500">
            Select your crop, upload a photograph
            and receive an AI classification report.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-3 gap-3">
          {[
            {
              name: "Crop & Image",
              icon: Camera,
            },
            {
              name: "Field Details",
              icon: CloudSun,
            },
            {
              name: "AI Results",
              icon: BrainCircuit,
            },
          ].map((item, index) => {
            const Icon = item.icon;
            const active = step >= index + 1;

            return (
              <div
                key={item.name}
                className={`rounded-xl border p-4 ${
                  active
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Icon
                  size={22}
                  className={
                    active
                      ? "text-green-700"
                      : "text-gray-400"
                  }
                />

                <p className="mt-3 text-sm font-semibold">
                  {item.name}
                </p>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={analyze}
          className="rounded-2xl border border-gray-200 bg-white p-6 md:p-9"
        >
          {step === 1 && (
            <section>
              <h3 className="text-2xl font-bold">
                Select your crop
              </h3>

              <p className="mt-2 text-gray-500">
                Tomato analysis is available now.
                More crop models are in development.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {crops.map((item) => {
                  const selected =
                    crop === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setCrop(item.id);
                        setError("");
                      }}
                      aria-pressed={selected}
                      className={`rounded-xl border p-5 text-left transition ${
                        selected
                          ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-lg font-bold">
                          {item.name}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.supported
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.supported
                            ? "AI available"
                            : "Coming soon"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-gray-500">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {selectedCrop.supported ? (
                <>
                  <h3 className="mt-9 text-xl font-bold">
                    Upload your {selectedCrop.name.toLowerCase()} photograph
                  </h3>

                  <label className="mt-5 flex min-h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-green-300 bg-green-50 p-6 text-center">
                    {image ? (
                      <img
                        src={image}
                        alt="Selected crop"
                        className="max-h-64 rounded-xl object-contain"
                      />
                    ) : (
                      <>
                        <Camera
                          size={42}
                          className="text-green-700"
                        />
                        <p className="mt-4 font-semibold">
                          Click to upload a leaf photograph
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          JPG, PNG or WebP · Max 5 MB
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

                  {imageFile && image && (
                    <p className="mt-3 flex items-center gap-2 text-sm text-green-700">
                      <Check size={17} />
                      Photograph ready
                    </p>
                  )}
                </>
              ) : (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                  {selectedCrop.name} AI analysis
                  is not connected yet. You can
                  explore this crop option, but
                  cannot submit it for diagnosis.
                </div>
              )}
            </section>
          )}

          {step === 2 && (
            <section className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold">
                  Tell us about your field
                </h3>

                <p className="mt-2 text-gray-500">
                  These observations will be saved
                  with your assessment. They do not
                  yet affect the image model.
                </p>
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Crop
                </label>
                <input
                  value={selectedCrop.name}
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
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  placeholder="e.g. Pune, Maharashtra"
                  className="w-full rounded-xl border border-gray-200 p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Last irrigation
                </label>
                <select
                  value={irrigation}
                  onChange={(event) =>
                    setIrrigation(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white p-3"
                >
                  <option value="">Select</option>
                  <option>Today</option>
                  <option>Yesterday</option>
                  <option>2–3 days ago</option>
                  <option>
                    More than 3 days ago
                  </option>
                  <option>Not sure</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Soil condition
                </label>
                <select
                  value={soil}
                  onChange={(event) =>
                    setSoil(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white p-3"
                >
                  <option value="">Select</option>
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
                  onChange={(event) =>
                    setSymptoms(event.target.value)
                  }
                  rows={5}
                  placeholder="Describe spots, yellowing, wilting or other symptoms..."
                  className="w-full rounded-xl border border-gray-200 p-3"
                />
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <div className="flex items-center gap-3">
                <BrainCircuit
                  size={29}
                  className="text-green-700"
                />
                <h3 className="text-2xl font-bold">
                  {result
                    ? "Your AI analysis report"
                    : "Ready for AI analysis"}
                </h3>
              </div>

              {image && (
                <img
                  src={image}
                  alt="Uploaded crop"
                  className="mt-6 h-60 w-full rounded-xl bg-gray-50 object-contain"
                />
              )}

              {!result ? (
                <div className="mt-6 rounded-xl bg-[#f7f8f2] p-6">
                  <p className="font-semibold">
                    {selectedCrop.name}
                  </p>
                  <p className="mt-3 text-sm text-gray-600">
                    Location: {location || "Not provided"}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Irrigation: {irrigation}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Soil: {soil}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Symptoms: {symptoms}
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-6">
                  <div className="rounded-xl border border-green-200 bg-green-50 p-6">
                    <p className="text-sm font-semibold text-green-800">
                      HIGHEST-SCORING CLASS
                    </p>

                    <h4 className="mt-3 text-3xl font-bold text-[#285943]">
                      {cleanLabel(
                        result.predictions[0].label
                      )}
                    </h4>

                    <p className="mt-2 font-semibold text-green-800">
                      {(
                        result.predictions[0].score *
                        100
                      ).toFixed(2)}
                      % model score
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-6">
                    <h4 className="text-xl font-bold">
                      Prediction breakdown
                    </h4>

                    <div className="mt-6 space-y-5">
                      {result.predictions.map(
                        (prediction, index) => {
                          const percentage =
                            Math.max(
                              0,
                              Math.min(
                                100,
                                prediction.score * 100
                              )
                            );

                          return (
                            <div
                              key={`${prediction.label}-${index}`}
                            >
                              <div className="mb-2 flex justify-between gap-3 text-sm">
                                <span className="font-semibold">
                                  {cleanLabel(
                                    prediction.label
                                  )}
                                </span>
                                <span>
                                  {percentage.toFixed(2)}%
                                </span>
                              </div>

                              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
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
                  </div>

                  <div className="rounded-xl bg-[#f7f8f2] p-6">
                    <h4 className="font-bold">
                      Field observations
                    </h4>

                    <p className="mt-3 text-sm">
                      Location: {location || "Not provided"}
                    </p>
                    <p className="mt-2 text-sm">
                      Irrigation: {irrigation}
                    </p>
                    <p className="mt-2 text-sm">
                      Soil: {soil}
                    </p>
                    <p className="mt-2 text-sm">
                      Symptoms: {symptoms}
                    </p>
                  </div>

                  <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                    <AlertTriangle
                      size={21}
                      className="shrink-0"
                    />
                    <p>
                      This is an image-classification
                      result, not a confirmed diagnosis.
                      Field observations have not yet
                      influenced the prediction.
                      Consult a qualified agricultural
                      expert before treatment.
                    </p>
                  </div>

                  <p className="break-all text-xs text-gray-500">
                    Model: {result.model}
                  </p>

                  {saved && (
                    <div className="space-y-3">
                      <p className="flex items-center gap-2 text-sm font-semibold text-green-700">
                        <Check size={18} />
                        Saved to assessment history
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          router.push("/history")
                        }
                        className="rounded-xl bg-[#285943] px-5 py-3 font-semibold text-white"
                      >
                        View history
                      </button>
                    </div>
                  )}
                </div>
              )}
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
            {step > 1 && !result ? (
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setError("");
                  setStep(step - 1);
                }}
                className="flex items-center gap-2 font-semibold text-gray-600 disabled:opacity-50"
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
                disabled={
                  step === 1 &&
                  !selectedCrop.supported
                }
                className="flex items-center gap-2 rounded-xl bg-[#285943] px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
                <ArrowRight size={19} />
              </button>
            ) : !result ? (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-[#285943] px-6 py-3 font-semibold text-white disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze with AI
                    <BrainCircuit size={19} />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-2 rounded-xl border border-green-700 px-5 py-3 font-semibold text-green-800"
              >
                New assessment
              </button>
            )}
          </div>
        </form>
      </div>
    </AppShell>
  );
}