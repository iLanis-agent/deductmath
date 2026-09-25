/* DeductMath engine - high vs low deductible break-even. Pure math, no DOM. */
(function (root) {
  'use strict';

  function num(v, name) {
    const n = typeof v === 'string' ? parseFloat(v) : v;
    if (typeof n !== 'number' || !isFinite(n) || isNaN(n)) throw new Error(name + ' must be a number');
    return n;
  }
  function round2(x) { return Math.round(x * 100) / 100; }

  function parsePlan(p, label) {
    if (!p || typeof p !== 'object') throw new Error(label + ' required');
    const premium = num(p.premium, label + ' premium');
    const deductible = num(p.deductible, label + ' deductible');
    if (premium < 0 || premium > 100000) throw new Error(label + ' premium must be in [0, 100000]');
    if (deductible < 0 || deductible > 100000) throw new Error(label + ' deductible must be in [0, 100000]');
    return { premium: premium, deductible: deductible };
  }

  function ev(plan, p, claim) {
    return plan.premium + p * Math.min(claim, plan.deductible);
  }

  function compare(o) {
    if (!o || typeof o !== 'object') throw new Error('options required');
    const a = parsePlan(o.planA, 'planA');
    const b = parsePlan(o.planB, 'planB');
    const probPct = num(o.claimProbabilityPct, 'claimProbabilityPct');
    const claim = num(o.claimAmount, 'claimAmount');
    if (probPct < 0 || probPct > 100) throw new Error('claimProbabilityPct must be in [0, 100]');
    if (claim <= 0 || claim > 1000000) throw new Error('claimAmount must be in (0, 1000000]');

    const p = probPct / 100;
    const evA = ev(a, p, claim), evB = ev(b, p, claim);
    const winner = Math.abs(evA - evB) < 0.005 ? 'tie' : (evA < evB ? 'a' : 'b');

    // break-even probability: premiumA + p*min(c,dA) = premiumB + p*min(c,dB)
    const oopA = Math.min(claim, a.deductible), oopB = Math.min(claim, b.deductible);
    let breakEvenPct = null;
    if (Math.abs(oopA - oopB) > 1e-9) {
      const pStar = (b.premium - a.premium) / (oopA - oopB);
      if (pStar >= 0 && pStar <= 1) breakEvenPct = round2(pStar * 100);
    }

    return {
      evA: round2(evA), evB: round2(evB),
      winner: winner,
      savingPerYear: round2(Math.abs(evA - evB)),
      breakEvenPct: breakEvenPct,
      worstCaseA: round2(a.premium + a.deductible),
      worstCaseB: round2(b.premium + b.deductible),
      oopA: round2(oopA), oopB: round2(oopB),
      premiumGap: round2(Math.abs(a.premium - b.premium)),
      deductibleGap: round2(Math.abs(a.deductible - b.deductible))
    };
  }

  const api = { compare: compare };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.DeductMathEngine = api;
})(typeof self !== 'undefined' ? self : this);
