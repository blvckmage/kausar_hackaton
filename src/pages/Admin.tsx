import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, BookOpen, Calendar as CalendarIcon, Award, Settings, BarChart3, MessageSquare, TrendingUp, Search, ArrowLeft, Trash2, Edit, Plus, X } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';

export function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  
  const [courses, setCourses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [olympiads, setOlympiads] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: coursesData } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (coursesData) setCourses(coursesData);

    const { data: usersData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (usersData) setUsers(usersData);

    const { data: olympiadsData } = await supabase.from('olympiads').select('*').order('created_at', { ascending: false });
    if (olympiadsData) setOlympiads(olympiadsData);

    const { data: eventsData } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (eventsData) setEvents(eventsData);
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm('Точно удалить?')) return;
    await supabase.from(table).delete().eq('id', id);
    fetchData();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'courses') {
        await supabase.from('courses').insert([{ title: formData.title, description: formData.description }]);
      } else if (activeTab === 'olympiads') {
        await supabase.from('olympiads').insert([{ title: formData.title, date: formData.date, description: formData.description }]);
      } else if (activeTab === 'calendar') {
        await supabase.from('events').insert([{ title: formData.title, date: formData.date }]);
      }
      setIsModalOpen(false);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Ошибка при создании');
    }
  };

  const openModal = () => {
    setFormData({});
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050508] flex relative">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0a0a0f] flex flex-col hidden md:flex z-20">
        <div className="p-6 border-b border-white/10">
          <span className="text-xl font-bold tracking-tight text-white cursor-pointer" onClick={() => navigate('/')}>
            Mentoria<span className="text-[--accent-from]">Admin</span>
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Дашборд' },
            { id: 'users', icon: Users, label: 'Пользователи' },
            { id: 'courses', icon: BookOpen, label: 'Курсы' },
            { id: 'olympiads', icon: Award, label: 'Олимпиады' },
            { id: 'calendar', icon: CalendarIcon, label: 'Календарь' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-[--accent-from]/20 to-transparent text-white border-l-2 border-[--accent-from]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[--accent-from]' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Вернуться на сайт</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <header className="h-16 border-b border-white/10 bg-[#0a0a0f]/50 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <h1 className="text-xl font-bold text-white capitalize">{
            activeTab === 'dashboard' ? 'Обзор системы' :
            activeTab === 'users' ? 'Управление пользователями' :
            activeTab === 'courses' ? 'Управление курсами' :
            activeTab === 'olympiads' ? 'Олимпиады и Стажировки' :
            activeTab === 'calendar' ? 'Календарь Дедлайнов' : activeTab
          }</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Всего регистраций', value: users.length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                  { label: 'Курсов', value: courses.length, icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                  { label: 'Олимпиад', value: olympiads.length, icon: Award, color: 'text-green-400', bg: 'bg-green-400/10' },
                  { label: 'Событий', value: events.length, icon: CalendarIcon, color: 'text-[--accent-to]', bg: 'bg-[--accent-to]/10' },
                ].map((stat, i) => (
                  <Card key={i} className="!p-6 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        <AnimatedCounter end={stat.value} />
                      </div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
             <div className="space-y-6 animate-fade-in-up">
               <Card className="!p-0 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-gray-400 text-sm border-b border-white/10">
                      <th className="p-4">Имя</th>
                      <th className="p-4">Роль</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-300">
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="p-4">{u.full_name || 'Не указано'}</td>
                        <td className="p-4 text-purple-400">{u.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               </Card>
             </div>
          )}

          {activeTab === 'courses' && (
             <div className="space-y-6 animate-fade-in-up">
               <div className="flex justify-end">
                 <Button onClick={openModal} className="gap-2"><Plus className="w-4 h-4"/> Создать курс</Button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {courses.map((course: any) => (
                   <Card key={course.id} className="!p-4 relative group">
                     <h3 className="font-bold text-white mb-2">{course.title}</h3>
                     <p className="text-sm text-gray-400 mb-4">{course.description || 'Нет описания'}</p>
                     <button onClick={() => handleDelete('courses', course.id)} className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 bg-red-500/20 text-red-500 rounded-md transition-all"><Trash2 className="w-4 h-4"/></button>
                   </Card>
                 ))}
               </div>
             </div>
          )}

          {activeTab === 'olympiads' && (
             <div className="space-y-6 animate-fade-in-up">
               <div className="flex justify-end">
                 <Button onClick={openModal} className="gap-2"><Plus className="w-4 h-4"/> Добавить олимпиаду</Button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {olympiads.map((o: any) => (
                   <Card key={o.id} className="!p-4 relative group">
                     <h3 className="font-bold text-white mb-2">{o.title}</h3>
                     <p className="text-xs text-[--accent-from] mb-2">{o.date}</p>
                     <p className="text-sm text-gray-400 mb-4">{o.description}</p>
                     <button onClick={() => handleDelete('olympiads', o.id)} className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 bg-red-500/20 text-red-500 rounded-md transition-all"><Trash2 className="w-4 h-4"/></button>
                   </Card>
                 ))}
               </div>
             </div>
          )}

          {activeTab === 'calendar' && (
             <div className="space-y-6 animate-fade-in-up">
               <div className="flex justify-end">
                 <Button onClick={openModal} className="gap-2"><Plus className="w-4 h-4"/> Добавить событие</Button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 {events.map((e: any) => (
                   <Card key={e.id} className="!p-4 flex justify-between items-center group">
                     <div>
                       <h3 className="font-bold text-white text-sm">{e.title}</h3>
                       <p className="text-xs text-gray-400">{e.date}</p>
                     </div>
                     <button onClick={() => handleDelete('events', e.id)} className="p-2 opacity-0 group-hover:opacity-100 bg-red-500/20 text-red-500 rounded-md transition-all"><Trash2 className="w-4 h-4"/></button>
                   </Card>
                 ))}
               </div>
             </div>
          )}
        </div>
      </main>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md animate-fade-in-up relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            <h2 className="text-xl font-bold text-white mb-6">Создать {activeTab === 'courses' ? 'Курс' : activeTab === 'olympiads' ? 'Олимпиаду' : 'Событие'}</h2>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Название</label>
                <input 
                  required
                  type="text" 
                  value={formData.title || ''}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-[--accent-from] outline-none" 
                />
              </div>

              {(activeTab === 'olympiads' || activeTab === 'calendar') && (
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Дата (например: 15 Октября)</label>
                  <input 
                    required
                    type="text" 
                    value={formData.date || ''}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-[--accent-from] outline-none" 
                  />
                </div>
              )}

              {(activeTab === 'courses' || activeTab === 'olympiads') && (
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Описание</label>
                  <textarea 
                    value={formData.description || ''}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-[--accent-from] outline-none min-h-[100px]" 
                  />
                </div>
              )}

              <Button type="submit" className="w-full mt-4">Сохранить</Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
