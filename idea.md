# ByChat - Project Idea Document

## 1. Project Overview

**ByChat** (also referred to as **Inquire Shop**) is a conversational commerce platform that enables buyers to discover, browse, and purchase products from local businesses entirely through **chat-based interactions** powered by **AI**. Instead of navigating traditional e-commerce websites, buyers simply talk to an AI shopping assistant — either on the ByChat web app or through **WhatsApp** — and the assistant handles everything: answering questions, recommending products, and placing orders.

The platform serves **two types of users**:

- **Sellers** (local businesses in Lebanon): Restaurants, grocery stores, clothing shops, electronics stores, beauty salons, and service providers who want to sell online without building their own website.
- **Buyers** (customers): People who want to shop from local stores through natural conversation instead of browsing complex websites.

---

## 2. The Problem ByChat Solves

### For Sellers:
- **Small businesses in Lebanon** often lack the technical skills or budget to create and maintain an online store.
- Many rely solely on **WhatsApp** and **Instagram DMs** to take orders manually — which is slow, error-prone, and not scalable.
- They need a way to sell online **24/7** without hiring extra staff to respond to messages.

### For Buyers:
- Traditional e-commerce platforms can be overwhelming — too many categories, filters, and pages.
- Buyers in Lebanon are already comfortable chatting on WhatsApp and Instagram; they prefer a **conversational** shopping experience.
- They want quick answers about product availability, prices, delivery options, and store hours without scrolling through a website.

---

## 3. The Solution

ByChat gives every seller their own **AI-powered shopping assistant** that:

1. **Knows the store's products** — prices, descriptions, categories, and availability.
2. **Knows the store's policies** — return policy, delivery times, minimum order amounts, payment methods.
3. **Can answer FAQs** — custom questions the seller sets up (e.g., "Do you deliver on weekends?").
4. **Can take orders** — the AI collects the buyer's choices, builds an order, calculates the total, and places it.
5. **Works 24/7** on multiple channels — the ByChat web app, WhatsApp, and (planned) Instagram.

---

## 4. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React + TypeScript (Vite build tool) |
| **UI Components** | Tailwind CSS + shadcn/ui component library |
| **Animations** | Framer Motion |
| **Charts** | Recharts (for seller dashboard analytics) |
| **Backend / Database** | Supabase (PostgreSQL + Auth + Storage + Edge Functions) |
| **AI Workflow Engine** | n8n Cloud (handles AI chat logic, webhook processing) |
| **WhatsApp Integration** | Twilio API (for purchasing phone numbers and sending/receiving WhatsApp messages) |
| **Shopify Integration** | Shopify Admin API (Custom App with `read_products` scope) |
| **Hosting** | Lovable.dev (deployment platform) |
| **Version Control** | GitHub (two repos kept in sync) |

---

## 5. Database Schema

The database is hosted on **Supabase** (PostgreSQL) with **Row Level Security (RLS)** enabled on all tables.

### Core Tables:

| Table | Purpose |
|-------|---------|
| `buyers` | Stores buyer profiles — name, phone, city, delivery address, preferred language |
| `sellers` | Stores seller/business profiles — business name, type, hours, location, payment methods, integration credentials (WhatsApp, Shopify) |
| `products` | Product catalog for each seller — name, description, price, category, images, availability. Supports manual entry and Shopify import (tracked via `source` field) |
| `orders` | Order records — links buyer to seller, stores items (JSONB), total price, and status |
| `ai_agent_config` | Per-seller AI assistant settings — personality, tone, language, FAQs, policies, greeting message, order-taking permissions |
| `whatsapp_messages` | Logs of WhatsApp conversations between buyers and seller AI agents |

### Custom Enums:

- `business_type`: restaurant, grocery, clothing, electronics, beauty, services, other
- `delivery_option`: pickup, delivery, both
- `order_status`: pending, confirmed, preparing, delivered, cancelled

### Storage:

- **Bucket**: `product-images` (public) — stores product photos uploaded by sellers

---

## 6. Features (Detailed)

### 6.1 Landing Page

- Modern dark-themed landing page with gradient effects and glass-morphism design
- **Hero section**: "Shop Through Conversation" headline with animated stats (500+ shops, 10K+ buyers, 24/7 AI support)
- **How It Works** section explaining the platform flow
- **Features** section highlighting: AI-Powered Assistants, Instant Responses, Secure Payments, Multilingual Support (Arabic + English), 24/7 Availability, Flexible Payments (Cash, Card, OMT, Whish)
- CTA buttons leading to the Auth page

### 6.2 Authentication System

