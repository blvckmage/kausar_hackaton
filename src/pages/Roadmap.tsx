import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { useTranslation } from 'react-i18next';
import { Compass, BookOpen, Trophy, FlaskConical, Sun, Target, Code2, HeartHandshake, Briefcase, FolderCheck, Award, School, Star, Send, Mic, CheckCircle, BadgeDollarSign, Rocket, Route, Check } from 'lucide-react';

const ICONS = {
  compass: Compass,
  'book-open': BookOpen,
  trophy: Trophy,
  'flask-conical': FlaskConical,
  sun: Sun,
  target: Target,
  'code-2': Code2,
  'heart-handshake': HeartHandshake,
  briefcase: Briefcase,
  'folder-check': FolderCheck,
  award: Award,
  school: School,
  star: Star,
  send: Send,
  mic: Mic,
  'check-circle': CheckCircle,
  'badge-dollar-sign': BadgeDollarSign,
  rocket: Rocket,
};

const roadmapData = {
  '9': [
    {p:['Сентябрь–Ноябрь','September–November','Қыркүйек–Қараша'],t:['Изучи свои интересы','Explore your interests','Қызығушылығыңды ашы'],tag:['Старт','Start','Бастау'],icon:'compass',d:['Определи сильные стороны и выбери направление.','Find your strengths and pick a direction.','Күшті жақтарыңды анықтап, бағыт таңда.'],tasks:[['Пройди тест профориентации','Take a career-orientation test','Кәсіби бағдар тестінен өт'],['Запишись на 2 вводных курса','Enroll in 2 intro courses','2 кіріспе курсқа жазыл'],['Веди дневник целей','Keep a goals journal','Мақсат күнделігін жүргіз']]},
    {p:['Декабрь–Январь','December–January','Желтоқсан–Қаңтар'],t:['База знаний','Knowledge base','Білім негізі'],tag:['Учёба','Study','Оқу'],icon:'book-open',d:['Заложи прочный фундамент по ключевым предметам.','Build a solid foundation in key subjects.','Негізгі пәндерден берік іргетас қала.'],tasks:[['Подтяни математику и английский','Strengthen math and English','Математика мен ағылшынды күшейт'],['Учись 30 минут каждый день','Study 30 minutes daily','Күнде 30 минут оқы'],['Держи учебный стрик','Keep your study streak','Оқу сериясын ұста']]},
    {p:['Февраль–Март','February–March','Ақпан–Наурыз'],t:['Первая олимпиада','First olympiad','Алғашқы олимпиада'],tag:['Опыт','Experience','Тәжірибе'],icon:'trophy',d:['Попробуй силы в школьных турах.','Test yourself in school rounds.','Мектеп турларында күшіңді сына.'],tasks:[['Зарегистрируйся на школьный тур','Register for the school round','Мектеп туріне тіркел'],['Прорешай прошлые задания','Practice past problems','Бұрынғы есептерді шеш'],['Запиши результат в портфолио','Log the result in your portfolio','Нәтижені портфолиоға жаз']]},
    {p:['Апрель–Май','April–May','Сәуір–Мамыр'],t:['Мини-проект','Mini project','Шағын жоба'],tag:['Проект','Project','Жоба'],icon:'flask-conical',d:['Сделай небольшой проект по любимому предмету.','Build a small project in a favourite subject.','Ұнайтын пәннен шағын жоба жаса.'],tasks:[['Выбери тему','Pick a topic','Тақырып таңда'],['Сделай и оформи проект','Build and document it','Жобаны жасап, рәсімде'],['Получи обратную связь ментора','Get mentor feedback','Ментордан кері байланыс ал']]},
    {p:['Лето','Summer','Жаз'],t:['Летняя прокачка','Summer boost','Жазғы серпіліс'],tag:['Лето','Summer','Жаз'],icon:'sun',d:['Используй лето для роста.','Use summer to grow.','Жазды өсу үшін пайдалан.'],tasks:[['Запишись на летний онлайн-курс','Take a summer online course','Жазғы онлайн курсқа жазыл'],['Учи английский системно','Learn English consistently','Ағылшынды жүйелі үйрен'],['Прочитай 2 книги по интересам','Read 2 books on your interests','Қызығушылығың бойынша 2 кітап оқы']]}
  ],
  '10': [
    {p:['Осень','Autumn','Күз'],t:['Профильный фокус','Subject focus','Бейіндік фокус'],tag:['Фокус','Focus','Фокус'],icon:'target',d:['Выбери 1–2 направления и углубись.','Choose 1–2 directions and go deep.','1–2 бағыт таңдап, тереңде.'],tasks:[['Выбери профильные предметы','Pick your major subjects','Бейіндік пәндерді таңда'],['Пройди продвинутый курс','Take an advanced course','Жоғары деңгейлі курс өт'],['Найди ментора','Find a mentor','Ментор тап']]},
    {p:['Осень–Зима','Autumn–Winter','Күз–Қыс'],t:['Первый хакатон','First hackathon','Алғашқы хакатон'],tag:['Опыт','Experience','Тәжірибе'],icon:'code-2',d:['Получи командный опыт.','Gain team experience.','Командалық тәжірибе ал.'],tasks:[['Собери команду','Build a team','Команда жина'],['Участвуй в хакатоне','Join a hackathon','Хакатонға қатыс'],['Добавь проект в портфолио','Add the project to your portfolio','Жобаны портфолиоға қос']]},
    {p:['Зима','Winter','Қыс'],t:['Старт подготовки к тестам','Start test prep','Тестке дайындық басы'],tag:['Экзамены','Exams','Емтихандар'],icon:'book-open',d:['Начни системную подготовку к SAT/IELTS.','Begin systematic SAT/IELTS prep.','SAT/IELTS-ке жүйелі дайындал.'],tasks:[['Сдай входной тест','Take a diagnostic test','Кіріс тестін тапсыр'],['Составь план на 6 месяцев','Make a 6-month plan','6 айға жоспар құр'],['Занимайся 3 раза в неделю','Study 3 times a week','Аптасына 3 рет оқы']]},
    {p:['Весна','Spring','Көктем'],t:['Волонтёрство и impact','Volunteering & impact','Волонтёрлық пен impact'],tag:['Impact','Impact','Impact'],icon:'heart-handshake',d:['Покажи социальную активность.','Show social engagement.','Әлеуметтік белсенділік көрсет.'],tasks:[['Найди волонтёрский проект','Find a volunteer project','Волонтёрлық жоба тап'],['Набери 20+ часов','Log 20+ hours','20+ сағат жина'],['Опиши вклад в эссе','Describe your impact in an essay','Үлесіңді эссеге жаз']]},
    {p:['Лето','Summer','Жаз'],t:['Стажировка или летняя школа','Internship or summer school','Тағылымдама не жазғы мектеп'],tag:['Лето','Summer','Жаз'],icon:'briefcase',d:['Получи серьёзный опыт.','Get serious experience.','Салмақты тәжірибе ал.'],tasks:[['Подай на стажировку','Apply for an internship','Тағылымдамаға өтін'],['Или поступи в летнюю школу','Or join a summer school','Немесе жазғы мектепке түс'],['Собери рекомендации','Collect recommendations','Ұсыныс хаттарын жина']]}
  ],
  '11': [
    {p:['Осень','Autumn','Күз'],t:['Сильное портфолио','Strong portfolio','Күшті портфолио'],tag:['Документы','Documents','Құжаттар'],icon:'folder-check',d:['Собери всё воедино.','Bring everything together.','Бәрін біріктір.'],tasks:[['Собери сертификаты и проекты','Gather certificates and projects','Сертификат пен жобаларды жина'],['Составь резюме (CV)','Write a CV','CV құрастыр'],['Обнови портфолио','Update your portfolio','Портфолионы жаңарт']]},
    {p:['Осень–Зима','Autumn–Winter','Күз–Қыс'],t:['Финальная подготовка к тестам','Final test prep','Тестке соңғы дайындық'],tag:['Экзамены','Exams','Емтихандар'],icon:'target',d:['Доведи баллы до цели.','Push your scores to target.','Балыңды мақсатқа жеткіз.'],tasks:[['Прорешай 3 пробных теста','Do 3 mock tests','3 сынақ тест шеш'],['Разбери ошибки','Review your mistakes','Қателерді талда'],['Запишись на экзамен','Register for the exam','Емтиханға тіркел']]},
    {p:['Зима','Winter','Қыс'],t:['Сдай SAT/IELTS','Take SAT/IELTS','SAT/IELTS тапсыр'],tag:['Экзамены','Exams','Емтихандар'],icon:'award',d:['Зафиксируй высокий балл.','Lock in a high score.','Жоғары балды бекіт.'],tasks:[['Сдай экзамен','Sit the exam','Емтихан тапсыр'],['Отправь баллы в вузы','Send scores to universities','Балдарды ЖОО-ларға жібер'],['Отдохни и восстановись','Rest and recover','Демал, қалпына кел']]},
    {p:['Весна','Spring','Көктем'],t:['Эссе и заявки','Essays & applications','Эссе мен өтінімдер'],tag:['Apply','Apply','Apply'],icon:'school',d:['Подай документы.','Submit your applications.','Құжаттарыңды тапсыр.'],tasks:[['Напиши мотивационные эссе','Write motivation essays','Мотивациялық эссе жаз'],['Запроси рекомендации','Request recommendation letters','Ұсыныс хаттарын сұра'],['Подай заявки в вузы и на стипендии','Apply to universities and scholarships','ЖОО мен стипендияларға өтін']]},
    {p:['Лето','Summer','Жаз'],t:['Усиление заявки','Strengthen your application','Өтінімді күшейту'],tag:['Лето','Summer','Жаз'],icon:'star',d:['Сделай последний рывок.','Make a final push.','Соңғы серпіліс жаса.'],tasks:[['Пройди престижную летнюю программу','Do a prestigious summer program','Беделді жазғы бағдарламадан өт'],['Подготовь портфолио к интервью','Prep your portfolio for interviews','Портфолионы сұхбатқа дайында'],['Изучи дедлайны стран','Study country deadlines','Ел дедлайндарын зертте']]}
  ],
  '12': [
    {p:['Осень','Autumn','Күз'],t:['Финал заявок','Application finale','Өтінім финалы'],tag:['Apply','Apply','Apply'],icon:'send',d:['Заверши все подачи.','Finish all submissions.','Барлық тапсыруды аяқта.'],tasks:[['Подай во все целевые вузы','Apply to all target universities','Барлық мақсатты ЖОО-ға өтін'],['Проверь дедлайны стипендий','Check scholarship deadlines','Стипендия дедлайндарын тексер'],['Отправь все документы','Send all documents','Барлық құжатты жібер']]},
    {p:['Зима','Winter','Қыс'],t:['Интервью','Interviews','Сұхбаттар'],tag:['Интервью','Interview','Сұхбат'],icon:'mic',d:['Подготовься к собеседованиям.','Prepare for interviews.','Сұхбаттарға дайындал.'],tasks:[['Тренируй mock-интервью','Practice mock interviews','Mock-сұхбат жаттық'],['Подготовь рассказ о себе','Prepare your self-pitch','Өзің туралы әңгіме дайында'],['Собери вопросы к вузам','Prepare questions for universities','ЖОО-ларға сұрақ дайында']]},
    {p:['Весна','Spring','Көктем'],t:['Выбор вуза','Choose a university','ЖОО таңдау'],tag:['Решение','Decision','Шешім'],icon:'check-circle',d:['Сравни предложения.','Compare your offers.','Ұсыныстарды салыстыр.'],tasks:[['Сравни офферы и финансирование','Compare offers and funding','Офферлер мен қаржыны салыстыр'],['Взвесь плюсы и минусы','Weigh pros and cons','Артық-кемін таразыла'],['Прими решение','Make your decision','Шешім қабылда']]},
    {p:['Весна–Лето','Spring–Summer','Көктем–Жаз'],t:['Финансы и виза','Finance & visa','Қаржы мен виза'],tag:['Финансы','Finance','Қаржы'],icon:'badge-dollar-sign',d:['Реши организационные вопросы.','Sort out the logistics.','Ұйымдастыру мәселелерін шеш.'],tasks:[['Оформи стипендию или грант','Arrange a scholarship or grant','Стипендия не грант рәсімде'],['Подай на визу при необходимости','Apply for a visa if needed','Қажет болса визаға өтін'],['Спланируй бюджет','Plan your budget','Бюджетті жоспарла']]},
    {p:['Лето','Summer','Жаз'],t:['Старт студенчества','Start of student life','Студенттік басы'],tag:['Финиш','Finish','Мәре'],icon:'rocket',d:['Подготовься к университету.','Get ready for university.','Университетке дайындал.'],tasks:[['Закрой школьные дела','Wrap up school matters','Мектеп істерін аяқта'],['Найди жильё или общежитие','Find housing or a dorm','Тұрғын үй не жатақхана тап'],['Познакомься с одногруппниками','Meet your future classmates','Болашақ топтастарыңмен таныс']]}
  ]
};

