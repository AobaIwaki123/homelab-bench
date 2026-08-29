# homelab-bench デプロイ引き継ぎ資料

`homelab-bench` は自宅 k0s クラスタへの GPU 推論基盤のベンチマーク・ネットワーク構成・スペックを公開する Next.js (SSR) ダッシュボードです。

---

## アーキテクチャ概要

```
[外部ブラウザ]
  ↓ HTTPS (bench.example.com)
[Cloudflare Tunnel Ingress]
  ↓
[homelab-bench Pod (homelab-bench Namespace)]
  ↓ Server Component fetch (クラスタ内 DNS)
[llm-gpu-service.ai.svc.cluster.local:8088/api/benchmarks]
  ↓
[WSL2 Unified AI Gateway → benchmarks.json]
```

---

## CI / イメージビルド（自動）

`main` ブランチへのマージ時に GitHub Actions が自動で Docker イメージをビルドして GHCR へ push します。

- **イメージ**: `ghcr.io/aobaiwaki123/homelab-bench:latest`
- **CI ワークフロー**: `.github/workflows/docker-build.yml`

---

## クラスタへのデプロイ手順

### Step 1: GHCR イメージの pull 許可（初回のみ）

k8s クラスタが GHCR からイメージを pull できるように Secret を作成します。

```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=AobaIwaki123 \
  --docker-password=<GitHub PAT (read:packages)> \
  --namespace homelab-bench
```

その後 `k8s/deployment.yaml` の `spec.template.spec` に以下を追加してください：

```yaml
imagePullSecrets:
  - name: ghcr-secret
```

### Step 2: ArgoCD Application の登録（初回のみ）

```bash
kubectl apply -f k8s/argocd-app.yaml
```

これで ArgoCD が `main` への push を検知するたびに `k8s/` 配下のマニフェストを自動同期します。

### Step 3: Cloudflare Ingress ホスト名の変更

`k8s/ingress.yaml` の `host:` を実際のドメインに変更してコミットしてください：

```yaml
rules:
  - host: bench.example.com  # ← ここをご利用のドメインに変更
```

### Step 4: 疎通確認

```bash
# Pod の状態確認
kubectl get pods -n homelab-bench

# ログ確認
kubectl logs -n homelab-bench -l app=homelab-bench -f

# クラスタ内からの動作確認
kubectl run test --rm -it --image=curlimages/curl --restart=Never -- \
  curl http://homelab-bench.homelab-bench.svc.cluster.local:3000
```

---

## 環境変数

| 変数名 | デフォルト値 | 説明 |
| :--- | :--- | :--- |
| `LLM_BENCH_API_URL` | `http://llm-gpu-service.ai.svc.cluster.local:8088` | ベンチマーク JSON を提供する Unified AI Gateway の URL |

---

## ファイル構成

```
homelab-bench/
├── src/
│   └── app/
│       ├── page.tsx              # ベンチマーク表（ソート・フィルタ付き）
│       ├── layout.tsx            # 共通レイアウト
│       ├── network/page.tsx      # ネットワーク構成図（Mermaid）
│       └── spec/page.tsx         # ハードウェアスペック一覧
├── k8s/
│   ├── deployment.yaml           # Deployment + Service + Namespace
│   ├── ingress.yaml              # Cloudflare Tunnel Ingress
│   └── argocd-app.yaml           # ArgoCD Application（これだけ apply すれば OK）
├── .github/workflows/
│   └── docker-build.yml          # CI: GHCR へ自動 push
└── Dockerfile                    # standalone モードビルド
```
