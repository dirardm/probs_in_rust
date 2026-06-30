import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { DISTRIBUTIONS } from '../wasm/distributions';
import Formula from './Formula';

interface Props { onClose: () => void; }

function WasmIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6.17l-2.45 9.66h-1.9l-1.5-6.24-1.5 6.24H6.95L4.5 8.17h1.8l1.3 6.2 1.55-6.2h1.7l1.55 6.2 1.3-6.2h1.8z"/>
    </svg>
  );
}
function RustIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1C9.5 1 7.3 1.5 5.6 2.4l.4.7c.4-.2.9-.4 1.5-.6.8-.2 1.6-.3 2.5-.3 1.1 0 2.1.2 3 .5.9.3 1.6.8 2.2 1.4l.6-.4c-.7-.7-1.5-1.2-2.5-1.6S13.2 1 12 1zm4.8 2.2l-.3.7c1.2.8 2.1 1.9 2.7 3.2l.8-.3c-.6-1.4-1.6-2.6-3.2-3.6zM7.2 3.2l-.4-.7C5.1 3.6 3.8 5.1 3 7l.7.3c.7-1.1 1.7-2 3.5-2.5v-.6zm-3.4 5l-.7-.3c-.5 1.3-.8 2.7-.8 4.1h.8c0-1.3.2-2.6.7-3.8zm16.4 0c.5 1.2.7 2.5.7 3.8H22c0-1.4-.2-2.8-.7-4.1l-.7.3zm-4.6 8.4l.5.6c1.2-.7 2.2-1.6 3-2.7l-.7-.4c-.7 1-1.6 1.8-2.8 2.5zm-6.8 0c-1.2-.7-2.1-1.5-2.8-2.5l-.7.4c.8 1.1 1.8 2 3 2.7l.5-.6zm4.6 1.5l-.4-.7c-.5.3-1 .5-1.6.7-.8.2-1.6.3-2.4.3-1.1 0-2.1-.2-3-.5-.9-.3-1.6-.7-2.2-1.3l-.6.5c.7.7 1.5 1.2 2.6 1.6 1 .3 2.1.5 3.2.5 1.1 0 2.1-.1 3-.4.8-.2 1.5-.5 2-.8l.4.7c-.6.4-1.4.7-2.4 1-.9.2-2 .3-3 .3-1.3 0-2.5-.2-3.6-.6-1.1-.4-2-1-2.7-1.7l-.5.6c.8.8 1.8 1.4 3 1.8L7.5 23l.3-.8c-1.1-.4-2-1-2.8-1.7l-.5.6c.9.8 2 1.4 3.2 1.8l.2.8h.8l.1-.8C9.9 23.9 11 24 12 24c1 0 2.1-.1 3.1-.3l.1.8h.8l.2-.8c1.2-.4 2.3-.9 3.2-1.8l-.5-.6c-.8.7-1.7 1.3-2.8 1.7l.3.8-1.2.4c-1.2.4-2.5.5-3.8.5-1.3 0-2.6-.2-3.7-.7zM5.6 20.7l-.4.6c1.4 1.1 3.3 1.9 5.4 2H12zm12.8 0c1.1-.7 2.1-1.5 2.9-2.6l-.5-.6c-.7.9-1.6 1.7-2.8 2.4l.4.8zM12 6c-1.8 0-3.3.6-4.5 1.8-1.2 1.2-1.8 2.7-1.8 4.5 0 1.8.6 3.3 1.8 4.5C8.7 17.9 10.2 18.5 12 18.5s3.3-.6 4.5-1.8c1.2-1.2 1.8-2.7 1.8-4.5 0-1.8-.6-3.3-1.8-4.5C15.3 6.6 13.8 6 12 6z"/>
    </svg>
  );
}

interface DistHelp {
  name: string; regClass: string;
  pdf?: string; pmf?: string;
  mean: string; variance: string;
  example: string; uses: string;
}

