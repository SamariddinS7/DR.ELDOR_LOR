import React, { useState, useEffect, useRef } from "react";
import { Instagram, Send, Phone, Facebook, Star, MessageSquare, Plus, Quote, Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, animate } from "motion/react";
import { DepartmentType } from "../types";
import { LanguageType, translations } from "../translations";
import marvaClinicImage from "../assets/images/b24ecfbf-88c1-456a-9340-014326afe7e8.jpg";
import doctorHeroImage from "../assets/images/image.jpg";
import doctorAboutImage from "../assets/images/image (1).jpg";

interface LegacyDesignProps {
  lang: LanguageType;
  handleOpenDiagnostics: (tab: "brain" | "liver" | "kidney") => void;
  setIsConsultOpen: (isOpen: boolean) => void;
  handleOpenAppt: (dept?: DepartmentType) => void;
  handleLaunchConsultWithTopic: (topic: string) => void;
}

const deptsByLang = {
  uz: [
    "Otologiya (Quloq)",
    "Rinologiya (Burun)",
    "Laringologiya (Tomoq)",
    "Endoskopik Diagnostika",
    "Umumiy LOR Terapiyalari"
  ],
  ru: [
    "Отология (Ухо)",
    "Ринология (Нос)",
    "Ларингология (Горло)",
    "Эндоскопическая диагностика",
    "Общая ЛОР-терапия"
  ],
  en: [
    "Otology (Ear)",
    "Rhinology (Nose)",
    "Laryngology (Throat)",
    "Endoscopic Diagnostics",
    "General ENT Therapies"
  ]
};

const reviewsTranslations = {
  uz: {
    badge: "Mijozlar fikri",
    title: "Bemorlarimizning shifo topish hikoyalari",
    desc: "Marva Nur Med klinikasida davolangan va maslahat olgan haqiqiy bemorlarimizning samimiy fikrlari va minnatdorchiliklari.",
    addBtn: "Fikr qoldirish",
    closeBtn: "Yopish",
    nameLabel: "Ismingiz va familiyangiz",
    cityLabel: "Shahar / Viloyat",
    ratingLabel: "Baho bering",
    deptLabel: "Qaysi bo'limda davolandingiz?",
    textLabel: "Fikringiz yoki minnatdorchilik xatingiz",
    submitBtn: "Fikrni jo'natish",
    successMsg: "Rahmat! Fikringiz muvaffaqiyatli qabul qilindi.",
    requiredFields: "Iltimos, barcha maydonlarni to'ldiring.",
    placeholderName: "Masalan: Sardor Rahimov",
    placeholderCity: "Masalan: Toshkent",
    placeholderText: "O'z fikringizni batafsil yozing...",
    noReviews: "Hozircha fikrlar yo'q."
  },
  ru: {
    badge: "Отзывы пациентов",
    title: "Истории выздоровления наших пациентов",
    desc: "Искренние отзывы и благодарности реальных пациентов, которые прошли обследование и лечение в клинике Marva Nur Med.",
    addBtn: "Оставить отзыв",
    closeBtn: "Закрыть",
    nameLabel: "Ваше имя и фамилия",
    cityLabel: "Город / Регион",
    ratingLabel: "Оцените работу",
    deptLabel: "В каком отделении вы лечились?",
    textLabel: "Ваш отзыв или слова благодарности",
    submitBtn: "Отправить отзыв",
    successMsg: "Спасибо! Ваш отзыв успешно опубликован.",
    requiredFields: "Пожалуйста, заполните все поля.",
    placeholderName: "Например: Сардор Рахимов",
    placeholderCity: "Например: Ташкент",
    placeholderText: "Опишите ваши впечатления в деталях...",
    noReviews: "Отзывов пока нет."
  },
  en: {
    badge: "Patient Testimonials",
    title: "Stories of Our Patients' Recovery",
    desc: "Sincere reviews and gratitude from real patients who received diagnostics and treatments at the Marva Nur Med clinic.",
    addBtn: "Leave a Review",
    closeBtn: "Close",
    nameLabel: "Your Full Name",
    cityLabel: "City / Region",
    ratingLabel: "Give a Rating",
    deptLabel: "Which department treated you?",
    textLabel: "Your feedback or message of gratitude",
    submitBtn: "Submit Review",
    successMsg: "Thank you! Your testimonial has been successfully published.",
    requiredFields: "Please fill in all fields.",
    placeholderName: "E.g., Sardor Rahimov",
    placeholderCity: "E.g., Tashkent",
    placeholderText: "Write your feedback in detail...",
    noReviews: "No reviews yet."
  }
};

