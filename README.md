# Probability Distributions — Rust + WebAssembly

An interactive showcase of **15 probability distributions** computed in Rust via WebAssembly, rendered with Chart.js and styled with the **ObligaI** design system.

**[Live demo →](https://oblig.ai)**

## Distributions

### Continuous (11)
| Distribution | Parameters | Key Use |
|---|---|---|
| **Normal** | `μ`, `σ` | Natural phenomena, measurement errors, CLT |
| **Uniform** | `a`, `b` | Random number generation, non-informative priors |
| **Log-Normal** | `μ`, `σ` | Stock prices, income distributions |
| **Exponential** | `λ` | Waiting times, radioactive decay |
| **Gamma** | `α`, `β` | Rainfall, insurance claims, aggregate waiting |
| **Beta** | `α`, `β` | Proportions, A/B testing, Bayesian conjugate prior |
| **Weibull** | `k`, `λ` | Reliability engineering, survival analysis |
| **Student's t** | `μ`, `σ`, `ν` | Small-sample inference, robust regression |
| **Chi-Squared** | `k` | Goodness-of-fit, variance confidence intervals |
| **Fisher (F)** | `d₁`, `d₂` | ANOVA, regression significance |
| **Erlang** | `k`, `λ` | Queueing theory, telecom traffic |

### Discrete (4)
| Distribution | Parameters | Key Use |
|---|---|---|
| **Poisson** | `λ` | Event counts, website hits, call arrivals |
| **Geometric** | `p` | Trials until first success |
| **Binomial** | `n`, `p` | Success counts, quality control |
| **Hypergeometric** | `N`, `K`, `n` | Sampling without replacement, lotteries |

## Architecture

```
app/                          # Vite + React frontend
├── src/
│   ├── wasm/distributions.ts # Distribution metadata + LaTeX formulas
│   ├── hooks/useWasmDist.ts  # WASM bridge with debounced compute
│   ├── components/
│   │   ├── DistributionCard.tsx  # Regulation card with chart + params
│   │   ├── DistributionModal.tsx # Fullscreen detail view
│   │   ├── HelpModal.tsx         # Mathematical reference
│   │   └── ParamSlider.tsx       # Range slider with KaTeX labels
│   ├── context/ThemeContext.tsx  # Dark/light mode
│   ├── obligai.css               # ObligaI design system (27 sections)
│   └── index.css                 # App-specific additions only
└── vercel.json

wasm/                          # Rust → WASM crate
├── Cargo.toml
└── src/lib.rs                 # 15 distribution PDF/PMF + stats via statrs
```

## Development

```bash
# Build WASM
cd wasm
wasm-pack build --target web
cp -r pkg ../app/src/wasm-pkg

# Run app
cd app
npm install
npm run dev
```

## Tech Stack

- **[Rust](https://www.rust-lang.org)** + **[WebAssembly](https://webassembly.org)** — distribution computation via `statrs`
- **React 19** + **TypeScript** — UI framework
- **Vite** — build tool
- **Chart.js** — PDF/PMF curve rendering
- **KaTeX** — mathematical formula typesetting
- **Framer Motion** — animations
- **ObligaI** Design System — theming, components, layout

## License

MIT
