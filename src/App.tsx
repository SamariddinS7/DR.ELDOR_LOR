/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Instagram, Send, Phone, Facebook } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import Header from "./components/Header";

// Lazy-load heavy modal components — they are not needed on initial paint
const VirtualConsult = lazy(() => import("./components/VirtualConsult"));
const DiagnosticsSuite = lazy(() => import("./components/DiagnosticsSuite"));
const AppointmentPortal = lazy(() => import("./components/AppointmentPortal"));
const LegacyDesign = lazy(() => import("./components/LegacyDesign"));
import { DepartmentType } from "./types";
import { LanguageType, translations } from "./translations";
import doctorHeroImage from "./assets/images/image.jpg";
import doctorAboutImage from "./assets/images/image (1).jpg";
import entServiceEar from "./assets/images/ent_service_ear_1781508127468.jpg";
import entServiceNose from "./assets/images/ent_service_nose_1781508148718.jpg";
import entServiceThroat from "./assets/images/ent_service_throat_1781508171815.jpg";
import entAudiometry from "./assets/images/ent_audiometry_1781462852681.jpg";
import entDoctorModern from "./assets/images/ent_doctor_modern_1781462875531.jpg";
import marvaClinicImage from "./assets/images/marva_nur_med_klinikasi_1781588549939.jpg";
import earAnatomyIcon from "./assets/images/ear_anatomy_icon_1781463146541.jpg";
import noseAnatomyIcon from "./assets/images/nose_anatomy_icon_1781463164895.jpg";
import throatAnatomyIcon from "./assets/images/throat_anatomy_icon_1781463185308.jpg";

