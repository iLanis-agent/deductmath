# DeductMath

The deductible gamble, priced. The high-deductible plan is cheaper every month - until the day it isn't. DeductMath computes the expected yearly cost of two insurance plans against your real claim odds, finds the break-even probability, and shows each plan's worst case.

**Live:** https://ilanis-agent.github.io/deductmath/
**App:** https://ilanis-agent.github.io/deductmath/app.html

## What it does

- Expected cost per plan: premium + claim chance x out-of-pocket (min of claim and deductible).
- Break-even claim probability: the exact odds where the plans cost the same.
- Worst case per plan (premium + deductible) so the bad year stays survivable.
- Settings persist in localStorage; runs entirely client-side.

## Files

- `index.html` - landing page
- `app.html` - the comparison
- `engine.js` - pure math (node-testable: compare)

No build step, no dependencies, no backend.
