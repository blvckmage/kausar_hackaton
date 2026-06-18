import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Brain, Calendar, Trophy, CheckCircle2, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { AIFloatingButton } from '../components/ui/AIFloatingButton';
import { Navbar } from '../components/layout/Navbar';
import { useTranslation } from 'react-i18next';

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    
    setIsAiLoading(true);
    setAiResponse('');
    
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'Ты - продвинутый ИИ-ментор. Помогай с учебой кратко и четко.' },
            { role: 'user', content: aiQuery }
          ],
          max_tokens: 250
        })
      });
      
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setAiResponse(data.choices[0].message.content);
      } else {
        setAiResponse("Извините, не удалось получить ответ.");
      }
    } catch (error) {
      console.error(error);
      setAiResponse("Ошибка соединения с AI.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-[var(--accent-glow-1)] blur-[150px] animate-blob" />
        <div className="absolute top-[40%] right-[-5%] w-[35%] h-[55%] rounded-full bg-[var(--accent-glow-2)] blur-[150px] animate-blob-delayed" />
      </div>

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        {/* Hero Section */}
        <div className="animate-fade-in-up flex flex-col items-center">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[var(--pill-bg)] border border-[var(--border-color)] mb-10 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span className="text-sm font-medium text-[var(--pill-text)]">{t('home.badge')}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-bold tracking-tight mb-10 leading-[1.1] text-[var(--text-main)]">
            {t('home.title1')} <br className="hidden md:block" />
            <span className="gradient-text-custom">{t('home.title2')}</span> {t('home.title3')}
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
            {t('home.subtitle')}
          </p>
        </div>

        {/* Statistics */}
        <section className="py-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: t('home.students'), value: 10000, suffix: '+' },
            { label: t('home.materials'), value: 500, suffix: '+' },
            { label: t('home.success'), value: 2500, suffix: '+' },
            { label: t('home.hours'), value: 50000, suffix: '+' },
          ].map((stat, i) => (
            <Card key={i} delay={i * 100} className="text-center p-6">
              <div className="text-3xl md:text-4xl font-bold text-[var(--text-main)] mb-2 relative z-10">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-[var(--text-muted)] relative z-10">{stat.label}</div>
            </Card>
          ))}
        </section>

        {/* Features */}
        <section className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[var(--text-main)]">{t('home.all_in_one')}</h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg">
              {t('home.all_in_one_sub')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card delay={100}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[--accent-from] to-[--accent-to] flex items-center justify-center mb-6 relative z-10">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--text-main)] relative z-10">{t('home.calendar_title')}</h3>
              <p className="text-[var(--text-muted)] relative z-10">
                {t('home.calendar_desc')}
              </p>
            </Card>

            <Card delay={200}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[--accent-from] to-[--accent-to] flex items-center justify-center mb-6 relative z-10">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--text-main)] relative z-10">{t('home.cert_title')}</h3>
              <p className="text-[var(--text-muted)] relative z-10">
                {t('home.cert_desc')}
              </p>
            </Card>

            <Card delay={300}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[--accent-from] to-[--accent-to] flex items-center justify-center mb-6 relative z-10">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--text-main)] relative z-10">{t('home.forum_title')}</h3>
              <p className="text-[var(--text-muted)] relative z-10">
                {t('home.forum_desc')}
              </p>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <Card className="text-center py-16 px-4 !bg-gradient-to-br from-[--accent-from]/20 to-[--accent-to]/20 border-[--accent-from]/30">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[var(--text-main)] relative z-10">{t('home.cta_title')}</h2>
            <p className="text-[var(--text-muted)] mb-10 max-w-2xl mx-auto text-lg relative z-10">
              {t('home.cta_desc')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Button size="lg" className="gap-2 cursor-pointer" onClick={() => navigate('/register')}>
                {t('home.cta_register')} <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="secondary" className="cursor-pointer" onClick={() => navigate('/olympiads')}>
                {t('home.cta_more')}
              </Button>
            </div>
          </Card>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--card-bg)] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[var(--text-muted)]">
          <p>{t('home.footer')}</p>
        </div>
      </footer>

      {/* Floating AI Button based on variant */}
      <AIFloatingButton variant={2} onClick={() => setIsAiOpen(!isAiOpen)} />
      
      {/* AI Chat Popup */}
      {isAiOpen && (
        <div className="fixed bottom-24 right-8 w-96 bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-6 shadow-2xl z-50 animate-fade-in-up">
          <h3 className="text-xl font-bold mb-4 text-[var(--text-main)]">AI Ментор</h3>
          
          <div className="max-h-60 overflow-y-auto mb-4">
            {aiResponse ? (
              <p className="text-[var(--text-muted)] text-sm whitespace-pre-wrap">{aiResponse}</p>
            ) : (
              <p className="text-[var(--text-muted)] text-sm italic">Сұрағыңызды қойыңыз / Задайте ваш вопрос...</p>
            )}
          </div>
          
          <form onSubmit={handleAiSubmit} className="flex gap-2">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="Сұрақ..."
              className="flex-1 bg-black/20 border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-main)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-glow-1)]"
            />
            <Button type="submit" disabled={isAiLoading || !aiQuery.trim()} size="sm">
              {isAiLoading ? '...' : 'Send'}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
