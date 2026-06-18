import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ru: {
    translation: {
      nav: {
        courses: "Курсы",
        olympiads: "Олимпиады",
        calendar: "Календарь",
        forum: "Форум",
        admin: "Админка",
        login: "Войти",
        start: "Начать",
        profile: "Профиль",
        logout: "Выйти"
      },
      home: {
        badge: "Платформа нового поколения",
        title1: "Твой путь к",
        title2: "успеху начинается здесь",
        subtitle: "Подготовка к олимпиадам, поиск стажировок и умный AI-ассистент, который всегда готов помочь и составить план.",
        start_free: "Начать бесплатно",
        explore: "Изучить возможности",
        ai_placeholder: "Спроси AI: Как подготовиться к SAT?",
        ai_button: "Спросить",
        ai_loading: "Думает...",
        search: "Искать",
        courses_btn: "Курсы",
        feature1: "Бесплатный доступ",
        feature2: "Умные рекомендации",
        feature3: "Сообщество единомышленников",
        students: "Активных учеников",
        materials: "Материалов и курсов",
        success: "Успешных поступлений",
        hours: "Часов сэкономлено",
        all_in_one: "Всё необходимое в одном месте",
        all_in_one_sub: "Мы объединили инструменты, которые помогут вам достичь целей быстрее и эффективнее.",
        calendar_title: "Умный Календарь",
        calendar_desc: "Все дедлайны олимпиад, конкурсов и стажировок. Настраиваемые уведомления и синхронизация с вашим расписанием.",
        cert_title: "Сертификаты",
        cert_desc: "Проходите курсы и автоматически получайте красивые сертификаты в формате PDF для вашего портфолио.",
        forum_title: "Форум и AI-Саммари",
        forum_desc: "Общайтесь с менторами, задавайте вопросы. ИИ автоматически сократит длинные дискуссии и выдаст суть.",
        cta_title: "Готовы начать свой путь?",
        cta_desc: "Присоединяйтесь к тысячам студентов, которые уже достигают своих целей вместе с Mentoria Hub.",
        cta_register: "Регистрация бесплатно",
        cta_more: "Узнать больше",
        footer: "© 2026 Mentoria Hub. Все права защищены."
      },
      auth: {
        welcome_back: "С возвращением!",
        enter_details: "Введите свои данные для входа",
        email: "Email",
        password: "Пароль",
        forgot_password: "Забыли пароль?",
        login_btn: "Войти",
        login_loading: "Вход...",
        no_account: "Нет аккаунта?",
        register_link: "Зарегистрироваться",
        create_account: "Создать аккаунт",
        join_platform: "Присоединяйтесь к платформе возможностей",
        name: "Имя и Фамилия",
        register_btn: "Зарегистрироваться",
        register_loading: "Создание...",
        has_account: "Уже есть аккаунт?",
        login_link: "Войти"
      }
    }
  },
  kz: {
    translation: {
      nav: {
        courses: "Курстар",
        olympiads: "Олимпиадалар",
        calendar: "Күнтізбе",
        forum: "Форум",
        admin: "Админ панель",
        login: "Кіру",
        start: "Бастау",
        profile: "Профиль",
        logout: "Шығу"
      },
      home: {
        badge: "Жаңа буын платформасы",
        title1: "Сенің табысқа",
        title2: "апарар жолың осы жерден басталады",
        subtitle: "Олимпиадаларға дайындық, тағылымдама іздеу және әрқашан көмектесуге дайын ақылды AI-көмекшісі.",
        start_free: "Тегін бастау",
        explore: "Мүмкіндіктерді зерттеу",
        ai_placeholder: "AI-дан сұра: SAT-қа қалай дайындалу керек?",
        ai_button: "Сұрау",
        ai_loading: "Ойлануда...",
        search: "Іздеу",
        courses_btn: "Курстар",
        feature1: "Тегін қолжетімділік",
        feature2: "Ақылды ұсыныстар",
        feature3: "Пікірлестер қауымдастығы",
        students: "Белсенді оқушылар",
        materials: "Материалдар мен курстар",
        success: "Сәтті түскендер",
        hours: "Үнемделген сағаттар",
        all_in_one: "Барлық қажеттілік бір жерде",
        all_in_one_sub: "Мақсаттарыңызға тезірек жетуге көмектесетін құралдарды біріктірдік.",
        calendar_title: "Ақылды Күнтізбе",
        calendar_desc: "Барлық олимпиадалардың, байқаулардың және тағылымдамалардың мерзімдері.",
        cert_title: "Сертификаттар",
        cert_desc: "Курстардан өтіп, портфолиоңызға арналған әдемі PDF сертификаттарды алыңыз.",
        forum_title: "Форум және AI-Түйіндеме",
        forum_desc: "Тәлімгерлермен сөйлесіңіз. ИИ ұзақ пікірталастарды қысқартып, негізгі ойды береді.",
        cta_title: "Жолыңызды бастауға дайынсыз ба?",
        cta_desc: "Mentoria Hub-пен бірге мақсаттарына жетіп жатқан мыңдаған студенттерге қосылыңыз.",
        cta_register: "Тегін тіркелу",
        cta_more: "Көбірек білу",
        footer: "© 2026 Mentoria Hub. Барлық құқықтар қорғалған."
      },
      auth: {
        welcome_back: "Қайта оралуыңызбен!",
        enter_details: "Кіру үшін мәліметтеріңізді енгізіңіз",
        email: "Email",
        password: "Құпия сөз",
        forgot_password: "Құпия сөзді ұмыттыңыз ба?",
        login_btn: "Кіру",
        login_loading: "Кіруде...",
        no_account: "Аккаунтыңыз жоқ па?",
        register_link: "Тіркелу",
        create_account: "Аккаунт жасау",
        join_platform: "Мүмкіндіктер платформасына қосылыңыз",
        name: "Аты және Тегі",
        register_btn: "Тіркелу",
        register_loading: "Жасалуда...",
        has_account: "Аккаунтыңыз бар ма?",
        login_link: "Кіру"
      }
    }
  },
  en: {
    translation: {
      nav: {
        courses: "Courses",
        olympiads: "Olympiads",
        calendar: "Calendar",
        forum: "Forum",
        admin: "Admin Panel",
        login: "Log in",
        start: "Get Started",
        profile: "Profile",
        logout: "Log out"
      },
      home: {
        badge: "Next Generation Platform",
        title1: "Your path to",
        title2: "success starts here",
        subtitle: "Preparation for olympiads, internship search, and a smart AI assistant ready to help and build your plan.",
        start_free: "Start for free",
        explore: "Explore features",
        ai_placeholder: "Ask AI: How to prepare for SAT?",
        ai_button: "Ask",
        ai_loading: "Thinking...",
        search: "Search",
        courses_btn: "Courses",
        feature1: "Free access",
        feature2: "Smart recommendations",
        feature3: "Like-minded community",
        students: "Active students",
        materials: "Materials & courses",
        success: "Successful admissions",
        hours: "Hours saved",
        all_in_one: "Everything you need in one place",
        all_in_one_sub: "We integrated tools that will help you achieve your goals faster and more efficiently.",
        calendar_title: "Smart Calendar",
        calendar_desc: "All deadlines for olympiads, competitions, and internships. Custom notifications.",
        cert_title: "Certificates",
        cert_desc: "Complete courses and automatically receive beautiful PDF certificates for your portfolio.",
        forum_title: "Forum & AI Summary",
        forum_desc: "Chat with mentors. AI automatically summarizes long discussions to give you the essence.",
        cta_title: "Ready to start your journey?",
        cta_desc: "Join thousands of students who are already achieving their goals with Mentoria Hub.",
        cta_register: "Register for free",
        cta_more: "Learn more",
        footer: "© 2026 Mentoria Hub. All rights reserved."
      },
      auth: {
        welcome_back: "Welcome back!",
        enter_details: "Enter your details to log in",
        email: "Email",
        password: "Password",
        forgot_password: "Forgot password?",
        login_btn: "Log in",
        login_loading: "Logging in...",
        no_account: "Don't have an account?",
        register_link: "Register",
        create_account: "Create an account",
        join_platform: "Join the platform of opportunities",
        name: "Full Name",
        register_btn: "Register",
        register_loading: "Creating...",
        has_account: "Already have an account?",
        login_link: "Log in"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
