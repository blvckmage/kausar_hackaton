import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/Button';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const notifications = useStore((state) => state.notifications);
  const markAsRead = useStore((state) => state.markAsRead);
  const clearNotifications = useStore((state) => state.clearNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[--text-secondary] hover:text-[--accent-from] hover:bg-[--accent-from]/10 rounded-full transition-colors focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[--bg-primary]"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[--bg-primary] border border-[--border-color] rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in-up">
          <div className="p-4 border-b border-[--border-color] flex justify-between items-center bg-[--bg-secondary]/50">
            <h3 className="font-bold text-[--text-primary] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[--accent-from]" />
              Уведомления
            </h3>
            {notifications.length > 0 && (
              <button 
                onClick={clearNotifications}
                className="text-xs text-[--text-secondary] hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Очистить
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-[--text-secondary]">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p>Нет новых уведомлений</p>
              </div>
            ) : (
              <div className="divide-y divide-[--border-color]">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 transition-colors hover:bg-[--bg-secondary]/50 ${!notification.read ? 'bg-[--accent-from]/5' : ''}`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <h4 className={`text-sm mb-1 ${!notification.read ? 'font-bold text-[--text-primary]' : 'text-[--text-primary]'}`}>
                          {notification.title}
                        </h4>
                        <p className="text-xs text-[--text-secondary] mb-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <span className="text-[10px] text-[--text-secondary] opacity-70">
                          {new Date(notification.date).toLocaleString('ru-RU')}
                        </span>
                      </div>
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="p-1.5 text-[--accent-from] hover:bg-[--accent-from]/20 rounded-full transition-colors tooltip-trigger"
                          title="Пометить как прочитанное"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-2 border-t border-[--border-color] bg-[--bg-secondary]/30 text-center">
            <button 
              onClick={() => setIsOpen(false)}
              className="text-xs text-[--text-secondary] hover:text-[--text-primary] flex items-center justify-center gap-1 w-full p-2"
            >
              <X className="w-3 h-3" /> Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