- **Role selection**: Users choose whether they are a Buyer or Seller at sign-up
- **Buyer signup**: Collects name, phone, city/area, delivery address, preferred language
- **Seller signup**: Collects name, phone, business name, business type, description, address, working hours, delivery options, payment methods accepted, WhatsApp number, Instagram handle
- **Login form**: Email + password authentication via Supabase Auth
- After login, users are redirected to their respective dashboard (buyer or seller)

### 6.3 Seller Dashboard

The seller dashboard is a full management panel with sidebar navigation:

#### Dashboard Home (`/seller`)
- **Summary cards**: Total Orders, Revenue Today, Active Products, Pending Orders
- **Revenue chart**: Last 7 days area chart (Recharts)
- **Recent orders list**: Shows buyer name, date, amount, and status badge

#### Products Management (`/seller/products`)
- Add, edit, and delete products
- Upload product images to Supabase Storage
- Set name, description, price, category, availability
- Products imported from Shopify show a green "Shopify" badge
- Shopify products link to "Edit on Shopify" instead of in-app editing

#### Orders Management (`/seller/orders`)
- View all incoming orders
- Update order status (pending -> confirmed -> preparing -> delivered / cancelled)
- See buyer name, items, total price

#### Statistics (`/seller/statistics`)
- Analytics and charts for seller performance

#### AI Agent Settings (`/seller/ai-settings`)
This is the **brain configuration** for each seller's AI assistant:

- **Store Knowledge Base**:
  - Store description / About Us (tells the AI about the business)
  - FAQ management (add custom Q&A pairs the AI should know)
  - Return policy text
  - Delivery time estimate
  - Minimum order amount
  - Special instructions for the AI (e.g., "Always greet in Arabic first", "Suggest daily specials")

- **Agent Personality**:
  - Agent name (e.g., "Shopping Assistant", "Mama's Helper")
  - Tone: Professional, Friendly, or Casual
  - Language: Arabic, English, or Both
  - Auto-greeting message (first thing the AI says when a buyer opens chat)

- **Order Settings**:
  - Toggle: Can the AI take orders?
  - Toggle: Can the AI give price quotes?
  - Toggle: Should the AI collect delivery address?

- Product catalog is auto-synced from the Products page

#### Integrations Hub (`/seller/integrations`)
A visual grid of all available integrations:

| Integration | Status |
|-------------|--------|
| WhatsApp Business | Active (fully built) |
| Instagram | Partial (saves handle, DM automation planned) |
| Shopify | Active (fully built) |
| Facebook Messenger | Coming Soon |
| Telegram | Coming Soon |
| TikTok Shop | Coming Soon |

### 6.4 WhatsApp Integration (`/seller/whatsapp`)

#### How It Works:
1. Seller clicks **"Connect WhatsApp"** — one button, no Twilio account needed
2. ByChat's backend (Supabase Edge Function `whatsapp-connect`) either:
   - **Purchases a real Twilio phone number** for the seller (production), OR
   - **Falls back to a sandbox number** (+14155238886) for testing
3. If sandbox: seller must send a one-time "join <keyword>" activation message
4. Once connected, the seller gets a **WhatsApp Inbox** showing all conversations
5. Buyers message the number -> Twilio webhook -> n8n workflow -> AI responds using the seller's agent config and product catalog

#### Connected State:
- Shows assigned phone number
- Active status badge
- **WhatsApp Inbox component** showing conversation threads
- Disconnect option (with confirmation warning)

### 6.5 Shopify Integration (`/seller/shopify`)

#### How It Works:
1. Seller creates a **Custom App** in their Shopify Admin
2. Configures `read_products` API scope
3. Installs the app and copies the **Admin API Access Token** (starts with `shpat_`)
4. Enters store URL and token in ByChat
5. Clicks **"Test & Connect"**
6. ByChat's Edge Function (`shopify-sync`) validates credentials and imports all products

#### Features:
- **Connect**: Validates Shopify credentials, imports all products into ByChat's database
- **Sync Now**: Re-syncs products (imports new ones, updates existing ones)
- **Disconnect**: Removes connection and marks imported products as unavailable
- **Sync Results Display**: Shows counts — new products imported, updated products, errors, total Shopify products
- **Source Tracking**: Each product has a `source` field (`manual` or `shopify`) and stores `shopify_product_id` + `shopify_variant_id` for reference
- **In-app setup guide**: Step-by-step visual guide with numbered steps

### 6.6 Buyer Experience

#### Buyer Home (`/buyer`)
- Welcome screen with quick links: Browse Shops, My Orders, AI Search

#### Browse Shops (`/buyer/shops`)
- Grid of all seller stores on the platform
- Shows business name, type, location, and hours

