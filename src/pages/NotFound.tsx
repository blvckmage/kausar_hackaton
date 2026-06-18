import { ArrowLeft, Ghost } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-full bg-red-500/10 blur-[120px] animate-blob" />
        <div className="absolute bottom-[20%] right-[30%] w-[30%] h-[40%] rounded-full bg-[--accent-to] opacity-10 blur-[120px] animate-blob-delayed" />
      </div>

      <div className="text-center animate-fade-in-up">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Ghost className="w-32 h-32 text-gray-700 animate-bounce" strokeWidth={1} />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/20 rounded-[100%] blur-sm" />
          </div>
        </div>
        
        <h1 className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-500 to-gray-800 mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Страница не найдена
        </h2>
        <p className="text-gray-400 mb-10 max-w-md mx-auto">
          Похоже, вы забрели в неизведанную часть платформы. Давайте вернемся к знаниям.
        </p>

        <Button size="lg" onClick={() => navigate('/')} className="gap-2">
          <ArrowLeft className="w-5 h-5" /> Вернуться на главную
        </Button>
      </div>
    </div>
  );
}
