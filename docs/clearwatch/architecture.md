# Clearwatch Fullstack Architecture Document

## 1. Introduction
[cite_start]This document outlines the complete fullstack architecture for the Clearwatch application. [cite: 83] [cite_start]It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack. [cite: 84]
[cite_start]**Starter Template:** N/A - Greenfield project. [cite: 85]

## 2. High Level Architecture
[cite_start]The Clearwatch application will be architected as a serverless, full-stack application using Supabase for the backend and Vercel for the frontend. [cite: 85] [cite_start]The frontend will be a responsive web application built with Next.js, communicating with a backend comprised of Supabase services (Auth, Database, Storage) and serverless Edge Functions. [cite: 86] [cite_start]This approach is chosen for its rapid development, high security, automatic scalability, and cost-effectiveness. [cite: 87]

## 3. Tech Stack
| Category | Technology | Rationale |
|---|---|---|
| Frontend Framework | React (Next.js) | [cite_start]Excellent performance, mature ecosystem, and seamless deployment to Vercel. [cite: 88] |
| UI Styling | Tailwind CSS | [cite_start]Utility-first approach offers maximum flexibility for the custom "Professional Anarchy" aesthetic. [cite: 89] |
| Backend Platform | Supabase | [cite_start]All-in-one platform (Database, Auth, Storage) that dramatically accelerates development. [cite: 90] |
| Backend Language | TypeScript (Deno) | [cite_start]For Supabase Edge Functions, ensuring type safety. [cite: 91] |
| AI Workflow | n8n | [cite_start]Powerful tool for creating and managing the complex chain of AI tasks in a visual, low-code environment. [cite: 92] |
| AI Gateway | OpenRouter | [cite_start]Provides the flexibility to switch between different LLMs to balance cost and performance. [cite: 93] |
| CI/CD | GitHub Actions & Vercel | [cite_start]Tightly integrated with GitHub for automated testing and deployment. [cite: 94] |

## 4. Data Models
[cite_start]The data will be structured using three core models: Officer, Incident, and InvolvedParty. [cite: 95] [cite_start]The design uses a "privacy-by-choice" philosophy, capturing all possible public information about officers while making the storage of private citizen's PII strictly opt-in via a consentToShareName flag. [cite: 96]

## 5. API Specification
[cite_start]A REST API will be exposed via Supabase Edge Functions. [cite: 97] [cite_start]The specification defines endpoints for creating and retrieving incidents and officers, serving as the contract between the frontend and backend. [cite: 98]

## 6. Components
[cite_start]The system is broken down into logical components: Frontend Web App, Supabase Backend (Auth, DB, Storage), Evidence Submission Service (Edge Function), Data Query Service (Edge Function), and the AI Analysis Service (n8n/OpenRouter). [cite: 99]

## 7. Database Schema
[cite_start]The schema is defined in SQL DDL for PostgreSQL, implementing the data models with appropriate indexes, constraints, and Row Level Security (RLS) enabled by default for maximum security. [cite: 100]

## 8. Frontend Architecture
[cite_start]The architecture uses Next.js with the App Router. [cite: 101] [cite_start]State management is handled with a dual approach: Zustand for client state and React Query for server state. [cite: 102] [cite_start]A dedicated service layer will abstract all API interactions. [cite: 103]

## 9. Backend Architecture
[cite_start]The backend uses Supabase Edge Functions organized by domain. [cite: 104] [cite_start]A Repository Pattern will be used to abstract all database logic, ensuring clean, testable, and secure code. [cite: 104] [cite_start]Authentication is handled by Supabase Auth using JWTs. [cite: 105]

## 10. Unified Project Structure
[cite_start]A monorepo will be used to organize the project, with separate apps for the web frontend and api backend, and a packages directory for shared code like TypeScript types. [cite: 105]

## 11. Development & Deployment
[cite_start]The workflow uses pnpm for local development and the Supabase CLI to run the backend locally. [cite: 106] [cite_start]Deployment is automated, with the frontend deploying to Vercel and the backend deploying to Supabase, both triggered by pushes to the main branch via GitHub Actions. [cite: 107]

## 12. Security and Performance
[cite_start]The architecture includes a defense-in-depth security strategy, including a strict Content Security Policy, server-side file scanning, abuse prevention, a data retention policy, mandatory MFA for admins, and Row Level Security on all database tables. [cite: 108] [cite_start]Performance is addressed through modern frontend practices like code splitting and server-side rendering. [cite: 109]

## 13. Testing Strategy
[cite_start]A comprehensive testing strategy follows the testing pyramid model, including unit, integration, and end-to-end tests. [cite: 110] [cite_start]The plan also incorporates security scanning, performance testing, and visual regression testing. [cite: 111]