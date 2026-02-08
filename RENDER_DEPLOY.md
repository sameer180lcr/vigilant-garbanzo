# 🚀 Publishing Muse to Render

To get your professional AI platform online, follow these steps to host the frontend on **Render**.

## 1. Prepare your GitHub Repo
Ensure all changes are committed and pushed to your GitHub/GitLab repository.

## 2. Render Settings (Static Site)
Log in to your [Render Dashboard](https://dashboard.render.com/) and create a **New Static Site**.

| Setting | Value |
|---------|-------|
| **Name** | `muse-ai-executive` (or your choice) |
| **Build Command** | `npm run build` |
| **Publish Directory** | `dist` |

## 3. Environment Variables
In the Render dashboard, go to the **Environment** tab and add:

- `VITE_OLLAMA_API`: Your public AI backend URL.
  - *Note: If you are still using local Ollama, you will need to expose it via a tool like Ngrok or host it on a cloud server/VPS.*

## 4. Backend Considerations (Online Chat)
Since Render hosts the **Frontend**, your browser needs to talk to an **AI API**.
- **Option A (VPS/Cloud)**: Host Ollama on a VPS with a public IP and SSL.
- **Option B (SaaS)**: You can change the API Endpoint in Muse's Settings to point to an OpenAI-compatible cloud provider (like Together AI or Groq).

## 5. Deployment Verified
Once the build finishes:
1. Muse will be live at `https://your-site.onrender.com`.
2. Go to **Settings** (Gear icon) in the app to verify your connection!

---
*Created for Muse Executive Tier.*
