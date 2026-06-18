import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Home } from './pages/Home';
import { Calendar } from './pages/Calendar';
import { Admin } from './pages/Admin';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Forum } from './pages/Forum';
import { Olympiads } from './pages/Olympiads';
import { Courses } from './pages/Courses';
import { Roadmap } from './pages/Roadmap';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { useStore } from './store/useStore';
import { useEffect } from 'react';

function App() {
  const initializeAuth = useStore((state) => state.initializeAuth);
  const setDeferredPrompt = useStore((state) => state.setDeferredPrompt);

  useEffect(() => {
    initializeAuth();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [initializeAuth, setDeferredPrompt]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/olympiads" element={<Olympiads />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/roadmap" element={<Roadmap />} />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin>
              <Admin />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;


