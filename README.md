# PM2 Dashboard

![PM2](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg)

A beautiful, responsive web dashboard for managing PM2 processes built with Next.js, React, TypeScript, and Tailwind CSS.

**Quick Links:**

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [File Structure](#-file-structure)
- [Security](#-security)
- [License](#-license)

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PM2](https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white)

## ✨ Features

- 🔒 **Secure Authentication** - Login system using Next Auth.js
- 📊 **Real-time Monitoring** - Live updates of your PM2 processes
- 🎛️ **Process Management** - Start, stop, restart, and delete processes
- 📜 **Log Viewer** - View process logs in real-time
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ⏰ **Auto-logout** - Security feature for inactive sessions
- ⚙️ **Configurable** - Adjust refresh intervals to your needs
- 🖥️ **System Monitoring** - CPU and RAM usage tracking

## 🛠️ Tech Stack

- **Next.js 13+** with App Router
- **TypeScript**
- **React 18+**
- **Tailwind CSS**
- **Next Auth.js** for authentication
- **Express backend** for PM2 communication
- **PM2** for process management

## 🚀 Getting Started

### Prerequisites

- Node.js 16.8 or later
- PM2 installed globally: `npm install -g pm2`

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/sacreations/pm2-dashboard.git
    cd pm2-dashboard
    ```

2. **Install dependencies**

    ```bash
    npm install
    # or
    yarn
    ```

3. **Create environment file**

    ```bash
    cp .env.local.example .env.local
    ```

4. **Configure environment variables**

    Edit `.env.local` and update:
    - Generate a random string for `NEXTAUTH_SECRET`
    - Set your admin username and password
    - Configure the port if needed

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

The server will run on the port specified in your `.env.local` file (defaults to 3000).
Open [http://localhost:3000](http://localhost:3000) (or your custom port) with your browser.

### Production

Build and start the production server:

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## 📁 File Structure

```text
pm2-dashboard/
├── app/                     # Next.js 13 app directory
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication API
│   │   ├── pm2/             # PM2 process management API
│   │   └── system/          # System information API
│   ├── dashboard/           # Dashboard pages
│   │   ├── settings/        # Settings page
│   │   └── system/          # System monitoring page
│   ├── login/               # Login page
│   ├── globals.css          # Global CSS
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
│
├── components/              # React components
│   ├── auth/                # Authentication components
│   ├── dashboard/           # Dashboard components
│   ├── layout/              # Layout components
│   ├── system/              # System monitoring components
│   └── theme/               # Theme components
│
├── public/                  # Static assets
├── .env.local.example       # Example environment variables
├── next.config.js           # Next.js configuration
├── package.json             # Project dependencies
├── postcss.config.js        # PostCSS configuration
├── server.js                # Custom server for port configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 🔐 Security

This dashboard should only be deployed in secure environments. Consider implementing:

- 🔒 **HTTPS** - Always use TLS/SSL for production
- 🛡️ **IP restrictions** - Limit access to trusted networks
- 🔑 **Strong passwords** - Use complex, unique passwords
- 👤 **Two-Factor Authentication** - Add an extra layer of security

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by [sacreations](https://github.com/sacreations)
