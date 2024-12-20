# Journal Application

A modern journaling application built with React, TypeScript, and Supabase that helps users track their daily activities, achievements, and time-based entries.

## Features

- Time-sectioned journal entries
- Achievement tracking and management
- Real-time database synchronization
- Type-safe database interactions
- Responsive design

## Tech Stack

- React + TypeScript
- Supabase for backend
- Vite as build tool
- SQL migrations

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Achievements.tsx    # Achievement tracking component
│   │   └── TimeSection.tsx     # Time-based entry component
│   ├── hooks/
│   │   └── useJournal.ts      # Journal management hook
│   ├── lib/
│   │   ├── database.types.ts   # Supabase database types
│   │   └── supabase.ts        # Supabase client configuration
│   └── App.tsx                 # Main application component
├── supabase/
│   └── migrations/
│       └── 0001_noisy_mode.sql # Database schema migrations
├── index.html                  # Entry HTML file
└── .env                        # Environment configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

### Database Setup

1. Make sure you have Supabase CLI installed:
```bash
npm install -g supabase
```

2. Run the database migrations:
```bash
supabase db reset
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Type Safety

The project uses TypeScript for type safety. Database types are automatically generated from Supabase schema using `database.types.ts`.

## Components

### TimeSection
Manages time-based journal entries with customizable sections for different parts of the day.

### Achievements
Tracks and displays user achievements and milestones.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
