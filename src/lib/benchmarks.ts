export interface BenchmarkModel {
  model_name: string;
  developer: string;
  release_date: string;
  parameters: string;
  quantization: string;
  size_gb: number;
  arch_type: string;
  prompt_tps: number;
  gen_tps: number;
  vram_mb: number;
  overall_accuracy: number;
  tech_accuracy: number;
  correct_count: number;
  total_count: number;
  avg_latency_ms: number;
  rank: number;
  eval_summary: string;
}

export interface BenchmarkData {
  last_updated: string;
  models: Record<string, BenchmarkModel>;
}

export async function fetchBenchmarks(): Promise<BenchmarkData> {
  const apiUrl = process.env.LLM_BENCH_API_URL ?? "http://localhost:8088";
  const res = await fetch(`${apiUrl}/api/benchmarks`, {
    next: { revalidate: 300 }, // 5 min cache
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch benchmarks: ${res.status}`);
  }
  return res.json();
}