const HELP: DistHelp[] = [
  { name:'Normal', regClass:'regulation-card--irl',
    pdf:'f(x)=\\frac{1}{\\sigma\\sqrt{2\\pi}}\\exp\\!\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right),\\quad x\\in\\mathbb{R}',
    mean:'\\mu', variance:'\\sigma^2',
    example:'Heights of adult men in a population are approximately Normal(178 cm, 7 cm). About 68% of men are between 171–185 cm tall.',
    uses:'Natural phenomena, measurement errors, financial returns, quality control, and as the foundation of most inferential statistics.' },
  { name:'Uniform', regClass:'regulation-card--lcr',
    pdf:'f(x)=\\frac{1}{b-a},\\quad a\\leq x\\leq b',
    mean:'\\frac{a+b}{2}', variance:'\\frac{(b-a)^2}{12}',
    example:'A bus arrives at a stop uniformly between 0 and 10 minutes. The probability you wait more than 8 minutes is 20%.',
    uses:'Random number generation, simulation of equally-likely outcomes, rounding errors, and as a non-informative prior in Bayesian statistics.' },
  { name:'Log-Normal', regClass:'regulation-card--nsfr',
    pdf:'f(x)=\\frac{1}{x\\sigma\\sqrt{2\\pi}}\\exp\\!\\left(-\\frac{(\\ln x-\\mu)^2}{2\\sigma^2}\\right),\\quad x>0',
    mean:'e^{\\mu+\\sigma^2\\!/2}', variance:'(e^{\\sigma^2}-1)\\,e^{2\\mu+\\sigma^2}',
    example:'Stock prices often follow a log-normal distribution. If daily returns are Normal(0, 0.02²), the price after one year is roughly LogNormal(0, 0.32).',
    uses:'Asset pricing, income distributions, particle sizes, biological growth, insurance claims severity, and modelling positive-skewed data.' },
  { name:'Exponential', regClass:'regulation-card--nsfr',
    pdf:'f(x)=\\lambda e^{-\\lambda x},\\quad x\\geq 0',
    mean:'\\frac{1}{\\lambda}', variance:'\\frac{1}{\\lambda^2}',
    example:'If a call centre receives calls at an average rate of 3 per minute (λ=3), the waiting time between consecutive calls is Exponential(3), with a mean wait of 20 seconds.',
    uses:'Waiting times between Poisson events, radioactive decay lifetimes, failure times of electronic components, and queuing theory.' },
  { name:'Gamma', regClass:'regulation-card--almm',
    pdf:'f(x)=\\frac{\\beta^{\\alpha}}{\\Gamma(\\alpha)}\\,x^{\\alpha-1}e^{-\\beta x},\\quad x>0',
    mean:'\\frac{\\alpha}{\\beta}', variance:'\\frac{\\alpha}{\\beta^2}',
    example:'The total rainfall in a month might follow Gamma(α=5, β=2). The sum of 5 independent Exponential(2) waiting times is precisely Gamma(5, 2).',
    uses:'Aggregate waiting times, rainfall modelling, insurance claim amounts, Bayesian priors for precision, and generalising the exponential and chi-squared.' },
  { name:'Beta', regClass:'regulation-card--peru',
    pdf:'f(x)=\\frac{\\Gamma(\\alpha+\\beta)}{\\Gamma(\\alpha)\\Gamma(\\beta)}\\,x^{\\alpha-1}(1-x)^{\\beta-1},\\quad 0\\leq x\\leq 1',
    mean:'\\frac{\\alpha}{\\alpha+\\beta}', variance:'\\frac{\\alpha\\beta}{(\\alpha+\\beta)^2(\\alpha+\\beta+1)}',
    example:'If you make 7 out of 10 free throws, your underlying shooting percentage can be modelled as Beta(8, 4), which centres around 0.67 with uncertainty.',
    uses:'Modelling proportions, conversion rates, A/B test analysis, Bayesian conjugate prior for the binomial, and task-completion percentages.' },
  { name:'Weibull', regClass:'regulation-card--panama',
    pdf:'f(x)=\\frac{k}{\\lambda}\\left(\\frac{x}{\\lambda}\\right)^{k-1}e^{-(x/\\lambda)^k},\\quad x\\geq 0',
    mean:'\\lambda\\,\\Gamma\\!(1+1/k)', variance:'\\lambda^2\\!\\left[\\Gamma(1+2/k)-\\Gamma^2(1+1/k)\\right]',
    example:'Wind turbine blade lifetimes follow Weibull(k=2, λ=5000 hours). With k>1, the failure rate increases over time — older blades are more likely to fail.',
    uses:'Reliability engineering, survival analysis, wind-speed modelling, extreme value theory, and modelling time-to-failure with non-constant hazard rates.' },
  { name:"Student's t", regClass:'regulation-card--panama',
    pdf:'f(x)\\propto\\left(1+\\frac{(x-\\mu)^2}{\\nu\\sigma^2}\\right)^{-(\\nu+1)/2}',
    mean:'\\mu\\;(\\nu>1)', variance:'\\frac{\\nu\\sigma^2}{\\nu-2}\\;(\\nu>2)',
    example:'Testing whether a new drug lowers blood pressure with only 10 patients. The t-distribution with ν=9 accounts for the uncertainty from estimating the variance from a small sample.',
    uses:'Small-sample hypothesis tests, confidence intervals when variance is unknown, robust regression, and modelling heavy-tailed financial returns.' },
  { name:'Chi-Squared', regClass:'regulation-card--peru',
    pdf:'f(x)=\\frac{1}{2^{k/2}\\,\\Gamma(k/2)}\\,x^{k/2-1}e^{-x/2},\\quad x\\geq 0',
    mean:'k', variance:'2k',
    example:'Rolling a fair die 60 times and comparing observed vs. expected frequencies. The test statistic follows approximately χ²(5) — the sum of 5 squared standard normal deviations.',
    uses:'Goodness-of-fit tests, tests of independence in contingency tables, confidence intervals for the variance of a normal population, and likelihood-ratio testing.' },
  { name:'Fisher (F)', regClass:'regulation-card--uk-fra',
    pdf:'f(x)=\\frac{\\sqrt{(d_1x)^{d_1}d_2^{\\,d_2}/(d_1x+d_2)^{d_1+d_2}}}{x\\,B(d_1/2,\\,d_2/2)},\\quad x>0',
    mean:'\\frac{d_2}{d_2-2}\\;(d_2>2)', variance:'\\frac{2d_2^2(d_1+d_2-2)}{d_1(d_2-2)^2(d_2-4)}\\;(d_2>4)',
    example:'Comparing three teaching methods by analysing test-score variance between groups vs. within groups. The F-statistic with (2, 87) degrees of freedom tests whether any method is significantly different.',
    uses:'ANOVA for comparing group means, testing equality of two variances, overall significance of regression models, and model-selection criteria.' },
  { name:'Erlang', regClass:'regulation-card--australia-apra',
    pdf:'f(x)=\\frac{\\lambda^k}{(k-1)!}\\,x^{k-1}e^{-\\lambda x},\\quad x\\geq 0',
    mean:'\\frac{k}{\\lambda}', variance:'\\frac{k}{\\lambda^2}',
    example:'A customer support centre needs to handle 3 calls before escalating. Calls arrive at λ=2 per minute. The total handling time is Erlang(k=3, λ=2), with mean 1.5 minutes.',
    uses:'Queueing theory, telecommunications traffic modelling, and any process modelling the sum of k independent exponential waiting times.' },
  { name:'Poisson', regClass:'regulation-card--japan-bsr',
    pmf:'P(X=k)=\\frac{\\lambda^k e^{-\\lambda}}{k!},\\quad k=0,1,2,\\ldots',
    mean:'\\lambda', variance:'\\lambda',
    example:'A website averages 4 clicks per minute (λ=4). P(X=0) ≈ 1.8% — there is only a 1.8% chance of zero clicks in a given minute. P(X≤2) ≈ 23.8%.',
    uses:'Counts of rare events, website traffic, call-centre arrivals, radioactive decay counts, insurance claims frequency, and disease incidence modelling.' },
  { name:'Geometric', regClass:'regulation-card--singapore-mas',
    pmf:'P(X=k)=(1-p)^k\\,p,\\quad k=0,1,2,\\ldots',
    mean:'\\frac{1-p}{p}', variance:'\\frac{1-p}{p^2}',
    example:'A basketball player with a 30% free-throw success rate (p=0.3). The expected number of misses before the first make is (1-0.3)/0.3 ≈ 2.3 misses.',
    uses:'Modelling the number of trials until first success, quality control (defects until first good unit), and the discrete analogue of the exponential for memoryless waiting.' },
  { name:'Binomial', regClass:'regulation-card--canada-osfi',
    pmf:'P(X=k)=\\binom{n}{k}p^k(1-p)^{n-k},\\quad k=0,\\ldots,n',
    mean:'np', variance:'np(1-p)',
    example:'Flipping a fair coin 20 times (n=20, p=0.5). The expected number of heads is 10, with variance 5. The probability of exactly 10 heads is C(20,10)·0.5²⁰ ≈ 17.6%.',
    uses:'Success counts in fixed trials, A/B test conversions, quality-control sampling, election polling, and any process with binary outcomes and fixed sample size.' },
  { name:'Hypergeometric', regClass:'regulation-card--switzerland-finma',
    pmf:'P(X=k)=\\frac{\\binom{K}{k}\\binom{N-K}{n-k}}{\\binom{N}{n}},\\quad \\max(0,n+K-N)\\leq k\\leq\\min(n,K)',
    mean:'n\\frac{K}{N}', variance:'n\\frac{K}{N}\\frac{N-K}{N}\\frac{N-n}{N-1}',
    example:'A lottery has 50 balls (N=50), 6 are winning numbers (K=6), and you pick 6 (n=6). The probability of matching exactly 3 numbers is C(6,3)·C(44,3)/C(50,6) ≈ 2.9%.',
    uses:'Sampling without replacement, lottery odds, audit sampling, capture-recapture population estimation, and quality inspection of finite batches.' },
];

