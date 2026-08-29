export default function SpecPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hardware Spec</h1>
          <p className="text-gray-400 mt-1">WSL2 GPU Inference Server — Local LLM Host</p>
        </div>

        {[
          {
            category: "GPU",
            items: [
              { label: "Model", value: "NVIDIA GeForce GTX 1650 Ti Mobile" },
              { label: "VRAM", value: "4 GB GDDR6" },
              { label: "CUDA Cores", value: "1,024" },
              { label: "Memory Bandwidth", value: "192 GB/s" },
              { label: "TGP", value: "50 W" },
              { label: "Acceleration", value: "Vulkan 1.3 (via llama.cpp)" },
            ],
          },
          {
            category: "CPU",
            items: [
              { label: "Model", value: "AMD Ryzen 5 4600H" },
              { label: "Cores / Threads", value: "6 Core / 12 Threads" },
              { label: "Base / Boost Clock", value: "3.0 GHz / 4.0 GHz" },
            ],
          },
          {
            category: "Memory",
            items: [
              { label: "WSL2 Allocation", value: "7.5 GB RAM" },
              { label: "Safe VRAM Limit", value: "3.2 GB (100% GPU Offload)" },
              { label: "OOM Threshold", value: "> 7.5 GB → Crash" },
            ],
          },
          {
            category: "Software Stack",
            items: [
              { label: "OS", value: "Ubuntu 24.04 LTS (WSL2 on Windows 11)" },
              { label: "Inference Engine", value: "llama.cpp (Vulkan backend)" },
              { label: "API Server", value: "llama-server (OpenAI Compatible)" },
              { label: "Gateway", value: "Unified AI Gateway (Python, Port 8080)" },
              { label: "Model Format", value: "GGUF (Q4_K_M quantization)" },
              { label: "Best Model", value: "Meta Llama-3.2-3B-Instruct (Accuracy: 92.5%)" },
            ],
          },
        ].map((section) => (
          <section key={section.category}>
            <h2 className="text-lg font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-2">
              {section.category}
            </h2>
            <div className="space-y-2">
              {section.items.map((item) => (
                <div key={item.label} className="flex justify-between text-sm py-1">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="text-gray-100 font-mono text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
