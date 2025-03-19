# AgentScan Frontend

A modern Next.js application built with TypeScript and Tailwind CSS, designed to provide a robust and scalable web application experience.

## 🚀 Features

- **Modern Tech Stack**

  - Next.js 14 with App Router
  - TypeScript for type safety
  - Tailwind CSS for styling
  - ESLint for code quality
  - PostCSS for CSS processing

- **Developer Experience**
  - Hot reload
  - Type checking
  - Code formatting
  - Environment variable management
  - Component-driven development

## 📋 Prerequisites

- Node.js 18.x or later
- npm or yarn or pnpm or bun

## 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:ExploreLabsxyz/agentscan.git
   cd agentscan
   ```

2. Clone the backend repository:

   ```bash
   git clone git@github.com:ExploreLabsxyz/agentscan-express.git
   cd agentscan-express
   ```

3. Install dependencies:

   ```bash
   npm install

   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your configuration values.

## 🚀 Development

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 📁 Project Structure

```
agentscan/
├── src/               # Source files
├── public/            # Static assets
├── components/        # Reusable components
├── .next/            # Next.js build output
├── node_modules/     # Dependencies
├── .env.example      # Example environment variables
├── .env.local        # Local environment variables
├── .eslintrc.json    # ESLint configuration
├── next.config.ts    # Next.js configuration
├── tailwind.config.ts # Tailwind CSS configuration
├── tsconfig.json     # TypeScript configuration
└── package.json      # Project metadata and dependencies
```

## 🔧 Configuration

- **TypeScript**: Configured in `tsconfig.json`
- **Tailwind CSS**: Customized in `tailwind.config.ts`
- **ESLint**: Rules defined in `.eslintrc.json`
- **Next.js**: Settings in `next.config.ts`

## 🚀 Deployment

The application can be deployed using Docker:

1. Build the Docker image:

   ```bash
   docker build -t agentscan-frontend .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_TEAM_ID=your-team-id \
     -e NEXT_PUBLIC_API_URL=your-api-url \
     -e NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id \
     agentscan-frontend
   ```

The application will be available at `http://localhost:3000` (or your configured host).

## 📝 Code Conventions

- **Components**: Use PascalCase (e.g., `UserProfile.tsx`)
- **Directories**: Use kebab-case (e.g., `user-profile/`)
- **Functions**: Use camelCase (e.g., `handleSubmit`)
- **Files**: Group by feature/module
- **Styling**: Use Tailwind CSS classes and custom utilities

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
