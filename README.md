# LuminaNote

A simple, clean, and lightweight personal productivity dashboard. Built with React, TypeScript, and Tailwind CSS.

![LuminaNote Dashboard](https://via.placeholder.com/800x450?text=LuminaNote+Dashboard)

## Features

### Core Functionality
- **Dashboard** - Bento grid overview with quick stats, today's tasks, and active projects
- **Tasks** - Organize by Today, This Week, and Backlog categories
- **Projects** - Track progress with detailed project management
- **Focus Mode** - Pomodoro timer for deep work sessions

### User Experience
- **Dark Mode** - Toggle between light and dark themes
- **Due Dates** - Visual indicators for overdue and upcoming tasks
- **Toast Notifications** - Subtle feedback for all actions
- **Drag & Drop** - Reorder tasks with smooth animations
- **LocalStorage** - Data persists across sessions

### Design Philosophy
- Simple and clean interface
- Lightweight and fast
- Smooth animations powered by Framer Motion
- Inter font for clean typography

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Storage | LocalStorage (extensible) |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/medeirosdev/LuminaNote.git
cd LuminaNote

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── focus/          # Pomodoro timer
│   ├── layout/         # Sidebar, Layout, BentoGrid
│   ├── projects/       # ProjectCard, ProjectList, ProjectDetailModal
│   └── tasks/          # TaskCard, TaskList, TaskInput
├── hooks/
│   ├── useLocalStorage.ts   # Generic localStorage hook
│   ├── useProjects.ts       # Project CRUD operations
│   ├── useTasks.ts          # Task management with reordering
│   ├── useTheme.tsx         # Dark mode context
│   ├── useTimer.ts          # Pomodoro timer logic
│   └── useToast.tsx         # Toast notification system
├── pages/
│   ├── DashboardPage.tsx
│   ├── FocusPage.tsx
│   ├── ProjectsPage.tsx
│   └── TasksPage.tsx
├── types/
│   └── index.ts        # TypeScript interfaces
├── App.tsx
├── main.tsx
└── index.css           # Tailwind + theme tokens
```

## Desktop App (Electron)

LuminaNote can be run as a native desktop application using Electron.

### Development Mode

Run the app in a desktop window with hot reload:

```bash
npm run electron:dev
```

### Build Installers

Generate platform-specific installers:

| Command | Output |
|---------|--------|
| `npm run electron:build:win` | Windows `.exe` installer |
| `npm run electron:build:mac` | macOS `.dmg` installer |
| `npm run electron:build:linux` | Linux `.AppImage` |
| `npm run electron:build` | Build for current platform |

The installers will be created in the `release/` folder.

### Project Structure (Electron)

```
electron/
├── main.cjs      # Main process (window creation)
└── preload.cjs   # Secure bridge to renderer
```

## Customization

### Theme Colors

Edit `src/index.css` to customize the color palette:

```css
@theme {
  --color-zen-bg: #FAFAF9;
  --color-zen-accent: #64748B;
  --color-zen-sage: #84A98C;
  /* ... */
}

.dark {
  --color-zen-bg: #0F0F0F;
  /* ... */
}
```

### Timer Durations

Modify `src/hooks/useTimer.ts`:

```typescript
const FOCUS_DURATION = 25 * 60; // 25 minutes
const BREAK_DURATION = 5 * 60;  // 5 minutes
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Inter Font](https://fonts.google.com/specimen/Inter) for typography

---

## Author

Created with care by **Guilherme de Medeiros**

Software Engineer | Computational and Applied Mathematics @ UNICAMP | Undergraduate Researcher @ Recod.ai

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/guilhermedemedeiros/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/medeirosdev)

---

Made with calm and clarity