const TR = {
  roadmapTitle: ['Конструктор Roadmap', 'Roadmap Builder', 'Roadmap құрастырғыш'],
  roadmapSub: ['Личный план поступления: что делать в каждом классе.', 'A personal admission plan: what to do each grade.', 'Жеке түсу жоспары: әр сыныпта не істеу керек.'],
  gradeWord: ['класс', 'grade', 'сынып'],
};

export function Roadmap() {
  const { i18n } = useTranslation();
  const [activeGrade, setActiveGrade] = useState<'9'|'10'|'11'|'12'>('10');

  const langIdx = i18n.language === 'en' ? 1 : i18n.language === 'kz' ? 2 : 0;
  
  const L = (arr: string[]) => arr[langIdx] || arr[0];
  const TM = (key: keyof typeof TR) => L(TR[key]);

  const grades = ['9', '10', '11', '12'] as const;
  const currentSteps = roadmapData[activeGrade];

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <span className="inline-flex w-[54px] h-[54px] rounded-2xl items-center justify-center text-[26px] text-white bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] shadow-[0_12px_30px_rgba(var(--glow),0.45)]">
              <Route className="w-8 h-8" />
            </span>
          </div>
          <h1 className="font-bold text-[clamp(28px,4vw,42px)] text-[var(--text-main)] my-3 text-center tracking-tight leading-tight">
            {TM('roadmapTitle')}
          </h1>
          <p className="text-[var(--text-muted)] text-[15.5px] mb-8 text-center">
            {TM('roadmapSub')}
          </p>

          {/* Tabs */}
          <div className="flex gap-2.5 mb-8">
            {grades.map(g => (
              <button
                key={g}
                onClick={() => setActiveGrade(g)}
                className={`flex-1 py-3 rounded-xl font-bold text-base transition-all duration-150 border
                  ${activeGrade === g 
                    ? 'border-transparent text-white bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)]' 
                    : 'border-[var(--border-color)] text-[var(--text-muted)] bg-[var(--card-bg)] hover:border-[var(--accent-from)]/50'
                  }`}
              >
                {g} {TM('gradeWord')}
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative pl-2">
            {currentSteps.map((st, i) => {
              const isLast = i === currentSteps.length - 1;
              const Icon = ICONS[st.icon as keyof typeof ICONS] || Compass;

              return (
                <div key={i} className="relative flex gap-4 md:gap-[18px] pb-7">
                  {/* Timeline icon column */}
                  <div className="relative flex flex-col items-center">
                    <span className="w-[46px] h-[46px] rounded-xl grid place-items-center text-white shrink-0 z-10 bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] shadow-[0_8px_20px_rgba(var(--glow),0.4)]">
                      <Icon className="w-5 h-5" />
                    </span>
                    {!isLast && (
                      <span className="absolute top-[46px] -bottom-[26px] w-[2px] bg-[var(--border-color)]"></span>
                    )}
                  </div>

                  {/* Content card */}
                  <div className="flex-1 p-[18px] md:p-5 rounded-[18px] bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm">
                    <div className="flex items-center justify-between gap-2.5 mb-1">
                      <div className="text-[var(--accent-to)] font-bold text-xs uppercase tracking-wider">
                        {L(st.p)}
                      </div>
                      <span className="text-[11px] font-bold py-1 px-2.5 rounded-lg text-[var(--accent-from)] bg-[var(--accent-from)]/10 whitespace-nowrap">
                        {L(st.tag)}
                      </span>
                    </div>
                    <h3 className="font-bold text-[18px] text-[var(--text-main)] mb-1.5 leading-tight">
                      {L(st.t)}
                    </h3>
                    <p className="text-[var(--text-muted)] text-[14px] leading-relaxed mb-3">
                      {L(st.d)}
                    </p>
                    <div className="flex flex-col gap-2">
                      {st.tasks.map((tk, j) => (
                        <div key={j} className="flex items-start gap-2.5 text-[13.5px] text-[var(--text-main)] leading-tight">
                          <span className="w-[18px] h-[18px] rounded-md shrink-0 grid place-items-center text-[var(--accent-to)] bg-[var(--accent-to)]/10 mt-0.5">
                            <Check className="w-3 h-3" />
                          </span>
                          <span className="flex-1">{L(tk)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}
