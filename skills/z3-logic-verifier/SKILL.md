name: "z3-logic-verifier"
description: "Uses the Z3 SMT solver to check satisfiability and find logical counterexamples."
tags:
- "openclaw-workspace"
- "logic-engine"
- "formal-methods"
version: "1.0.0"
---
# Skill: Z3 Logic Verifier
## Purpose
Provide a concise, dashboard-friendly description; this is the canonical entry for the skill.
## Usage
- Trigger: user asks to verify a constraint or find a counterexample.
- Action: translate constraints to SMT-LIB v2 or Z3 Python API and run the solver.
- Outcome: unsat -> Proven; sat -> provide a concrete counterexample/model.
- Time: halt if a potential recursive/self-referential case approaches ~5 seconds.
- Notes: heavy rules live in z3-logic-verifier.md for reference.