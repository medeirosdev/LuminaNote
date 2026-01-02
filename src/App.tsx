import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout, Sidebar } from './components/layout';
import { DashboardPage, TasksPage, ProjectsPage, FocusPage, CalendarPage } from './pages';
import type { NavItem } from './types';

function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (activeNav) {
      case 'dashboard':
        return <DashboardPage />;
      case 'tasks':
        return <TasksPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'focus':
        return <FocusPage />;
      case 'calendar':
        return <CalendarPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Layout
      sidebar={
        <Sidebar
          activeNav={activeNav}
          onNavChange={setActiveNav}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeNav}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
