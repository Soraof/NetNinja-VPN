// src/App.jsx
import { useState } from 'preact/hooks';
import { Suspense, lazy } from 'preact/compat'; // ✅ Правильно!

// Ленивая загрузка страниц с fallback при ошибке
const Dashboard = lazy(() => import('./pages/Dashboard').catch(() => () => <ErrorPage name="Dashboard" />));
const Arsenal = lazy(() => import('./pages/Arsenal').catch(() => () => <ErrorPage name="Arsenal" />));
const MyPassages = lazy(() => import('./pages/MyPassages').catch(() => () => <ErrorPage name="MyPassages" />));
const Missions = lazy(() => import('./pages/Missions').catch(() => () => <ErrorPage name="Missions" />));
const Clan = lazy(() => import('./pages/Clan').catch(() => () => <ErrorPage name="Clan" />));
const Help = lazy(() => import('./pages/Help').catch(() => () => <ErrorPage name="Help" />));

function ErrorPage({ name }) {
  return (
    <div style={{ padding: '20px', color: 'red' }}>
      ❌ Ошибка загрузки: {name}. Проверь файл <code>src/pages/{name}.jsx</code>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'arsenal': return <Arsenal />;
      case 'passages': return <MyPassages />;
      case 'missions': return <Missions />;
      case 'clan': return <Clan />;
      case 'help': return <Help />;
      default: return <Dashboard />;
    }
  };

  const getIconName = (page) => {
    const names = {
      dashboard: '👤',
      arsenal: '🛒',
      passages: '🔑',
      missions: '🎯',
      clan: '👥',
      help: '❓'
    };
    return names[page] || '📄';
  };

  return (
    <div className="min-h-screen bg-ninja-bg text-white relative">
      <Suspense fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-ninja-bg z-50">
          <img
            src="/assets/animations/loading_ninja_smoke.gif"
            alt="Loading..."
            className="w-32 h-32"
          />
        </div>
      }>
        {renderPage()}
      </Suspense>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-ninja-bg border-t border-gray-800 z-40">
        <div className="grid grid-cols-6 gap-1 p-2">
          {['dashboard', 'arsenal', 'passages', 'missions', 'clan', 'help'].map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                currentPage === page ? 'bg-purple-600' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{getIconName(page)}</span>
              <span className="text-xs mt-1 capitalize">{page}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
