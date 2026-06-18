import { useStore } from '../store/useStore';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Award, Book, Trophy, Target, Settings, Bell, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';

import { Skeleton } from '../components/ui/Skeleton';

export function Profile() {
  const user = useStore((state) => state.user);
  const deferredPrompt = useStore((state) => state.deferredPrompt);
  const setDeferredPrompt = useStore((state) => state.setDeferredPrompt);

  // Calculate Rank dynamically based on XP
  const xp = user?.xp || 0;
  let rankName = 'Новичок';
  if (xp >= 50) rankName = 'Продвинутый';
  if (xp >= 150) rankName = 'Эксперт';
  if (xp >= 500) rankName = 'Мастер';

  // Achievements
  const hasFirstStep = true; // Always has first step if registered
  const hasHardworker = xp >= 50;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[--accent-from] to-[--accent-to] flex items-center justify-center text-4xl text-white font-bold shadow-lg">
              {user?.full_name?.charAt(0).toUpperCase() || user?.email.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[--text-primary] mb-1">{user?.full_name || 'Студент'}</h1>
              <p className="text-[--text-secondary] mb-2">{user?.email}</p>
              <div className="flex gap-2 mb-2">
                <span className="px-3 py-1 bg-[--accent-from]/10 text-[--accent-from] border border-[--accent-from]/20 rounded-full text-xs font-medium">
                  Ранг: {rankName}
                </span>
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-xs font-medium">
                  {xp} XP
                </span>
                {user?.role === 'admin' && (
                  <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-xs font-medium">
                    Администратор
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-[--text-secondary]">
                ID для бота: <code className="bg-white/5 px-2 py-0.5 rounded text-[--accent-to]">{user?.id || 'Войдите'}</code>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {deferredPrompt && (
              <Button
                variant="primary"
                className="gap-2 bg-gradient-to-r from-[--accent-from] to-[--accent-to] border-none"
                onClick={async () => {
                  if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                      setDeferredPrompt(null);
                    }
                  }
                }}
              >
                Скачать приложение
              </Button>
            )}
            <Button variant="secondary" className="gap-2"><Settings className="w-4 h-4" /> Настройки</Button>
            <Button variant="secondary" className="gap-2"><Bell className="w-4 h-4" /> Уведомления</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main info */}
          <div className="md:col-span-2 space-y-8">
            <Card className="!p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[--text-primary]">
                <Target className="w-5 h-5 text-[--accent-to]" /> Мой прогресс
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2 text-[--text-secondary]">
                    <span>Опыт (XP)</span>
                    <span>{xp} XP</span>
                  </div>
                  <div className="w-full bg-[--border-color] rounded-full h-2">
                    <div className="bg-[--accent-from] h-2 rounded-full" style={{ width: `${Math.min((xp / 500) * 100, 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2 text-[--text-secondary]">
                    <span>Пройдено уроков</span>
                    <span>{user?.completed_modules || 0}</span>
                  </div>
                  <div className="w-full bg-[--border-color] rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(((user?.completed_modules || 0) / 20) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="!p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[--text-primary]">
                <Book className="w-5 h-5 text-[--accent-from]" /> Активные курсы
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 rounded-xl border border-[--border-color] hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="h-32 bg-gray-500/20 rounded-lg mb-4 flex items-center justify-center">
                      {/* Placeholder for course image */}
                      <Book className="w-8 h-8 text-gray-500" />
                    </div>
                    <h4 className="font-bold text-[--text-primary] mb-1">Курс {i}</h4>
                    <p className="text-sm text-[--text-secondary]">Продолжить обучение</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="!p-6 bg-gradient-to-br from-[--accent-from]/5 to-[--accent-to]/5 border-[--accent-from]/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[--text-primary]">
                <Award className="w-5 h-5 text-yellow-500" /> Достижения
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/50">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[--text-primary]">Первый шаг</h4>
                    <p className="text-xs text-[--text-secondary]">Зарегистрироваться на платформе</p>
                  </div>
                </div>
                <div className={`flex items-center gap-4 ${!hasHardworker ? 'opacity-50 grayscale' : ''}`}>
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
                    <Award className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[--text-primary]">Трудяга</h4>
                    <p className="text-xs text-[--text-secondary]">Набрать 50 XP (сейчас: {xp}/50)</p>
                  </div>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-4 text-sm text-[--accent-from]">Все достижения</Button>
            </Card>

            <Card className={user?.telegram_chat_id ? "!p-6 bg-green-500/10 border-green-500/20 relative overflow-hidden" : "!p-6 bg-[#0088cc]/10 border-[#0088cc]/20 relative overflow-hidden group"}>
              <div className={`absolute -right-6 -top-6 transition-transform ${user?.telegram_chat_id ? "text-green-500/10" : "text-[#0088cc]/10 group-hover:scale-110"}`}>
                <Send className="w-32 h-32" />
              </div>
              <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 relative z-10 ${user?.telegram_chat_id ? "text-green-500" : "text-[#0088cc]"}`}>
                <Send className="w-5 h-5" /> Telegram Бот
              </h3>
              
              {user?.telegram_chat_id ? (
                <div>
                  <p className="text-sm text-[--text-secondary] mb-4 relative z-10">
                    Ваш аккаунт успешно привязан! Вы будете получать уведомления.
                  </p>
                  <Button disabled className="w-full bg-green-500/20 text-green-500 border-none relative z-10 cursor-default opacity-100">
                    Привязан
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-[--text-secondary] mb-4 relative z-10">
                    Привяжите аккаунт, чтобы получать напоминания о дедлайнах и уведомления об XP!
                  </p>
                  <a href="https://t.me/mentoria_hackaton_bot" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-[#0088cc] hover:bg-[#0077b3] text-white border-none relative z-10">
                      Привязать Telegram
                    </Button>
                  </a>
                </div>
              )}
            </Card>

            <Card className="!p-6">
              <h3 className="text-lg font-bold mb-4 text-[--text-primary]">Учебный стрик</h3>
              <div className="flex justify-center items-center gap-2 mb-4">
                <span className="text-4xl font-black text-orange-500">3</span>
                <span className="text-[--text-secondary] mt-2">дня</span>
              </div>
              <div className="flex justify-between">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d, i) => (
                  <div key={d} className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-orange-500 text-white' : 'bg-[--border-color] text-[--text-secondary]'
                      }`}>
                      {i < 3 && '🔥'}
                    </div>
                    <span className="text-[10px] text-[--text-secondary]">{d}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