#### Shop Page (`/buyer/shop/:sellerId`)
- Full store page showing:
  - Store header with business name, type, description, hours, location, delivery option
  - Payment methods accepted (Cash, Card, OMT, Whish)
  - WhatsApp chat button (if seller has WhatsApp connected)
  - **Product grid** grouped by category with images, prices, and "Add to Cart" buttons
  - **Floating cart button** showing item count
  - **AI Chat Panel** (floating bubble) — opens a chat window where the buyer talks to the seller's AI assistant

#### AI Chat Panel
- Powered by **n8n webhook** (`https://bychat.app.n8n.cloud/webhook/ai-chat`)
- The buyer types a message -> it's sent to n8n -> n8n processes it with AI (using the seller's agent config, products, and FAQ) -> AI response is displayed
- Detects order summaries in AI responses and shows a "Confirm Order" button
- Session-based conversations

#### Cart & Checkout (`/buyer/cart`)
- View items in cart grouped by seller
- Adjust quantities
- Place order (creates record in `orders` table)

#### My Orders (`/buyer/orders`)
- View order history with status tracking

#### AI Search (`/buyer/search`)
- AI-powered search across all products on the platform

#### Buyer Profile (`/buyer/profile`)
- View and edit buyer profile information

---

## 7. Architecture Flow

```
BUYER                          BYCHAT PLATFORM                     SELLER
  |                                  |                                |
  |  1. Browse shops on web app      |                                |
  |  ─────────────────────────────>  |                                |
  |                                  |                                |
  |  2. Open chat with AI assistant  |                                |
  |  ─────────────────────────────>  |                                |
  |                                  |  n8n webhook processes message |
  |                                  |  ─────> AI generates response  |
  |                                  |  (uses seller's products,      |
  |                                  |   FAQ, policies, tone)         |
  |  3. AI responds with answers     |                                |
  |  <─────────────────────────────  |                                |
  |                                  |                                |
  |  4. Buyer places order via chat  |                                |
  |  ─────────────────────────────>  |  5. Order appears in dashboard |
  |                                  |  ─────────────────────────────>|
  |                                  |                                |
  |                                  |  6. Seller updates status      |
  |  7. Buyer sees status update     |  <─────────────────────────────|
  |  <─────────────────────────────  |                                |

  ─── WhatsApp Channel ───
  |                                  |                                |
  |  Buyer messages WhatsApp number  |                                |
  |  ─────> Twilio ─────> n8n ─────> AI responds ─────> Twilio ─────>|
  |  <───── (same AI agent logic) ──────────────────────── Buyer      |
```

---

## 8. Key Design Decisions

1. **Custom App (not OAuth) for Shopify**: Simpler setup — seller copies a token instead of going through an OAuth redirect flow. Good for MVP.

2. **n8n as AI middleware**: Instead of building AI logic directly in the app, n8n handles the AI workflow. This makes it easy to modify AI behavior (change prompts, add tools) without deploying code.

3. **Supabase Edge Functions for integrations**: WhatsApp connect and Shopify sync run as serverless functions, keeping the frontend lightweight.

4. **Twilio Sandbox fallback**: For development/testing, the app falls back to Twilio's sandbox when a real number can't be purchased, so the flow still works.

5. **Dual repo strategy**: Code is pushed to both `aliassaad4/ByChat` (main development) and `aliassaad1/pure-canvas` (Lovable deployment) to keep both in sync.

6. **RLS on all tables**: Row Level Security ensures sellers can only see their own data and buyers can only see their own orders, enforced at the database level.

7. **Lebanon-focused**: Payment methods (Cash, OMT, Whish), phone formats (+961), and business types are tailored to the Lebanese market.

---

## 9. Current State & What's Next

### Built and Working:
- Full landing page with modern UI
- Authentication (buyer + seller signup/login)
- Seller dashboard (products, orders, statistics, AI settings)
- Buyer experience (browse shops, shop pages, cart, orders, AI chat)
- WhatsApp integration (connect, inbox, AI auto-replies)
- Shopify integration (connect, product sync, disconnect)
- AI chat on web (via n8n)

### Planned / In Progress:
- **Instagram DM integration** — auto-reply to Instagram messages using the same AI agent (via Meta Instagram Messaging API)
- **Facebook Messenger** integration
- **Telegram** bot integration
- **TikTok Shop** integration
- Real-time order notifications
- Payment gateway integration
- Multi-image product support improvements
- Analytics and reporting enhancements

---

## 10. Course Context

This project is being developed as part of **EECE 505** at the **American University of Beirut (AUB)**, Spring 2026 semester. It demonstrates the practical application of:

- Full-stack web development (React + Supabase)
- AI integration in e-commerce (conversational commerce)
- Third-party API integrations (Twilio, Shopify, Meta)
- Database design with security (PostgreSQL + RLS)
- Cloud services and serverless architecture (Supabase Edge Functions, n8n)
- Modern UI/UX design principles (dark theme, glass-morphism, responsive design)