export default function HelpModal({ onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="modal modal--wider"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.3, ease: [0.25,0.46,0.45,0.94] }}
        onClick={e => e.stopPropagation()}
      >
        <button className="btn btn-ghost btn-icon modal__close" onClick={onClose} aria-label="Close">
          <span className="icon"><svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></span>
        </button>

        <h2 className="modal__title">Distribution Reference</h2>
        <div className="flex-row gap-3 mb-4 rust-intro">
          <span className="t-body">All computations performed in <a href="https://www.rust-lang.org" target="_blank" rel="noopener">Rust</a> <span className="icon icon--sm rust-icon"><RustIcon/></span> — compiled to <a href="https://webassembly.org" target="_blank" rel="noopener">WebAssembly</a> <span className="icon icon--sm rust-icon"><WasmIcon/></span> via <code className="code-inline">wasm-pack</code> + <code className="code-inline">statrs</code>.</span>
        </div>
        <p className="modal__body">
          Each distribution is defined by its <strong>probability density function (PDF)</strong> <Formula latex="f(x)"/> for continuous distributions, or <strong>probability mass function (PMF)</strong> <Formula latex="P(X=k)"/> for discrete ones.
          The PDF gives the relative likelihood at each point; the area under the curve between two values is the probability of falling in that interval.
          The PMF gives the exact probability that the random variable equals a specific integer <Formula latex="k"/>.
        </p>

        <hr className="divider mt-6 mb-6"/>

        {HELP.map((d, i) => {
          const cfg = DISTRIBUTIONS.find(x => x.name === d.name);
          const rc = d.regClass;
          return (
            <div key={d.name} className="mb-6">
              <div className={`regulation-card ${rc} p-4`}>
                <div className="flex-row gap-3 mb-2">
                  <h3 className="t-h3 m-0" id={`help-${cfg?.id}`}>{d.name} Distribution</h3>
                  <span className="badge badge--regulation">{cfg?.isDiscrete ? 'Discrete' : 'Continuous'}</span>
                </div>

                {d.pdf && <div className="mb-3"><Formula latex={d.pdf} displayMode/></div>}
                {d.pmf && <div className="mb-3"><Formula latex={d.pmf} displayMode/></div>}

                <div className="grid-3 mb-3">
                  <div><span className="t-label">Mean</span><div className="mt-1"><Formula latex={`\\mathbb{E}[X]=${d.mean}`} displayMode/></div></div>
                  <div><span className="t-label">Variance</span><div className="mt-1"><Formula latex={`\\operatorname{Var}(X)=${d.variance}`} displayMode/></div></div>
                </div>

                <hr className="divider mb-3"/>

                <div className="mb-3">
                  <span className="t-label">Example</span>
                  <p className="t-body mt-1">{d.example}</p>
                </div>
                <div>
                  <span className="t-label">Common Uses</span>
                  <p className="t-body mt-1">{d.uses}</p>
                </div>
              </div>
            </div>
          );
        })}

        <div className="modal__actions">
          <button className="btn btn-ghost" onClick={onClose}>
            <span className="icon icon--sm mr-2"><svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></span>
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
