# ClearWatch

A web application for improving police accountability and transparency through citizen reporting and officer performance tracking.

## Project Structure

```
clearwatch/
├── api/              # Supabase Edge Functions
│   └── supabase/
│       └── functions/
│           └── hello-world/  # Example function
├── web/              # Next.js frontend application
│   ├── src/
│   │   ├── app/     # App Router pages
│   │   └── components/
└── README.md        # This file
```

## Prerequisites

- Node.js >= 20.0.0
- pnpm
- Docker Desktop (for local development)
- Supabase CLI

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Slon3r/PoliceApp.git
   cd PoliceApp
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local` in the web directory
   - Fill in the required environment variables

4. Start the development servers:
   ```bash
   # Start Supabase services
   pnpm dev:db

   # In a new terminal, start the Edge Functions
   pnpm dev:api

   # In another terminal, start the frontend
   pnpm dev:web
   ```

5. Open http://localhost:3000 to view the frontend

## Available Commands

- `pnpm dev:web` - Start the Next.js development server
- `pnpm dev:api` - Start the Edge Functions development server
- `pnpm dev:db` - Start the local Supabase stack
- `pnpm build` - Build all applications for production

## Development Workflow

1. Create a new branch for your feature/fix
2. Make your changes
3. Push your changes and create a pull request
4. CI will automatically:
   - Build the project
   - Run tests
   - Deploy Edge Functions (on main branch)

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ENV=development
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.