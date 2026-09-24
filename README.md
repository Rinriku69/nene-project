# Nene and The GANG 

A gamified web app I built as a gift for a long-distance relationship. It has a gacha (random-pull) system, a pet shop, a message board, live location sharing, and a Stardew Valley save viewer, all in a cute pink pixel-art style.

**Live:** https://nene-project.com


## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Angular 22 (standalone, zoneless, signals, signal forms), Tailwind CSS 4, Vitest |
| Backend | Laravel 13 (API only), PHP 8.4, Sanctum (session cookies), JWT (for the Stardew client) |
| Database | PostgreSQL (production), SQLite in-memory (tests) |
| Infra | Docker Compose (Angular + Nginx, PHP-FPM, Nginx, Postgres), DigitalOcean VPS, Let's Encrypt |
| CI/CD | GitHub Actions: a push to `production` deploys over SSH |

## Features

- **Gacha**: single and 10-pulls with weighted rarity tiers (N / R / SR / SSR) and a pity rule that guarantees an SR or better in every 10-pull
- **Inventory and pull history**: paginated logs of everything you've rolled
- **Pet shop**: buy animated sprite-sheet pets with in-game currency
- **Safe Zone**: a Tanabata-style *tanzaku* wall for leaving messages, with role-based visibility
- **Location sharing**: shows where a friend is and when they were last seen, with online/offline status
- **Stardew Valley sync**: a JWT-authenticated endpoint receives save data (skills, stats, farm) from the game and shows it in the app
- **Admin panel**: user and role management, item management, gem giveaways, notifications
- **Account flow**: register, email verification, forgot/reset password, daily login rewards

## Interesting problems I solved

**Race-safe currency spending.** The client could fire two pull requests at the same moment. Both could read the balance before either one deducted, and the user would get two pulls for the price of one. Each pull runs inside `DB::transaction()` and locks the user row with `lockForUpdate()`, so the second request waits for the first to commit and then sees the new balance.
→ [`GachaController::pull`](backend/app/Http/Controllers/GachaController.php)

**Weighted random with pity.** A pull picks a rarity first, then picks an item within that rarity by cumulative weight. That way the chance of each rarity stays fixed no matter how many items are in the pool. On the 10th roll of a 10-pull, if nothing so far was SR or better, the roll is forced to SR.

**Cookie-based SPA auth without CORS headaches.** Sanctum uses a session cookie plus CSRF protection. An Angular interceptor reads the `XSRF-TOKEN` cookie and sends it back as the `X-XSRF-TOKEN` header. Auth state is restored before the first render with `provideAppInitializer()`, and routes are protected with `canMatch` guards (including a role-based `roleGuard`).

**Authorization on the server, not the UI.** Hiding admin pages in Angular is only a convenience. Every admin endpoint checks `Gate::authorize('isAdmin')` on the backend. Registration always assigns the `user` role and ignores anything the client sends.

## Project structure

```
frontend/src/app/nene-project/
  pages/        routed views (auth, app/*, admin/*, profile)
  components/   shared UI (icons, pets, loading, sakura effects)
  services/     one signal-based service per domain
  models/       shared TypeScript interfaces (mirror backend JSON exactly)
backend/
  app/Http/Controllers/   feature controllers (Gacha, Pet, SafeZone, Location, Stardew, Admin)
  app/Policies/           role gates (isAdmin, isFriend)
  routes/api.php          routes grouped by feature prefix
  tests/Feature/          HTTP-level tests against in-memory SQLite
```

## Running locally

**With Docker (the whole stack):**
```bash
cp backend/.env.example backend/.env   # fill in DB_* and APP_KEY
docker compose up -d --build
docker compose exec backend-php php artisan migrate --seed
# frontend → http://localhost:8080   api → http://localhost:8000
```

**Without Docker:**
```bash
# backend
cd backend && composer install && php artisan key:generate && php artisan migrate --seed && php artisan serve
# frontend
cd frontend && npm install && npm start   # http://localhost:4200
```

## Tests

```bash
cd backend && php artisan test     # Laravel feature tests (in-memory SQLite)
cd frontend && npm test            # Vitest
```
