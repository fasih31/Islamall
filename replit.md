# Islamic Compass Portal

## Overview
The Islamic Compass Portal is a comprehensive web application designed as a spiritual and educational hub for the Muslim community. It integrates Quran reading (with audio), Hadith collections, prayer times, Islamic finance tools (including Zakat calculator), and community event management. The platform emphasizes authentic Islamic content, bilingual support (Arabic RTL and English LTR), reverent design inspired by established Islamic platforms, and accessibility across devices. Its business vision is to provide a central, modern platform for Muslims worldwide to deepen their understanding and practice of Islam.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework & Build System:** React 18 with TypeScript, Vite for bundling, and Wouter for client-side routing. Supports Server-Side Rendering (SSR).
- **State Management:** TanStack Query for server state caching and React Context API for global state like theme management.
- **UI Component Library:** Shadcn/ui built on Radix UI primitives, styled with Tailwind CSS and Class Variance Authority (CVA).
- **Design System:** Custom color palette (deep teal-green primary, warm neutrals), specific typography for Arabic (Amiri/Scheherazade) and English (Inter, Playfair Display), with a dark mode-first, responsive grid layout.

### Backend Architecture
- **Server Framework:** Express.js with Node.js and TypeScript, integrated with Vite middleware for development.
- **API Design:** RESTful API with JSON responses, organized by feature domain, and standardized error handling.
- **Authentication System:** Replit Auth using OpenID Connect (OIDC) with Passport.js strategy and PostgreSQL-backed session persistence.
- **AI Integration (OpenAI):** Utilizes GPT-5 for Arabic OCR, TTS-1-HD for high-quality audio, Vision API for Quranic analysis, and AI-powered chatbots for contextual search. Includes Hadith authenticity validation based on classical Islamic criteria.

### Data Storage
- **Database:** PostgreSQL via Neon serverless, managed with Drizzle ORM for type-safe operations.
- **Schema Design:** Includes tables for Users (with roles), Quran (surahs, ayahs, translations, audio), Hadith (collections, grades, narrators), Bookmarks, Prayer times, Finance articles, Duas, and Community events.
- **Session Storage:** Dedicated PostgreSQL table for authentication state.

## External Dependencies

### Third-Party Services
- **Neon Database:** Serverless PostgreSQL hosting.
- **OpenAI API:** GPT-5, Vision API, TTS-1-HD for AI functionalities.
- **Replit Auth:** OIDC-based authentication provider.
- **Google Fonts:** For typography.

### Development Tools
- **Replit-specific plugins:** Cartographer, Dev Banner, Runtime Error Modal.
- **ESBuild:** For production server bundling.
- **Drizzle Kit:** For database migrations.

### UI Libraries
- **Radix UI:** Accessible component primitives.
- **React Hook Form with Zod:** For form validation.
- **Lucide React:** For iconography.
- **Date-fns:** For date manipulation.
- **CMDK:** For command palette functionality.

### File Upload
- **Multer:** Middleware for multipart/form-data handling with in-memory storage.

### Performance Optimization
- **Memoizee:** For OIDC configuration caching.
- **TanStack Query:** For query result caching.
- **Vite's build process:** For static asset optimization.