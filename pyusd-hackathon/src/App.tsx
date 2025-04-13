// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import DocumentationPage from '@/pages/DocumentationPage';
import FeaturesPage from '@/pages/FeaturesPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-md py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
              PYUSD Hackathon Project
            </Link>
            <nav className="space-x-4">
              <Link to="/" className="text-gray-700 dark:text-gray-300">Home</Link>
              <Link to="/about" className="text-gray-700 dark:text-gray-300">About</Link>
              <Link to="/features" className="text-gray-700 dark:text-gray-300">Features</Link>
              <Link to="/docs" className="text-gray-700 dark:text-gray-300">Docs</Link>
              <Link to="/contact" className="text-gray-700 dark:text-gray-300">Contact</Link>
              <DarkModeToggle />
            </nav>
          </div>
        </header>

        {/* Main Routes */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/docs" element={<DocumentationPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-200 dark:bg-gray-800 py-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} PYUSD Hackathon Project
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
