use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use statrs::distribution::{
    Beta, Binomial, ChiSquared, Continuous, Discrete, Erlang, Exp,
    FisherSnedecor, Gamma, Geometric, Hypergeometric, LogNormal, Normal,
    Poisson, StudentsT, Uniform, Weibull,
};
use statrs::statistics::Distribution as DistStat;

#[derive(Deserialize)]
struct Req { distribution: String, params: HashMap<String, f64>, num_points: usize }
#[derive(Serialize)]
struct Resp { x: Vec<f64>, y: Vec<f64>, stats: Stats, is_discrete: bool, error: Option<String> }
#[derive(Serialize)]
struct Stats { mean: Option<f64>, variance: Option<f64>, skewness: Option<f64> }

#[wasm_bindgen::prelude::wasm_bindgen]
pub fn compute(json: &str) -> String {
    let req: Req = match serde_json::from_str(json) { Ok(r) => r, Err(e) => return err(&e.to_string()) };
    match req.distribution.as_str() {
        "normal" => cont::<Normal>(&req),
        "uniform" => cont::<Uniform>(&req),
        "lognormal" => cont::<LogNormal>(&req),
        "exponential" => cont::<Exp>(&req),
        "gamma" => cont::<Gamma>(&req),
        "beta" => cont::<Beta>(&req),
        "weibull" => cont::<Weibull>(&req),
        "studentt" => cont::<StudentsT>(&req),
        "chisquared" => cont::<ChiSquared>(&req),
        "fisher" => cont::<FisherSnedecor>(&req),
        "erlang" => cont::<Erlang>(&req),
        "poisson" => disc_poisson(&req),
        "geometric" => disc_geometric(&req),
        "binomial" => disc_binomial(&req),
        "hypergeometric" => disc_hypergeometric(&req),
        _ => err("Unknown distribution"),
    }
}

fn get(req: &Req, keys: &[&str], def: f64) -> f64 { for k in keys { if let Some(&v) = req.params.get(*k) { return v; } } def }

fn range(d: &str) -> (f64,f64) { match d {
    "normal"=>(-4.,4.),"uniform"=>(-0.2,1.2),"lognormal"=>(0.01,5.),"exponential"=>(0.,4.),"gamma"=>(0.,6.),"beta"=>(0.,1.),"weibull"=>(0.,3.),"studentt"=>(-4.,4.),"chisquared"=>(0.,10.),"fisher"=>(0.,4.),"erlang"=>(0.,10.),"poisson"=>(0.,12.),"geometric"=>(0.,15.),"binomial"=>(0.,20.),"hypergeometric"=>(0.,10.),_=> (0.,1.)
}}

trait Build: Sized { fn build(req: &Req) -> Option<Self>; }

fn cont<D: Continuous<f64,f64> + Build + DistStat<f64>>(req: &Req) -> String {
    let d = match D::build(req) { Some(d) => d, None => return err("Invalid params") };
    let (lo,hi) = { let rlo = get(req,&["x_min"],f64::NAN); let rhi = get(req,&["x_max"],f64::NAN); if rlo.is_nan()||rhi.is_nan() { range(&req.distribution) } else { (rlo,rhi) }};
    let n = if req.num_points>0 { req.num_points } else { 200 };
    let st = (hi-lo)/(n as f64);
    let x: Vec<f64> = (0..n).map(|i| lo + (i as f64)*st).collect();
    let y: Vec<f64> = x.iter().map(|&xv| { let v = d.pdf(xv); if v.is_finite() {v} else {0.} }).collect();
    serde_json::to_string(&Resp{x,y,stats:Stats{mean:d.mean(),variance:d.variance(),skewness:d.skewness()},is_discrete:false,error:None}).unwrap()
}

