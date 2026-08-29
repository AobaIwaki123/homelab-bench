import { fetchBenchmarks } from "@/lib/benchmarks";
import BenchmarkTable from "@/components/BenchmarkTable";

// The benchmark API only exists inside the cluster at runtime.  Do not bake a
// failed build-time request into the generated page.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  let data;
  try {
    data = await fetchBenchmarks();
  } catch {
    return (
      <main className="min-h-screen bg-gray-950 text-gray-100 p-8">
        <p className="text-red-400">Failed to load benchmark data. Is the GPU service running?</p>
      </main>
    );
  }

  const models = Object.values(data.models).sort(
    (a, b) => b.overall_accuracy - a.overall_accuracy
  );

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Homelab LLM Benchmark</h1>
          <p className="text-gray-400 mt-1">
            Local GPU inference performance on NVIDIA GTX 1650 Ti (4 GB VRAM) — WSL2 / Vulkan
          </p>
          <p className="text-xs text-gray-600 mt-1">Last updated: {data.last_updated}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Models Evaluated", value: models.length },
            {
              label: "Best Accuracy",
              value: `${Math.max(...models.map((m) => m.overall_accuracy)).toFixed(1)}%`,
            },
            {
              label: "Fastest Speed",
              value: `${Math.max(...models.map((m) => m.gen_tps)).toFixed(1)} t/s`,
            },
            {
              label: "GPU",
              value: "GTX 1650 Ti",
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Model Leaderboard</h2>
          <BenchmarkTable models={models} />
        </div>
      </div>
    </main>
  );
}
