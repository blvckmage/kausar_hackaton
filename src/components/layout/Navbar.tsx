import { useState, useEffect } from 'react';
import { BookOpen, Menu, X, User, Sun, Moon, LogOut, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import { NotificationDropdown } from './NotificationDropdown';

export function Navbar() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[--bg-primary]/80 backdrop-blur-md border-b border-[--border-color] py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="p-2 bg-gradient-to-br from-[--accent-from] to-[--accent-to] rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[--text-primary]">
              Mentoria<span className="text-[--accent-from]">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/courses" className="text-sm font-medium text-[--text-secondary] hover:text-[--accent-from] transition-colors">Курсы</Link>
            <Link to="/olympiads" className="text-sm font-medium text-[--text-secondary] hover:text-[--accent-from] transition-colors">Олимпиады</Link>
            <Link to="/calendar" className="text-sm font-medium text-[--text-secondary] hover:text-[--accent-from] transition-colors">Календарь</Link>
            <Link to="/forum" className="text-sm font-medium text-[--text-secondary] hover:text-[--accent-from] transition-colors">Форум</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-sm font-medium text-[--accent-from] hover:text-[--accent-to] transition-colors flex items-center gap-1">
                <Settings className="w-4 h-4" /> Админка
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center bg-white/5 rounded-lg p-1 mr-2 border border-white/10">
              {(['kz', 'ru', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => i18n.changeLanguage(lang)}
                  className={`px-2 py-1 text-xs font-medium rounded-md uppercase transition-colors ${
                    i18n.language === lang 
                      ? 'bg-[--accent-from] text-white' 
                      : 'text-[--text-secondary] hover:text-[--text-primary]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            
            <NotificationDropdown />

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-[--text-secondary] hover:text-[--accent-from] transition-colors p-2"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {user ? (
              <div className="flex items-center gap-4 ml-2">
                <Link to="/profile" className="flex items-center gap-2 text-[--text-secondary] hover:text-[--text-primary] transition-colors font-medium">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[--accent-from] to-[--accent-to] flex items-center justify-center text-sm text-white font-bold">
                    {user.full_name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block">{user.full_name}</span>
                </Link>
                <button onClick={handleLogout} className="text-[--text-secondary] hover:text-red-500 p-2">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Button variant="secondary" size="sm" className="gap-2" onClick={() => navigate('/login')}>
                  <User className="w-4 h-4" />
                  {t('nav.login')}
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>{t('nav.start')}</Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <div className="flex items-center bg-white/5 rounded-lg p-1 mr-1 border border-white/10">
              {(['kz', 'ru', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => i18n.changeLanguage(lang)}
                  className={`px-2 py-1 text-xs font-medium rounded-md uppercase transition-colors ${
                    i18n.language === lang 
                      ? 'bg-[--accent-from] text-white' 
                      : 'text-[--text-secondary] hover:text-[--text-primary]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <NotificationDropdown />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[--text-secondary] hover:text-[--accent-from] p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[--bg-primary]/95 backdrop-blur-xl border-b border-[--border-color] animate-fade-in-up">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <Link to="/courses" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-[--text-primary] hover:bg-black/5 dark:hover:bg-white/5">{t('nav.courses')}</Link>
            <Link to="/olympiads" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-[--text-primary] hover:bg-black/5 dark:hover:bg-white/5">{t('nav.olympiads')}</Link>
            <Link to="/calendar" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-[--text-primary] hover:bg-black/5 dark:hover:bg-white/5">{t('nav.calendar')}</Link>
            <Link to="/forum" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-[--text-primary] hover:bg-black/5 dark:hover:bg-white/5">{t('nav.forum')}</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-[--text-primary] hover:bg-black/5 dark:hover:bg-white/5">{t('nav.admin')}</Link>
            )}
            <div className="pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <Button variant="secondary" className="w-full justify-center" onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}>{t('nav.profile')}</Button>
                  <Button variant="outline" className="w-full justify-center text-red-500 border-red-500/20" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>{t('nav.logout')}</Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" className="w-full justify-center" onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}>{t('nav.login')}</Button>
                  <Button className="w-full justify-center" onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}>{t('home.start_free')}</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

