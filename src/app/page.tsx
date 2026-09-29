
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CloudSun,
  BrainCircuit,
  ShieldCheck,
  Sprout,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Image Intelligence",
    description:
      "Analyze visible crop symptoms using computer vision.",
  },
  {
    icon: CloudSun,
    title: "Field Context",
    description:
      "Combine weather conditions with irrigation and field observations.",
  },
  {
    icon: BrainCircuit,
    title: "Contextual Reasoning",
    description:
      "Compare possible causes instead of relying on a photograph alone.",
  },
  {
    icon: ShieldCheck,
    title: "Explainable Guidance",
    description:
      "Understand supporting evidence and identify cases requiring expert review.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8f2] text-[#203c2c]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold"
        >
          <Sprout size={30} className="text-green-700" />
          CropSense
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          <a
            href="#features"
            className="font-medium hover:text-green-700"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="font-medium hover:text-green-700"
          >
            How It Works
          </a>
        </div>

        <Link
          href="/dashboard"
          className="rounded-xl bg-[#285943] px-5 py-3 text-sm font-semibold text-white"
        >
          Open Dashboard
        </Link>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <span className="inline-block rounded-full bg-[#e2eddf] px-5 py-2 text-sm font-semibold text-green-800">
            AI-POWERED AGRICULTURAL INTELLIGENCE
          </span>

          <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Healthier crops begin with{" "}
            <span className="text-[#548b62]">
              better understanding.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-gray-600">
            CropSense brings crop photographs, weather
            conditions and field observations together
            to investigate crop stress and support
            informed farming decisions.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 rounded-xl bg-[#285943] px-7 py-4 font-semibold text-white hover:bg-[#203c2c]"
            >
              Explore CropSense
              <ArrowRight size={20} />
            </Link>

            <a
              href="#how-it-works"
              className="rounded-xl border border-green-200 px-7 py-4 font-semibold hover:bg-green-50"
            >
              How It Works
            </a>
          </div>

          <div className="mt-10 flex items-center gap-3 text-sm text-gray-500">
            <CheckCircle2
              size={19}
              className="text-green-700"
            />
            Starting with tomato crop assessments
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-5 -top-5 h-32 w-32 rounded-full bg-green-200/60 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] bg-[#dce8d6] p-5 shadow-xl">
            <div className="rounded-[1.5rem] bg-[#285943] p-8 text-white md:p-12">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/15 px-4 py-2 text-sm">
                  Crop Intelligence
                </span>

                <Sprout
                  size={36}
                  className="text-green-200"
                />
              </div>

              <div className="my-14 flex justify-center">
                <Sprout
                  size={180}
                  strokeWidth={0.8}
                  className="text-[#a8d5a2]"
                />
              </div>

              <h2 className="text-3xl font-bold">
                Beyond the photograph.
              </h2>

              <p className="mt-4 leading-relaxed text-green-100">
                Image findings + field observations +
                weather context.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                ["01", "Observe"],
                ["02", "Investigate"],
                ["03", "Understand"],
              ].map(([number, label]) => (
                <div
                  key={number}
                  className="rounded-xl bg-white p-4 text-center"
                >
                  <p className="text-2xl font-bold text-green-700">
                    {number}
                  </p>

                  <p className="mt-2 text-xs font-semibold">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="bg-white px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
            Our approach
          </p>

          <h2 className="mt-4 max-w-2xl text-4xl font-bold">
            A more complete picture of crop health.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-green-100 bg-[#f7f8f2] p-7"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#e2eddf]">
                    <Icon
                      size={27}
                      className="text-green-700"
                    />
                  </div>

                  <h3 className="mt-7 text-xl font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-4 leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-6 py-24"
      >
        <div className="text-center">
          <p className="font-semibold uppercase tracking-widest text-green-700">
            The process
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            Three steps to better crop insights.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              number: "01",
              title: "Capture",
              description:
                "Upload a clear photograph of the affected crop.",
            },
            {
              number: "02",
              title: "Describe",
              description:
                "Share irrigation history, soil conditions and visible symptoms.",
            },
            {
              number: "03",
              title: "Investigate",
              description:
                "Combine visual and environmental evidence to explore possible causes.",
            },
          ].map((item) => (
            <div
              key={item.number}
              className="rounded-2xl border border-green-100 bg-white p-8"
            >
              <p className="text-5xl font-bold text-green-200">
                {item.number}
              </p>

              <h3 className="mt-6 text-2xl font-bold">
                {item.title}
              </h3>

              <p className="mt-4 leading-relaxed text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#203c2c] px-6 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Sprout />
            CropSense
          </div>

          <p className="text-sm text-white/60">
            Context-aware crop stress investigation.
          </p>
        </div>
      </footer>
    </main>
  );
}