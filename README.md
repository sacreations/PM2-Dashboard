<div align="center">
  <h1>
    <br>
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="PM2" width="100" height="100">
    <br>
    PM2 Dashboard
    <br>
  </h1>
  <p>A beautiful, responsive web dashboard for managing PM2 processes</p>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#file-structure">File Structure</a> •
    <a href="#security">Security</a> •
    <a href="#license">License</a>
  </p>

  <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white" alt="PM2">
</div>

## ✨ Features

- 🔒 **Secure Authentication** - Login system using NextAuth.js
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
- **NextAuth.js** for authentication
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
