# PRception 🔍
### AI-Powered Product Perception Engine

> **"Know what people really think — before you buy or sell"**

**Team NaN Bread** · Team Leader: Riddhi Kulkarni · AI for Bharat Hackathon
*Problem Statement: AI for Retail, Commerce & Market Intelligence*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-AWS%20Amplify-orange)](https://main.d3qdnowuiij1kn.amplifyapp.com)
![Built with](https://img.shields.io/badge/Built%20with-Amazon%20Bedrock-yellow)
![Stack](https://img.shields.io/badge/Stack-Django%20%7C%20Next.js%20%7C%20Redis-blue)

---

## 📌 Table of Contents

- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [What Makes PRception Different](#-what-makes-prception-different)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Current Build Status](#-current-build-status)
- [Estimated Cost](#-estimated-implementation-cost)
- [Roadmap](#-future-scope--roadmap)
- [Business Model](#-business-model)

---

## 🚨 The Problem

Every day, millions of consumers across India make high-stakes purchasing decisions on smartphones, laptops, and appliances. They scroll through product listings, glance at star ratings, and read a handful of curated reviews — but those ratings only tell part of the story.

The **real conversation** is happening elsewhere — on Reddit threads, YouTube comment sections, X discussions, and community forums. These are unfiltered, unsponsored opinions from people who have actually owned and used the products. The problem? These conversations are:

- Scattered across dozens of platforms
- Buried under thousands of posts
- Practically impossible to make sense of at scale

**Vendors and retailers** face the mirror image of this problem. By the time negative sentiment becomes visible in product ratings, the damage is already done — no early warning system, no real-time tracking, no structured intelligence to act on.

**PRception was built to close that gap — for both sides.**

---

## 💡 The Solution

PRception is an **Agentic AI-powered product perception engine**. It crawls thousands of real social media discussions and online reviews to produce a detailed, unbiased analysis of what people genuinely say about any product — delivered in seconds.

**How the experience works:**
1. User types a product name and hits **Analyse**
2. Intelligent agents fan out across Reddit, X, YouTube, and e-commerce platforms **simultaneously**
3. Agents collect discussions, read comments, analyse sentiment, and surface recurring themes
4. A structured **perception report** is delivered — complete with a confidence score

### 📊 Sample Report Stats

| Metric | Value |
|--------|-------|
| Queries Fired | 7 |
| Sources Crawled | 6 |
| Comments Read | 100+ |
| Confidence Score | 82% |

Every report includes:
- ✅ Executive Summary
- 💪 Key Strengths
- ⚠️ Genuine Concerns
- 📂 Topic-level analysis (performance, battery, camera, thermals, etc.)

---

## ✨ What Makes PRception Different

| Feature | Description |
|--------|-------------|
| **Multi-Platform Crawling** | Crawls Reddit, X, YouTube, and e-commerce simultaneously — not just one source |
| **Agentic Discussion Layers** | LLM-powered reasoning that understands context, nuance, and patterns — not just keyword matching |
| **Organic Data Only** | Surfaces unsponsored, real user opinions from genuine community discussions |
| **Confidence Scoring** | Every report includes a score reflecting how well the data supports the conclusions |
| **Freemium Access** | Free queued reports for consumers; premium instant access for vendors |
| **Data Flywheel** | Users earn credits by contributing feedback, improving future report quality |

---

## 🛠 Features

### For Consumers
- 🔎 Search any product and receive a fully structured AI-generated perception report
- 📊 Understand sentiment at a glance — positive, neutral, and negative signals from real users
- 🔬 Drill down into topic-level analysis: battery life, camera quality, build quality, value for money, and more
- 💰 Access reports for free via the queue system; earn credits by contributing product feedback

### For Vendors & Retailers
- ⚡ Instant perception reports (no queue wait) as a premium feature
- 📈 Rolling 30-day sentiment trend timelines to monitor opinion evolution
- 🚨 Proactive alerts when negative sentiment spikes are detected
- 🌐 Platform-by-platform score breakdowns (Reddit vs YouTube vs Amazon vs X)
- 📄 Export polished PDF reports for internal review and stakeholder presentations

### Data Reliability
- 🤖 Bot accounts and low-credibility sources are filtered out
- 🏅 User reliability scored by account activity, engagement history, and posting behaviour
- 🔗 Recurring complaints and praise are cross-referenced across multiple sources to confirm real patterns

---

## ⚙️ How It Works

```
User submits product name
        ↓
Request authenticated & added to Redis-backed priority queue
        ↓
Crawlers dispatched simultaneously:
  ├── Reddit (via PRAW)
  ├── X / Twitter (via API)
  ├── YouTube (comment threads)
  └── E-commerce (Flipkart / Amazon)
        ↓
Data normalised into unified schema
        ↓
Reliability scoring layer evaluates each source & user
        ↓
Sentiment analysis across all normalised content
        ↓
Agentic Analysis Layer (Amazon Bedrock) synthesises insights
        ↓
Structured perception report delivered to user
        ↓
User feedback collected → fed back into model improvement loop
        ↓
[Premium] Vendors receive continuous live monitoring updates
```

---

## 🏗 System Architecture

PRception is built on a modern, scalable **cloud-native architecture** with four primary layers:

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                    │
│              Hosted on AWS Amplify                      │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│              BFF Server (Django REST Framework)         │
│         API routing, request management, auth           │
└────────┬──────────────────────────┬─────────────────────┘
         │                          │
┌────────▼────────┐      ┌──────────▼──────────────────┐
│  Product Request│      │    Data Ingestion Layer      │
│     Queue       │      │  Scrapy + PRAW + X API       │
│  Redis + Celery │      │  User Scoring Graph          │
└─────────────────┘      └──────────┬──────────────────┘
                                    │
                         ┌──────────▼──────────────────┐
                         │    Agentic Summarizer        │
                         │  Amazon Bedrock (LLM Layer)  │
                         │  Theme ID · Sentiment · NLP  │
                         └─────────────────────────────┘
```

---

## 🧰 Technology Stack

### ☁️ Cloud & Infrastructure
- **AWS** — EC2, Lambda, S3, DynamoDB, API Gateway
- **Amazon Bedrock** — Agentic AI and LLM-powered reasoning
- **AWS Amplify** — Frontend hosting and delivery
- **Redis** — Request queuing and caching
- **Celery** — Asynchronous task processing

### 🤖 AI, ML & Backend
- **Adalflow** — Agentic workflow orchestration
- **PyTorch Geometric** — Advanced reviewer scoring (exploratory)
- **PRAW** — Reddit API data collection
- **Scrapy** — Structured web crawling
- **Django REST Framework** — Backend API management

### 🎨 Frontend
- **Next.js** — Server-side rendered, responsive UI
- **Tailwind CSS** — Styling
- **Axios** — API communication

### 📡 Data Sources
- Reddit (via PRAW)
- X / Twitter (via API)
- YouTube comment threads
- Flipkart and Amazon product reviews

---

## 🚀 Current Build Status

| Component | Status |
|-----------|--------|
| Responsive web frontend (AWS Amplify) | ✅ Live |
| Backend API server (AWS EC2) | ✅ Live |
| Amazon Bedrock agentic reasoning | ✅ Live |
| Reddit data ingestion via PRAW | ✅ Live |
| X / Twitter data fetching | ✅ Live |
| Full agentic analysis pipeline | ✅ Live |
| Completed perception reports with confidence scores | ✅ Live |

🌐 **Live Prototype:** [https://main.d3qdnowuiij1kn.amplifyapp.com](https://main.d3qdnowuiij1kn.amplifyapp.com)

---

## 💸 Estimated Implementation Cost

| Component | Cost (₹) | Notes |
|-----------|----------|-------|
| AWS Free Tier (EC2, Lambda, S3, DynamoDB) | ₹0 | Covered under free tier |
| AWS API Gateway & S3 extras | ₹200–400 | Small usage volumes |
| Amazon Bedrock LLM calls | ₹0 | Covered by hackathon credits |
| Model hosting (Hugging Face / CPU) | ₹0 | Free tier |
| Reddit & X API crawlers | ₹0 | Free tier usage |
| Frontend on AWS Amplify | ₹0 | Free tier |
| Optional AWS Lightsail | ₹300 | Only if required |
| **Total Estimated Cost** | **₹500–₹700** | Or ₹0 with credits applied |

---

## 🗺 Future Scope & Roadmap

### Phase 2 — Browser Extension
A lightweight extension that surfaces PRception scores, sentiment summaries, and top concerns **directly on Flipkart and Amazon product pages** — no new tab required.

### Phase 3 — Vendor Intelligence Dashboard
A dedicated vendor portal with:
- Rolling 30-day sentiment timelines
- Automated spike alerts
- Competitor benchmarking
- Topic-level drill-downs
- One-click PDF export

### Phase 4 — Multilingual Support & Expanded Platforms
Expanding coverage to Instagram, Facebook groups, Quora, and regional Indian forums, with multilingual sentiment analysis for **Hindi, Tamil, Telugu, Marathi**, and more.

### Phase 5 — Feedback-Driven Data Flywheel
Users earn credits for contributing product feedback. This feeds a structured data loop that continuously improves model accuracy and report quality for all users.

### Longer Term — Graph-Based Reviewer Reliability
Exploring **Graph Neural Networks (GNNs)** to model user interaction patterns across platforms — automatically identifying and down-weighting bot accounts and low-quality sources.

---

## 💼 Business Model

| Tier | Audience | Model |
|------|----------|-------|
| **Free** | Consumers | Queued reports + contextual advertising during generation |
| **Premium** | Vendors & Retailers | Instant reports, monitoring dashboards, platform breakdowns, API access |
| **Credits Economy** | Consumers | Earn faster access by contributing verified product feedback |
| **Enterprise Licensing** | Large Retail Brands | Direct API access to embed perception intelligence into internal tools |

---

## 👥 Team

**Team NaN Bread**
- Team Leader: Riddhi Kulkarni
- Submission for: *AI for Bharat Hackathon*
- Problem Statement: *AI for Retail, Commerce & Market Intelligence*

---

*PRception — Know what people really think, before you buy or sell.*