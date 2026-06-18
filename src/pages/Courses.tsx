import { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, PlayCircle, Clock, Star, BookOpen, ChevronLeft, ChevronDown, ChevronRight, Video } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

import { useStore } from '../store/useStore';
import { Skeleton } from '../components/ui/Skeleton';

export function Courses() {
  const user = useStore((state) => state.user);
  const initializeAuth = useStore((state) => state.initializeAuth);
  const [activeTab, setActiveTab] = useState<'all' | 'sat' | 'ielts' | 'it'>('all');
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  // Detail View State
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [activeLesson, setActiveLesson] = useState<any | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [uiError, setUiError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          course_modules (
            *,
            course_lessons (*)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const openCourse = (course: any) => {
    setSelectedCourse(course);
    // Find the first lesson to auto-play if available
    let firstLesson = null;
    if (course.course_modules && course.course_modules.length > 0) {
      const sortedModules = [...course.course_modules].sort((a,b) => a.order_index - b.order_index);
      for (const mod of sortedModules) {
        if (mod.course_lessons && mod.course_lessons.length > 0) {
          firstLesson = [...mod.course_lessons].sort((a,b) => a.order_index - b.order_index)[0];
          break;
        }
      }
    }
    setActiveLesson(firstLesson);
    window.scrollTo(0, 0);
  };

  const handleCompleteLesson = async () => {
    setUiError(null);
    if (!user) {
      setUiError("Сначала войдите в систему, чтобы сохранять прогресс.");
      return;
    }
    
    setIsCompleting(true);
    try {
      // Optimistic or simple update to profile XP
      const newXp = (user.xp || 0) + 10;
      const newModules = (user.completed_modules || 0) + 1;
      
      const { error } = await supabase
        .from('profiles')
        .update({ xp: newXp, completed_modules: newModules })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Re-fetch user to update UI globally
      initializeAuth();
      alert("Поздравляем! Вы прошли урок и получили +10 XP! 🎉");
      
    } catch (err: any) {
      console.error(err);
      setUiError(err.message || "Неизвестная ошибка БД");
    } finally {
      setIsCompleting(false);
    }
  };

  if (selectedCourse) {
    // Render Detailed Course View
    const sortedModules = selectedCourse.course_modules ? [...selectedCourse.course_modules].sort((a,b) => a.order_index - b.order_index) : [];

    return (
      <div className="min-h-screen bg-[#050508]">
        <Navbar />
        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <button 
            onClick={() => setSelectedCourse(null)} 
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> Вернуться к списку курсов
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Video Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl">
                {activeLesson?.video_url ? (
                  <iframe 
                    src={activeLesson.video_url} 
                    className="w-full h-full"
                    allowFullScreen
                    title={activeLesson.title}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                    <Video className="w-16 h-16 mb-4 opacity-20" />
                    <p>Выберите урок из списка справа</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{activeLesson ? activeLesson.title : selectedCourse.title}</h1>
                  <p className="text-gray-400">{activeLesson?.content || selectedCourse.description}</p>
                  {uiError && <p className="text-red-500 font-bold mt-2 bg-red-500/10 p-2 rounded border border-red-500/50">{uiError}</p>}
                </div>
                {activeLesson && (
                  <Button 
                    onClick={handleCompleteLesson} 
                    disabled={isCompleting || !user}
                    className="bg-green-500 hover:bg-green-600 text-white border-none shrink-0"
                  >
                    {isCompleting ? 'Сохранение...' : 'Завершить урок (+10 XP)'}
                  </Button>
                )}
              </div>
            </div>

            {/* Sidebar Modules */}
            <div className="lg:col-span-1">
              <Card className="!p-4 h-[600px] overflow-y-auto flex flex-col gap-2">
                <h3 className="text-lg font-bold text-white mb-4 px-2">Программа курса</h3>
                {sortedModules.map((mod: any) => {
                  const isExpanded = expandedModules[mod.id];
                  const sortedLessons = mod.course_lessons ? [...mod.course_lessons].sort((a,b) => a.order_index - b.order_index) : [];

                  return (
                    <div key={mod.id} className="border border-white/5 bg-white/[0.02] rounded-xl overflow-hidden">
                      <button 
                        onClick={() => toggleModule(mod.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                      >
                        <span className="font-medium text-left text-gray-200">{mod.title}</span>
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                      </button>

                      {isExpanded && (
                        <div className="flex flex-col border-t border-white/5">
                          {sortedLessons.map((lesson: any) => {
                            const isActive = activeLesson?.id === lesson.id;
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => setActiveLesson(lesson)}
                                className={cn(
                                  "flex items-center gap-3 p-3 pl-8 text-sm text-left transition-colors",
                                  isActive ? "bg-[--accent-from]/10 text-[--accent-to] border-l-2 border-[--accent-to]" : "text-gray-400 hover:bg-white/5 hover:text-white"
                                )}
                              >
                                <PlayCircle className="w-4 h-4 shrink-0" />
                                {lesson.title}
                              </button>
                            );
                          })}
                          {sortedLessons.length === 0 && (
                            <p className="p-3 pl-8 text-xs text-gray-500">Нет уроков</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Render List View
  const filteredCourses = courses;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Видеокурсы</h1>
            <p className="text-gray-400">Лучшие материалы для вашей подготовки</p>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Поиск курсов..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[--accent-from] transition-colors"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {isLoading ? (
            // Skeleton Loading
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={`skel-${i}`} className="!p-0 overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex gap-4 pt-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              </Card>
            ))
          ) : (
            filteredCourses.map((course, i) => (
              <Card 
                key={course.id} 
                delay={i * 100} 
                onClick={() => openCourse(course)}
                className="!p-0 overflow-hidden group cursor-pointer hover:border-[--accent-from]/50 transition-colors"
              >
              <div className={cn("h-48 relative flex items-center justify-center", course.thumbnail || 'bg-white/5')}>
                <PlayCircle className="w-16 h-16 text-white/50 group-hover:text-white group-hover:scale-110 transition-all" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white leading-tight group-hover:text-[--accent-to] transition-colors">
                    {course.title}
                  </h3>
                </div>
                
                <p className="text-gray-400 text-sm mb-6 flex items-center gap-2 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <PlayCircle className="w-4 h-4" />
                    <span>{course.course_modules?.reduce((acc: number, mod: any) => acc + (mod.course_lessons?.length || 0), 0) || 0} уроков</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span>5.0</span>
                  </div>
                </div>

                <Button className="w-full">
                  Начать просмотр
                </Button>
              </div>
            </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
