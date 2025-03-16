# PM2 Dashboard

A beautiful, responsive web dashboard for managing PM2 processes built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- Secure authentication system using NextAuth.js
- Real-time monitoring of PM2 processes
- Process management (start, stop, restart, delete)
- Process log viewer
- Responsive design for desktop and mobile
- Auto-logout after inactivity
- Configurable refresh intervals

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- PM2 installed globally: `npm install -g pm2`

### Installation

1. Clone the repository:

```bash
git clone https://github.com/sacreations/pm2-dashboard.git
cd pm2-dashboard
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Create a `.env.local` file from the example:

```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` and update the values:

- Generate a random string for `NEXTAUTH_SECRET`
- Set your admin username and password

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production

Build the application:

```bash
npm run build
# or
yarn build
```

Start the production server:

```bash
npm run start
# or
yarn start
```

## Security

This dashboard should only be deployed in secure environments. Consider additional security measures:

1. Use HTTPS
2. Set up IP restrictions
3. Use strong passwords
4. Consider adding Two-Factor Authentication

## License

This project is licensed under the MIT License - see the LICENSE file for details.
