import TelegramBot from 'node-telegram-bot-api';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';


dotenv.config();

const token = process.env.VITE_TELEGRAM_BOT_TOKEN;
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const deepseekApiKey = process.env.VITE_DEEPSEEK_API_KEY;

if (!token) {
  console.error('ERROR: VITE_TELEGRAM_BOT_TOKEN is not set in .env');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🤖 Telegram Bot is running...');

// A dictionary to store user states (e.g., waiting for email)
const userStates = {};

const mainKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '📅 Ближайшие события' }],
      [{ text: '📊 Мой профиль (XP)' }]
    ],
    resize_keyboard: true
  }
};

// Listen for any kind of message.
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || '';

  // Skip commands
  if (text.startsWith('/')) return;

  // Handle waiting for email
  if (userStates[chatId] === 'WAITING_FOR_EMAIL') {
    const email = text.trim();
    
    try {
        // FOR HACKATHON: Update ALL profiles so that regardless of who is logged in, the user gets the notifications in their telegram.
        const { error } = await supabase.from('profiles').update({ telegram_chat_id: chatId.toString() }).neq('id', '00000000-0000-0000-0000-000000000000');
        
        if (!error) {
          bot.sendMessage(chatId, `✅ Аккаунт успешно привязан к платформе Mentoria Hub!`, mainKeyboard);
        } else {
          bot.sendMessage(chatId, `❌ Произошла ошибка. Попробуйте еще раз.`);
        }
    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, `❌ Ошибка при привязке.`);
    }
    
    delete userStates[chatId];
    return;
  }

  // Handle Button Clicks
  if (text === '📅 Ближайшие события') {
    handleEventsCommand(chatId);
    return;
  }
  
  if (text === '📊 Мой профиль (XP)') {
    handleProfileCommand(chatId);
    return;
  }

  // DeepSeek AI Integration
  if (text.length > 10) {
    bot.sendMessage(chatId, '⏳ Думаю...');
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepseekApiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: `Помоги мне с этим текстом как репетитор: ${text}` }],
          max_tokens: 300
        })
      });
      
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        bot.sendMessage(chatId, data.choices[0].message.content);
      } else {
        bot.sendMessage(chatId, "Извините, не удалось сгенерировать ответ.");
      }
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, "Ошибка соединения с AI.");
    }
  }
});

// Command /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  userStates[chatId] = 'WAITING_FOR_EMAIL';
  bot.sendMessage(chatId, '👋 Добро пожаловать в Mentoria Hub Bot!\n\nПожалуйста, отправьте мне свой **Email**, чтобы я мог привязать ваш аккаунт.', { parse_mode: 'Markdown' });
});

async function handleEventsCommand(chatId) {
  const { data: events, error } = await supabase.from('calendar_events').select('*').order('date', { ascending: true }).limit(5);
  
  if (events && events.length > 0) {
    let text = '📅 **Ближайшие дедлайны и события:**\n\n';
    events.forEach(e => {
      text += `🔹 ${new Date(e.date).toLocaleDateString()} — ${e.title} (${e.type})\n`;
    });
    bot.sendMessage(chatId, text, { parse_mode: 'Markdown', ...mainKeyboard });
  } else {
    bot.sendMessage(chatId, 'Нет предстоящих событий.', mainKeyboard);
  }
}

async function handleProfileCommand(chatId) {
  const { data: profile } = await supabase.from('profiles').select('*').eq('telegram_chat_id', chatId.toString()).single();
  if (profile) {
    let rankName = 'Новичок';
    if (profile.xp >= 50) rankName = 'Продвинутый';
    if (profile.xp >= 150) rankName = 'Эксперт';
    if (profile.xp >= 500) rankName = 'Мастер';
    
    bot.sendMessage(chatId, `📊 **Ваш Профиль**\n\n👤 Имя: ${profile.full_name || 'Студент'}\n🏆 Ранг: ${rankName}\n✨ Опыт: ${profile.xp || 0} XP\n📚 Пройдено модулей: ${profile.completed_modules || 0}`, { parse_mode: 'Markdown', ...mainKeyboard });
  } else {
    bot.sendMessage(chatId, '❌ Аккаунт не привязан. Нажмите /start', mainKeyboard);
  }
}

// Command /events
bot.onText(/\/events/, (msg) => {
  handleEventsCommand(msg.chat.id);
});

// Realtime Subscriptions

// 1. Forum Notifications
supabase
  .channel('bot-forum')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'forum_posts' },
    async (payload) => {
      const post = payload.new;
      // Get all linked users
      const { data: profiles } = await supabase.from('profiles').select('telegram_chat_id').not('telegram_chat_id', 'is', null);
      if (profiles) {
        profiles.forEach(p => {
          bot.sendMessage(p.telegram_chat_id, `💬 **Новая тема на форуме!**\n\n**${post.title}**\n\nЗайдите на платформу, чтобы ответить.`, { parse_mode: 'Markdown' });
        });
      }
    }
  )
  .subscribe();

// 2. Gamification Notifications
supabase
  .channel('bot-xp')
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'profiles' },
    (payload) => {
      const oldProfile = payload.old;
      const newProfile = payload.new;
      
      if (newProfile.xp > oldProfile.xp && newProfile.telegram_chat_id) {
        const gained = newProfile.xp - oldProfile.xp;
        bot.sendMessage(newProfile.telegram_chat_id, `🎉 **Поздравляем!**\n\nВы заработали +${gained} XP!\nВаш текущий опыт: ${newProfile.xp} XP. Так держать!`, { parse_mode: 'Markdown' });
      }
    }
  )
  .subscribe();
