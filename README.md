# SkillSwap

SkillSwap is a skill-exchange platform. Members list the skills they can **teach** and the skills they want to **learn**, and SkillSwap matches them with people whose skills fit theirs. Person A teaches guitar and wants to learn mathematics; person B teaches mathematics and wants to learn guitar. They show up for each other as a mutual match, send a swap request, and once it is accepted they get each other's contact details.

## Features

- Sign up, then a short onboarding step for the profile (about me, phone, city, address)
- Any number of teach and learn listings, each with a level, a description and a meeting mode (online, in person, or both, with a city and location for in-person)
- Shared skill catalogue with autocomplete, so "guitar" and "Guitar" are the same skill
- **Discover**: mutual matches, people who can teach you, people who want to learn from you, plus a searchable directory of all members
- Swap requests: send, accept, decline, cancel. Contact details are shared only after a request is accepted
- Admin area: activity overview, deactivate or reactivate members, merge or delete duplicate skills

## Tech stack

| Part | Stack |
|---|---|
| API (`skillSwap-API/`) | Java 21, Spring Boot 3.5, Spring Security with JWT, Spring Data JPA, Flyway, springdoc OpenAPI |
| Web app (`skillswap-app/`) | React 19, Vite, Tailwind CSS, TanStack Query, react-hook-form with zod, lucide icons |
| Database | PostgreSQL on Supabase |
| Containers | Docker Compose: `api` (JRE on Alpine) and `app` (nginx on Alpine). No database container |

## Getting started

### 1. Configure

```bash
cp .env.example .env
```

Fill in `.env`:

- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`: from Supabase, **Project Settings → Database → Connection string → Session pooler**. Use the JDBC form `jdbc:postgresql://<host>:5432/postgres`. The direct connection is IPv6-only and often fails from Docker on Windows.
- `JWT_SECRET`: a base64 string of at least 32 bytes, for example the output of `openssl rand -base64 48`.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`: the first admin account, created automatically on startup if it does not exist.

The database schema is created and upgraded by Flyway when the API starts (`skillSwap-API/src/main/resources/db/migration`).

### 2a. Run with Docker

```bash
docker compose up -d --build
```

Open http://localhost:3000 (change the port with `APP_PORT` in `.env`). nginx serves the app and forwards `/api` to the API container. The API container is capped at 512 MB and the app container at 64 MB.

### 2b. Run for development

Requires JDK 21 and Node 20 or newer.

```bash
cd skillSwap-API
./mvnw spring-boot:run
```

```bash
cd skillswap-app
npm install
npm run dev
```

Open http://localhost:5173. Vite forwards `/api` to `http://localhost:8080`, so no CORS setup is needed. The API reads the repo-root `.env` automatically when started from `skillSwap-API/`.

API docs (development): http://localhost:8080/swagger-ui

## Project structure

```
skillSwap-API/src/main/java/com/learnjava/skillswapapi/
  config/       security chain, CORS, admin seeding, OpenAPI
  security/     JWT service and filter, authenticated principal
  controller/   thin REST controllers
  service/      business rules (profiles, skills, matching, requests, admin)
  repository/   Spring Data JPA repositories and queries
  entity/       JPA entities and enums
  dto/          request/response records with validation
  mapper/       entity to DTO mapping
  exception/    API exceptions and the global problem-detail handler

skillswap-app/src/
  components/ui/      buttons, form controls, cards, modal, tabs
  components/layout/  public, member and admin shells
  features/<area>/    pages, components and API calls per feature
  lib/                HTTP client, formatting, constants
  routes/             route guards
```

## API overview

All endpoints are under `/api`. Errors use RFC 7807 problem details (`{ status, detail, errors }`).

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| My profile | `GET`, `PUT /me/profile` |
| My skills | `GET`, `POST /me/skills`, `PUT`, `DELETE /me/skills/{id}` |
| Skills | `GET /skills/suggest?q=` |
| Discover | `GET /matches?mode=&city=`, `GET /members?skill=&city=&page=`, `GET /members/{id}` |
| Requests | `POST /requests`, `GET /requests/incoming`, `GET /requests/outgoing`, `POST /requests/{id}/accept`, `/decline`, `/cancel` |
| Admin | `GET /admin/stats`, `GET /admin/users`, `PATCH /admin/users/{id}/status`, `GET /admin/skills`, `POST /admin/skills/{id}/merge`, `DELETE /admin/skills/{id}` |

## Tests

```bash
cd skillSwap-API && ./mvnw test
```

The MVP keeps tests to the matching rules. The test needs no database.

## Not in this MVP

Email verification, password reset, social login, profile photos, notifications, in-app chat, video calls, and the paid Learn / Teach modes.
