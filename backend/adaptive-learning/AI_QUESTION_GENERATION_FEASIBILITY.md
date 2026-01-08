# AI Question Generation — Feasibility and Recommendation

## Feasibility
- **External LLMs (Groq/Gemini/OpenAI)**: Feasible for a student project with guardrails; Groq offers generous free tier for hints and periodic high-difficulty questions.
- **Fine-tuned small model**: Not realistic without a labeled dataset and training pipeline; correctness assurance is hard.
- **Hybrid (templates + AI)**: Most reliable/defensible; templates dominate levels 1–3, AI augments 4–5 with strict prompts and validation.

## Necessity vs Constrained Prompting
- A dedicated AI is not necessary. Constrained prompting with validation and caching yields better reliability and cost control than end-to-end generation.

## Deployment Costs and Risks
- **External LLMs**: Rate limits, occasional format errors, correctness risk; cost manageable with Groq-first and Gemini fallback.
- **Fine-tuned model**: Compute, infra, and dataset costs are prohibitive; high risk of poor accuracy.
- **Hybrid**: Minimal cost; correctness risk mitigated by templates and output validation.

## Comparison
- **External LLM**: + Quick, + flexible; − correctness, − cost risk (OpenAI), mitigated by Groq/Gemini.
- **Fine-tuned small model**: + control; − data, − infra, − time.
- **Hybrid**: + reliability, + cost, + defensibility; − needs good prompts and validation.

## Recommendation
- **Cost**: Groq-first (free/low), Gemini fallback; avoid OpenAI unless required.
- **Reliability**: Hybrid approach with strict output validation in `GroqQuestionGenerator` and cached reuse.
- **Research Defensibility**: Hybrid is easiest to justify: templates provide correctness baseline; AI only for higher-order items under constraints.