export default function LegacyDesign({
  lang,
  handleOpenDiagnostics,
  setIsConsultOpen,
  handleOpenAppt,
  handleLaunchConsultWithTopic,
}: LegacyDesignProps) {
  const defaultReviews = [
    {
      id: "1",
      name: "Sardor Rahimov",
      city: "Toshkent",
      rating: 5,
      deptUz: "Rinologiya (Burun)",
      deptRu: "Ринология (Нос)",
      deptEn: "Rhinology (Nose)",
      textUz: "Ko'p yillardan buyon surunkali burun bitishidan aziyat chekar edim. Dr. Eldorning lazer va endoskopik muolajalaridan so'ng qayta erkin nafas ola boshladim! Marva Nur Med klinikasiga katta rahmat.",
      textRu: "Много лет страдал хронической заложенностью носа. После лазерных процедур у доктора Эльдора я наконец дышу свободно! Большое спасибо клинике Marva Nur Med.",
      textEn: "I suffered from chronic nasal congestion for many years. After laser treatments with Dr. Eldor, I can finally breathe freely! Big thanks to the Marva Nur Med clinic.",
      date: "2026-06-25",
      initials: "SR"
    },
    {
      id: "2",
      name: "Nigora Alimova",
      city: "Samarqand",
      rating: 5,
      deptUz: "Laringologiya (Tomoq)",
      deptRu: "Ларингология (Горло)",
      deptEn: "Laryngology (Throat)",
      textUz: "O'g'limning adenoit muammosi bo'yicha ko'plab joylarga murojaat qildik. Faqat Eldor aka og'riqsiz va jarrohliksiz davolash yo'lini ko'rsatib, to'liq davolab berdilar. Juda tajribali shifokor!",
      textRu: "Мы обращались во многие места по поводу аденоидов у сына. Только доктор Эльдор нашел безболезненный способ лечения без операции. Очень опытный врач!",
      textEn: "We consulted many places regarding my son's adenoid issues. Only Dr. Eldor found a painless treatment method without surgery. A highly experienced specialist!",
      date: "2026-06-20",
      initials: "NA"
    },
    {
      id: "3",
      name: "Dmitriy Kozlov",
      city: "Toshkent",
      rating: 5,
      deptUz: "Otologiya (Quloq)",
      deptRu: "Отология (Ухо)",
      deptEn: "Otology (Ear)",
      textUz: "Chap qulog'imda eshitish pasayishi va doimiy shovqin bor edi. Dr. Eldor Farxod o'g'li aniq audiometriya tahlili qilib, mukammal muolaja tayinladilar. Shovqin butkul yo'qoldi, eshitishim tiklandi.",
      textRu: "Был шум в левом ухе и снижение слуха. Доктор Эльдор провел точную аудиометрию и назначил эффективное лечение. Шум полностью прошел, слух восстановился.",
      textEn: "I had constant ringing in my left ear and hearing loss. Dr. Eldor performed a precise audiometry check and prescribed a perfect therapy. The ringing is completely gone!",
      date: "2026-06-15",
      initials: "DK"
    },
    {
      id: "4",
      name: "Malika Qodirova",
      city: "Buxoro",
      rating: 5,
      deptUz: "Rinologiya (Burun)",
      deptRu: "Ринология (Нос)",
      deptEn: "Rhinology (Nose)",
      textUz: "Burun to'sig'i qiyshiqligi sababli uzoq vaqt qiynalib kelgan edim. Ushbu klinikada jarrohliksiz davolash choralari ko'rildi, nafas olishim sezilarli darajada yaxshilandi! Sharoitlar ham juda ajoyib ekan.",
      textRu: "Долгое время мучилась из-за искривления носовой перегородки. В этой клинике мне предложили эффективные безоперационные методы лечения. Дыхание значительно улучшилось!",
      textEn: "I had been suffering from a deviated nasal septum for a long time. In this clinic, I received non-surgical treatments that greatly improved my breathing!",
      date: "2026-06-12",
      initials: "MQ"
    },
    {
      id: "5",
      name: "Abdurashid Karimov",
      city: "Namangan",
      rating: 5,
      deptUz: "Umumiy LOR Terapiyalari",
      deptRu: "Общая ЛОР-терапия",
      deptEn: "General ENT Therapies",
      textUz: "Klinikaga birinchi marta kelishim, shifokorlar va personallarning munosabati juda ma'qul keldi. Zamonaviy uskunalar yordamida tezkor tashxis qo'yib, to'g'ri maslahat berdilar.",
      textRu: "Впервые посетил эту клинику, очень понравилось отношение врачей и персонала. Быстро поставили диагноз с помощью современного оборудования и дали правильные рекомендации.",
      textEn: "My first time visiting this clinic, I was highly impressed by the attitude of the doctors and staff. They quickly diagnosed me using modern equipment and gave great advice.",
      date: "2026-06-08",
      initials: "AK"
    },
    {
      id: "6",
      name: "Zilola Umarova",
      city: "Farg'ona",
      rating: 5,
      deptUz: "Laringologiya (Tomoq)",
      deptRu: "Ларингология (Горло)",
      deptEn: "Laryngology (Throat)",
      textUz: "Tomoq og'rig'i va ovoz bo'g'ilishi meni tez-tez bezovta qilar edi. Eldor shifokorning foydali tavsiyalari va dorilari yordamida qisqa vaqt ichida sog'ayib ketdim. Tashakkur!",
      textRu: "Часто беспокоили боли в горле и хрипота в голосе. Благодаря полезным советам и лечению доктора Эльдора я быстро поправилась. Спасибо!",
      textEn: "I was frequently troubled by throat pain and a hoarse voice. Thanks to Dr. Eldor's helpful advice and treatment, I recovered in no time. Thank you!",
      date: "2026-06-05",
      initials: "ZU"
    },
    {
      id: "7",
      name: "Jasur Aliyev",
      city: "Toshkent",
      rating: 5,
      deptUz: "Endoskopik Diagnostika",
      deptRu: "Эндоскопическая диагностика",
      deptEn: "Endoscopic Diagnostics",
      textUz: "Endoskopik tekshiruvdan o'tishdan biroz qo'rqqan edim, lekin mutaxassislar muolajani juda ehtiyotkorlik va og'riqsiz o'tkazishdi. Klinikadagi gigiyena va tozalikka gap bo'lishi mumkin emas.",
      textRu: "Немного боялся проходить эндоскопическое обследование, но специалисты провели процедуру очень бережно и безболезненно. Чистота и гигиена в клинике на высшем уровне.",
      textEn: "I was a bit scared of having an endoscopic exam, but the specialists performed it very gently and painlessly. The cleanliness and hygiene of the clinic are top-notch.",
      date: "2026-06-02",
      initials: "JA"
    },
    {
      id: "8",
      name: "Elena Petrova",
      city: "Toshkent",
      rating: 5,
      deptUz: "Otologiya (Quloq)",
      deptRu: "Отология (Ухо)",
      deptEn: "Otology (Ear)",
      textUz: "Bolaligimdan qulog'imda muammo bor edi. Marva Nur Med klinikasidagi muolajalar va g'amxo'rlik sababli nihoyat eshitishim ancha ravonlashdi. Barcha shifokorlarga minnatdorchilik bildiraman!",
      textRu: "С детства были проблемы с ушами. Благодаря лечению и заботе в клинике Marva Nur Med мой слух наконец стал намного четче. Выражаю благодарность всем врачам!",
      textEn: "I had ear problems since childhood. Thanks to the treatments and care at Marva Nur Med clinic, my hearing has finally improved significantly. Sincere thanks to all the doctors!",
      date: "2026-05-28",
      initials: "EP"
    },
    {
      id: "9",
      name: "Otabek Soliyev",
      city: "Andijon",
      rating: 5,
      deptUz: "Rinologiya (Burun)",
      deptRu: "Ринология (Нос)",
      deptEn: "Rhinology (Nose)",
      textUz: "Burun bitishi bilan bog'liq dori vositalariga o'rganib qolgan edim (zavisimost). Dr. Eldor bu odatdan qutulishimga professional darajada yordam berdilar. Tavsiya qilaman!",
      textRu: "У меня была зависимость от сосудосуживающих капель для носа. Доктор Эльдор профессионально помог мне избавиться от этой привычки. Очень рекомендую!",
      textEn: "I had a dependency on nasal sprays. Dr. Eldor helped me overcome this habit in a highly professional manner. Highly recommended!",
      date: "2026-05-20",
      initials: "OS"
    }
  ];

  const [reviewsList, setReviewsList] = useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("marva_clinic_reviews") : null;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading reviews", e);
      }
    }
    return defaultReviews;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newDept, setNewDept] = useState("");
  const [newText, setNewText] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // ── Modal state ─────────────────────────────────────────────
  const [expandedReview, setExpandedReview] = useState<any | null>(null);

  // Measure track vs container to set accurate drag constraints
  useEffect(() => {
    localStorage.setItem("marva_clinic_reviews", JSON.stringify(reviewsList));
  }, [reviewsList]);


  useEffect(() => {
    if (!newDept) {
      setNewDept(deptsByLang[lang][0]);
    }
  }, [lang, newDept]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCity.trim() || !newText.trim()) {
      setFormError(reviewsTranslations[lang].requiredFields);
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      name: newName.trim(),
      city: newCity.trim(),
      rating: newRating,
      deptUz: newDept,
      deptRu: newDept,
      deptEn: newDept,
      textUz: newText.trim(),
      textRu: newText.trim(),
      textEn: newText.trim(),
      date: new Date().toISOString().split("T")[0],
      initials: newName.trim().split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "U"
    };

    const updated = [newReview, ...reviewsList];
    setReviewsList(updated);
    localStorage.setItem("marva_clinic_reviews", JSON.stringify(updated));

    setNewName("");
    setNewCity("");
    setNewRating(5);
    setNewText("");
    setFormError("");
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsFormOpen(false);
    }, 2000);
  };
  return (
    <div className="relative text-white w-full pt-4 z-10 bg-transparent">
      {/* ABOUT THE HOSPITAL INFRASTRUCTURE AREA */}
      <section 
        id="hospital-about" 
        className="py-12 bg-transparent select-none relative z-10"
        style={{ minHeight: "500px" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left building graphic image with float overlay */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-[500px]">
            <img
              alt="Marva Nur Med Klinikasi"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 pointer-events-none"
              src={marvaClinicImage}
              loading="lazy"
              decoding="async"
              width="1408"
              height="768"
            />

            {/* Overlay clinic tag */}
            <div 
              className="absolute bottom-4 right-4 md:bottom-6 md:right-6 glass-panel p-4 rounded-xl max-w-[220px] md:max-w-[240px] shadow-2xl border-l-4 border-l-[#007bff] select-none text-white backdrop-blur-md"
              style={{ backgroundColor: "#000000" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-[#007bff] text-white flex items-center justify-center rounded-full shrink-0">
                  <span className="material-symbols-outlined text-[12px] font-bold">
                    equalizer
                  </span>
                </div>
                <span className="font-sans font-black text-[10px] text-[#00a2ff] uppercase tracking-wider">
                  STATISTIKA
                </span>
              </div>
              
              <div className="space-y-2 pt-1 text-slate-200">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    {lang === "uz" ? "Tajriba" : lang === "ru" ? "Опыт" : "Experience"}:
                  </span>
                  <span className="text-xs font-black text-[#00a2ff]">
                    {lang === "uz" ? "5+ yil" : lang === "ru" ? "5+ лет" : "5+ Years"}
                  </span>
                </div>
                
                <div className="border-t border-white/10 pt-1.5 flex items-center justify-between gap-4">
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    {lang === "uz" ? "Bemorlar" : lang === "ru" ? "Пациенты" : "Patients"}:
                  </span>
                  <span className="text-xs font-black text-white">5.000+</span>
                </div>

                <div className="border-t border-white/10 pt-1.5 flex items-center justify-between gap-4">
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    {lang === "uz" ? "Mukofotlar" : lang === "ru" ? "Награды" : "Awards"}:
                  </span>
                  <span className="text-xs font-black text-emerald-400">23+</span>
                </div>

                <div className="border-t border-white/10 pt-1.5 flex items-center justify-between gap-4">
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    {lang === "uz" ? "Shifokorlar" : lang === "ru" ? "Врачи" : "Doctors"}:
                  </span>
                  <span className="text-xs font-black text-white">1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right text layout block */}
          <div className="space-y-6">
            <div className="inline-block bg-[#00a2ff]/10 text-[#00a2ff] font-sans font-bold text-xs px-4 py-2 rounded-full uppercase tracking-wider border border-[#00a2ff]/20">
              {translations[lang].about.badge}
            </div>

            <h2 className="font-sans font-extrabold text-white text-[clamp(1.8rem,4vw,3rem)] leading-tight uppercase">
              {lang === "uz" ? (
                <>
                  MARVA NUR MED KLINIKASIGA XUSH KELIBSIZ. MEN{" "}
                  <span className="inline-block bg-gradient-to-r from-amber-400 via-emerald-400 to-[#00a2ff] bg-clip-text text-transparent border-b-2 border-dashed border-[#00a2ff]/50 pb-0.5 tracking-wide px-0.5">
                    DR. ELDOR FARXOD O'G'LI
                  </span>
                </>
              ) : lang === "ru" ? (
                <>
                  ДОБРО ПОЖАЛОВАТЬ В КЛИНИКУ MARVA NUR MED. Я{" "}
                  <span className="inline-block bg-gradient-to-r from-amber-400 via-emerald-400 to-[#00a2ff] bg-clip-text text-transparent border-b-2 border-dashed border-[#00a2ff]/50 pb-0.5 tracking-wide px-0.5">
                    ДОКТОР ЭЛЬДОР ФАРХОДОВИЧ
                  </span>
                </>
              ) : (
                <>
                  WELCOME TO MARVA NUR MED KLINIKA. I AM{" "}
                  <span className="inline-block bg-gradient-to-r from-amber-400 via-emerald-400 to-[#00a2ff] bg-clip-text text-transparent border-b-2 border-dashed border-[#00a2ff]/50 pb-0.5 tracking-wide px-0.5">
                    DR. ELDOR FARXOD O'G'LI
                  </span>
                </>
              )}
            </h2>

            <p className="font-sans text-slate-500 text-sm md:text-base leading-relaxed">
              {translations[lang].about.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <button
                onClick={() => setIsConsultOpen(true)}
                className="bg-gradient-to-r from-[#007bff] to-[#00a2ff] text-white font-sans font-bold text-xs uppercase tracking-wider px-8 py-4.5 rounded-full flex items-center gap-2.5 hover:from-[#0055ff] hover:to-[#0088ff] transition-all duration-300 shadow-xl shadow-[#00a2ff]/20 cursor-pointer active:scale-95"
              >
                {translations[lang].about.btnLearn}
                <span className="material-symbols-outlined text-base font-bold">
                  arrow_outward
                </span>
              </button>

              <div
                onClick={() =>
                  handleLaunchConsultWithTopic(
                    "How can I contact Marva Nur Med clinic staff? Please list contact numbers, working hours, and address details of Marva Nur Med clinic.",
                  )
                }
                className="flex items-center gap-4 hover:scale-102 transition-transform duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20">
                  <span className="material-symbols-outlined text-xl">
                    call
                  </span>
                </div>
                <div className="font-sans text-left">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                    {translations[lang].about.deskLabel}
                  </div>
                  <div className="font-sans font-extrabold text-white text-sm mt-1">
                    +998 99 528 03 23
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION (MIJOZLAR FIKRI) */}
      <section id="patient-testimonials" className="py-16 bg-transparent relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#00a2ff]/10 text-[#00a2ff] font-bold mb-4 tracking-wide uppercase text-[10px] md:text-xs border border-[#00a2ff]/20">
                {reviewsTranslations[lang].badge}
              </span>
              <h2 className="font-sans font-black text-[clamp(1.8rem,4vw,3rem)] text-white leading-tight uppercase">
                {reviewsTranslations[lang].title}
              </h2>
              <p className="text-slate-400 text-sm md:text-base mt-4 font-sans leading-relaxed">
                {reviewsTranslations[lang].desc}
              </p>
            </div>

            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white font-sans font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full flex items-center gap-2 border border-white/20 transition-all duration-300 self-start md:self-end hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus size={16} />
              {reviewsTranslations[lang].addBtn}
            </button>
          </div>
        </div>

        {/* Testimonial Cards — Draggable Carousel */}
        {reviewsList.length === 0 ? (
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center py-12 bg-white/5 border border-white/5 rounded-3xl">
              <p className="text-slate-400 font-sans">{reviewsTranslations[lang].noReviews}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 w-full relative select-none">

            {/* ── Row 1 (even-indexed reviews) ── */}
            {(() => {
              const row1 = reviewsList.filter((_: any, i: number) => i % 2 === 0);
              // Duplicate the row to ensure seamless infinite looping
              const loopedRow1 = [...row1, ...row1, ...row1, ...row1];
              return (
                <div 
                  className="overflow-hidden w-full relative py-2"
                  style={{
                    maskImage: "linear-gradient(to right, transparent, white 10%, white 90%, transparent)",
                    WebkitMaskImage: "linear-gradient(to right, transparent, white 10%, white 90%, transparent)"
                  }}
                >
                  <div className="animate-marquee-left flex gap-6 w-max">
                    {loopedRow1.map((review: any, idx: number) => {
                      const txt  = lang === "uz" ? review.textUz  : lang === "ru" ? review.textRu  : review.textEn;
                      const dept = lang === "uz" ? review.deptUz  : lang === "ru" ? review.deptRu  : review.deptEn;
                      return (
                        <div
                          key={`${review.id}-r1-${idx}`}
                          onClick={() => setExpandedReview({ ...review, txt, dept })}
                          className="bg-[#0c1e3a]/70 backdrop-blur-md rounded-3xl p-6 md:p-7 border border-white/5 flex flex-col justify-between hover:border-[#00a2ff]/40 hover:shadow-[0_16px_40px_rgba(0,162,255,0.10)] transition-colors duration-200 group w-[300px] md:w-[380px] shrink-0 cursor-pointer"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, si) => (
                                  <Star key={si} size={14} className={si < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"} />
                                ))}
                              </div>
                              <Quote size={22} className="text-[#00a2ff]/10 group-hover:text-[#00a2ff]/25 transition-colors" />
                            </div>
                            <p className="font-sans text-xs md:text-sm text-slate-300 leading-relaxed italic line-clamp-4 text-left">
                              "{txt}"
                            </p>
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#00a2ff]/50 group-hover:text-[#00a2ff]/80 transition-colors">
                              <span className="material-symbols-outlined text-[12px]">open_in_full</span>
                              {lang === "uz" ? "Batafsil ko'rish" : lang === "ru" ? "Читать полностью" : "Read full review"}
                            </span>
                          </div>
                          <div className="border-t border-white/5 pt-4 mt-5 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#00a2ff]/10 border border-[#00a2ff]/20 text-[#00a2ff] flex items-center justify-center font-black text-xs shrink-0">
                              {review.initials}
                            </div>
                            <div className="text-left font-sans min-w-0">
                              <div className="font-bold text-white text-sm truncate">{review.name}</div>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mt-0.5">
                                <span>{review.city}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0"></span>
                                <span className="text-[#00a2ff] truncate">{dept}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* ── Row 2 (odd-indexed reviews) ── */}
            {(() => {
              const row2 = reviewsList.filter((_: any, i: number) => i % 2 !== 0);
              if (row2.length === 0) return null;
              // Duplicate the row to ensure seamless infinite looping
              const loopedRow2 = [...row2, ...row2, ...row2, ...row2];
              return (
                <div 
                  className="overflow-hidden w-full relative py-2"
                  style={{
                    maskImage: "linear-gradient(to right, transparent, white 10%, white 90%, transparent)",
                    WebkitMaskImage: "linear-gradient(to right, transparent, white 10%, white 90%, transparent)"
                  }}
                >
                  <div className="animate-marquee-right flex gap-6 w-max">
                    {loopedRow2.map((review: any, idx: number) => {
                      const txt  = lang === "uz" ? review.textUz  : lang === "ru" ? review.textRu  : review.textEn;
                      const dept = lang === "uz" ? review.deptUz  : lang === "ru" ? review.deptRu  : review.deptEn;
                      return (
                        <div
                          key={`${review.id}-r2-${idx}`}
                          onClick={() => setExpandedReview({ ...review, txt, dept })}
                          className="bg-[#0c1e3a]/70 backdrop-blur-md rounded-3xl p-6 md:p-7 border border-white/5 flex flex-col justify-between hover:border-[#00a2ff]/40 hover:shadow-[0_16px_40px_rgba(0,162,255,0.10)] transition-colors duration-200 group w-[300px] md:w-[380px] shrink-0 cursor-pointer"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, si) => (
                                  <Star key={si} size={14} className={si < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"} />
                                ))}
                              </div>
                              <Quote size={22} className="text-[#00a2ff]/10 group-hover:text-[#00a2ff]/25 transition-colors" />
                            </div>
                            <p className="font-sans text-xs md:text-sm text-slate-300 leading-relaxed italic line-clamp-4 text-left">
                              "{txt}"
                            </p>
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#00a2ff]/50 group-hover:text-[#00a2ff]/80 transition-colors">
                              <span className="material-symbols-outlined text-[12px]">open_in_full</span>
                              {lang === "uz" ? "Batafsil ko'rish" : lang === "ru" ? "Читать полностью" : "Read full review"}
                            </span>
                          </div>
                          <div className="border-t border-white/5 pt-4 mt-5 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#00a2ff]/10 border border-[#00a2ff]/20 text-[#00a2ff] flex items-center justify-center font-black text-xs shrink-0">
                              {review.initials}
                            </div>
                            <div className="text-left font-sans min-w-0">
                              <div className="font-bold text-white text-sm truncate">{review.name}</div>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mt-0.5">
                                <span>{review.city}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0"></span>
                                <span className="text-[#00a2ff] truncate">{dept}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── Expanded review modal ── */}
        <AnimatePresence>
          {expandedReview && (
            <motion.div
              className="fixed inset-0 z-[200] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setExpandedReview(null)}
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

              {/* Card */}
              <motion.div
                className="relative z-10 bg-[#0b1a30] border border-white/10 rounded-[2rem] p-8 md:p-10 max-w-lg w-full shadow-2xl"
                initial={{ scale: 0.88, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.88, opacity: 0, y: 24 }}
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close */}
                <button
                  onClick={() => setExpandedReview(null)}
                  className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} className={i < expandedReview.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"} />
                  ))}
                </div>

                {/* Quote icon */}
                <Quote size={36} className="text-[#00a2ff]/15 mb-3" />

                {/* Full text */}
                <p className="font-sans text-sm md:text-base text-slate-200 leading-relaxed italic mb-8">
                  "{expandedReview.txt}"
                </p>

                {/* Patient */}
                <div className="border-t border-white/8 pt-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#00a2ff]/15 border border-[#00a2ff]/25 text-[#00a2ff] flex items-center justify-center font-black text-sm shrink-0 tracking-wide">
                    {expandedReview.initials}
                  </div>
                  <div>
                    <div className="font-bold text-white text-base">{expandedReview.name}</div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-0.5">
                      <span>{expandedReview.city}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0"></span>
                      <span className="text-[#00a2ff]">{expandedReview.dept}</span>
                    </div>
                    {expandedReview.date && (
                      <div className="text-[10px] text-slate-600 mt-1">{expandedReview.date}</div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal / Dialog for Adding Review */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b172a] border border-white/10 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative"
            >
              {/* Header */}
              <div className="bg-[#0e213e] px-6 py-5 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-sans font-black text-white text-lg flex items-center gap-2">
                  <MessageSquare className="text-[#00a2ff]" size={20} />
                  {reviewsTranslations[lang].addBtn}
                </h3>
                <button
                  onClick={() => {
                    setIsFormOpen(false);
                    setFormError("");
                  }}
                  className="text-slate-400 hover:text-white text-xs font-sans font-bold uppercase cursor-pointer"
                >
                  {reviewsTranslations[lang].closeBtn}
                </button>
              </div>

              {/* Success Screen */}
              {formSuccess ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check size={32} />
                  </div>
                  <h4 className="font-sans font-extrabold text-white text-lg">
                    {reviewsTranslations[lang].successMsg}
                  </h4>
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="p-6 space-y-4 font-sans text-left">
                  {formError && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs py-2 px-3 rounded-xl">
                      {formError}
                    </div>
                  )}

                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      {reviewsTranslations[lang].nameLabel} *
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder={reviewsTranslations[lang].placeholderName}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00a2ff] focus:ring-1 focus:ring-[#00a2ff]/30 transition-all placeholder:text-slate-600"
                    />
                  </div>

                  {/* City Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      {reviewsTranslations[lang].cityLabel} *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder={reviewsTranslations[lang].placeholderCity}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00a2ff] focus:ring-1 focus:ring-[#00a2ff]/30 transition-all placeholder:text-slate-600"
                    />
                  </div>

                  {/* Rating selection */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      {reviewsTranslations[lang].ratingLabel}
                    </label>
                    <div className="flex items-center gap-2 pt-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewRating(idx + 1)}
                          className="hover:scale-110 active:scale-95 transition-transform"
                        >
                          <Star
                            size={24}
                            className={idx < newRating ? "text-amber-400 fill-amber-400" : "text-slate-600"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Department selection */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      {reviewsTranslations[lang].deptLabel}
                    </label>
                    <select
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value)}
                      className="w-full bg-[#0b172a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00a2ff] transition-all"
                    >
                      {deptsByLang[lang].map((d) => (
                        <option key={d} value={d} className="bg-[#0b172a]">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Testimonial text */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      {reviewsTranslations[lang].textLabel} *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      placeholder={reviewsTranslations[lang].placeholderText}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00a2ff] focus:ring-1 focus:ring-[#00a2ff]/30 transition-all placeholder:text-slate-600 resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#007bff] to-[#00a2ff] hover:from-[#0055ff] hover:to-[#0088ff] text-white font-sans font-bold text-xs uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-[#007bff]/20 transition-all duration-300 transform active:scale-95 cursor-pointer"
                  >
                    {reviewsTranslations[lang].submitBtn}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </section>

      {/* CONNECTED SPECIALISTS ORBIT SECTION */}
      <section className="relative py-12 overflow-hidden bg-transparent border-t border-white/10 select-none text-white">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl overflow-hidden pointer-events-none">
        </div>
        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 max-w-2xl mx-auto flex flex-col items-center animate-fade-in-up">
            <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#00a2ff]/10 text-[#00a2ff] font-bold mb-4 tracking-wide uppercase text-xs border border-[#00a2ff]/20">
              {lang === "uz"
                ? "Mening ijtimoiy tarmoqlarim"
                : lang === "ru"
                  ? "Мои социальные сети"
                  : "My Social Networks"}
            </span>
            <h2 className="font-sans font-extrabold text-[clamp(1.8rem,4vw,3rem)] text-white mb-4 leading-tight">
              {lang === "uz"
                ? "Ijtimoiy tarmoqlarimga a'zo bo'ling"
                : lang === "ru"
                  ? "Подписывайтесь на мои соцсети"
                  : "Follow My Social Networks"}
            </h2>
            <p className="text-slate-500 text-sm md:text-base max-w-lg mx-auto font-sans leading-relaxed">
              {lang === "uz"
                ? "Mening klinikam, tibbiy maslahatlarim va LOR xizmatlari haqidagi eng so'nggi yangiliklardan xabardor bo'lish uchun sahifalarimga obuna bo'ling."
                : lang === "ru"
                  ? "Подпишитесь на мои страницы, чтобы быть в курсе последних новостей о моей клинике, получать медицинские советы и узнавать о ЛОР-услугах."
                  : "Subscribe to my pages to stay updated on the latest news about my clinic, medical advice, and ENT services."}
            </p>
          </div>
          {/* Orbit Interactive Area */}
          <div className="relative w-full max-w-[300px] sm:max-w-[400px] md:max-w-[720px] aspect-square mx-auto flex items-center justify-center mt-12 mb-8">
            {/* Track Rings (Decorative) */}
            <div className="absolute inset-0 rounded-full border border-slate-200/50 hidden md:block"></div>
            <div className="absolute inset-[15%] rounded-full border border-slate-200/30 border-dashed"></div>
            {/* The Orbiting Track */}
            <div className="absolute inset-0 orbit-track">
              {/* Instagram (Top) */}
              <a
                aria-label="Instagram"
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 orbit-item group flex flex-col items-center gap-2 float-slow"
                href="https://instagram.com/Lor_Eldor"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-[60px] h-[60px] md:w-[120px] md:h-[120px] bg-white/10 rounded-full flex items-center justify-center shadow-lg border border-white/20 transition-all transform hover:scale-105 overflow-hidden p-2 md:p-3 text-pink-500 backdrop-blur-sm">
                  <Instagram className="w-8 h-8 md:w-16 md:h-16" strokeWidth={1.5} />
                </div>
              </a>
              {/* Telegram (Right) */}
              <a
                aria-label="Telegram"
                className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 orbit-item group flex flex-col items-center gap-2 float-slow"
                style={{ animationDelay: "2s" }}
                href="https://t.me/Lor_Eldor"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-[60px] h-[60px] md:w-[120px] md:h-[120px] bg-white/10 rounded-full flex items-center justify-center shadow-lg border border-white/20 transition-all transform hover:scale-105 overflow-hidden p-2 md:p-3 text-sky-500 backdrop-blur-sm">
                  <Send className="w-8 h-8 md:w-16 md:h-16 mr-0.5 mt-0.5 md:mr-1 md:mt-1" strokeWidth={1.5} />
                </div>
              </a>
              {/* Phone Call (Bottom) */}
              <a
                aria-label="Phone Call"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 orbit-item group flex flex-col items-center gap-2 float-slow"
                style={{ animationDelay: "4s" }}
                href="tel:+998995280323"
              >
                <div className="w-[60px] h-[60px] md:w-[120px] md:h-[120px] bg-white/10 rounded-full flex items-center justify-center shadow-lg border border-white/20 transition-all transform hover:scale-105 overflow-hidden p-2 md:p-3 text-green-500 backdrop-blur-sm">
                  <Phone className="w-8 h-8 md:w-16 md:h-16" strokeWidth={1.5} fill="currentColor" />
                </div>
              </a>
              {/* Facebook (Left) */}
              <a
                aria-label="Facebook"
                className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 orbit-item group flex flex-col items-center gap-2 float-slow"
                style={{ animationDelay: "6s" }}
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                <div className="w-[60px] h-[60px] md:w-[120px] md:h-[120px] bg-white/10 rounded-full flex items-center justify-center shadow-lg border border-white/20 transition-all transform hover:scale-105 overflow-hidden p-2 md:p-3 text-blue-500 backdrop-blur-sm">
                  <Facebook className="w-8 h-8 md:w-16 md:h-16 mt-0.5 md:mt-2" strokeWidth={1.5} fill="currentColor" />
                </div>
              </a>
            </div>
            {/* Central Doctor Hub */}
            <div className="absolute center-hub z-20 pulse-glow rounded-full">
              <div className="w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] md:w-[312px] md:h-[312px] rounded-full overflow-hidden border-2 border-[#00a2ff]/30 shadow-[0_0_30px_rgba(0,162,255,0.2)] relative z-30 flex items-center justify-center bg-black/40 backdrop-blur-md">
                <img
                  alt="Dr. Eldor Farxod o'g'li - Lead LOR Specialist"
                  className="w-full h-full object-cover object-[center_top] scale-110"
                  src={doctorAboutImage}
                  loading="lazy"
                  decoding="async"
                  width="768"
                  height="1376"
                />
              </div>
            </div>
          </div>
          {/* Secondary CTA */}
          <div className="text-center mt-12 animate-fade-in-up">
            <motion.button
              onClick={() => handleOpenAppt()}
              className="relative overflow-hidden inline-flex items-center gap-3 bg-gradient-to-r from-[#0055ff] via-[#0088ff] to-[#00c2ff] text-white font-sans font-black text-xs uppercase tracking-widest px-10 py-5 rounded-full shadow-lg cursor-pointer border border-[#00a2ff]/30"
              whileHover={{ 
                scale: 1.06, 
                boxShadow: "0px 15px 40px rgba(0, 162, 255, 0.6)",
                textShadow: "0px 0px 8px rgba(255, 255, 255, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0px 8px 25px rgba(0, 123, 255, 0.4)",
                  "0px 12px 35px rgba(0, 162, 255, 0.7)",
                  "0px 8px 25px rgba(0, 123, 255, 0.4)"
                ]
              }}
              transition={{
                boxShadow: {
                  repeat: Infinity,
                  duration: 2.5,
                  ease: "easeInOut"
                }
              }}
            >
              {/* Sliding glass/shine glow effect */}
              <motion.span 
                className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                initial={{ left: "-100%" }}
                animate={{ left: "200%" }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2.5, 
                  ease: "easeInOut",
                  repeatDelay: 1
                }}
              />

              <span className="relative z-10 font-sans tracking-widest">
                {lang === "uz"
                  ? "Konsultatsiyaga yozilish"
                  : lang === "ru"
                    ? "Записаться на консультацию"
                    : "Book a Consultation"}
              </span>
              
              <motion.span 
                className="material-symbols-outlined text-[18px] relative z-10"
                animate={{ x: [0, 4, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.2, 
                  ease: "easeInOut" 
                }}
              >
                arrow_forward
              </motion.span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* CORPORATE CALM FOOTER */}
      <footer className="bg-transparent text-white w-full py-10 mt-auto select-none border-t border-white/10 z-20 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="text-xl font-sans font-black text-white flex items-center gap-2 select-none">
              <span
                className="material-symbols-outlined text-[#007bff]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                hearing
              </span>
              MARVA NUR MED LOR
            </div>
            <p className="text-slate-400 text-xs font-sans max-w-sm leading-relaxed">
              {translations[lang].footer.description}
            </p>
            <div className="text-slate-500 text-[11px] font-sans pt-4">
              {translations[lang].footer.copyright}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-300">
              {translations[lang].footer.rulesHeader}
            </h4>
            <ul className="space-y-2.5 font-sans text-xs">
              <li>
                <button
                  onClick={() =>
                    handleLaunchConsultWithTopic(
                      "List guidelines for HIPAA compliance or medical data rules under Marva Nur Med's clinical portal.",
                    )
                  }
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer font-semibold text-left text-xs"
                >
                  {translations[lang].footer.privacyLink}
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    handleLaunchConsultWithTopic(
                      "What is Marva Nur Med's help desk email or phone number? Let me know how to get tech help with this app.",
                    )
                  }
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer font-semibold text-left text-xs"
                >
                  {translations[lang].footer.supportLink}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleOpenAppt()}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer font-semibold text-left text-xs"
                >
                  {translations[lang].footer.bookingLink}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
