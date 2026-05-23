# 🚀 IncidentIQ — AI Incident Copilot for DevOps

**Reduce MTTR from hours to seconds.** The world’s first AI-native incident investigation platform that correlates complex telemetry into actionable root-cause intelligence.

---

## ⚡ What is IncidentIQ?
IncidentIQ is a high-performance **AI Copilot** designed to sit at the center of your DevOps stack. It transforms chaotic log streams and telemetry noise into a structured, visual, and actionable "Truth Report" using advanced LLM reasoning.

---

## 🔥 Why This Matters
* **The Downtime Tax:** Unplanned downtime costs enterprises an average of **$300,000 per hour**.
* **Log Fatigue:** 70% of MTTR (Mean Time To Recovery) is wasted manually digging through fragmented logs across multiple services.
* **The Gap:** Traditional monitoring tells you *that* something is broken; IncidentIQ tells you *why* and *how* to fix it.

---

## 🤖 What Makes It Special
* **AI Root Cause Detection:** Leveraging Google Gemini to identify the "patient zero" of any system failure.
* **Failure Timeline Visualization:** A beautifully rendered chronological map of failure propagation.
* **Confidence Scoring:** Real-time probability metrics for AI-generated hypotheses.
* **Instant Fix Suggestions:** Actionable mitigation steps and prevention strategies.
* **Predictive Intelligence:** Live monitoring that identifies anomalies *before* they trigger a total outage.

---

## 🧠 How It Works (Simple Flow)
1. **Ingest:** Paste raw log streams or connect your telemetry firehose.
2. **Correlate:** AI scans logs, node health, and service dependencies simultaneously.
3. **Diagnose:** The engine identifies the root cause with a confidence percentage.
4. **Resolve:** Receive instant mitigation steps and mitigation code.

---

## 🎯 Live Demo Flow (IMPORTANT)
**For the best judging experience, follow this 30-second flow:**

1. **Enter the Cockpit:** Log in to the premium Dashboard.
2. **Trigger Intelligence:** Click the **"Run Demo Diagnostic"** button in the Log Stream section.
3. **Watch the Brain Work:** Observe the **AI Intelligence Scanning** effect as it correlates the "Redis" failure logs.
4. **Investigate the Node:** Navigate to **Active Faults**, click **"Investigate Node"** to open the full AI Copilot Report.
5. **Chat with the System:** Ask the **AI Chat Panel** *"What is the fix?"* or *"What caused this?"* for real-time interactive diagnostics.

---

## 🖥️ Key Features
* **Intelligent Dashboard:** Real-time System Integrity and Cluster Load monitoring.
* **Copilot Chat:** An interactive assistant that knows your infrastructure's every heartbeat.
* **Node Topology:** A live grid of your entire cluster with animated health indicators.
* **Telemetry Stream:** A hacker-aesthetic live feed of every system event.
* **Smart Notifications:** Real-time alerts that guide you directly to the source of pain.

---

## 🛠 Tech Stack
* **Frontend:** React 18, Vite, Tailwind CSS (Vanilla CSS for Premium UI)
* **Backend:** Node.js, Express
* **AI Engine:** Google Gemini-1.5-Flash (via Google Generative AI SDK)
* **Animations:** Framer Motion (Glassmorphism & Interactive UI)
* **State Management:** React Context API

---

## 🚀 Getting Started
1. **Clone & Install:**
   ```bash
   # Install server dependencies
   cd server && npm install
   # Install client dependencies
   cd ../client && npm install
   ```
2. **Environment Setup:**
   Create a `.env` in the `server` folder:
   ```env
   GEMINI_API_KEY=your_google_gemini_key
   PORT=5000
   ```
3. **Launch the Engine:**
   ```bash
   # Run Backend
   node server/index.js
   # Run Frontend
   npm run dev (inside client folder)
   ```

---

## 🧪 Demo Mode
No API key? No problem. IncidentIQ features a **Safe-Heuristic Demo Mode**. Toggle it in the **System Preferences** (Settings) to use our local intelligence engine that simulates high-fidelity AI analysis for the hackathon demo.

---

## 🏆 Why This Can Win
* **Commercial Viability:** Solves a multi-billion dollar problem (unplanned downtime).
* **High-Impact UI:** A "Linear-meets-Datadog" aesthetic that feels like a $100M ARR product.
* **Deep AI Integration:** Not just a wrapper—it uses LLMs for complex, multi-vector correlation.
* **Complete Story:** A seamless flow from "Something is wrong" to "I know exactly how to fix it."

---

## 🔮 Future Scope
* **Native Integrations:** Direct connectors for Datadog, New Relic, and Grafana.
* **Auto-Remediation:** "Self-healing" infrastructure that can apply fixes autonomously.
* **Multi-Service Tracing:** 3D visualization of microservice request flows.

---

## ❤️ Built For Hackathon
Crafted with passion to redefine how engineers interact with infrastructure. **IncidentIQ — Don't just monitor. Understand.**
