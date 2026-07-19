export type LanguageType = "uz" | "ru" | "en";

export interface TranslationsSchema {
  nav: {
    home: string;
    aiConsult: string;
    departments: string;
    activeBookings: string;
    genetics: string;
    contactUs: string;
    neurology: string;
    hepatology: string;
    urology: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    title3: string;
    description: string;
    btnDiagnostics: string;
    btnConsult: string;
    awardsVal: string;
    awardsLabel: string;
    yearsVal: string;
    yearsLabel: string;
    lungsVal: string;
    lungsLabel: string;
  };
  playground: {
    badge: string;
    title: string;
    description: string;
    brainTitle: string;
    brainDesc: string;
    liverTitle: string;
    liverDesc: string;
    kidneyTitle: string;
    kidneyDesc: string;
    btnGo: string;
  };
  stats: {
    funding: string;
    fundingLabel: string;
    patients: string;
    patientsLabel: string;
    satisfaction: string;
    satisfactionLabel: string;
    doctors: string;
    doctorsLabel: string;
  };
  about: {
    badge: string;
    title: string;
    description: string;
    established: string;
    date: string;
    text: string;
    btnLearn: string;
    deskLabel: string;
  };
  footer: {
    description: string;
    copyright: string;
    sandboxHeader: string;
    brainLink: string;
    liverLink: string;
    kidneyLink: string;
    rulesHeader: string;
    privacyLink: string;
    supportLink: string;
    bookingLink: string;
  };
  consult: {
    title: string;
    role: string;
    sub: string;
    disclaimer: string;
    model: string;
    inputPlaceholder: string;
    needPhysical: string;
    scheduleBtn: string;
    confirmClear: string;
    greetingText: string;
    greetingNeurology: string;
    greetingHepatology: string;
    greetingUrology: string;
    fallbackResponse: string;
    apiError: string;
    presetBrain: string;
    presetBrainLabel: string;
    presetLiver: string;
    presetLiverLabel: string;
    presetKidney: string;
    presetKidneyLabel: string;
  };
  diagnostics: {
    title: string;
    tabBrain: string;
    tabLiver: string;
    tabKidney: string;
    disclaimer: string;
    reportBtn: string;
    generatingReport: string;
    reportHeader: string;
    closeBtn: string;

    // Brain check specifics
    brainIntro: string;
    brainStartBtn: string;
    brainReactionRound: string;
    brainReactionDelay: string;
    brainMemoryTurns: string;
    brainScore: string;
    brainAccuracy: string;
    brainPoints: string;
    brainSuccessTitle: string;
    brainReactionInitialMsg: string;
    brainMemoryInstruction: string;
    brainReactionClickMsg: string;
    brainReactionWaitMsg: string;
    brainReactionTooEarly: string;
    brainReactionNiceMsg: string;
    brainReactionResultMsg: string;

    // Liver check specifics
    liverIntro: string;
    liverProcessedLabel: string;
    liverAntioxidantLabel: string;
    liverFatigueLabel: string;
    liverExerciseLabel: string;
    liverFastfoodLabel: string;
    liverFatigueNone: string;
    liverFatigueMild: string;
    liverFatigueFrequent: string;
    liverFatigueSevere: string;
    liverScoreResult: string;
    liverStressLevel: string;
    liverDaysPerWeek: string;

    // Kidney check specifics
    kidneyIntro: string;
    kidneyWaterLabel: string;
    kidneySodiumLabel: string;
    kidneyCoffeeLabel: string;
    kidneyActivityLabel: string;
    kidneyWeightLabel: string;
    kidneySodiumLow: string;
    kidneySodiumMod: string;
    kidneySodiumHigh: string;
    kidneyActivityLow: string;
    kidneyActivityMod: string;
    kidneyActivityVig: string;
    kidneyScoreResult: string;
    kidneyGfrResult: string;
    kidneyLitres: string;
    kidneyCups: string;
  };
  bookings: {
    title: string;
    subtitle: string;
    newBookingHeader: string;
    patientNameLabel: string;
    patientEmailLabel: string;
    departmentLabel: string;
    doctorLabel: string;
    dateLabel: string;
    timeLabel: string;
    notesLabel: string;
    createBtn: string;
    filterAll: string;
    filterConfirmed: string;
    filterCompleted: string;
    emptyBookings: string;
    statusConfirmed: string;
    statusCompleted: string;
    statusPending: string;
    tableID: string;
    tablePatient: string;
    tableDept: string;
    tableDoctor: string;
    tableDateTime: string;
    tableStatus: string;
    tableAction: string;
    actionComplete: string;
    actionCancel: string;
    doctorWatson: string;
    doctorEmily: string;
    doctorSarah: string;
    doctorMichael: string;
  };
}