export default function App() {
  // Language configuration
  const [lang, setLang] = useState<LanguageType>("uz");

  // Modern LOR Services List for looping carousel
  const ldfServices = [
    {
      titleUz: "Otologiya (Quloq)",
      titleRu: "Отология (Ухо)",
      titleEn: "Otology (Ear)",
      descUz: "Eshitish a'zolari diagnostikasi va quloq kasalliklari davolash protokollari.",
      descRu: "Диагностика органов слуха, лечение заболеваний ушного канала.",
      descEn: "Standard hearing tests, diagnosis of ear canals & micro-surgery.",
      image: entServiceEar,
      action: "brain" as const,
      badgeUz: "Eshitish a'zolari",
      badgeRu: "Органы слуха",
      badgeEn: "Auditory Pathways"
    },
    {
      titleUz: "Rinologiya (Burun)",
      titleRu: "Ринология (Нос)",
      titleEn: "Rhinology (Nose)",
      descUz: "Burun endoskopiyasi, nafas qisishi va g'ayrioddiy bitishlarni davolash.",
      descRu: "Эндоскопия носа, устранение заложенности и лечение пазух.",
      descEn: "Nasal endoscopy, sinus treatment and airway obstruction surgery.",
      image: entServiceNose,
      action: "liver" as const,
      badgeUz: "Burun nafas yo'llari",
      badgeRu: "Дыхательные пути",
      badgeEn: "Nasal Passages"
    },
    {
      titleUz: "Laringologiya (Tomoq)",
      titleRu: "Ларингология (Горло)",
      titleEn: "Laryngology (Throat)",
      descUz: "Ovoz apparati muammolari, angina va hiqildoq kasalliklari tahlili.",
      descRu: "Проблемы голосового аппарата, лечение ангины и гортани.",
      descEn: "Vocal cord therapy, sore throat relief, and voice enhancement.",
      image: entServiceThroat,
      action: "kidney" as const,
      badgeUz: "Ovoz va Tomoq",
      badgeRu: "Голос и Горло",
      badgeEn: "Vocal & Throat"
    },
    {
      titleUz: "Audiometriya (Eshitish testi)",
      titleRu: "Аудиометрия (Тест слуха)",
      titleEn: "Audiometry Diagnostics",
      descUz: "Eng ilg'or raqamli audiometr yordamida eshitish darajasini o'lchash.",
      descRu: "Анализ порогов слышимости с помощью высокоточного оборудования.",
      descEn: "Audiogram clinical curves and speech recognition evaluation.",
      image: entAudiometry,
      action: "brain" as const,
      badgeUz: "Raqamli test",
      badgeRu: "Цифровой тест",
      badgeEn: "Hearing Thresholds"
    },
    {
      titleUz: "Endoskopik LOR Diagnostikasi",
      titleRu: "Эндоскопический ЛОР",
      titleEn: "Endoscopic ENT Check",
      descUz: "Yuqori aniqlikdagi mikrokamera orqali og'riqsiz ichki a'zolar tekshiruvi.",
      descRu: "Безопасный осмотр скрытых полостей под увеличением микрокамеры.",
      descEn: "Deep visual screening of mucosal linings using high-definition scopes.",
      image: entDoctorModern,
      action: "liver" as const,
      badgeUz: "Mikrokamera",
      badgeRu: "Микрокамера",
      badgeEn: "High-Def Scope"
    },
    {
      titleUz: "Marva Nur Med LOR Terapiyalari",
      titleRu: "Инновационная ЛОР Терапия",
      titleEn: "ENT Clinical Therapy",
      descUz: "Zamonaviy lazer muolajalari, dorili yuvishlar va ingalyatsiya xizmatlari.",
      descRu: "Лазерные процедуры, лекарственные промывания пазух и ингаляции.",
      descEn: "Nebulizer breathing assistance, laser healing, and drug-delivery wash.",
      image: marvaClinicImage,
      action: "kidney" as const,
      badgeUz: "Klinik xizmat",
      badgeRu: "Клинический уход",
      badgeEn: "Complex Care"
    }
  ];

  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % ldfServices.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isPaused, ldfServices.length]);

  const handlePrevSlide = () => {
    setStartIndex((prev) => (prev - 1 + ldfServices.length) % ldfServices.length);
  };

  const handleNextSlide = () => {
    setStartIndex((prev) => (prev + 1) % ldfServices.length);
  };

  // Modal toggle controllers
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [diagnosticsActiveTab, setDiagnosticsActiveTab] = useState<
    "brain" | "liver" | "kidney"
  >("brain");

  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [initialConsultTopic, setInitialConsultTopic] = useState("");

  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [appointmentDefaultDept, setAppointmentDefaultDept] = useState<
    DepartmentType | undefined
  >(undefined);

  // Trigger appt portal with dynamic department focus
  const handleOpenAppt = (dept?: DepartmentType) => {
    setAppointmentDefaultDept(dept);
    setIsAppointmentOpen(true);
  };

  // Trigger diagnostics sandbox
  const handleOpenDiagnostics = (tab: "brain" | "liver" | "kidney") => {
    setDiagnosticsActiveTab(tab);
    setIsDiagnosticsOpen(true);
  };

  const handleLaunchConsultWithTopic = (topic: string) => {
    setInitialConsultTopic(topic);
    setIsConsultOpen(true);
  };

  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const y3 = useTransform(scrollYProgress, [0, 1], [-200, 200]);
  const scaleAnim = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);

  const visibleIndices = [
    (startIndex - 1 + ldfServices.length) % ldfServices.length,
    startIndex % ldfServices.length,
    (startIndex + 1) % ldfServices.length,
  ];

  return (
    <div className="min-h-screen bg-[#061224] text-white flex flex-col font-sans overflow-x-hidden pt-20 relative">
      {/* GLOBAL ANIMATED BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ perspective: "1000px" }}>
        {/* Layer 1 - Moving Top Right Blob */}
        <motion.div 
          style={{ y: y1, scale: scaleAnim }}
          className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-[#00a2ff] rounded-full mix-blend-screen filter blur-[100px] opacity-20"
        />
        {/* Layer 2 - Moving Bottom Left Blob */}
        <motion.div 
          style={{ y: y2, scale: scaleAnim }}
          className="absolute bottom-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-[#0055ff] rounded-full mix-blend-screen filter blur-[120px] opacity-20"
        />
        {/* Layer 3 - Subtle center depth blur */}
        <motion.div 
          style={{ y: y3 }}
          className="absolute top-[30%] left-[30%] w-[30rem] h-[30rem] bg-indigo-600 rounded-full mix-blend-screen filter blur-[150px] opacity-15"
        />
        
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] opacity-30"></div>
      </div>
      {/* NAVIGATION HEADER */}
      <Header
        lang={lang}
        setLang={setLang}
        onOpenConsult={() => {
          setInitialConsultTopic("");
          setIsConsultOpen(true);
        }}
        onOpenAppt={() => handleOpenAppt()}
      />

      {/* HERO SECTION */}
      <section 
        className="relative pt-8 pb-12 px-6 md:px-16 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        style={{ minHeight: "500px" }}
      >
        {/* Left Side: Text Content */}
        <motion.div 
          className="space-y-6 md:space-y-8 z-10"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-block bg-white/5 backdrop-blur-md text-[#00a2ff] font-sans font-bold text-[10px] md:text-xs px-3 md:px-4 py-1.5 md:py-2 rounded-full uppercase tracking-[0.2em] border border-white/10 shadow-[0_0_15px_rgba(0,162,255,0.2)]">
            {lang === "uz" ? "LOR Mutaxassisi" : lang === "ru" ? "ЛОР Специалист" : "ENT Specialist"}
          </div>

          <h1 className="font-sans font-black text-[clamp(1.8rem,4.5vw,3.5rem)] leading-[1.1] tracking-tight uppercase">
            {lang === "uz" ? (
              <>
                SALOM! MEN{" "}
                <span className="inline-block bg-gradient-to-r from-amber-400 via-emerald-400 to-[#00a2ff] bg-clip-text text-transparent border-b-2 border-dashed border-[#00a2ff]/50 pb-0.5 tracking-wide px-1">
                  DR. ELDOR FARXOD O'G'LI
                </span>
              </>
            ) : lang === "ru" ? (
              <>
                ПРИВЕТ! Я{" "}
                <span className="inline-block bg-gradient-to-r from-amber-400 via-emerald-400 to-[#00a2ff] bg-clip-text text-transparent border-b-2 border-dashed border-[#00a2ff]/50 pb-0.5 tracking-wide px-1">
                  ДОКТОР ЭЛЬДОР ФАРХОДОВИЧ
                </span>
              </>
            ) : (
              <>
                HELLO! I AM{" "}
                <span className="inline-block bg-gradient-to-r from-amber-400 via-emerald-400 to-[#00a2ff] bg-clip-text text-transparent border-b-2 border-dashed border-[#00a2ff]/50 pb-0.5 tracking-wide px-1">
                  DR. ELDOR FARXOD O'G'LI
                </span>
              </>
            )} <br />
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a2ff] to-[#0055ff] text-[clamp(1.4rem,3.2vw,2.5rem)] block mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {lang === "uz" ? "MARVA NUR MED LOR SHIFOKORI" : lang === "ru" ? "ЛОР-ВРАЧ КЛИНИКИ MARVA NUR MED" : "ENT SURGEON AT MARVA NUR MED"}
              <span className="text-white"> |</span>
            </motion.span>
          </h1>

          <p className="font-sans text-slate-300 text-sm md:text-base leading-relaxed max-w-lg shadow-sm">
            {lang === "uz" 
              ? "Marva Nur Med klinikasining oliy toifali LOR shifokoriman. Quloq, burun va tomoq kasalliklarining mukammal konservativ, jarrohlik va endoskopik muolajalarini olib boraman." 
              : lang === "ru" 
              ? "Я ведущий оториноларинголог высшей категории клиники Marva Nur Med. Провожу высокоточную лазерную, эндоскопическую диагностику и эффективное лечение уха, горла и носа." 
              : "Chief otorhinolaryngologist (ENT Specialist) at Marva Nur Med Clinic. Specializing in advanced endoscopic and microscopic procedures of ear, nose, and throat pathology."}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <button
              onClick={() => handleOpenAppt()}
              className="bg-gradient-to-r from-[#007bff] to-[#0044ff] text-white font-sans font-bold text-xs uppercase tracking-widest px-8 md:px-10 py-3.5 md:py-4 rounded-full flex items-center gap-3 hover:from-[#0055ff] hover:to-[#0033cc] transition-all duration-300 shadow-[0_10px_30px_rgba(0,123,255,0.4)] hover:shadow-[0_15px_40px_rgba(0,123,255,0.6)] transform hover:-translate-y-1"
            >
              {lang === "uz" ? "Bog'lanish" : lang === "ru" ? "Связаться" : "Get in touch"} 
              <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </button>

            {/* Social Orbs */}
            <div className="flex gap-5 border border-white/10 rounded-full px-5 py-2.5 items-center bg-white/5 backdrop-blur-xl shadow-inner">
              <a href="https://instagram.com/Lor_Eldor" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-pink-500/30 flex items-center justify-center text-pink-500 hover:text-white hover:bg-gradient-to-tr hover:from-pink-500 hover:to-orange-500 transition-all duration-300 hover:-translate-y-1.5 hover:scale-110 hover:shadow-[0_0_25px_rgba(236,72,153,0.8)] group relative overflow-hidden bg-black/20">
                 <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
                 <Instagram size={18} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a href="https://t.me/Lor_Eldor" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-sky-500/30 flex items-center justify-center text-sky-500 hover:bg-sky-500 hover:text-white transition-all duration-300 hover:-translate-y-1.5 hover:scale-110 hover:shadow-[0_0_25px_rgba(14,165,233,0.8)] group relative overflow-hidden bg-black/20">
                 <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
                 <Send size={18} className="relative z-10 mr-0.5 mt-0.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a href="tel:+998995280323" className="w-10 h-10 rounded-full border border-green-500/30 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300 hover:-translate-y-1.5 hover:scale-110 hover:shadow-[0_0_25px_rgba(34,197,94,0.8)] group relative overflow-hidden bg-black/20">
                 <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
                 <Phone size={18} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Doctor Hero Image */}
        <motion.div 
          className="relative flex justify-center lg:justify-end"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Abstract background circles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <motion.div 
               className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full border border-[#00a2ff]/20 opacity-50"
               animate={{ rotate: 360, scale: [1, 1.05, 1] }} 
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             ></motion.div>
             <div className="absolute w-[250px] h-[250px] md:w-[380px] md:h-[380px] rounded-full border border-white/5 opacity-70"></div>
             <div className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full border border-[rgba(0,162,255,0.1)]" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)"}}></div>
          </div>

          <div className="relative z-10 w-full max-w-[400px]">
             <img
               src={doctorHeroImage}
               alt="LOR Doctor profile"
               fetchPriority="high"
               decoding="sync"
               width="511"
               height="680"
               className="w-full h-auto object-cover rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10"
               style={{ maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)" }}
             />
             {/* Floating decorative elements mimicking the dark orbs in the design */}
             <div className="absolute top-10 -left-6 w-12 h-12 rounded-full bg-gradient-to-br from-[#00a2ff] to-[#0055ff] shadow-[0_0_30px_rgba(0,162,255,0.6)] border border-white/20 z-20 mix-blend-screen opacity-90 backdrop-blur-md animate-float" style={{ willChange: "transform" }}></div>
             <div className="absolute top-1/2 -right-8 w-16 h-16 rounded-full bg-gradient-to-br from-[#12366b] to-[#040e21] shadow-[0_0_40px_rgba(0,162,255,0.4)] border border-[#007bff]/40 z-20 mix-blend-screen opacity-90 animate-float-delayed" style={{ willChange: "transform" }}></div>
          </div>
        </motion.div>
      </section>

      {/* TRUST STATS STRIP */}
      <motion.section
        className="border-t border-b border-white/5 bg-[#081222] py-5 mt-6 w-full"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {[
            { icon: "groups",             num: "5 000+", labelUz: "Davolangan bemor",   labelRu: "Пациентов",        labelEn: "Patients treated" },
            { icon: "workspace_premium",  num: "23+",    labelUz: "Mukofotlar",         labelRu: "Наград",           labelEn: "Awards" },
            { icon: "calendar_month",     num: "5+",     labelUz: "Yil tajriba",        labelRu: "Лет опыта",        labelEn: "Years experience" },
            { icon: "star",               num: "4.9★",   labelUz: "Bemor bahosi",       labelRu: "Рейтинг",          labelEn: "Patient rating" },
            { icon: "verified",           num: "100%",   labelUz: "Sertifikatlangan",   labelRu: "Сертифицирован",   labelEn: "Board certified" },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2.5 group select-none">
              <span
                className="material-symbols-outlined text-[#00a2ff]/50 text-xl group-hover:text-[#00a2ff] transition-colors duration-300"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >{s.icon}</span>
              <div>
                <div className="text-white font-black text-sm md:text-base leading-none stat-glow">
                  {s.num}
                </div>
                <div className="text-slate-500 text-[10px] font-sans font-medium mt-0.5 group-hover:text-slate-300 transition-colors duration-300">
                  {lang === "uz" ? s.labelUz : lang === "ru" ? s.labelRu : s.labelEn}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ABOUT US SECTION */}
      <section 
        className="relative py-12 px-6 md:px-16 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center"
        style={{ paddingTop: "15px", minHeight: "450px" }}
      >
         {/* Left Side: Photo with glow */}
         <motion.div 
           className="relative flex justify-center md:justify-start"
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8 }}
         >
            {/* Abstract radial element */}
            <div className="absolute -bottom-16 -left-16 w-64 h-64 border border-[#007bff]/30 rounded-full border-dashed animate-[spin_30s_linear_infinite] pointer-events-none opacity-60"></div>
            
            <div className="w-full max-w-[400px] h-[550px] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,162,255,0.15)] relative z-10 bg-[#0c1e3a] border border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <img 
                  src={doctorAboutImage} 
                  alt="ENT Professional" 
                  loading="lazy"
                  decoding="async"
                  width="768"
                  height="1376"
                  className="w-full object-cover scale-[1.01] transition-transform duration-700 group-hover:scale-[1.05]"
                  style={{ borderRadius: "32px", height: "1100px" }}
                />
            </div>
         </motion.div>

         {/* Right Side: Details */}
         <motion.div 
           className="space-y-6 relative"
           initial={{ opacity: 0, x: 50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, delay: 0.2 }}
         >
            {/* Right abstract radial */}
            <div className="absolute -top-12 -right-12 w-32 h-32 border-[8px] border-[#007bff]/20 border-dotted rounded-full animate-[spin_20s_linear_infinite] pointer-events-none opacity-60"></div>

            <div className="inline-block bg-[#00a2ff]/10 text-[#00a2ff] font-sans font-bold text-[10px] md:text-xs px-3 md:px-4 py-1.5 md:py-2 rounded-full uppercase tracking-[0.2em] border border-[#00a2ff]/20">
              {lang === "uz" ? "BIZ HAQIMIZDA" : lang === "ru" ? "О НАС" : "ABOUT US"}
            </div>

            <h2 className="font-sans font-black text-[clamp(1.5rem,3.8vw,2.5rem)] leading-[1.1] uppercase max-w-xl">
              {lang === "uz" ? "SIZNING LOR SALOMATLIGINGIZ UCHUN " : lang === "ru" ? "ВАШЕ ЛОР ЗДОРОВЬЕ - " : "YOUR ENT HEALTH FOR "} 
              <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a2ff] to-[#0055ff]">
                {lang === "uz" ? "OLIY TOIFALI LOR MUTAXASSISI" : lang === "ru" ? "ЛОР-ВРАЧ ВЫСШЕЙ КАТЕГОРИИ" : "BOARD CERTIFIED ENT SURGEON"}
              </span>
            </h2>

            <p className="font-sans text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mt-6">
              {lang === "uz" 
                ? "Men va jamoamiz LOR kasalliklarini diagnostika qilish va davolashda ko'p yillik tajribaga egamiz. Har bir bemor uchun individual diagnostika, zamonaviy LOR xizmatlari va xalqaro me'yorlarga to'liq mos keladigan davolash dasturlarini taqdim etaman." 
                : lang === "ru" 
                ? "Я и моя команда клиники Marva Nur Med имеем многолетний опыт лечения проблем со слухом, дыханием и речью. Я лично гарантирую индивидуальный подход, точную ЛОР-диагностику и эффективность лечения." 
                : "My team at Marva Nur Med and I have years of expertise in handling ear, nose, and throat pathology. I actively deliver personalized clinical diagnostics and safe, globally compliant respiratory and vocal therapies."}
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-6 pt-6 max-w-lg border-b border-white/10 pb-8 mb-4">
               <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} viewport={{ once: true }}>
                  <div className="text-3xl font-black text-white mb-1">5.000<span className="text-[#007bff]">+</span></div>
                  <div className="text-[10px] text-slate-400 font-sans tracking-widest font-bold">
                    {lang === "uz" ? "Bemorlar" : lang === "ru" ? "Пациенты" : "Patients Served"}
                  </div>
               </motion.div>
               <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} viewport={{ once: true }}>
                  <div className="text-3xl font-black text-white mb-1">5<span className="text-[#007bff]">+</span></div>
                  <div className="text-[10px] text-slate-400 font-sans tracking-widest font-bold">
                    {lang === "uz" ? "Yil Tajriba" : lang === "ru" ? "Лет Опыта" : "Years Experience"}
                  </div>
               </motion.div>
               <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} viewport={{ once: true }}>
                  <div className="text-3xl font-black text-white mb-1">23<span className="text-[#007bff]">+</span></div>
                  <div className="text-[10px] text-slate-400 font-sans tracking-widest font-bold">
                    {lang === "uz" ? "Mukofotlar" : lang === "ru" ? "Награды" : "Awards Reached"}
                  </div>
               </motion.div>
            </div>

            <button
              onClick={() => handleOpenAppt()}
              className="bg-gradient-to-r from-[#007bff] to-[#0044ff] text-white font-sans font-bold text-[10px] md:text-xs uppercase tracking-widest px-8 md:px-10 py-3.5 md:py-4 rounded-full flex items-center gap-3 hover:from-[#0055ff] hover:to-[#0033cc] transition-all duration-300 shadow-[0_10px_30px_rgba(0,123,255,0.3)] hover:shadow-[0_15px_40px_rgba(0,123,255,0.5)] transform hover:-translate-y-1 mt-4"
            >
              {lang === "uz" ? "Bog'lanish" : lang === "ru" ? "Связаться" : "Get in touch"} 
              <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </button>
         </motion.div>
      </section>

      {/* RECENT PROJECTS / SERVICES WITH ROTATING CAROUSEL LOOP */}
      <section 
        id="recent-services"
        className="relative py-12 px-6 md:px-16 mx-auto w-full z-10 bg-gradient-to-b from-[#0c2148] via-[#071633] to-[#061224] flex flex-col items-center border-y border-white/10 shadow-[inset_0_40px_100px_rgba(0,162,255,0.02)]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{ minHeight: "600px" }}
      >
         <div className="max-w-7xl mx-auto w-full">
           <div className="w-full flex flex-col items-center justify-center mb-12 gap-6 text-center">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex flex-col items-center">
                 <div className="inline-block text-[#00a2ff] font-sans font-bold text-xs tracking-[0.2em] border border-[#00a2ff]/30 rounded-full px-4 py-1.5 mb-4 bg-[#00a2ff]/10">
                   {lang === "uz" ? "AMALIYOTLAR & DIAGNOSTIKA" : lang === "ru" ? "ПРОЦЕДУРЫ И ДИАГНОСТИКА" : "PRACTICES & DIAGNOSTICS"}
                 </div>
                 <h2 className="font-sans font-black text-[clamp(1.5rem,4vw,2.5rem)] leading-[1.1] uppercase text-white tracking-wide">
                   {lang === "uz" ? "LOR AMALIYOTLARI" : lang === "ru" ? "ЛОР ПРОЦЕДУРЫ" : "ENT PROCEDURES & CARE"}
                 </h2>
                 <p className="text-slate-400 font-sans text-xs md:text-sm mt-3 max-w-xl mx-auto">
                   {lang === "uz" 
                     ? "Klinikamning zamonaviy LOR amaliyotlari va mening ilg'or davolash standartlarim bilan tanishing." 
                     : lang === "ru" 
                     ? "Ознакомьтесь с современными ЛОР-процедурами моей клиники и передовыми стандартами моего лечения." 
                     : "Explore my state-of-the-art ENT procedures, diagnostics, and customized treatment plans."}
                 </p>
              </motion.div>
           </div>

           {/* Carousel Container - Smooth Marquee Loop */}
           <div className="w-full overflow-hidden relative py-4">
              <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-[#0c2148] to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-[#061224] to-transparent z-10 pointer-events-none"></div>
              
              <div className="animate-marquee-left flex gap-6 px-3">
                 {[...ldfServices, ...ldfServices, ...ldfServices].map((item, i) => {
                    const currentTitle = lang === "uz" ? item.titleUz : lang === "ru" ? item.titleRu : item.titleEn;
                    const currentDesc = lang === "uz" ? item.descUz : lang === "ru" ? item.descRu : item.descEn;
                    const currentBadge = lang === "uz" ? item.badgeUz : lang === "ru" ? item.badgeRu : item.badgeEn;

                    return (
                       <div 
                          key={i}
                          className="w-[85vw] sm:w-[350px] md:w-[400px] shrink-0 relative flex flex-col group"
                       >
                          <div className="w-full h-full bg-[#0c1e3a]/90 backdrop-blur-xl rounded-3xl p-5 flex flex-col overflow-hidden border shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-white/5 transition-all duration-500 ease-in-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,162,255,0.15)] hover:border-[#00a2ff]/30">
                             <div className="w-full h-48 md:h-52 rounded-2xl overflow-hidden mb-5 relative bg-[#061224] shadow-inner">
                                 <div className="absolute top-3 left-3 bg-black/70 text-white border border-white/20 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full z-20 backdrop-blur-md">
                                   {currentBadge}
                                 </div>
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                                 <img 
                                   src={item.image} 
                                   alt={currentTitle} 
                                   loading="lazy"
                                   decoding="async"
                                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                 />
                             </div>
                             
                             <div className="flex flex-col flex-grow justify-between text-left px-2">
                               <div>
                                 <h3 className="font-sans font-black text-white text-lg md:text-xl tracking-tight group-hover:text-[#00a2ff] transition-colors duration-300">
                                   {currentTitle}
                                 </h3>
                                 <p className="font-sans text-xs text-slate-400 leading-relaxed mt-2 min-h-[40px]">
                                   {currentDesc}
                                 </p>
                               </div>

                               <div className="flex justify-between items-center pt-5 mt-5 border-t border-white/10">
                                 <span className="font-sans text-[10px] text-slate-500 font-extrabold uppercase tracking-widest group-hover:text-slate-300 transition-colors duration-300">
                                   {lang === "uz" ? "INTERAKTIV DIAGNOSTIKA" : lang === "ru" ? "ДИАГНОСТИКА" : "INTERACTIVE CHECK"}
                                 </span>
                                 
                                 <button 
                                   onClick={() => handleOpenDiagnostics(item.action)}
                                   className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#00a2ff] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer shrink-0 border border-white/10 hover:border-transparent group/btn"
                                   title={lang === "uz" ? "Simulyatorni boshlash" : lang === "ru" ? "Запустить симулятор" : "Launch Simulator"}
                                 >
                                   <span className="material-symbols-outlined text-base group-hover/btn:rotate-12 transition-transform">science</span>
                                 </button>
                               </div>
                             </div>
                          </div>
                       </div>
                    );
                 })}
              </div>
           </div>
         </div>
      </section>

            {/* ORGAN ASSESSMENT CARDS ROW */}
      <section className="bg-[#0a172c] py-10 border-y border-white/10 relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center space-y-4 mb-12">
          <span className="text-[#007bff] text-xs uppercase font-sans font-black tracking-widest">
            {translations[lang].playground.badge}
          </span>
          <h2 className="font-sans font-extrabold text-white text-[clamp(1.8rem,3vw,2.5rem)]">
            {translations[lang].playground.title}
          </h2>
          <p className="text-slate-400 text-xs md:text-sm font-sans max-w-lg mx-auto">
            {translations[lang].playground.description}
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Ear / Otology card */}
          <div
            onClick={() => handleOpenDiagnostics("brain")}
            className="bg-[#102341] p-6 rounded-3xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,162,255,0.15)] hover:border-[#00a2ff]/20 transition-all duration-300 cursor-pointer group flex flex-col items-center text-center relative overflow-hidden border border-white/5"
          >
            <div className="w-12 h-12 rounded-full bg-[#007bff]/20 flex items-center justify-center self-end mb-2 group-hover:bg-[#007bff] transition-colors">
              <span className="material-symbols-outlined text-[#00a2ff] group-hover:text-white">
                arrow_outward
              </span>
            </div>

            <img
              alt="Otology Ear Health model"
              className="h-64 object-contain mb-4 select-none pointer-events-none animate-float-sm rounded-3xl"
              src={earAnatomyIcon}
              loading="lazy"
              decoding="async"
              style={{ mixBlendMode: 'screen', willChange: "transform" }}
            />

            <h3 className="font-sans font-extrabold text-xl text-white mt-2">
              {translations[lang].playground.brainTitle}
            </h3>
            <p className="text-[11px] text-slate-400 font-sans mt-2">
              {translations[lang].playground.brainDesc}
            </p>
          </div>

          {/* Nose / Rhinology card */}
          <div
            onClick={() => handleOpenDiagnostics("liver")}
            className="bg-[#102341] p-6 rounded-3xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,162,255,0.15)] hover:border-[#00a2ff]/20 transition-all duration-300 cursor-pointer group flex flex-col items-center text-center relative overflow-hidden border border-white/5"
          >
            <div className="w-12 h-12 rounded-full bg-[#007bff]/20 flex items-center justify-center self-end mb-2 group-hover:bg-[#007bff] transition-colors">
              <span className="material-symbols-outlined text-[#00a2ff] group-hover:text-white">
                arrow_outward
              </span>
            </div>

            <img
              alt="Rhinology Nose scan model"
              className="h-64 object-contain mb-4 select-none pointer-events-none animate-float-sm rounded-3xl"
              src={noseAnatomyIcon}
              loading="lazy"
              decoding="async"
              style={{ animationDelay: "0.5s", mixBlendMode: 'screen', willChange: "transform" }}
            />

            <h3 className="font-sans font-extrabold text-xl text-white mt-2">
              {translations[lang].playground.liverTitle}
            </h3>
            <p className="text-[11px] text-slate-400 font-sans mt-2">
              {translations[lang].playground.liverDesc}
            </p>
          </div>

          {/* Kidney card up (Active style) */}
          <div
            onClick={() => handleOpenDiagnostics("kidney")}
            className="bg-[#007bff] p-6 rounded-3xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col items-center text-center shadow-2xl shadow-[#007bff]/30 relative overflow-hidden border border-blue-400/30"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>

            <div className="w-12 h-12 rounded-full bg-white/25 flex items-center justify-center self-end mb-2 group-hover:bg-white transition-colors relative z-10">
              <span className="material-symbols-outlined text-white group-hover:text-[#007bff]">
                arrow_outward
              </span>
            </div>

            <img
              alt="Laryngology Throat model"
              className="h-64 object-contain mb-4 relative z-10 animate-float-sm opacity-95 rounded-3xl"
              src={throatAnatomyIcon}
              loading="lazy"
              decoding="async"
              style={{ animationDelay: "1s", mixBlendMode: 'screen', willChange: "transform" }}
            />

            <h3 className="font-sans font-extrabold text-xl text-white relative z-10 mt-2">
              {translations[lang].playground.kidneyTitle}
            </h3>
            <p className="text-[11px] text-[#e0eaff] relative z-10 font-sans mt-2">
              {translations[lang].playground.kidneyDesc}
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <LegacyDesign
          lang={lang}
          handleOpenDiagnostics={handleOpenDiagnostics}
          setIsConsultOpen={setIsConsultOpen}
          handleOpenAppt={handleOpenAppt}
          handleLaunchConsultWithTopic={handleLaunchConsultWithTopic}
        />
      </Suspense>

      {/* MODALS MOUNT */}

      {/* 1. AI Virtual Consult */}
      <Suspense fallback={null}>
        <VirtualConsult
          lang={lang}
          isOpen={isConsultOpen}
          onClose={() => setIsConsultOpen(false)}
          initialTopic={initialConsultTopic}
          onBookAppointmentShortcut={handleOpenAppt}
        />
      </Suspense>

      {/* 2. ENT Diagnostic Sandbox Suite */}
      <Suspense fallback={null}>
        <DiagnosticsSuite
          lang={lang}
          isOpen={isDiagnosticsOpen}
          onClose={() => setIsDiagnosticsOpen(false)}
          activeTab={diagnosticsActiveTab}
          onTabChange={setDiagnosticsActiveTab}
          onBookAppointmentShortcut={handleOpenAppt}
        />
      </Suspense>

      {/* 3. Appointment booking scheduler */}
      <Suspense fallback={null}>
        <AppointmentPortal
          lang={lang}
          isOpen={isAppointmentOpen}
          onClose={() => setIsAppointmentOpen(false)}
          defaultDepartment={appointmentDefaultDept}
        />
      </Suspense>
    </div>
  );
}
