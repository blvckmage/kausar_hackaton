import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Filter, Calendar as CalendarIcon, Clock, Bell } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { Skeleton } from '../components/ui/Skeleton';

type ViewMode = 'month' | 'week' | 'day';

export function Calendar() {
  const [view, setView] = useState<ViewMode>('month');
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase.from('calendar_events').select('*').order('date', { ascending: true });
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Календарь Дедлайнов</h1>
            <p className="text-gray-400">Планируйте свое время и не пропускайте важные события</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="secondary" className="gap-2">
              <Filter className="w-4 h-4" /> Фильтры
            </Button>
            <Button className="gap-2">
              <Bell className="w-4 h-4" /> Напомнить
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Calendar Area */}
          <div className="lg:col-span-3">
            <Card className="!p-0 overflow-hidden flex flex-col h-full">
              {/* Calendar Header */}
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-white">Октябрь 2026</h2>
                  <div className="flex gap-1">
                    <button className="p-1 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
                    <button className="p-1 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"><ChevronRight className="w-5 h-5" /></button>
                  </div>
                </div>
                
                {/* View switcher */}
                <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
                  {(['month', 'week', 'day'] as ViewMode[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={cn(
                        'px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 capitalize',
                        view === v 
                          ? 'bg-gradient-to-r from-[--accent-from]/80 to-[--accent-to]/80 text-white shadow-lg' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      )}
                    >
                      {v === 'month' ? 'Месяц' : v === 'week' ? 'Неделя' : 'День'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar Grid (Mockup for Month view) */}
              <div className="p-4 grid grid-cols-7 gap-2 flex-grow min-h-[500px]">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 mb-2">{day}</div>
                ))}
                
                {/* Empty cells for padding */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[100px] p-2 rounded-xl border border-white/5 bg-white/[0.01]" />
                ))}
                
                {/* Days */}
                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1;
                  // Filter events that happen on this day in Oct 2026
                  const dayEvents = events.filter(e => {
                    const eventDate = new Date(e.date);
                    return eventDate.getFullYear() === 2026 && eventDate.getMonth() === 9 && eventDate.getDate() === day;
                  });
                  
                  return (
                    <div 
                      key={day} 
                      className={cn(
                        "min-h-[100px] p-2 rounded-xl border transition-colors relative group",
                        day === 12 ? "bg-[--accent-from]/10 border-[--accent-from]/30" : "border-white/5 hover:border-white/10 hover:bg-white/[0.03]"
                      )}
                    >
                      <span className={cn(
                        "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1",
                        day === 12 ? "bg-[--accent-from] text-white" : "text-gray-400 group-hover:text-white"
                      )}>{day}</span>
                      
                      {/* Event indicators */}
                      <div className="space-y-1">
                        {dayEvents.map(event => (
                          <div key={event.id} className={cn("text-xs px-2 py-1 rounded border truncate", event.color)}>
                            {event.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="!p-5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[--accent-to]" /> Предстоящие
              </h3>
              <div className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))
                ) : events.length === 0 ? (
                  <p className="text-sm text-gray-500">Нет предстоящих событий</p>
                ) : (
                  events.map(event => (
                    <div key={event.id} className="group cursor-pointer">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{event.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded border ml-auto", event.color)}>
                          {event.type}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-sm text-gray-400 hover:text-white">Показать все</Button>
            </Card>

            <Card className="!p-5 bg-gradient-to-br from-[--accent-from]/10 to-transparent border-[--accent-from]/20">
              <h3 className="text-lg font-bold text-white mb-2">Синхронизация</h3>
              <p className="text-sm text-gray-400 mb-4">Добавьте расписание в свой Google Calendar или Apple Calendar</p>
              <Button className="w-full text-sm">Подключить</Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
