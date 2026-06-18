import { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MessageSquare, Sparkles, TrendingUp, Search, User, Clock, ThumbsUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { Skeleton } from '../components/ui/Skeleton';

export function Forum() {
  const user = useStore((state) => state.user);
  const [topics, setTopics] = useState<any[]>([]);
  const [isSummarizing, setIsSummarizing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTopics();

    // Subscribe to new posts
    const channel = supabase
      .channel('public:forum_posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'forum_posts' },
        (payload) => {
          // Add new post to the top (with a mock profile if needed, or fetch it)
          const newPost = payload.new;
          setTopics((current) => [newPost, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiSummary = async (topic: any) => {
    setIsSummarizing(topic.id);
    
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: `Summarize this forum post. Title: ${topic.title}. Content: ${topic.content}` }],
          max_tokens: 150
        })
      });
      
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        alert('AI Саммари:\n\n' + data.choices[0].message.content);
      } else {
        alert("Извините, не удалось сгенерировать саммари.");
      }
    } catch (error) {
      console.error(error);
      alert("Ошибка соединения с AI.");
    } finally {
      setIsSummarizing(null);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Войдите в систему, чтобы создать пост");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('forum_posts').insert([
        {
          title: newTitle,
          content: newContent,
          author_id: user.id,
          tags: ['Обсуждение']
        }
      ]);
      if (error) throw error;
      
      setIsCreating(false);
      setNewTitle('');
      setNewContent('');
      // No need to fetchTopics manually, realtime subscription will catch it
    } catch (err) {
      console.error(err);
      alert("Ошибка при создании поста");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Create Post Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[--bg-primary] border border-[--border-color] rounded-2xl w-full max-w-xl p-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-4">Создать тему</h2>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Заголовок</label>
                <input 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[--accent-from]" 
                  placeholder="О чем хотите поговорить?" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Содержимое</label>
                <textarea 
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[--accent-from] min-h-[150px]" 
                  placeholder="Опишите подробнее..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Отмена</Button>
                <Button type="submit" disabled={isSubmitting || !newTitle || !newContent}>
                  {isSubmitting ? 'Публикация...' : 'Опубликовать'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[--text-primary] mb-2">Форум</h1>
            <p className="text-[--text-secondary]">Общайтесь, делитесь опытом и получайте советы от сообщества</p>
          </div>
          <Button className="shrink-0 gap-2" onClick={() => user ? setIsCreating(true) : alert('Требуется авторизация')}>
            <MessageSquare className="w-4 h-4" /> Создать тему
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Искать в форуме..." 
                  className="w-full bg-[--bg-primary] border border-[--border-color] rounded-xl py-2 pl-12 pr-4 text-[--text-primary] focus:outline-none focus:border-[--accent-from]"
                />
              </div>
              <Button variant="secondary" className="hidden sm:flex gap-2">
                <TrendingUp className="w-4 h-4" /> Популярное
              </Button>
            </div>

            {isLoading ? (
              // Skeleton Loaders
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={`skeleton-${i}`} className="!p-5">
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-5 w-10" />
                      <Skeleton className="h-5 w-10" />
                    </div>
                  </div>
                </Card>
              ))
            ) : topics.length === 0 ? (
              <div className="text-center py-10 text-[--text-secondary]">
                Нет постов. Будьте первым, кто создаст тему!
              </div>
            ) : (
              topics.map((topic, i) => (
                <Card key={topic.id} delay={i * 100} className="!p-5 hover:border-[--accent-from]/50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-[--text-primary] group-hover:text-[--accent-from] transition-colors">{topic.title}</h3>
                    
                    {/* AI Summary Button */}
                    {topic.replies > 20 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAiSummary(topic); }}
                        disabled={isSummarizing === topic.id}
                        className="shrink-0 ml-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[--accent-from]/10 to-[--accent-to]/10 text-[--accent-from] border border-[--accent-from]/20 hover:bg-[--accent-from]/20 transition-colors text-xs font-medium"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {isSummarizing === topic.id ? 'Саммаризация...' : 'AI Саммари'}
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(topic.tags || []).map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 bg-[--bg-primary] border border-[--border-color] text-[--text-secondary] rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-[--text-secondary]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-[--border-color] flex items-center justify-center">
                          <User className="w-3 h-3 text-gray-400" />
                        </div>
                        <span className="font-medium text-[--text-primary]">{topic.profiles?.full_name || 'Неизвестный'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {new Date(topic.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 hover:text-[--accent-from]">
                        <ThumbsUp className="w-4 h-4" /> {topic.likes || 0}
                      </div>
                      <div className="flex items-center gap-1.5 hover:text-[--accent-from]">
                        <MessageSquare className="w-4 h-4" /> {topic.replies || 0}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="!p-5">
              <h3 className="font-bold text-[--text-primary] mb-4">Популярные теги</h3>
              <div className="flex flex-wrap gap-2">
                {['IELTS', 'ЕНТ', 'NUET', 'Стажировки', 'Резюме', 'Python', 'Математика', 'Мотивация'].map(tag => (
                  <button key={tag} className="px-3 py-1.5 bg-[--bg-primary] border border-[--border-color] hover:border-[--accent-from] hover:text-[--accent-from] text-[--text-secondary] rounded-full text-sm transition-colors">
                    {tag}
                  </button>
                ))}
              </div>
            </Card>

            {!user && (
              <Card className="!p-5 bg-gradient-to-br from-[--accent-from]/10 to-transparent border-[--accent-from]/20">
                <h3 className="font-bold text-[--text-primary] mb-2">Присоединяйтесь!</h3>
                <p className="text-sm text-[--text-secondary] mb-4">Зарегистрируйтесь, чтобы задавать вопросы и отвечать другим.</p>
                <Button className="w-full text-sm">Зарегистрироваться</Button>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