fn disc_poisson(req: &Req) -> String { let l = get(req,&["lambda"],4.); if l<=0. {return err("lambda>0")}; let (lo,hi)=range("poisson"); disc(&Poisson::new(l).unwrap(),req,lo as i64,hi as i64) }
fn disc_geometric(req: &Req) -> String { let p = get(req,&["p","prob"],0.3); if p<=0.||p>1. {return err("p in (0,1]")}; let (lo,hi)=range("geometric"); disc(&Geometric::new(p).unwrap(),req,lo as i64,hi as i64) }
fn disc_binomial(req: &Req) -> String { let p = get(req,&["p","prob"],0.5); let n = get(req,&["n","trials"],20.) as u64; if p<0.||p>1. {return err("p in [0,1]")}; let (_,hi)=range("binomial"); disc(&Binomial::new(p,n).unwrap(),req,0,(n as f64).min(hi) as i64) }
fn disc_hypergeometric(req: &Req) -> String { let pop = get(req,&["N"],50.) as u64; let suc = get(req,&["K"],20.) as u64; let drw = get(req,&["n"],10.) as u64; match Hypergeometric::new(pop,suc,drw) { Ok(d) => disc(&d,req,0,drw.min(suc) as i64), Err(_) => err("Invalid params") }}

fn disc<D: Discrete<u64,f64> + DistStat<f64>>(d: &D, req: &Req, lo: i64, hi: i64) -> String {
    let x: Vec<f64> = (lo..=hi).map(|i| i as f64).collect();
    let y: Vec<f64> = x.iter().map(|&xv| { let v = d.pmf(xv as u64); if v.is_finite() {v} else {0.} }).collect();
    serde_json::to_string(&Resp{x,y,stats:Stats{mean:d.mean(),variance:d.variance(),skewness:d.skewness()},is_discrete:true,error:None}).unwrap()
}
fn err(m: &str) -> String { serde_json::to_string(&Resp{x:vec![],y:vec![],stats:Stats{mean:None,variance:None,skewness:None},is_discrete:false,error:Some(m.into())}).unwrap() }

impl Build for Normal { fn build(r: &Req) -> Option<Self> { let m=get(r,&["mean","mu"],0.); let s=get(r,&["std_dev","sigma"],1.); if s<=0.{None}else{Normal::new(m,s).ok()} }}
impl Build for Uniform { fn build(r: &Req) -> Option<Self> { let a=get(r,&["a","min"],0.); let b=get(r,&["b","max"],1.); if a>=b{None}else{Uniform::new(a,b).ok()} }}
impl Build for LogNormal { fn build(r: &Req) -> Option<Self> { let l=get(r,&["mu","location"],0.); let s=get(r,&["sigma","scale"],0.5); if s<=0.{None}else{LogNormal::new(l,s).ok()} }}
impl Build for Exp { fn build(r: &Req) -> Option<Self> { let l=get(r,&["lambda","rate"],1.5); if l<=0.{None}else{Exp::new(l).ok()} }}
impl Build for Gamma { fn build(r: &Req) -> Option<Self> { let a=get(r,&["alpha","shape"],2.); let b=get(r,&["beta","rate"],2.); if a<=0.||b<=0.{None}else{Gamma::new(a,b).ok()} }}
impl Build for Beta { fn build(r: &Req) -> Option<Self> { let a=get(r,&["alpha"],2.); let b=get(r,&["beta"],5.); if a<=0.||b<=0.{None}else{Beta::new(a,b).ok()} }}
impl Build for Weibull { fn build(r: &Req) -> Option<Self> { let k=get(r,&["k","shape"],1.5); let l=get(r,&["lambda","scale"],1.); if k<=0.||l<=0.{None}else{Weibull::new(k,l).ok()} }}
impl Build for StudentsT { fn build(r: &Req) -> Option<Self> { let l=get(r,&["mu","location"],0.); let s=get(r,&["sigma","scale"],1.); let f=get(r,&["nu","freedom"],3.); if s<=0.||f<=0.{None}else{StudentsT::new(l,s,f).ok()} }}
impl Build for ChiSquared { fn build(r: &Req) -> Option<Self> { let k=get(r,&["k","freedom"],3.); if k<=0.{None}else{ChiSquared::new(k).ok()} }}
impl Build for FisherSnedecor { fn build(r: &Req) -> Option<Self> { let d1=get(r,&["d1","freedom1"],4.); let d2=get(r,&["d2","freedom2"],10.); if d1<=0.||d2<=0.{None}else{FisherSnedecor::new(d1,d2).ok()} }}
impl Build for Erlang { fn build(r: &Req) -> Option<Self> { let k=get(r,&["k","shape"],3.) as u64; let l=get(r,&["lambda","rate"],1.); if l<=0.{None}else{Erlang::new(k,l).ok()} }}