export const translations: Record<LanguageType, TranslationsSchema> = {
  uz: {
    nav: {
      home: "Bosh sahifa",
      aiConsult: "AI Maslahat",
      departments: "Bo'limlar",
      activeBookings: "Faol bandlovlar",
      genetics: "Endoskopiya",
      contactUs: "Aloqa",
      neurology: "Otologiya (Quloq)",
      hepatology: "Rinologiya (Burun)",
      urology: "Laringologiya (Tomoq)"
    },
    hero: {
      badge: "Marva Nur Med",
      title1: "SALOM!",
      title2: "MEN SHIFOKOR ELDOR",
      title3: "FARXOD O'G'LIMAN",
      description:
        "Marva Nur Med klinikasining oliy toifali LOR mutaxassisiman. Quloq, burun va tomoq kasalliklarining mukammal konservativ va jarrohlik muolajalarini olib boraman. Sizga eng zamonaviy yechimlar bilan g'amxo'rlik ko'rsatishga tayyorman.",
      btnDiagnostics: "LOR Diagnostikasi",
      btnConsult: "Dr. Eldor (AI) bilan chat",
      awardsVal: "23+",
      awardsLabel: "Mukofotlar va yutuqlar",
      yearsVal: "5+ yil",
      yearsLabel: "Tibbiy tajriba",
      lungsVal: "5.000+",
      lungsLabel: "Sog'lom oilalar",
    },
    playground: {
      badge: "MENING TAHLILLAR MAYDONCHAM",
      title: "LOR a'zolaringizni onlayn baholang",
      description:
        "Ushbu diagnostik ko'rsatkichlar tizimim orqali real vaqtda interaktiv LOR tekshiruvlarini o'tkazing.",
      brainTitle: "Quloq & Reaksiya (Otologiya)",
      brainDesc:
        "Eshitish faoliyati, quloq ichi bosimi va kognitiv asab sinuslarini sinab ko'ring",
      liverTitle: "Burun & Nafas yo'li (Rinologiya)",
      liverDesc: "Allergik rinit, burun bitishi va burun to'sig'i ta'sirini baholang",
      kidneyTitle: "Tomoq & Ovoz (Laringologiya)",
      kidneyDesc:
        "Tomoq og'rig'i, ovoz xillashi va yutunish yuklamalarini tekshiring",
      btnGo: "Boshlash",
    },
    stats: {
      funding: "$250M",
      fundingLabel: "Sog'liqni saqlashga ajratilgan mablag'lar",
      patients: "20M+",
      patientsLabel: "Butun dunyo bo'ylab sog'aygan bemorlar",
      satisfaction: "95%",
      satisfactionLabel: "Bemorlar qoniqish ko'rsatkichi",
      doctors: "200+",
      doctorsLabel: "Yuqori malakali tibbiyot xodimlari",
    },
    about: {
      badge: "MEN HAQIMDA & KLINIKAMIZ",
      title: "MARVA NUR MED KLINIKASIGA XUSH KELIBSIZ. MEN DR. ELDOR",
      description:
        "Men, Dr. Eldor Farxod o'g'li, Toshkentdagi yetakchi otorinolaringologiya (LOR) klinikamiz – Marva Nur Med faoliyatini yuritaman. Maqsadim va professional jamoamizning maqsadi sizga eng ilg'or raqamli audiometriya, og'riqsiz endoskopik vizualizatsiya va zamonaviy LOR lazer texnologiyalari yordamida sifatli xizmat ko'rsatishdir.",
      established: "KLINIKA ISH TIZIMI",
      date: "Dushanba - Shanba, 09:00 - 18:00",
      text: "Men har bir bemorga o'zimning va jamoamiz mutaxassislarining tajribasidan kelib chiqib, aniq diagnostika va samarali davo choralarini tavsiya etaman.",
      btnLearn: "Bizning Klinik Xizmatlar",
      deskLabel: "Klinika Call-Markazi",
    },
    footer: {
      description:
        "Men va jamoam sizning sog'ligingizni himoya qilish hamda LOR a'zolari bilan bog'liq muolajalarda mukammal natijalarni ta'minlash uchun doimo xizmatingizdamiz.",
      copyright:
        "© 2026 Marva Nur Med portfeli. Barcha huquqlar himoyalangan.",
      sandboxHeader: "LOR Tekshiruvlari",
      brainLink: "👂 Quloq audiometriya sinovi",
      liverLink: "👃 Burun nafas yo'li sinovi",
      kidneyLink: "🗣️ Tomoq yuklamasi sinovi",
      rulesHeader: "Foydali bo'limlar",
      privacyLink: "Bemor sirlari va xavfsizligi",
      supportLink: "Klinik muvofiqlik xizmati",
      bookingLink: "Onlayn qabul shartlari",
    },
    consult: {
      title: "Dr. Eldor Farxod o'g'li",
      role: "LOR shifokori (AI yordamchisi)",
      sub: "Marva Nur Med intellektual tizimi",
      disclaimer:
        "Tizim faol. Faqat axborot va ta'lim maqsadida foydalaniladi.",
      model: "Model: gemini-3.5-flash",
      inputPlaceholder:
        "Alomatlar, umumiy salomatlik haqida yozing yoki diagnostika haqida so'rang...",
      needPhysical: "Kasalxonaga tashrif buyurishingiz kerakmi?",
      scheduleBtn: "Qabulga yozilish",
      confirmClear:
        "Haqiqatan ham Dr. Eldor Farxod o'g'li bilan yozishmalar tarixini o'chirib tashlamoqchimisiz?",
      greetingText: `Assalomu alaykum! Men **Dr. Eldor Farxod o'g'li**, sizning LOR mutaxassisingiz (sun'iy intellekt orqali ishlayman). 

Bugun sizga qanday yordam bera olaman? Bizning portalimizda quyidagi yo'nalishlar mavjud:
- 👂 **Otologiya** — Quloq kasalliklari va eshitish testi
- 👃 **Rinologiya** — Burun holati va nafas qisishi
- 🗣️ **Laringologiya** — Tomoq og'riqlari va ovoz xiralashishi
- 🔬 **Zamonaviy diagnostika** — Endoskopiya va audiometriya tahlillari

*Eslatma: Mening tavsiyalarim axborot berish uchundir. Yakuniy tashxis uchun mutaxassislarimizga murojaat qiling.*`,
      greetingNeurology:
        "Quloq salomatligi tekshiruvlari qanday amalga oshiriladi?",
      greetingHepatology:
        "Burun bitishidan qanday tabiiy xalos bo'lish mumkin?",
      greetingUrology: "Tomoq og'rig'i paytida nimalarga e'tibor berish lozim?",
      fallbackResponse:
        "Salom! Men LOR virtual yordamchisiman. Hozirda Gemini API kaliti sozlanmaganga o'xshaydi. Shunga qaramay, sizga yordam bera olaman: Biz yuqori darajada otologiya, rinologiya va laringologiya xizmatlarini taklif etamiz.",
      apiError:
        "⚠️ Klinik server bilan ulanishda xatolik yuz berdi. Sozlamalarda GEMINI_API_KEY borligini tekshiring yoki interaktiv diagnostikani sahifada sinab ko'ring.",
      presetBrain: "Eshitish pasayishining sabablari nima?",
      presetBrainLabel: "Quloq tahlili",
      presetLiver: "Surunkali burun bitishiga nima sabab bo'ladi?",
      presetLiverLabel: "Burun tekshiruvi",
      presetKidney: "Tomoqdagi og'riq va qizarish nimadan dalolat beradi?",
      presetKidneyLabel: "Tomoq holati",
    },
    diagnostics: {
      title: "LOR Interaktiv markazi",
      tabBrain: "Quloq kasalliklari",
      tabLiver: "Burun salomatligi",
      tabKidney: "Tomoq va yutinish",
      disclaimer:
        "*Eslatma: Ushbu tahlillar simulyatsiya hisoblanadi. Yakuniy tibbiy xulosa uchun shifokor ko'rigidan o'ting.",
      reportBtn: "AI tibbiy xulosasini yaratish",
      generatingReport: "AI hisoboti tayyorlanmoqda...",
      reportHeader: "AI Tibbiy Tashxis Hisoboti",
      closeBtn: "Yopish",
      brainIntro:
        "Quloq-asab tahliliy diagnostikasini ishga tushiring. Eshitish reaktsiyasi tezligini o'lchash orqali eshitish va diqqat darajangizni hisoblang.",
      brainStartBtn: "Sinovni boshlash",
      brainReactionRound: "Reaksiya raundi",
      brainReactionDelay: "Reaksiya kechikishi",
      brainMemoryTurns: "Xotira urinishlari",
      brainScore: "Tafsilotlar:",
      brainAccuracy: "Aniqlik",
      brainPoints: "Hisoblangan ball",
      brainSuccessTitle: "Quloq audio-reaksiya sinovi yakunlandi!",
      brainReactionInitialMsg:
        "Sinovni boshlash uchun Boshlash tugmasini bosing...",
      brainMemoryInstruction: "Tovush va signal mosligini aniqlang:",
      brainReactionClickMsg: "HOZIROQ BOSING!!!",
      brainReactionWaitMsg: "Kuting...",
      brainReactionTooEarly: "Juda erta! Ekran yashil ranga kirguncha kuting.",
      brainReactionNiceMsg: "Ajoyib! Reaksiya tezligi: ",
      brainReactionResultMsg:
        "Sinov yakunlandi. Audio-reaktsiyalar muvaffaqiyatli saqlandi.",
      liverIntro:
        "Kunlik turmush tarzingiz asosida burun nafas yo'lidagi yuklama ko'rsatkichini va nafas to'sig'i ehtimollarini simulyatsiya qiling.",
      liverProcessedLabel: "Shirinlik va quruq go'sht iste'moli",
      liverAntioxidantLabel:
        "Ko'p miqdorda iliq choy yoki toza suv ichish",
      liverFatigueLabel: "Surunkali burun bitishi yoki quruqlik darajasi",
      liverExerciseLabel: "Haftalik jismoniy mashg'ulotlar (kun)",
      liverFastfoodLabel: "Chang yoki allergen havo ta'siri",
      liverFatigueNone: "Yo'q",
      liverFatigueMild: "Yengil",
      liverFatigueFrequent: "Tez-tez",
      liverFatigueSevere: "O'ta og'ir",
      liverScoreResult: "Simulyatsion burun stressi",
      liverStressLevel: "Yuklama darajasi:",
      liverDaysPerWeek: "kun/hafta",
      kidneyIntro:
        "Tomoq va ovoz boylamlari zo'riqishi hamda namlik darajasi barqarorligini hisoblash tizimi.",
      kidneyWaterLabel: "Kunlik suv iste'moli",
      kidneySodiumLabel: "Allergiya dori-darmonlari",
      kidneyCoffeeLabel: "Kunlik kofe yoki achchiq ichimlik",
      kidneyActivityLabel: "Kunlik ovoz bilan gapirish zo'riqishi",
      kidneyWeightLabel: "Bemor yoshi",
      kidneySodiumLow: "Kam",
      kidneySodiumMod: "O'rtacha",
      kidneySodiumHigh: "Ko'p",
      kidneyActivityLow: "Tinch / Kam gapiradi",
      kidneyActivityMod: "O'rtacha gapiradi",
      kidneyActivityVig: "Sertovar / Jadal gapiradi",
      kidneyScoreResult: "Tomoq va ovoz yuklamasi",
      kidneyGfrResult: "Taxminiy tomoq namlik ko'rsatkichi",
      kidneyLitres: "litr",
      kidneyCups: "finjon",
    },
    bookings: {
      title: "Marva Nur Med shifokor qabulini rejalashtirish",
      subtitle:
        "Kerakli bo'lim va shifokorni tanlagan holda tibbiy qabulni bandlang.",
      newBookingHeader: "Yangi qabulni saqlash",
      patientNameLabel: "Bemor ismi",
      patientEmailLabel: "Email manzili",
      departmentLabel: "Klinik bo'lim",
      doctorLabel: "Mutaxassis shifokor",
      dateLabel: "Tashrif sanasi",
      timeLabel: "Soni (Vaqti)",
      notesLabel: "Qo'shimcha tibbiy izohlar",
      createBtn: "Qabulni band qilish",
      filterAll: "Barchasi",
      filterConfirmed: "Tasdiqlangan",
      filterCompleted: "Yakunlangan",
      emptyBookings:
        "Hozircha faol bandlovlar yo'q. Istalgan bo'lim bo'yicha qabulga yoziling.",
      statusConfirmed: "Tasdiqlangan",
      statusCompleted: "Yakunlangan",
      statusPending: "Kutilmoqda",
      tableID: "ID",
      tablePatient: "Bemor",
      tableDept: "Bo'lim",
      tableDoctor: "Shifokor",
      tableDateTime: "Sana va Vaqt",
      tableStatus: "Holati",
      tableAction: "Harakatlar",
      actionComplete: "Yakunlash",
      actionCancel: "Bekor qilish",
      doctorWatson: "Dr. Eldor Farxod o'g'li (AI)",
      doctorEmily: "Dr. Eldor Farxod o'g'li",
      doctorSarah: "Dr. Eldor Farxod o'g'li (Otolog)",
      doctorMichael: "Dr. Eldor Farxod o'g'li (Rinolog)",
    },
  },
  ru: {
    nav: {
      home: "Главная",
      aiConsult: "ИИ Консультант",
      departments: "Отделения",
      activeBookings: "Записи",
      genetics: "Эндоскопия",
      contactUs: "Контакты",
      neurology: "Отология (Ухо)",
      hepatology: "Ринология (Нос)",
      urology: "Ларингология (Горло)"
    },
    hero: {
      badge: "Marva Nur Med",
      title1: "ПРИВЕТ!",
      title2: "Я ДОКТОР ЭЛЬДОР",
      title3: "ФАРХОДОВИЧ",
      description:
        "Я ведущий оториноларинголог высшей категории клиники Marva Nur Med. Мой приоритет — точная цифровая диагностика, эндоскопическое обследование органов слуха, дыхания и высокотехнологичное восстановление вашего здоровья.",
      btnDiagnostics: "Открыть диагностику",
      btnConsult: "Чат с доктором Эльдором (ИИ)",
      awardsVal: "23+",
      awardsLabel: "Полученных наград",
      yearsVal: "5+ лет",
      yearsLabel: "Медицинского опыта",
      lungsVal: "5.000+",
      lungsLabel: "Здоровых семей",
    },
    playground: {
      badge: "МОЯ ДИАГНОСТИЧЕСКАЯ ЗОНА",
      title: "Оцените ваше ЛОР-здоровье онлайн",
      description:
        "Пройдите симуляцию интерактивных ЛОР-тестов с помощью моей цифровой диагностической панели.",
      brainTitle: "Слух и Реакция (Отология)",
      brainDesc:
        "Проверьте слуховые реакции, ушное давление и проводимость в интерактивной симуляции",
      liverTitle: "Дыхание и Нос (Ринология)",
      liverDesc: "Оцените степень заложенности носа, аллергического ринита и носового дыхания",
      kidneyTitle: "Горло и Голос (Ларингология)",
      kidneyDesc: "Исследуйте утомляемость связок, боль в горле и увлажнение слизистой",
      btnGo: "Начать",
    },
    stats: {
      funding: "$250 млн",
      fundingLabel: "Финансирование здравоохранения",
      patients: "20 млн+",
      patientsLabel: "Пациентов вылечено по всему миру",
      satisfaction: "95%",
      satisfactionLabel: "Уровень удовлетворенности",
      doctors: "200+",
      doctorsLabel: "Высококлассных врачей",
    },
    about: {
      badge: "ОБО МНЕ И МОЕЙ КЛИНИКЕ",
      title: "ДОБРО ПОЖАЛОВАТЬ В КЛИНИКУ MARVA NUR MED. Я ДОКТОР ЭЛЬДОР",
      description:
        "Меня зовут доктор Эльдор Фарходович, и я руковожу клиникой Marva Nur Med. Наша главная цель — обеспечить вас передовой и точной диагностикой органов слуха, дыхания и речи. В нашей клинике я и моя команда профессионалов используем современное оборудование, такое как немецкая цифровая аудиометрия, жесткие эндоскопы и инновационная лазерная терапия.",
      established: "ГРАФИК РАБОТЫ",
      date: "Пн-Сб: 09:00 - 18:00",
      text: "Я лично гарантирую индивидуальный подход и высочайшее качество медицинского обслуживания для каждого моего пациента.",
      btnLearn: "Наши Клинические Услуги",
      deskLabel: "Горячая линия связи",
    },
    footer: {
      description:
        "Я и моя команда клиники Marva Nur Med всегда готовы помочь вам защитить ваше ЛОР-здоровье, предоставляя качественное медицинское обслуживание под чутким наблюдением.",
      copyright:
        "© 2026 ЛОР Клиника Marva Nur Med. Все права защищены.",
      sandboxHeader: "Направления диагностики",
      brainLink: "👂 Проверка здоровья ушей",
      liverLink: "👃 Тест здоровья носа",
      kidneyLink: "🗣️ Тест здоровья горла",
      rulesHeader: "Полезные ссылки",
      privacyLink: "Конфиденциальность и безопасность данных",
      supportLink: "Служба клинической поддержки",
      bookingLink: "Запись на прием к врачу",
    },
    consult: {
      title: "Доктор Эльдор Фарходович",
      role: "ЛОР-врач высшей категории (ИИ-ассистент)",
      sub: "Клиника Marva Nur Med",
      disclaimer:
        "Система активна. Используется исключительно в информационных и ознакомительных целях.",
      model: "Модель: gemini-3.5-flash",
      inputPlaceholder:
        "Опишите симптомы, задайте вопросы о здоровье или спросите о диагностике...",
      needPhysical: "Нужен очный визит к врачу?",
      scheduleBtn: "Записаться на прием",
      confirmClear:
        "Вы уверены, что хотите очистить историю консультации с доктором Эльдором Фарходовичем?",
      greetingText: `Приветствую! Я **доктор Эльдор Фарходович**, ваш эксперт по ЛОР-заболеваниям в клинике Marva Nur Med (моя виртуальная ИИ-версия).

Я готов проконсультировать вас по любым вопросам уха, горла и носовой полости:
- 👂 **Отология** — Слух, шум в ушах и отоневрология
- 👃 **Ринология** — Заложенность носа, гаймориты, синуситы и перегородки
- 🗣️ **Ларингология** — Ослабление голоса, тонзиллиты и горловые инфекции
- 🔬 **Эндоскопия** — Тонкая визуализация полости и воспалений

*Обратите внимание: ИИ-консультация служит ознакомительным ориентиром. Для точной диагностики запишитесь на очный прием в Marva Nur Med.*`,
      greetingNeurology: "Как устроена диагностика уха?",
      greetingHepatology: "Как избавиться от заложенности носа?",
      greetingUrology: "На что обратить внимание при боли в горле?",
      fallbackResponse:
        "Здравствуйте! Я ИИ-ассистент доктора Эльдора Фарходовича. Похоже, API-ключ Gemini еще не настроен. Тем не менее, я могу сориентировать вас: мы предлагаем передовую диагностику ЛОР-органов (отология, ринология, ларингология). Желаете ли вы записаться на прием?",
      apiError:
        "⚠️ Ошибка связи с клиническим сервером. Пожалуйста, убедитесь в наличии GEMINI_API_KEY в настройках клиники или воспользуйтесь интерактивными симуляторами на сайте.",
      presetBrain: "Каковы причины снижения слуха?",
      presetBrainLabel: "Состояние ушей",
      presetLiver: "Как избавиться от заложенности носа?",
      presetLiverLabel: "Заложенность носа",
      presetKidney: "На что обратить внимание при боли в горле?",
      presetKidneyLabel: "Состояние горла",
    },
    diagnostics: {
      title: "ЛОР-кабинет диагностики Marva Nur Med",
      tabBrain: "Слуховая реакция (Отология)",
      tabLiver: "Проходимость носа (Ринология)",
      tabKidney: "Голосовая нагрузка (Ларингология)",
      disclaimer:
        "*Примечание: Все данные получены путем симуляции. Обратитесь к врачу для клинического обследования.",
      reportBtn: "Сформировать ИИ-заключение",
      generatingReport: "Диагностические данные анализируются...",
      reportHeader: "Диагностический отчет ИИ",
      closeBtn: "Закрыть",
      brainIntro:
        "Запустите проверку слухового и неврологического статуса. Пройдите тест на задержку реакции и найдите парные карты памяти.",
      brainStartBtn: "Начать тест",
      brainReactionRound: "Раунд реакции",
      brainReactionDelay: "Задержка реакции",
      brainMemoryTurns: "Попытки памяти",
      brainScore: "Показатели:",
      brainAccuracy: "Точность",
      brainPoints: "Баллы когниции",
      brainSuccessTitle: "Когнитивно-слуховой ЛОР-тест завершен!",
      brainReactionInitialMsg: "Нажмите кнопку Начать для запуска теста...",
      brainMemoryInstruction: "Найдите парные символы на картах:",
      brainReactionClickMsg: "НАЖИМАЙТЕ СЕЙЧАС!!!",
      brainReactionWaitMsg: "Ждите...",
      brainReactionTooEarly: "Слишком рано! Дождитесь зеленого экрана.",
      brainReactionNiceMsg: "Отлично! Ваша реакция: ",
      brainReactionResultMsg:
        "Раунд завершен. Результаты успешно сохранены в профиле.",
      liverIntro:
        "Симуляция проходимости и нагрузок на носовое дыхание (Ринология) на основе показателей заложенности и образа жизни.",
      liverProcessedLabel: "Потребление сахара и переработанной пищи",
      liverAntioxidantLabel: "Антиоксидантные напитки (зеленый чай, вода)",
      liverFatigueLabel: "Степень усталости и утомляемости",
      liverExerciseLabel: "Активность в неделю (дней)",
      liverFastfoodLabel: "Доля фастфуда и трансжиров",
      liverFatigueNone: "Нет",
      liverFatigueMild: "Легкая",
      liverFatigueFrequent: "Частая",
      liverFatigueSevere: "Сильная / Хроническая",
      liverScoreResult: "Симуляция стресса носового дыхания",
      liverStressLevel: "Уровень стресса:",
      liverDaysPerWeek: "дней/нед",
      kidneyIntro:
        "Определение нагрузок на голосовой аппарат, сухости горла и калькулятор локальной влажности дыхательных путей.",
      kidneyWaterLabel: "Объем воды в день",
      kidneySodiumLabel: "Уровень соли",
      kidneyCoffeeLabel: "Объем кофе в день",
      kidneyActivityLabel: "Физическая активность",
      kidneyWeightLabel: "Вес пациента (кг)",
      kidneySodiumLow: "Низкий",
      kidneySodiumMod: "Умеренный",
      kidneySodiumHigh: "Высокий",
      kidneyActivityLow: "Низкая активность",
      kidneyActivityMod: "Умеренная активность",
      kidneyActivityVig: "Очень активный / Тяжелый спорт",
      kidneyScoreResult: "Ларингологический индекс усталости",
      kidneyGfrResult: "Оценка степени влажности горла",
      kidneyLitres: "литров",
      kidneyCups: "чашек",
    },
    bookings: {
      title: "Запись на прием в клинику Marva Nur Med",
      subtitle:
        "Выберите свободное отделение и запишитесь к нашему главному специалисту.",
      newBookingHeader: "Внести новую запись",
      patientNameLabel: "ФИО Пациента",
      patientEmailLabel: "Электронная почта",
      departmentLabel: "Медицинское отделение",
      doctorLabel: "Врач-консультант",
      dateLabel: "Желаемая дата",
      timeLabel: "Время визита",
      notesLabel: "Примечание (симптомы)",
      createBtn: "Забронировать визит",
      filterAll: "Все",
      filterConfirmed: "Подтвержденные",
      filterCompleted: "Завершенные",
      emptyBookings:
        "Активные записи отсутствуют. Запишитесь к врачу в любое удобное время.",
      statusConfirmed: "Подтверждено",
      statusCompleted: "Завершено",
      statusPending: "В обработке",
      tableID: "ID",
      tablePatient: "Пациент",
      tableDept: "Отделение",
      tableDoctor: "Врач",
      tableDateTime: "Дата и Время",
      tableStatus: "Статус",
      tableAction: "Действия",
      actionComplete: "Завершить",
      actionCancel: "Отменить",
      doctorWatson: "Др. Эльдор Фарходович (AI)",
      doctorEmily: "Др. Эльдор Фарходович",
      doctorSarah: "Др. Эльдор Фарходович (Отолог)",
      doctorMichael: "Др. Эльдор Фарходович (Ринолог)",
    },
  },
  en: {
    nav: {
      home: "Home",
      aiConsult: "AI Consult Chat",
      departments: "Departments",
      activeBookings: "Active Bookings",
      genetics: "Endoscopy",
      contactUs: "Contact Us",
      neurology: "Otology (Ear)",
      hepatology: "Rhinology (Nose)",
      urology: "Laryngology (Throat)"
    },
    hero: {
      badge: "Marva Nur Med",
      title1: "HELLO!",
      title2: "I AM DR. ELDOR",
      title3: "FARXOD O'G'LI",
      description:
        "I am the chief otorhinolaryngologist (ENT Specialist) at Marva Nur Med Clinic. I specialize in state-of-the-art diagnostic, conservative, and surgical treatments of ear, nose, and throat conditions.",
      btnDiagnostics: "Explore ENT Diagnostics",
      btnConsult: "Chat with Dr. Eldor (AI)",
      awardsVal: "23+",
      awardsLabel: "Awards Reached",
      yearsVal: "5+ Years",
      yearsLabel: "Medical Experience",
      lungsVal: "5.000+",
      lungsLabel: "Healed Families",
    },
    playground: {
      badge: "MY DIAGNOSTICS PLAYGROUND",
      title: "Assess Your ENT Health With Me",
      description:
        "Click any organ card to start taking live, simulated ENT checks using my digital diagnostic tool.",
      brainTitle: "Ear Health & Reaction (Otology)",
      brainDesc: "Test auditory cognitive latencies & auditory pressure loops",
      liverTitle: "Nose & Airway (Rhinology)",
      liverDesc: "Evaluate nasal blockage ratio, allergic rhinitis & breathing quality",
      kidneyTitle: "Throat & Voice (Laryngology)",
      kidneyDesc: "Simulate throat exhaustion levels and airway moisture coefficients",
      btnGo: "Explore",
    },
    stats: {
      funding: "$250M",
      fundingLabel: "In Healthcare Funding Support",
      patients: "20M+",
      patientsLabel: "Patients Served Globally & Securely",
      satisfaction: "95%",
      satisfactionLabel: "Patient Satisfaction Standard Rate",
      doctors: "200+",
      doctorsLabel: "High-Tier Medical Professionals Acc.",
    },
    about: {
      badge: "ABOUT ME & MY CLINIC",
      title: "WELCOME TO MARVA NUR MED. I AM DR. ELDOR",
      description:
        "I am Dr. Eldor Farxod o'g'li, the founder and lead specialist at Marva Nur Med Clinic. My dedicated medical team and I specialize in providing top-tier Otology, Rhinology, and Laryngology (ENT) healthcare. We proudly utilize advanced digital audiometry, non-invasive endoscopy, and modern laser therapies precisely to ensure your exceptional patient care.",
      established: "WORKING HOURS",
      date: "Mon-Sat: 09:00 - 18:00",
      text: "I am personally committed to delivering state-of-the-art diagnostic testing and compassionate, effective treatment for every individual I treat.",
      btnLearn: "Our Clinical Services",
      deskLabel: "Emergency Direct Desk",
    },
    footer: {
      description:
        "My team at Marva Nur Med and I are here to protect your ENT health using our advanced clinical expertise and compassionate care.",
      copyright:
        "© 2026 Marva Nur Med Portfolios. All rights reserved.",
      sandboxHeader: "Quick ENT Links",
      brainLink: "👂 Otology Audiometry Check",
      liverLink: "👃 Rhinology Airflow Scan",
      kidneyLink: "🗣️ Laryngology Throat Assay",
      rulesHeader: "Registry Rules",
      privacyLink: "Privacy Protection Rules",
      supportLink: "Clinical Help desk Support",
      bookingLink: "Reserving slot guidelines",
    },
    consult: {
      title: "Dr. Eldor Farxod o'g'li",
      role: "AI ENT Medic",
      sub: "Marva Nur Med Digital Intelligence",
      disclaimer: "Prescription proxy active. Educational reference only.",
      model: "Model: gemini-3.5-flash",
      inputPlaceholder:
        "Type symptoms, general health queries, or ask about diagnostics...",
      needPhysical: "Need physical clinic care?",
      scheduleBtn: "Schedule physical Checkup",
      confirmClear:
        "Are you sure you want to clear your consultation history with Dr. Eldor?",
      greetingText: `Greetings! I am **Dr. Eldor Farxod o'g'li**, Chief Otorhinolaryngologist at Marva Nur Med Clinic. 

How can I assist your ear, nose, and throat wellness journey today? Our medical suite specializes in:
- 👂 **Otology** — Ear infections, hearing & tinnitus assessment
- 👃 **Rhinology** — Sinuses, nose blockage, nasal septoplasty
- 🗣️ **Laryngology** — Sore throat, voice strain, tonsillectomy
- 🔬 **Rigid Endoscopy** & high-definition micro ENT visualization

*Disclaimer: My insights are for general educational purposes. Please consult our expert clinical physicians for final diagnosis.*`,
      greetingNeurology: "What happens during an Otology Ear Check?",
      greetingHepatology: "How can I reduce nasal congestion naturally?",
      greetingUrology: "Estimate throat moisture levels under dry air",
      fallbackResponse:
        "Hello! I am Dr. Eldor's virtual assistant. It looks like the Gemini API Key is not configured yet in the Settings panel. I can still guide you: Marva Nur Med offers top-tier ENT diagnostic services. Would you like to check out our appointment options or book using the quick scheduler?",
      apiError:
        "⚠️ Clinical Sync Error: I encountered a minor error connecting with my medical server. Please verify that your Marva Nur Med Service has a valid GEMINI_API_KEY in your Settings, or try again.",
      presetBrain: "What are the common causes of hearing loss?",
      presetBrainLabel: "Hearing Assessment",
      presetLiver: "How can I relieve nasal congestion naturally?",
      presetLiverLabel: "Nasal Wellness",
      presetKidney: "What signs should I worry about with throat irritation?",
      presetKidneyLabel: "Throat Inspection",
    },
    diagnostics: {
      title: "Marva Nur Med ENT Diagnostic Center",
      tabBrain: "Otology Check",
      tabLiver: "Rhinology Check",
      tabKidney: "Laryngology Check",
      disclaimer:
        "*Evaluation proxy only. Consult a clinical resident for accurate medical panels.",
      reportBtn: "Generate AI Assessment Report",
      generatingReport: "Assessing diagnostics data...",
      reportHeader: "Clinical ENT Diagnostic Report",
      closeBtn: "Close",
      brainIntro:
        "Launch neurology and hearing assessment engine. Test visual latency response thresholds and identify memory recall associations.",
      brainStartBtn: "Launch Test Engine",
      brainReactionRound: "Reaction Round",
      brainReactionDelay: "Reaction Delay",
      brainMemoryTurns: "Memory Grid Turns",
      brainScore: "Interactive Metrics Card:",
      brainAccuracy: "Recall Accuracy",
      brainPoints: "Score",
      brainSuccessTitle: "Cognitive Assessment Complete!",
      brainReactionInitialMsg: "Click Start to measure reaction delay...",
      brainMemoryInstruction: "Complete matches inside the memory matrix:",
      brainReactionClickMsg: "CLICK NOW!!!",
      brainReactionWaitMsg: "Wait...",
      brainReactionTooEarly: "Too early! Hold click until slate turns green.",
      brainReactionNiceMsg: "Splendid! Latency registry: ",
      brainReactionResultMsg: "Rounds satisfied. Clinical latencies saved.",
      liverIntro:
        "Map non-invasive sub-clinical Rhinology congestion indices. Provide congestion & airflow scores.",
      liverProcessedLabel: "Ratio of high refined sugar & dairy intake",
      liverAntioxidantLabel: "Antioxidant hydration index (Water, Tea)",
      liverFatigueLabel: "Morning nasal dryness or stuffiness index",
      liverExerciseLabel: "Active fitness/sports (days/week)",
      liverFastfoodLabel: "Allergen exposure or smoking ratio",
      liverFatigueNone: "None",
      liverFatigueMild: "Mild / Occasional",
      liverFatigueFrequent: "Frequent stuffiness",
      liverFatigueSevere: "Severe / Constant blockage",
      liverScoreResult: "Estimated Narial Airflow Resistance",
      liverStressLevel: "Functional Strain Level:",
      liverDaysPerWeek: "days/week",
      kidneyIntro:
        "Laryngological vocal-load index calculation proxy. Input core biometric coefficients.",
      kidneyWaterLabel: "Average water volume daily",
      kidneySodiumLabel: "Dietary sodium coefficient",
      kidneyCoffeeLabel: "Caffeine or smoky air factors",
      kidneyActivityLabel: "Hours speaking or vocally strain daily",
      kidneyWeightLabel: "Patient Total Mass (kg)",
      kidneySodiumLow: "Low / Safe",
      kidneySodiumMod: "Moderate",
      kidneySodiumHigh: "High / Critical",
      kidneyActivityLow: "Low Vocal Load",
      kidneyActivityMod: "Moderate Vocal Load",
      kidneyActivityVig: "Constant Loud Speaking/Singing",
      kidneyScoreResult: "Vocal Chord Strain Risk Ratio",
      kidneyGfrResult: "Estimated Airway Humidity Rate",
      kidneyLitres: "liters",
      kidneyCups: "cups",
    },
    bookings: {
      title: "Clinic Appointment Scheduler Portal",
      subtitle:
        "Reserve an on-site treatment block at our active medical campus.",
      newBookingHeader: "Schedule New Appointment Block",
      patientNameLabel: "Patient Full Name",
      patientEmailLabel: "Verify Email Address",
      departmentLabel: "Target ENT Wing",
      doctorLabel: "Specialist Physician",
      dateLabel: "Scheduled Date",
      timeLabel: "Requested Block",
      notesLabel: "Symptom Log Overview",
      createBtn: "Reserve Treatment Block",
      filterAll: "All Logs",
      filterConfirmed: "Confirmed Blocks",
      filterCompleted: "Completed Treatments",
      emptyBookings:
        "No certified clinical appointments recorded yet in active slots. Reserve one above.",
      statusConfirmed: "Confirmed",
      statusCompleted: "Completed",
      statusPending: "Pending Verification",
      tableID: "Appointment",
      tablePatient: "Patient",
      tableDept: "Clinical Wing",
      tableDoctor: "Doctor",
      tableDateTime: "Schedule block",
      tableStatus: "Verification",
      tableAction: "Actions",
      actionComplete: "Complete Session",
      actionCancel: "Cancel Block",
      doctorWatson: "Dr. Eldor Farxod o'g'li (AI)",
      doctorEmily: "Dr. Eldor Farxod o'g'li",
      doctorSarah: "Dr. Eldor Farxod o'g'li (Otolog)",
      doctorMichael: "Dr. Eldor Farxod o'g'li (Rinolog)",
    },
  },
};
