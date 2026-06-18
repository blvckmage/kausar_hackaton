import { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Filter, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

export function Olympiads() {
  const [activeTab, setActiveTab] = useState<'all' | 'olympiads' | 'internships'>('all');
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOlympiads();
  }, []);

  const fetchOlympiads = async () => {
    try {
      const { data, error } = await supabase.from('olympiads').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching olympiads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // We don't have type in DB yet, returning all for now
  const filteredOpts = activeTab === 'all' 
    ? opportunities 
    : opportunities;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[--text-primary] mb-4">Олимпиады и Стажировки</h1>
          <p className="text-lg text-[--text-secondary]">
            Найдите лучшие возможности для развития: от школьных олимпиад до стажировок в BigTech компаниях.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Поиск по названию или организатору..." 
              className="w-full bg-[--bg-primary] border border-[--border-color] rounded-xl py-3 pl-12 pr-4 text-[--text-primary] focus:outline-none focus:border-[--accent-from] transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="gap-2 shrink-0">
              <Filter className="w-4 h-4" /> Фильтры
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-[--border-color] pb-4 overflow-x-auto hide-scrollbar">
          {[
            { id: 'all', label: 'Все возможности' },
            { id: 'olympiads', label: 'Олимпиады' },
            { id: 'internships', label: 'Стажировки' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-[--accent-from] text-white" 
                  : "bg-transparent text-[--text-secondary] hover:bg-[--border-color]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredOpts.map((opt, i) => (
            <Card key={opt.id} delay={i * 100} className="!p-0 group cursor-pointer hover:border-[--accent-from]/50">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-white/10", opt.image)}>
                    {/* Placeholder Logo */}
                    <span className="text-2xl font-bold text-white opacity-80">{opt.organizer.charAt(0)}</span>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border",
                    opt.type === 'olympiad' ? "bg-purple-500/10 text-purple-500 border-purple-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"
                  )}>
                    {opt.type === 'olympiad' ? 'Олимпиада' : 'Стажировка'}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-[--text-primary] mb-2 group-hover:text-[--accent-from] transition-colors">{opt.title}</h3>
                <p className="text-[--text-secondary] mb-4">{opt.organizer}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {opt.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-[--bg-primary] border border-[--border-color] text-[--text-secondary] rounded-md text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-[--text-secondary] mb-6">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" /> {opt.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" /> {opt.location}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[--border-color]">
                  <Button variant="ghost" size="sm" className="text-[--text-secondary] hover:text-[--text-primary] -ml-4">
                    Добавить в календарь
                  </Button>
                  <div className="w-8 h-8 rounded-full bg-[--accent-from]/10 text-[--accent-from] flex items-center justify-center group-hover:bg-[--accent-from] group-hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
