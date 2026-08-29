export default function NetworkPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Network Topology</h1>
          <p className="text-gray-400 mt-1">Home LAN (192.168.11.0/24) — k0s Cluster on Proxmox VE</p>
        </div>

        {/* Node Table */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Cluster Nodes</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  {["Hostname", "IP Address", "Role", "Infra", "Workloads"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    host: "WSL2 GPU Server",
                    ip: "192.168.11.15",
                    role: "LLM Inference + Benchmark API",
                    infra: "Windows 11 / WSL2",
                    workloads: "llama-server (Port 8088) — GTX 1650 Ti / Vulkan",
                    highlight: true,
                  },
                  {
                    host: "k8s-ctl.vm",
                    ip: "192.168.11.221",
                    role: "k0s Controller",
                    infra: "Proxmox VM",
                    workloads: "API Server, etcd, Calico",
                  },
                  {
                    host: "k8s-worker-1.vm",
                    ip: "192.168.11.214",
                    role: "Worker",
                    infra: "Proxmox VM",
                    workloads: "Rook Ceph OSD",
                  },
                  {
                    host: "k8s-worker-2.vm",
                    ip: "192.168.11.220",
                    role: "Worker",
                    infra: "Proxmox VM",
                    workloads: "Harbor Registry",
                  },
                  {
                    host: "k8s-worker-3.vm",
                    ip: "192.168.11.231",
                    role: "Worker",
                    infra: "Proxmox VM",
                    workloads: "ArgoCD (GitOps)",
                  },
                  {
                    host: "k8s-worker-4.vm",
                    ip: "192.168.11.234",
                    role: "Worker",
                    infra: "Proxmox VM",
                    workloads: "Cloudflare Ingress + Apps",
                  },
                ].map((node) => (
                  <tr
                    key={node.ip}
                    className={`border-t border-gray-700 ${node.highlight ? "bg-blue-950/30" : "hover:bg-gray-800"}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-200">{node.host}</td>
                    <td className="px-4 py-3 font-mono text-xs text-blue-400">{node.ip}</td>
                    <td className="px-4 py-3 text-gray-300 text-xs">{node.role}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{node.infra}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{node.workloads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Key Services */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Key Internal Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: "LLM Inference API",
                endpoint: "llm-gpu-service.ai.svc.cluster.local:8088/v1",
                desc: "OpenAI-compatible inference endpoint. Served by Unified AI Gateway → llama-server (Vulkan).",
                badge: "Internal",
                badgeColor: "bg-green-900 text-green-300",
              },
              {
                name: "Benchmark JSON API",
                endpoint: "llm-gpu-service.ai.svc.cluster.local:8088/api/benchmarks",
                desc: "Returns benchmarks.json with accuracy, throughput, and latency for all evaluated models.",
                badge: "Internal",
                badgeColor: "bg-green-900 text-green-300",
              },
              {
                name: "homelab-bench (This Site)",
                endpoint: "bench.example.com",
                desc: "Next.js SSR dashboard. Fetches benchmark data from internal cluster DNS.",
                badge: "Public",
                badgeColor: "bg-blue-900 text-blue-300",
              },
              {
                name: "ArgoCD",
                endpoint: "argocd.example.com",
                desc: "GitOps continuous deployment. Syncs k8s manifests from GitHub repositories.",
                badge: "Public",
                badgeColor: "bg-blue-900 text-blue-300",
              },
            ].map((svc) => (
              <div key={svc.name} className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-100">{svc.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${svc.badgeColor}`}>
                    {svc.badge}
                  </span>
                </div>
                <code className="text-xs text-blue-400 bg-gray-800 px-2 py-1 rounded block break-all">
                  {svc.endpoint}
                </code>
                <p className="text-xs text-gray-400">{svc.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
