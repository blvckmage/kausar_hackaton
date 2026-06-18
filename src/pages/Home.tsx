import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Brain, Calendar, Trophy, CheckCircle2, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { Navbar } from '../components/layout/Navbar';
import { useTranslation } from 'react-i18next';

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    
    setIsAiLoading(true);
    setAiResponse('');
    
    // Call DeepSeek API
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
            { role: 'system', content: 'Ты - продвинутый ИИ-ментор образовательной платформы Mentoria Hub. Твоя задача: помогать школьникам и студентам с поступлением, выбором олимпиад, подготовкой к экзаменам (SAT, IELTS, ЕНТ) и стажировками. Отвечай кратко, структурированно, дружелюбно и мотивирующе. Старайся уложиться в 2-3 небольших абзаца.' },
            { role: 'user', content: aiQuery }
          ],
          max_tokens: 250
        })
      });
      
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setAiResponse(data.choices[0].message.content);
      } else {
        setAiResponse("Извините, не удалось получить ответ. Попробуйте еще раз.");
      }
    } catch (error) {
      console.error(error);
      setAiResponse("Ошибка соединения с AI.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[--accent-from] opacity-20 blur-[120px] animate-blob" />
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] rounded-full bg-[--accent-to] opacity-20 blur-[120px] animate-blob-delayed" />
      </div>

      <Navbar />

      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center py-16 md:py-24 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[--accent-to]" />
            <span className="text-sm font-medium text-gray-300">{t('home.badge')}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            {t('home.title1')} <br className="hidden md:block" />
            <span className="gradient-text glow-text">{t('home.title2')}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            {t('home.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button size="lg" className="w-full sm:w-auto gap-2" onClick={() => navigate('/register')}>
              {t('home.start_free')} <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto" onClick={() => navigate('/olympiads')}>
              {t('home.explore')}
            </Button>
          </div>

          {/* AI Search Interface */}
          <div className="max-w-2xl mx-auto mb-16">
            <Card className="!p-2 shadow-2xl shadow-[--accent-from]/10 relative z-10">
              <form onSubmit={handleAiSubmit} className="relative flex items-center">
                <Brain className="absolute left-4 w-6 h-6 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder={t('home.ai_placeholder')}
                  className="w-full bg-transparent border-none py-4 pl-14 pr-32 text-white placeholder:text-gray-500 focus:outline-none focus:ring-0 text-lg relative z-10"
                />
                <Button 
                  type="submit" 
                  className="absolute right-2 z-20 cursor-pointer"
                  disabled={isAiLoading || !aiQuery.trim()}
                >
                  {isAiLoading ? t('home.ai_loading') : t('home.ai_button')}
                </Button>
              </form>
              
              {/* AI Response Area */}
              {aiResponse && (
                <div className="mt-4 p-6 bg-white/5 rounded-xl text-left border border-white/10 animate-fade-in-up relative z-10">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[--accent-from]/20 rounded-lg shrink-0">
                      <Sparkles className="w-5 h-5 text-[--accent-from]" />
                    </div>
                    <div>
                      <p className="text-gray-200 whitespace-pre-line leading-relaxed">{aiResponse}</p>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="w-full text-xs" onClick={() => navigate('/forum')}>{t('home.search')}</Button>
                        <Button size="sm" variant="secondary" className="w-full text-xs" onClick={() => navigate('/olympiads')}>{t('home.courses_btn')}</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[--accent-to]" />
              <span>{t('home.feature1')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[--accent-to]" />
              <span>{t('home.feature2')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[--accent-to]" />
              <span>{t('home.feature3')}</span>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: t('home.students'), value: 10000, suffix: '+' },
            { label: t('home.materials'), value: 500, suffix: '+' },
            { label: t('home.success'), value: 2500, suffix: '+' },
            { label: t('home.hours'), value: 50000, suffix: '+' },
          ].map((stat, i) => (
            <Card key={i} delay={i * 100} className="text-center p-6">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 relative z-10">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-gray-400 relative z-10">{stat.label}</div>
            </Card>
          ))}
        </section>

        {/* Features */}
        <section className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('home.all_in_one')}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              {t('home.all_in_one_sub')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card delay={100}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[--accent-from] to-[--accent-to] flex items-center justify-center mb-6 relative z-10">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white relative z-10">{t('home.calendar_title')}</h3>
              <p className="text-gray-400 relative z-10">
                {t('home.calendar_desc')}
              </p>
            </Card>

            <Card delay={200}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[--accent-from] to-[--accent-to] flex items-center justify-center mb-6 relative z-10">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white relative z-10">{t('home.cert_title')}</h3>
              <p className="text-gray-400 relative z-10">
                {t('home.cert_desc')}
              </p>
            </Card>

            <Card delay={300}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[--accent-from] to-[--accent-to] flex items-center justify-center mb-6 relative z-10">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white relative z-10">{t('home.forum_title')}</h3>
              <p className="text-gray-400 relative z-10">
                {t('home.forum_desc')}
              </p>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <Card className="text-center py-16 px-4 !bg-gradient-to-br from-[--accent-from]/20 to-[--accent-to]/20 border-[--accent-from]/30">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white glow-text relative z-10">{t('home.cta_title')}</h2>
            <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg relative z-10">
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
      <footer className="border-t border-white/10 bg-[#0a0a0f]/50 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>{t('home.footer')}</p>
        </div>
      </footer>
    </div>
  );
}
