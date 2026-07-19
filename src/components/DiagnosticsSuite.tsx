import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import { LanguageType, translations } from "../translations";

interface DiagnosticsSuiteProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: "brain" | "liver" | "kidney";
  onTabChange: (tab: "brain" | "liver" | "kidney") => void;
  onBookAppointmentShortcut?: (dept: string) => void;
  lang: LanguageType;
}

export default function DiagnosticsSuite({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  onBookAppointmentShortcut,
  lang
}: DiagnosticsSuiteProps) {
  const t = translations[lang].diagnostics;

  // --- NEW DIAGNOSTIC STATE (REPLACING LEGACY) ---
  
  // Otology (Hearing/Threshold) Test
  const [activeFreqIdx, setActiveFreqIdx] = useState(-1); // -1: Not started
  const [currentDb, setCurrentDb] = useState(0);
  const [hearingResults, setHearingResults] = useState<Record<number, number>>({});
  const frequencies = [250, 500, 1000, 2000, 4000, 8000];

  // Rhinology (Nose/Sinus) Test
  const [nasalMap, setNasalMap] = useState({
    maxillary: false,
    frontal: false,
    ethmoid: false,
    sphenoid: false,
    obstruction: 50
  });

  // Laryngology (Throat/Vocal) Test
  const [vocalMetrics, setVocalMetrics] = useState({
    stability: 85,
    breathiness: 20,
    tension: 15,
    painLevel: 0
  });

  // Common Clinical state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState<Record<string, boolean>>({
    brain: false,
    liver: false,
    kidney: false
  });

  // Live instant analysis shown in right panel immediately after test completes
  const [liveInsight, setLiveInsight] = useState<string | null>(null);

  // Rhinology workflow steps
  const [rhinoStep, setRhinoStep] = useState<"intro" | "interactive" | "scanning" | "complete">("intro");
  const [rhinoScanMessage, setRhinoScanMessage] = useState("");

  // Laryngology workflow steps
  const [laryngoStep, setLaryngoStep] = useState<"intro" | "interactive" | "scanning" | "complete">("intro");
  const [laryngoScanMessage, setLaryngoScanMessage] = useState("");

  // Play dynamic clinical sine tone
  const playTone = (frequency: number, dbValue: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.value = frequency;
      
      // Map dB (0 to 90) to safe volume gain (0.01 to 0.15)
      const baseGain = 0.01 + (0.14) * (dbValue / 90);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(baseGain, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(baseGain, ctx.currentTime + 0.25);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn("AudioContext init skipped due to browser sandbox protection:", e);
    }
  };

  // Report state (AI Gen)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportMarkdown, setReportMarkdown] = useState<string | null>(null);

  // --- ENT DIAGNOSTIC ENGINES ---

  // Audiometry Sweep logic
  useEffect(() => {
    let interval: any;
    if (activeFreqIdx >= 0 && activeFreqIdx < frequencies.length && isSimulating) {
      interval = setInterval(() => {
        setCurrentDb(prev => {
          if (prev >= 90) {
            // Auto-move if not clicked (worst case)
            handleFoundThreshold();
            return 0;
          }
          const next = prev + 2;
          // Pulse tone periodically as decibel rises
          if (next % 10 === 0) {
            playTone(frequencies[activeFreqIdx], next);
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [activeFreqIdx, isSimulating]);

  const startHearingTest = () => {
    setHearingResults({});
    setActiveFreqIdx(0);
    setCurrentDb(0);
    setIsSimulating(true);
    setSimulationComplete(prev => ({ ...prev, brain: false }));
  };

  const handleFoundThreshold = () => {
    const freq = frequencies[activeFreqIdx];
    const updatedResults = { ...hearingResults, [freq]: currentDb };
    setHearingResults(updatedResults);
    
    if (activeFreqIdx < frequencies.length - 1) {
      setActiveFreqIdx(prev => prev + 1);
      setCurrentDb(0);
    } else {
      setIsSimulating(false);
      setActiveFreqIdx(-1);
      setSimulationComplete(prev => ({ ...prev, brain: true }));
      // Show live insight immediately — no API call needed
      setLiveInsight(computeLiveInsight("brain", updatedResults, nasalMap, vocalMetrics));
      setReportMarkdown(null);
    }
  };

  // Rhinology toggle
  const toggleSinusZone = (zone: keyof typeof nasalMap) => {
    if (typeof nasalMap[zone] === 'boolean') {
      setNasalMap(prev => ({ ...prev, [zone]: !prev[zone] }));
    }
  };

  const startRhinologyScan = () => {
    setRhinoStep("scanning");
    const messages = [
      lang === "uz" ? "Burun yo'llari qarshiligini tahlil qilish..." : "Analyzing narial airflow resistance...",
      lang === "uz" ? "Sinus ostiumi kanallarini skanerlash..." : "Scanning sinus ostia pathways...",
      lang === "uz" ? "Shilliq qavat shish ko'rsatkichini qayd etish..." : "Registering mucosal engorgement index..."
    ];
    let idx = 0;
    setRhinoScanMessage(messages[0]);
    
    const msgInterval = setInterval(() => {
      idx++;
      if (idx < messages.length) {
        setRhinoScanMessage(messages[idx]);
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(msgInterval);
      setRhinoStep("complete");
      setSimulationComplete(prev => ({ ...prev, liver: true }));
      setLiveInsight(computeLiveInsight("liver", hearingResults, nasalMap, vocalMetrics));
      setReportMarkdown(null);
    }, 3000);
  };

  const startLaryngologyScan = () => {
    setLaryngoStep("scanning");
    const messages = [
      lang === "uz" ? "Ovoz apparatining asosiy chastotasini (F0) hisoblash..." : "Capturing fundamental voice frequency (F0)...",
      lang === "uz" ? "Ovoz va jitter koeffitsiyentlarini aniqlash..." : "Calculating vocal perturbation & shimmer quotients...",
      lang === "uz" ? "Tomoq namligi va shilliq to'siq darajasini baholash..." : "Evaluating laryngeal mucosal lubrication index..."
    ];
    let idx = 0;
    setLaryngoScanMessage(messages[0]);
    
    const msgInterval = setInterval(() => {
      idx++;
      if (idx < messages.length) {
        setLaryngoScanMessage(messages[idx]);
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(msgInterval);
      setLaryngoStep("complete");
      setSimulationComplete(prev => ({ ...prev, kidney: true }));
      setLiveInsight(computeLiveInsight("kidney", hearingResults, nasalMap, vocalMetrics));
      setReportMarkdown(null);
    }, 3000);
  };

  // ── Live client-side insight: computed immediately after test completes ──────
  // This gives the user instant, personalised feedback without any API call.
  const computeLiveInsight = (
    tab: "brain" | "liver" | "kidney",
    hearing: Record<number, number>,
    nasal: typeof nasalMap,
    vocal: typeof vocalMetrics
  ): string => {
    const tr = (uz: string, ru: string, en: string) =>
      lang === "ru" ? ru : lang === "en" ? en : uz;

    if (tab === "brain") {
      const freqs = [250, 500, 1000, 2000, 4000, 8000];
      const ptaFreqs = [500, 1000, 2000];
      const pta = ptaFreqs.length
        ? ptaFreqs.reduce((s, f) => s + (hearing[f] ?? 0), 0) / ptaFreqs.length
        : 0;

      const classify = (db: number) =>
        db <= 25 ? tr("Me'yor ✓", "Норма ✓", "Normal ✓")
        : db <= 40 ? tr("Yengil yo'qolish", "Лёгкая тугоухость", "Mild loss")
        : db <= 55 ? tr("O'rtacha yo'qolish", "Умеренная", "Moderate loss")
        : db <= 70 ? tr("O'rtacha-og'ir ⚠️", "Умеренно-тяжёлая ⚠️", "Moderately severe ⚠️")
        : tr("Og'ir ⚠️", "Тяжёлая ⚠️", "Severe ⚠️");

      const ptaLabel = classify(pta);
      const highAvg = ([2000, 4000, 8000].reduce((s, f) => s + (hearing[f] ?? 0), 0)) / 3;
      const lowAvg  = ([250,  500, 1000].reduce((s, f) => s + (hearing[f] ?? 0), 0)) / 3;
      const pattern = highAvg - lowAvg > 15
        ? tr("📉 Yuqori chastota yo'qolishi (shovqindan zarar yoki yosh o'zgarishi)", "📉 Потеря высоких частот", "📉 High-frequency loss pattern")
        : lowAvg - highAvg > 15
          ? tr("📉 Past chastota yo'qolishi (ehtimol Menyer kasalligi)", "📉 Низкочастотная потеря", "📉 Low-frequency loss pattern")
          : tr("〜 Tekis profil (o'tkazuvchan yo'qolish xavfi)", "〜 Плоский профиль", "〜 Flat audiogram profile");

      const rows = freqs.map(f =>
        `| **${f} Hz** | ${hearing[f] ?? "—"} dB | ${typeof hearing[f] === "number" ? classify(hearing[f]) : "—"} |`
      ).join("\n");

      return (
        `### 🎧 ${tr("Tezkor Audiometriya Xulosasi", "Быстрый аудиометрический отчёт", "Quick Audiometry Summary")}\n\n` +
        `**PTA (500–2000 Hz):** ${pta.toFixed(1)} dB — **${ptaLabel}**\n\n` +
        `**${tr("Chastota profili", "Профиль частот", "Frequency pattern")}:** ${pattern}\n\n` +
        `| Hz | dB | ${tr("Daraja", "Уровень", "Level")} |\n|---|---|---|\n${rows}\n\n` +
        `> ${tr("To'liq tibbiy xulosa uchun quyidagi «Hisobot yaratish» tugmasini bosing.", "Для полного медицинского заключения нажмите «Создать отчёт».", "Click 'Generate Report' below for a full clinical write-up.")}`
      );
    }

    if (tab === "liver") {
      const obs = nasal.obstruction;
      const affected = (["maxillary", "frontal", "ethmoid", "sphenoid"] as const)
        .filter(k => nasal[k] === true);
      const sinusLabels: Record<string, string> = {
        maxillary: tr("Maxillary", "Верхнечелюст.", "Maxillary"),
        frontal:   tr("Frontal",   "Лобный",        "Frontal"),
        ethmoid:   tr("Ethmoid",   "Решётч.",        "Ethmoid"),
        sphenoid:  tr("Sphenoid",  "Клиновид.",      "Sphenoid"),
      };
      const obsBadge = obs <= 30
        ? `✅ ${tr("Yaxshi nafas", "Свободно", "Clear")}`
        : obs <= 60
          ? `🟡 ${tr("Yengil to'siq", "Умеренная обстр.", "Mild obstruction")}`
          : `🔴 ${tr("Og'ir to'siq", "Тяжёлая обстр.", "Severe obstruction")}`;

      const riskNote = affected.length >= 3
        ? tr("⚠️ Bir nechta sinus ta'sirlangan — pansinus xavfi.", "⚠️ Пансинусит — несколько пазух.", "⚠️ Multiple sinuses — pansinusitis risk.")
        : affected.length === 0
          ? tr("✅ Bosim nuqtalari aniqlanmadi.", "✅ Давления не выявлено.", "✅ No pressure points detected.")
          : `🟡 ${tr(`Ta'sir: ${affected.map(k => sinusLabels[k]).join(", ")}`, `Поражены: ${affected.map(k => sinusLabels[k]).join(", ")}`, `Affected: ${affected.map(k => sinusLabels[k]).join(", ")}`)}`;

      return (
        `### 👃 ${tr("Tezkor Rinologiya Tahlili", "Быстрый риноанализ", "Quick Rhinology Summary")}\n\n` +
        `**${tr("Havo o'tish", "Обструкция", "Obstruction")}:** ${obs}% — ${obsBadge}\n\n` +
        `**${tr("Sinus xaritasi", "Карта пазух", "Sinus map")}:** ${riskNote}\n\n` +
        (obs > 60
          ? `> ⚠️ ${tr("Og'ir to'siq — Marva Nur Med endoskopik tekshiruviga yozilish tavsiya etiladi.", "Тяжёлая обструкция — рекомендуем эндоскопию в Marva Nur Med.", "Severe obstruction — endoscopic evaluation at Marva Nur Med recommended.")}\n\n`
          : "") +
        `> ${tr("Batafsil tibbiy ko'rsatmalar uchun «Hisobot yaratish» tugmasini bosing.", "Подробные рекомендации — кнопка «Создать отчёт».", "Tap 'Generate Report' for detailed clinical guidance.")}`
      );
    }

    if (tab === "kidney") {
      const { stability, breathiness, tension, painLevel } = vocal;
      const stabBadge = stability >= 75 ? `✅ ${tr("Barqaror", "Стабильно", "Stable")}`
        : stability >= 50 ? `🟡 ${tr("O'rtacha", "Умеренно", "Moderate")}`
        : `🔴 ${tr("Past barqarorlik", "Низкая стабильность", "Low stability")}`;
      const breathBadge = breathiness > 50 ? `🔴 ${tr("Yuqori ⚠️", "Высокий ⚠️", "High ⚠️")}`
        : breathiness > 30 ? `🟡 ${tr("O'rtacha", "Умеренный", "Moderate")}`
        : `✅ ${tr("Me'yor", "Норма", "Normal")}`;
      const tensBadge = tension > 60 ? `🔴 ${tr("Yuqori zo'riqish ⚠️", "Высокое ⚠️", "High tension ⚠️")}`
        : tension > 35 ? `🟡 ${tr("O'rtacha", "Умеренное", "Moderate")}`
        : `✅ ${tr("Minimal", "Минимально", "Minimal")}`;
      const painBadge = painLevel === 0 ? `✅ ${tr("Og'riqsiz", "Без боли", "Pain-free")}`
        : painLevel <= 3 ? `🟡 ${tr("Minimal", "Минимальная", "Minimal")}`
        : painLevel <= 6 ? `🔴 ${tr("O'rtacha ⚠️", "Умеренная ⚠️", "Moderate ⚠️")}`
        : `🔴 ${tr("Kuchli — darhol uchrashing", "Сильная — срочно", "Significant — urgent")}`;

      return (
        `### 🗣️ ${tr("Tezkor Vokal Profil Tahlili", "Быстрый вокальный профиль", "Quick Vocal Profile Summary")}\n\n` +
        `| ${tr("Ko'rsatkich", "Показатель", "Metric")} | ${tr("Qiymat", "Значение", "Value")} | ${tr("Holat", "Статус", "Status")} |\n|---|---|---|\n` +
        `| ${tr("Barqarorlik", "Стабильность", "Stability")} | ${stability}% | ${stabBadge} |\n` +
        `| ${tr("Shovqin", "Breathiness", "Breathiness")} | ${breathiness}% | ${breathBadge} |\n` +
        `| ${tr("Zo'riqish", "Напряжение", "Tension")} | ${tension}% | ${tensBadge} |\n` +
        `| ${tr("Og'riq", "Боль", "Pain")} | ${painLevel}/10 | ${painBadge} |\n\n` +
        (breathiness > 50 || tension > 60
          ? `> ⚠️ ${tr("Ovoz boylamlarida zo'riqish belgilari — ovoz terapevtiga murojaat qilish tavsiya etiladi.", "Признаки перегрузки голосовых связок — рекомендуем голосовую терапию.", "Signs of vocal fold strain — vocal therapy recommended.")}\n\n`
          : "") +
        `> ${tr("Batafsil ko'rsatmalar uchun «Hisobot yaratish» tugmasini bosing.", "Подробные рекомендации — кнопка «Создать отчёт».", "Tap 'Generate Report' for personalised vocal hygiene guidance.")}`
      );
    }

    return "";
  };

  // --- AI CLINICAL REPORT TRIGGER ---
  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    setReportMarkdown(null);
    setLiveInsight(null);

    const payload = {
      checkupType: activeTab,
      scorecard: activeTab === "brain" ? hearingResults : activeTab === "liver" ? nasalMap : vocalMetrics,
      inputData: { timestamp: new Date().toISOString() }, // Minimal input data for new simulations
      language: lang
    };

    try {
      const response = await fetch("/api/diagnose/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Sync failed");
      const data = await response.json();
      setReportMarkdown(data.report);
    } catch (error) {
      setReportMarkdown(lang === "uz" ? "Report generation fail" : "Error");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-md p-4 overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/40 max-h-[92vh] my-4"
        id="diagnostics-suite-modal"
      >
        {/* Header */}
        <div className="bg-primary text-white p-6 pb-2 flex justify-between items-center relative z-10 border-b border-primary-container">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed text-2xl">science</span>
              <h2 className="font-sans font-extrabold text-xl">{t.title}</h2>
            </div>
            <p className="text-white/70 text-xs font-sans mt-1">{t.disclaimer}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all cursor-pointer"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Tab Controls */}
        <div className="bg-slate-50 border-b border-slate-100 px-4 md:px-6 py-3 flex items-center md:justify-start gap-3 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => { onTabChange("brain"); setReportMarkdown(null); setLiveInsight(null); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs md:text-sm font-sans font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
              activeTab === "brain" 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            <span className="text-lg">👂</span> {t.tabBrain}
          </button>
          
          <button
            onClick={() => { onTabChange("liver"); setReportMarkdown(null); setLiveInsight(null); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs md:text-sm font-sans font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
              activeTab === "liver" 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            <span className="text-lg">👃</span> {t.tabLiver}
          </button>

          <button
            onClick={() => { onTabChange("kidney"); setReportMarkdown(null); setLiveInsight(null); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs md:text-sm font-sans font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
              activeTab === "kidney" 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            <span className="text-lg">🗣️</span> {t.tabKidney}
          </button>
        </div>

        {/* Content Body Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-50/10">
          
          {/* Left interactive control panel */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* OTOLOGY (HEARING) WORKFLOW */}
            {activeTab === "brain" && (
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-sans font-bold text-lg text-primary">{lang === "uz" ? "Audiometriya Tahlili" : "Audiometry Analysis"}</h3>
                    <p className="text-xs text-slate-500 font-sans">{lang === "uz" ? "Eshitish chegarasini aniqlash testi." : "Determine hearing threshold limits."}</p>
                  </div>
                  <span className="bg-primary/5 text-primary text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">Otology</span>
                </div>

                {!isSimulating && !simulationComplete.brain ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-primary text-3xl animate-float-sm">👂</div>
                    <p className="text-sm text-slate-600 font-sans max-w-sm mx-auto leading-relaxed">
                      {lang === "uz" 
                        ? "Har bir chastota uchun audio testni boshlang. Ovozni eshitishingiz bilan tugmani bosing." 
                        : lang === "ru" 
                        ? "Запустите аудио-тест для каждой частоты. Нажмите кнопку, как только услышите звук." 
                        : "Start the audio test for each frequency. Click as soon as you hear the tone."}
                    </p>
                    <motion.button 
                      onClick={startHearingTest} 
                      className="w-full bg-primary hover:bg-primary-container text-white px-8 py-4 rounded-full font-sans font-bold text-sm uppercase tracking-wide transition-all shadow-lg active:scale-95 cursor-pointer"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    >
                      {lang === "uz" ? "Eshitish Sinovini Boshlash" : lang === "ru" ? "Запустить аудио-тест" : "Start Clinical Sweep"}
                    </motion.button>
                  </div>
                ) : isSimulating ? (
                  <div className="space-y-6 py-4">
                    <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                       <div>
                         <div className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{lang === "uz" ? "Joriy chastota" : lang === "ru" ? "Текущая частота" : "Current Frequency"}</div>
                         <div className="text-3xl font-black text-primary">{frequencies[activeFreqIdx]} <span className="text-xs">Hz</span></div>
                       </div>
                       <div className="text-right">
                         <div className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{lang === "uz" ? "Tahlil balandligi" : lang === "ru" ? "Громкость сканирования" : "Scanning Volume"}</div>
                         <div className="text-3xl font-black text-slate-900">{currentDb} <span className="text-xs">dB</span></div>
                       </div>
                    </div>
                    
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                       <motion.div 
                         className="h-full bg-primary" 
                         animate={{ width: `${(currentDb/90)*100}%` }}
                       />
                    </div>

                    <button 
                       onClick={handleFoundThreshold}
                       className="w-full py-10 rounded-3xl bg-slate-900 text-white font-sans font-black text-2xl uppercase tracking-tighter hover:bg-slate-800 transition-all border-4 border-slate-700 shadow-2xl active:scale-95"
                    >
                       {lang === "uz" ? "ESHITDIM" : "I HEAR IT"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-3 gap-2">
                       {frequencies.map(f => (
                         <div key={f} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                            <div className="text-[10px] text-slate-400 font-bold">{f}Hz</div>
                            <div className="text-xl font-black text-primary">{hearingResults[f]}dB</div>
                         </div>
                       ))}
                    </div>
                    <div className="flex gap-2">
                       <button onClick={startHearingTest} className="flex-1 bg-[#111559] text-white hover:bg-[#111559]/90 py-3 rounded-full text-xs font-bold uppercase transition-all">{lang === "uz" ? "Qaytadan" : lang === "ru" ? "Заново" : "Retry"}</button>
                       <button onClick={handleGenerateReport} disabled={isGeneratingReport} className="flex-[2] bg-primary text-white py-3 rounded-full text-xs font-bold uppercase shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                         {isGeneratingReport ? t.generatingReport : t.reportBtn} <span className="material-symbols-outlined text-sm">clinical_notes</span>
                       </button>
                    </div>
                  </div>
                )}
              </div>
            )}


            {/* RHINOLOGY (SINUS) WORKFLOW */}
            {activeTab === "liver" && (
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-sans font-bold text-lg text-primary">{lang === "uz" ? "Rinologiya Mapping" : "Rhinology Mapping"}</h3>
                    <p className="text-xs text-slate-500 font-sans">{lang === "uz" ? "Burun va sinus holatini tahlil qilish." : "Map sinus pressure and obstruction."}</p>
                  </div>
                  <span className="bg-primary/5 text-primary text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">Rhinology</span>
                </div>

                {rhinoStep === "intro" && (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-primary text-3xl animate-float-sm">👃</div>
                    <p className="text-sm text-slate-600 font-sans max-w-sm mx-auto leading-relaxed">
                      {lang === "uz" 
                        ? "Ushbu bo'lim burun yo'llarining to'siq ko'rsatkichi va sinus bo'shliqlaridagi bosim yuklamasini o'lchaydi." 
                        : "This section maps sub-clinical nasal airway blockage levels and sinus cavity pressures."}
                    </p>
                    <button 
                      onClick={() => setRhinoStep("interactive")} 
                      className="w-full bg-primary hover:bg-primary-container text-white px-8 py-4 rounded-full font-sans font-bold text-sm uppercase tracking-wide transition-all shadow-lg active:scale-95 cursor-pointer"
                    >
                      {lang === "uz" ? "Skanerlash xaritasini ochish" : "Open Rhinology Map"}
                    </button>
                  </div>
                )}

                {rhinoStep === "interactive" && (
                  <div className="space-y-5">
                    <p className="text-xs text-slate-500 font-sans">
                      {lang === "uz" ? "Og'riq yoki bosim sezilayotgan sinus zonalarini belgilang:" : "Select sinus cavities experiencing pressure or inflammation:"}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries({
                        maxillary: lang === "uz" ? "Yuqori Jag' (Maxillary)" : "Maxillary Sinus",
                        frontal: lang === "uz" ? "Peshona (Frontal)" : "Frontal Sinus",
                        ethmoid: lang === "uz" ? "G'alvirsimon (Ethmoid)" : "Ethmoid Sinus",
                        sphenoid: lang === "uz" ? "Asosiy (Sphenoid)" : "Sphenoid Sinus"
                      }).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => toggleSinusZone(key as any)}
                          className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 ${
                            nasalMap[key as keyof typeof nasalMap] 
                              ? "bg-primary border-primary text-white scale-98 shadow-md" 
                              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                          }`}
                        >
                          <span className="material-symbols-outlined text-xl">
                            {nasalMap[key as keyof typeof nasalMap] ? "hdr_weak" : "radio_button_unchecked"}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-tight text-center">{label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span className="font-sans text-[10px] uppercase font-black text-slate-400 tracking-wider">堵塞 RATING / OBSTRUCTION LEVEL</span>
                        <span className="text-primary font-mono font-bold">{nasalMap.obstruction}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" 
                        value={nasalMap.obstruction}
                        onChange={e => setNasalMap(p => ({ ...p, obstruction: parseInt(e.target.value) }))}
                        className="w-full accent-primary h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                      />
                    </div>

                    <motion.button 
                      onClick={startRhinologyScan} 
                      className="w-full bg-primary hover:bg-primary-container text-white py-4 rounded-full font-sans font-bold text-sm uppercase tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    >
                      {lang === "uz" ? "Rinometriya Skanerini Boshlash" : "Run Rhinometry Scan"} 
                      <span className="material-symbols-outlined text-lg">cyclone</span>
                    </motion.button>
                  </div>
                )}

                {rhinoStep === "scanning" && (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                      <div className="absolute inset-2 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined anim-spin-reverse text-xl">air</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-sans font-bold text-sm text-slate-800">
                        {lang === "uz" ? "Rinometriya Tahlili..." : "Rhinometry Simulation..."}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono animate-pulse max-w-xs leading-normal">
                        {rhinoScanMessage}
                      </p>
                    </div>
                  </div>
                )}

                {rhinoStep === "complete" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-1">
                      <span className="material-symbols-outlined text-emerald-500 text-3xl">check_circle</span>
                      <h4 className="font-sans font-extrabold text-sm text-emerald-800">
                        {lang === "uz" ? "Tahlil Muvaqqiyatli Yakunlandi" : "Diagnostic Map Cleared"}
                      </h4>
                      <p className="text-xs text-emerald-600/90 font-sans">
                        {lang === "uz" ? "Burun a'zolari ko'rsatkichlari tizimga kiritildi." : "Sinus status registry updated with simulated values."}
                      </p>
                    </div>

                    <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-500 uppercase">Airflow Obstruction</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          nasalMap.obstruction <= 30 ? "bg-emerald-100 text-emerald-800" :
                          nasalMap.obstruction <= 60 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                        }`}>
                          {nasalMap.obstruction <= 30 ? (lang === "uz" ? "Yaxshi nafas" : "Clear") :
                           nasalMap.obstruction <= 60 ? (lang === "uz" ? "Yengil og'ish" : "Mild") : (lang === "uz" ? "Og'ir to'siq" : "Severe")}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                        {Object.entries({
                          maxillary: "Maxillary Cavity",
                          frontal: "Frontal Cavity",
                          ethmoid: "Ethmoid Channels",
                          sphenoid: "Sphenoid Passage"
                        }).map(([key, label]) => (
                          <div key={key} className="flex justify-between items-center p-2 bg-white rounded-lg border border-slate-100">
                            <span className="text-slate-500">{label}</span>
                            <span className={`font-bold ${nasalMap[key as keyof typeof nasalMap] ? "text-rose-500" : "text-emerald-500"}`}>
                              {nasalMap[key as keyof typeof nasalMap] 
                                ? (lang === "uz" ? "Bosim bor" : "Warn") 
                                : (lang === "uz" ? "Me'yor" : "Normal")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => setRhinoStep("interactive")} 
                        className="flex-1 bg-[#13055b] text-white hover:bg-[#13055b]/90 py-3 rounded-full text-xs font-bold uppercase transition-all cursor-pointer"
                      >
                        {lang === "uz" ? "Qaytadan" : lang === "ru" ? "Заново" : "Retry Map"}
                      </button>
                      <button 
                        onClick={handleGenerateReport} 
                        disabled={isGeneratingReport} 
                        className="flex-[2] bg-primary text-white py-3 rounded-full text-xs font-bold uppercase shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isGeneratingReport ? t.generatingReport : t.reportBtn} <span className="material-symbols-outlined text-sm" style={{ paddingLeft: '-2px' }}>clinical_notes</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}


            {/* LARYNGOLOGY (VOCAL) WORKFLOW */}
            {activeTab === "kidney" && (
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-sans font-bold text-lg text-primary">{lang === "uz" ? "Laringologiya Profiler" : "Laryngology Profiler"}</h3>
                    <p className="text-xs text-slate-500 font-sans">{lang === "uz" ? "Ovoz apparatini diagnostika qilish." : "Analyze vocal cord stability."}</p>
                  </div>
                  <span className="bg-primary/5 text-primary text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">Laryngology</span>
                </div>

                {laryngoStep === "intro" && (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-primary text-3xl animate-float-sm">🗣️</div>
                    <p className="text-sm text-slate-600 font-sans max-w-sm mx-auto leading-relaxed">
                      {lang === "uz" 
                        ? "Ovoz boylamlari barqarorligi, quruqlik va tomoq zo'riqishi kabi vokal ko'rsatkichlarni tahlil qiling." 
                        : "Measure vocal fold stability, throat moisture level, and laryngeal mucosal friction indexes."}
                    </p>
                    <button 
                      onClick={() => setLaryngoStep("interactive")} 
                      className="w-full bg-primary hover:bg-primary-container text-white px-8 py-4 rounded-full font-sans font-bold text-sm uppercase tracking-wide transition-all shadow-lg active:scale-95 cursor-pointer"
                    >
                      {lang === "uz" ? "Profilerni ochish" : "Open Vocal Profiler"}
                    </button>
                  </div>
                )}

                {laryngoStep === "interactive" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {Object.entries({
                        stability: lang === "uz" ? "Ovoz barqarorligi" : "Vocal Stability",
                        breathiness: lang === "uz" ? "Shovqin (Breathiness)" : "Breathiness Ratio",
                        tension: lang === "uz" ? "Ovoz zo'riqishi" : "Vocal Tension"
                      }).map(([key, label]) => (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span>{label}</span>
                            <span className="font-mono text-primary font-bold">{vocalMetrics[key as keyof typeof vocalMetrics]}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="100" 
                            value={vocalMetrics[key as keyof typeof vocalMetrics]}
                            onChange={e => setVocalMetrics(p => ({ ...p, [key]: parseInt(e.target.value) }))}
                            className="w-full accent-primary h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                      <div className="text-[10px] font-black text-slate-400 uppercase mb-2">
                        {lang === "uz" ? "Og'riq Indeksi" : "Laryngeal Pain Index (0-10)"}
                      </div>
                      <div className="flex justify-center gap-2">
                        {[0, 2, 4, 6, 8, 10].map(val => (
                          <button 
                            key={val} 
                            onClick={() => setVocalMetrics(p => ({ ...p, painLevel: val }))}
                            className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                              vocalMetrics.painLevel === val 
                                ? "bg-primary text-white scale-110 shadow-lg" 
                                : "bg-white text-slate-400 border border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <motion.button 
                      onClick={startLaryngologyScan} 
                      className="w-full bg-primary hover:bg-primary-container text-white py-4 rounded-full font-sans font-bold text-sm uppercase tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    >
                      {lang === "uz" ? "Akkustik Ovozni Yozish" : "Record & Analyze Voice"} 
                      <span className="material-symbols-outlined text-lg">mic</span>
                    </motion.button>
                  </div>
                )}

                {laryngoStep === "scanning" && (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="flex items-end justify-center gap-1.5 h-12 py-2">
                      {[...Array(6)].map((_, i) => (
                        <motion.div 
                          key={i} 
                          className="w-1.5 bg-primary rounded-full"
                          animate={{ height: ["12px", "40px", "12px"] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-sans font-bold text-sm text-slate-800">
                        {lang === "uz" ? "Klinik Ovoz Tahlili..." : "Voice Waveform Extraction..."}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono animate-pulse max-w-xs leading-normal">
                        {laryngoScanMessage}
                      </p>
                    </div>
                  </div>
                )}

                {laryngoStep === "complete" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-1">
                      <span className="material-symbols-outlined text-emerald-500 text-3xl">record_voice_over</span>
                      <h4 className="font-sans font-extrabold text-sm text-emerald-800">
                        {lang === "uz" ? "Vokal Profil Tayyor" : "Vocal Analytics Captured"}
                      </h4>
                      <p className="text-xs text-emerald-600/90 font-sans">
                        {lang === "uz" ? "Ovoz apparati ko'rsatkichlari tizimga qayd etildi." : "Laryngeal parameters logged successfully in profile."}
                      </p>
                    </div>

                    <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-500 uppercase">Tone Stability</span>
                        <span className="font-mono font-black text-primary">{vocalMetrics.stability}%</span>
                      </div>

                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${vocalMetrics.stability}%` }} />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                        <div className="p-2 bg-white rounded-lg border border-slate-100 flex justify-between">
                          <span className="text-slate-500">{lang === "uz" ? "Ovoz Zo'riqishi" : "Tension Rating"}</span>
                          <span className="font-bold text-slate-700">{vocalMetrics.tension}%</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-slate-100 flex justify-between">
                          <span className="text-slate-500">{lang === "uz" ? "Silliqlik" : "Breathiness"}</span>
                          <span className="font-bold text-slate-700">{vocalMetrics.breathiness}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => setLaryngoStep("interactive")} 
                        className="flex-1 border border-slate-200 py-3 rounded-full text-xs font-bold uppercase hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        {lang === "uz" ? "Qaytadan" : lang === "ru" ? "Заново" : "Retry"}
                      </button>
                      <button 
                        onClick={handleGenerateReport} 
                        disabled={isGeneratingReport} 
                        className="flex-[2] bg-primary text-white py-3 rounded-full text-xs font-bold uppercase shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isGeneratingReport ? t.generatingReport : t.reportBtn} <span className="material-symbols-outlined text-sm">clinical_notes</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>


          {/* Right AI report section */}
          <div className="lg:col-span-6 flex flex-col h-full min-h-[400px]">
            <div className="bg-slate-900 text-white p-5 rounded-t-2xl flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-fixed">assignment_turned_in</span>
                <span className="font-sans font-bold text-xs uppercase tracking-wider">
                  {lang === "uz" ? "Dr. Eldor LOR Tahlil Konsoli" : lang === "ru" ? "Медицинская Консоль Др. Эльдора" : "Dr. Eldor's Medical Report Console"}
                </span>
              </div>
              <span className="bg-secondary-fixed/20 text-secondary-fixed text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded font-mono">
                {activeTab.toUpperCase()}-STATUS
              </span>
            </div>

            <div className="flex-1 bg-slate-950 border-x border-b border-slate-900 rounded-b-2xl p-6 overflow-y-auto max-h-[500px] text-white/90">
              
              {isGeneratingReport && (
                <div className="flex flex-col items-center justify-center h-full space-y-4 py-20 text-center">
                  <div className="relative w-16 h-16">
                    <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-secondary/35 opacity-75"></span>
                    <div className="rounded-full bg-primary p-4 h-16 w-16 flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-secondary-fixed">sync_saved_locally</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="font-sans font-bold text-sm">
                      {lang === "uz" ? "Klinik jurnal sinxronizatsiyasi..." : lang === "ru" ? "Синхронизация Клинических Данных..." : "Synchronizing Clinical Logs"}
                    </h5>
                    <p className="text-xs text-slate-400 font-sans max-w-xs animate-pulse">
                      {lang === "uz" ? "Tizim LOR ko'rsatkichlari va klinik tahlil parametrlarini uzatmoqda." : lang === "ru" ? "Система передает показатели ЛОР органов для клинического анализа." : "System is transmitting ENT scorecard and respiratory parameters to analyze."}
                    </p>
                  </div>
                </div>
              )}

              {/* State 1: empty — test not yet started */}
              {!isGeneratingReport && !reportMarkdown && !liveInsight && (
                <div className="flex flex-col items-center justify-center h-full space-y-4 py-20 text-center text-slate-400">
                  <span className="material-symbols-outlined text-5xl">biotech</span>
                  <div className="space-y-1.5">
                    <h5 className="font-sans font-bold text-sm text-slate-200">
                      {lang === "uz" ? "Tahlil kutilmoqda" : lang === "ru" ? "Ожидание диагностики" : "Awaiting Diagnostic"}
                    </h5>
                    <p className="text-xs max-w-xs font-sans leading-relaxed">
                      {lang === "uz"
                        ? "Chap paneldan testni o'ting — natijalar shu yerda darhol ko'rinadi."
                        : lang === "ru"
                          ? "Пройдите тест слева — результаты появятся здесь немедленно."
                          : "Complete the test on the left — results will appear here instantly."}
                    </p>
                  </div>
                </div>
              )}

              {/* State 2: live client-side insight (instant, no API) */}
              {!isGeneratingReport && !reportMarkdown && liveInsight && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                      {lang === "uz" ? "Tezkor Tahlil — Darhol Natija" : lang === "ru" ? "Быстрый анализ — мгновенный результат" : "Live Analysis — Instant Result"}
                    </span>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none text-slate-300 font-sans">
                    <Markdown>{liveInsight}</Markdown>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800 text-[10px] text-slate-500 font-sans">
                    {lang === "uz"
                      ? "Bu tezkor tahlil. Chuqur tibbiy xulosa uchun «Hisobot yaratish» tugmasini bosing."
                      : lang === "ru"
                        ? "Это экспресс-анализ. Нажмите «Создать отчёт» для углублённого медицинского заключения."
                        : "This is a quick summary. Click 'Generate Report' for an in-depth clinical write-up."}
                  </div>
                </div>
              )}

              {/* State 3: full AI-generated report */}
              {!isGeneratingReport && reportMarkdown && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-secondary-fixed text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>clinical_notes</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary-fixed">
                      {lang === "uz" ? "To'liq Klinik Xulosa" : lang === "ru" ? "Полное клиническое заключение" : "Full Clinical Report"}
                    </span>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none text-slate-300 font-sans">
                    <Markdown>{reportMarkdown}</Markdown>
                  </div>
                </div>
              )}

            </div>

            {/* Quick schedule appt helper shortcut */}
            {onBookAppointmentShortcut && (
              <div className="mt-4 bg-primary/20 border border-primary-container p-4 rounded-xl flex justify-between items-center gap-4">
                <div>
                  <h5 className="font-sans font-bold text-xs text-primary leading-tight">
                    {lang === "uz" ? "Ko'rsatkichlarda og'ish bormi?" : lang === "ru" ? "Заметили отклонения в характеристиках?" : "Elevated metric flags?"}
                  </h5>
                  <p className="text-[10px] text-slate-600 font-sans mt-0.5">
                    {lang === "uz" ? "Marva Nur Med shifokorlari bilan uchrashuv to'g'ri tashxisni ta'minlaydi." : lang === "ru" ? "Очная консультация со специалистами Marva Nur Med гарантирует верный диагноз." : "Physical consultation with Marva Nur Med physicians ensures diagnostic safety."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onBookAppointmentShortcut(activeTab === "brain" ? "Otology" : activeTab === "liver" ? "Rhinology" : "Laryngology");
                  }}
                  className="bg-primary hover:bg-primary-container text-white py-2 px-4 rounded-full font-sans font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                >
                  {lang === "uz" ? "Uchrashuv belgilash" : lang === "ru" ? "Записаться на прием" : "Schedule Unit"}
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
