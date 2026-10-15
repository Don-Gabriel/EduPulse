# Optional free AI setup

You do not need a key to demonstrate EduPulse. The complete local lesson and assessment flow is already available. Follow these steps only if live AI generation is desired and permitted by the organizers.

1. Open [Google AI Studio API keys](https://aistudio.google.com/apikey).
2. Create a key in a dedicated project. Inspect the project and confirm its tier is **Free Tier**.
3. Inspect its billing state. It must have **billing disabled**, with no paid-tier or billing-backed trial usage. Do not add a payment method, purchase credits, or click an upgrade button.
4. Inspect the available free quota for `gemini-3.5-flash-lite`. Free quotas and availability depend on the account and can change. If access or billing is unclear, stop here and keep the local mode.
5. In the EduPulse project folder, copy `.env.example` to `.env`. Open `.env` in a local editor. Do not put a secret in chat or commit it.
6. Set `GEMINI_API_KEY` to the key. Set `EDUPULSE_GEMINI_FREE_VERIFIED=1` only after the billing check. Keep the model unchanged.
7. Restart the local server. Demo controls should show a configured free-tier connection.
8. Open a learning plan and click **Personalize explanation** once. Verify the mode label and token ledger. The existing reviewed lesson remains available if generation fails.

No paid provider, web search grounding, image generation, managed file search, or paid context cache is used. Only educational content without personal identifiers is sent. Free-tier inputs may be used by the provider to improve its products.

Local limits: one active generation, two requests per minute, twenty requests per rolling 24 hours, 2,000 input tokens, 800 maximum generated tokens, 50,000 daily reserved/actual tokens, and 100,000 lifetime reserved/actual tokens. These are application limits, not promises about provider quota. An unknown request outcome retains its reservation. Resetting demo data does not reset the ledger.

The software cannot verify the remote project's billing attachment from an API key. Free-tier verification is an explicit operator step. To guarantee that no external service can charge for this project, leave generation disabled and use local reviewed content.

Official references: [pricing](https://ai.google.dev/gemini-api/docs/pricing), [billing](https://ai.google.dev/gemini-api/docs/billing), [rate limits](https://ai.google.dev/gemini-api/docs/rate-limits), [token counting](https://ai.google.dev/gemini-api/docs/tokens).
