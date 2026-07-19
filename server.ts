import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load configuration
dotenv.config();

/**
 * Initialize Gemini SDK safely
 */
let ai: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("⚠️ GEMINI_API_KEY environment variable is not defined. AI consultations will fallback to scripted responses.");
    }
    ai = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

/**
 * Executes a Gemini request with automatic fallback across multiple models
 * to ensure high availability during temporary 503 outages or high demand periods.
 */
async function generateWithFallback(
  gemini: GoogleGenAI,
  options: {
    contents: any;
    config?: any;
  }
) {
  const models = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-2.5-pro"];
  let lastError: any = null;

  for (const model of models) {
    try {
      console.log(`[Gemini Fallback] Attempting generation with model: ${model}`);
      const response = await gemini.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });
      return response;
    } catch (err: any) {
      console.warn(`⚠️ [Gemini Fallback] Model ${model} failed or is busy:`, err.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error("All available Gemini models are currently busy or down.");
}

// ─────────────────────────────────────────────────────────────────────────────
// Scorecard-aware fallback report builder
// Interprets the actual user data and produces a personalised Markdown report
// without any AI call. Used when GEMINI_API_KEY is not set.
// ─────────────────────────────────────────────────────────────────────────────
function buildPersonalizedFallbackReport(
  checkupType: string,
  scorecard: any,
  lang: string
): string {
  const t = (uz: string, ru: string, en: string) =>
    lang === "ru" ? ru : lang === "en" ? en : uz;

  const disclaimer = t(
    "\n\n---\n*Eslatma: Bu simulyatsiya natijalari bo'lib, klinik tashxis o'rnini bosa olmaydi. Yakuniy xulosa uchun Marva Nur Med klinikasida Dr. Eldor bilan uchrashing.*",
    "\n\n---\n*Примечание: Это результаты симуляции и не заменяют клинический диагноз. Для окончательного заключения обратитесь к доктору Эльдору в клинике Marva Nur Med.*",
    "\n\n---\n*Note: These are simulation results and do not replace a clinical diagnosis. Book a consultation with Dr. Eldor at Marva Nur Med for a definitive assessment.*"
  );

  // ── OTOLOGY (Audiometry) ──────────────────────────────────────────────────
  if (checkupType === "brain") {
    const results: Record<string, number> = scorecard || {};
    const freqKeys = [250, 500, 1000, 2000, 4000, 8000];

    // Pure Tone Average (standard clinical PTA: 500, 1000, 2000 Hz)
    const ptaFreqs = [500, 1000, 2000];
    const pta = ptaFreqs.reduce((s, f) => s + (results[f] ?? 0), 0) / ptaFreqs.length;

    const lowAvg = ([250, 500, 1000].reduce((s, f) => s + (results[f] ?? 0), 0)) / 3;
    const highAvg = ([2000, 4000, 8000].reduce((s, f) => s + (results[f] ?? 0), 0)) / 3;

    const classifyDb = (db: number) =>
      db <= 25
        ? t("Me'yoriy", "Норма", "Normal")
        : db <= 40
          ? t("Yengil yo'qolish", "Лёгкая тугоухость", "Mild loss")
          : db <= 55
            ? t("O'rtacha yo'qolish", "Умеренная тугоухость", "Moderate loss")
            : db <= 70
              ? t("O'rtacha-og'ir", "Умеренно-тяжёлая", "Moderately severe")
              : t("Og'ir yo'qolish", "Тяжёлая тугоухость", "Severe loss");

    const ptaLabel = classifyDb(pta);
    const hasHighFreqLoss = highAvg - lowAvg > 15;
    const hasLowFreqLoss = lowAvg - highAvg > 15;
    const pattern = hasHighFreqLoss
      ? t("Yuqori chastota yo'qolishi (shovqindan zararlanish yoki keksalik)", "Потеря высоких частот (шумовое или возрастное)", "High-frequency loss (noise-induced or presbycusis)")
      : hasLowFreqLoss
        ? t("Past chastota yo'qolishi (Menyer kasalligi bilan bog'liq bo'lishi mumkin)", "Низкочастотная потеря (возможно, болезнь Меньера)", "Low-frequency loss (possibly Ménière's-related)")
        : t("Tekis audiogram profili (o'tkazuvchan yo'qolish xavfi)", "Плоский профиль аудиограммы (риск кондуктивной тугоухости)", "Flat audiogram (possible conductive hearing loss)");

    const freqTable = freqKeys.map(f => {
      const db = results[f] ?? "—";
      const cls = typeof db === "number" ? classifyDb(db) : "—";
      return `| ${f} Hz | ${db} dB | ${cls} |`;
    }).join("\n");

    const suggestions: string[] = [];
    if (pta > 25) suggestions.push(t("Shovqinli muhitda quloq himoya vositalarini (quloqbog') ishlating.", "Используйте беруши или наушники в шумных местах.", "Use hearing protection (earplugs/earmuffs) in noisy environments."));
    if (highAvg > 40) suggestions.push(t("Yuqori shovqinli ish joylarida ish gigiyenasiga amal qiling.", "Соблюдайте гигиену труда в шумных рабочих условиях.", "Follow occupational hearing hygiene in high-noise workplaces."));
    if (hasLowFreqLoss) suggestions.push(t("Bosh aylanishi yoki quloq shovqini (tinitus) bo'lsa, darhol mutaxassisga uchrashing.", "При головокружениях или звоне в ушах срочно обратитесь к специалисту.", "If experiencing vertigo or tinnitus, seek specialist evaluation promptly."));
    suggestions.push(t("Quloqlarni tozalashda paxta tayoqchalaridan foydalanmang.", "Не используйте ватные палочки для чистки ушей.", "Never use cotton swabs to clean inside your ear canals."));
    suggestions.push(t("Yiliga bir marotaba Marva Nur Med klinikasida audiometrik tekshiruvdan o'ting.", "Ежегодно проходите аудиометрию в клинике Marva Nur Med.", "Schedule an annual audiometry examination at Marva Nur Med."));

    return (
      `## ${t("Audiometriya Tahlili — Shaxsiylashtirilgan Xulosa", "Аудиометрия — Персонализированный Отчёт", "Audiometry Assessment — Personalised Report")}\n\n` +
      `**${t("Sof Ton O'rtachasi (PTA)", "Среднеарифметический порог (PTA)", "Pure Tone Average (PTA)")}:** ${pta.toFixed(1)} dB — **${ptaLabel}**\n\n` +
      `**${t("Chastota profili", "Частотный профиль", "Frequency pattern")}:** ${pattern}\n\n` +
      `### ${t("Chastota bo'yicha natijalar", "Результаты по частотам", "Per-Frequency Results")}\n` +
      `| ${t("Chastota", "Частота", "Frequency")} | ${t("Bosim (dB)", "Порог (дБ)", "Threshold (dB)")} | ${t("Daraja", "Уровень", "Level")} |\n|---|---|---|\n${freqTable}\n\n` +
      `### ${t("Klinik ko'rsatmalar", "Клинические рекомендации", "Clinical Recommendations")}\n` +
      suggestions.map(s => `- ${s}`).join("\n") +
      disclaimer
    );
  }

  // ── RHINOLOGY (Sinus Map) ─────────────────────────────────────────────────
  if (checkupType === "liver") {
    const sc = scorecard || {};
    const obstruction: number = sc.obstruction ?? 50;
    const affectedSinuses: string[] = [];
    const sinusNames: Record<string, [string, string, string]> = {
      maxillary: ["Yuqori jag' (Maxillary)", "Верхнечелюстной (Maxillary)", "Maxillary sinus"],
      frontal:   ["Peshona (Frontal)",        "Лобный (Frontal)",            "Frontal sinus"],
      ethmoid:   ["G'alvirsimon (Ethmoid)",   "Решётчатый (Ethmoid)",        "Ethmoid cells"],
      sphenoid:  ["Asosiy (Sphenoid)",         "Клиновидный (Sphenoid)",      "Sphenoid sinus"],
    };
    for (const key of Object.keys(sinusNames)) {
      if (sc[key] === true) affectedSinuses.push(t(...sinusNames[key]));
    }

    const obstructLabel =
      obstruction <= 30
        ? t("Yaxshi nafas (30% dan past)", "Свободное дыхание (< 30%)", "Clear airflow (< 30%)")
        : obstruction <= 60
          ? t("Yengil to'siq (30–60%)", "Умеренная обструкция (30–60%)", "Mild obstruction (30–60%)")
          : t("Og'ir to'siq (60% dan yuqori)", "Тяжёлая обструкция (> 60%)", "Severe obstruction (> 60%)");

    const riskNote =
      affectedSinuses.length >= 3
        ? t("Bir nechta sinus bo'shliqlari ta'sirlangan — pansinus yallig'lanish xavfi mavjud.", "Поражены несколько пазух — риск пансинусита.", "Multiple sinuses affected — risk of pansinusitis.")
        : affectedSinuses.length === 0
          ? t("Sinus bosimi belgisi aniqlanmadi.", "Признаки давления в пазухах не выявлены.", "No sinus pressure points reported.")
          : t(`Ta'sirlangan sinus: ${affectedSinuses.join(", ")}.`, `Поражены пазухи: ${affectedSinuses.join(", ")}.`, `Affected sinuses: ${affectedSinuses.join(", ")}.`);

    const suggestions: string[] = [];
    if (obstruction > 30) suggestions.push(t("Kuniga 8–10 stakan iliq suv iching — shilliq qavatni namlantirish uchun.", "Пейте 8–10 стаканов тёплой воды в день для увлажнения слизистой.", "Drink 8–10 glasses of warm water daily to hydrate nasal mucosa."));
    if (affectedSinuses.some(s => s.toLowerCase().includes("maxillary") || s.includes("Yuqori"))) {
      suggestions.push(t("Yuqori jag' sinusit uchun issiq kompressni yuzga qo'ying (15 daqiqa, kuniga 2 marta).", "При гайморите применяйте тёплые компрессы на лицо (15 мин, 2 раза/день).", "For maxillary involvement, apply warm facial compresses (15 min, twice daily)."));
    }
    suggestions.push(t("Tuz eritmasidan (izotonik) burunni yuvish usulini qo'llang.", "Используйте изотонический солевой раствор для промывания носа.", "Use isotonic saline nasal irrigation (Neti pot or spray) daily."));
    if (obstruction > 60) suggestions.push(t("Og'ir to'siq — Marva Nur Med endoskopik tekshiruviga yoziling.", "Тяжёлая обструкция — запишитесь на эндоскопию в Marva Nur Med.", "Severe obstruction — schedule an endoscopic nasal evaluation at Marva Nur Med."));
    suggestions.push(t("Namlik 40–60% bo'lgan xonada yashang; havoni tozalovchi filtr qurilmasidan foydalaning.", "Поддерживайте влажность воздуха 40–60%; используйте воздухоочиститель с HEPA-фильтром.", "Maintain indoor humidity at 40–60%; use a HEPA air purifier."));

    return (
      `## ${t("Rinologiya Xaritasi — Sinus Holati Tahlili", "Ринология — Анализ Синусов", "Rhinology Mapping — Sinus Health Report")}\n\n` +
      `**${t("Havo o'tish darajasi", "Уровень обструкции", "Airflow Obstruction")}:** ${obstruction}% — **${obstructLabel}**\n\n` +
      `**${t("Bosim nuqtalari", "Болевые точки", "Pressure points")}:** ${riskNote}\n\n` +
      `### ${t("Klinik ko'rsatmalar", "Клинические рекомендации", "Clinical Recommendations")}\n` +
      suggestions.map(s => `- ${s}`).join("\n") +
      disclaimer
    );
  }

  // ── LARYNGOLOGY (Vocal Profiler) ──────────────────────────────────────────
  if (checkupType === "kidney") {
    const sc = scorecard || {};
    const stability: number  = sc.stability  ?? 85;
    const breathiness: number = sc.breathiness ?? 20;
    const tension: number    = sc.tension    ?? 15;
    const painLevel: number  = sc.painLevel  ?? 0;

    const stabilityLabel =
      stability >= 75
        ? t("Barqaror (yaxshi)", "Стабильный (норма)", "Stable (good)")
        : stability >= 50
          ? t("O'rtacha barqarorlik", "Умеренная стабильность", "Moderate stability")
          : t("Past barqarorlik — nazorat tavsiya etiladi", "Низкая стабильность — требует наблюдения", "Low stability — monitoring advised");

    const breathinessNote =
      breathiness > 50
        ? t("Yuqori shovqin koeffitsienti (breathiness) — ovoz boylamlari yallig'lanishi yoki nodulalar xavfi.", "Высокий коэффициент шума — риск воспаления или узелков голосовых складок.", "High breathiness ratio — risk of vocal fold inflammation or nodules.")
        : breathiness > 30
          ? t("O'rtacha shovqin — ovoz zo'riqishini kamaytirish tavsiya etiladi.", "Умеренный шум — рекомендуется снизить голосовую нагрузку.", "Moderate breathiness — reduce vocal load.")
          : t("Past shovqin — normal ovoz profili.", "Низкий шум — нормальный профиль голоса.", "Low breathiness — normal vocal profile.");

    const tensionNote =
      tension > 60
        ? t("Yuqori ovoz zo'riqishi — laringospazm yoki muskul zo'riqishi xavfi.", "Высокое напряжение — риск ларингоспазма или мышечного гиперфункции.", "High tension — risk of laryngospasm or muscle tension dysphonia.")
        : tension > 35
          ? t("O'rtacha zo'riqish — ovozni dam oldirishni ko'paytiring.", "Умеренное напряжение — увеличьте время голосового отдыха.", "Moderate tension — increase vocal rest periods.")
          : t("Minimal zo'riqish — mukammal ovoz gigiena.", "Минимальное напряжение — отличная голосовая гигиена.", "Minimal tension — excellent vocal hygiene.");

    const painLabel =
      painLevel === 0
        ? t("Og'riqsiz", "Без боли", "Pain-free")
        : painLevel <= 3
          ? t("Minimal diskomfort", "Минимальный дискомфорт", "Minimal discomfort")
          : painLevel <= 6
            ? t("O'rtacha og'riq — shifokorga uchrashing", "Умеренная боль — обратитесь к врачу", "Moderate pain — consult a physician")
            : t("Kuchli og'riq — zudlik bilan konsultatsiya zarur", "Сильная боль — срочная консультация", "Significant pain — urgent consultation needed");

    const suggestions: string[] = [];
    if (stability < 75) suggestions.push(t("Kunda 2–3 soat ovozli dam olish (sukut) rejimini amalga oshiring.", "Практикуйте 2–3 часа голосового молчания ежедневно.", "Practice 2–3 hours of vocal silence (vocal rest) daily."));
    if (breathiness > 40) suggestions.push(t("Ovoz terapevti bilan ovoz mashqlari (vokal terapiya) kursini boshlang.", "Пройдите курс вокальной терапии со специалистом по голосу.", "Begin a vocal therapy programme with a certified speech-language pathologist."));
    if (tension > 40) suggestions.push(t("Ovoz ko'tarishdan oldin bo'yin va yuz mushaklarini cho'zing (vocal warm-up).", "Перед голосовой нагрузкой выполняйте растяжку мышц шеи и лица.", "Perform neck/jaw warm-up stretches before any prolonged speaking."));
    suggestions.push(t("Kuniga kamida 2 litr iliq suv iching — ovoz boylamlarini namlantiradi.", "Пейте не менее 2 литров тёплой воды в день для увлажнения голосовых складок.", "Drink at least 2 litres of warm water daily to keep vocal folds lubricated."));
    if (painLevel >= 4) suggestions.push(t("Og'riq 2 haftadan ko'p davom etsa — Marva Nur Med da fiberoptik laringoskopiyaga yoziling.", "При боли более 2 недель — запишитесь на фиброларингоскопию в Marva Nur Med.", "If pain persists beyond 2 weeks — book a fiberoptic laryngoscopy at Marva Nur Med."));
    suggestions.push(t("Kofein va spirtli ichimliklardan saqlaning — ular ovoz boylamlarini quritadi.", "Избегайте кофеина и алкоголя — они пересушивают слизистую.", "Avoid caffeine and alcohol — both desiccate mucosal lining of the larynx."));

    return (
      `## ${t("Laringologiya Profili — Ovoz Salomatligi Tahlili", "Ларингология — Профиль Голосового Здоровья", "Laryngology Profile — Vocal Health Report")}\n\n` +
      `| ${t("Ko'rsatkich", "Показатель", "Metric")} | ${t("Qiymat", "Значение", "Value")} | ${t("Baho", "Оценка", "Status")} |\n|---|---|---|\n` +
      `| ${t("Barqarorlik", "Стабильность", "Stability")} | ${stability}% | ${stabilityLabel} |\n` +
      `| ${t("Shovqin (Breathiness)", "Шум (Breathiness)", "Breathiness")} | ${breathiness}% | ${breathiness > 50 ? "⚠️" : breathiness > 30 ? "〜" : "✓"} |\n` +
      `| ${t("Zo'riqish (Tension)", "Напряжение", "Tension")} | ${tension}% | ${tension > 60 ? "⚠️" : tension > 35 ? "〜" : "✓"} |\n` +
      `| ${t("Og'riq indeksi", "Болевой индекс", "Pain index")} | ${painLevel}/10 | ${painLabel} |\n\n` +
      `**${t("Shovqin tahlili", "Анализ шума", "Breathiness analysis")}:** ${breathinessNote}\n\n` +
      `**${t("Zo'riqish tahlili", "Анализ напряжения", "Tension analysis")}:** ${tensionNote}\n\n` +
      `### ${t("Ovoz gigiena ko'rsatmalari", "Рекомендации по гигиене голоса", "Vocal Hygiene Recommendations")}\n` +
      suggestions.map(s => `- ${s}`).join("\n") +
      disclaimer
    );
  }

  return t("Tahlil turi topilmadi.", "Тип диагностики не найден.", "Diagnostic type not recognised.");
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API router / endpoints
  
  // Healthcheck
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Smart Marva Nur Med Virtual Consult (Gemini Chat Proxy)
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, history, language = "uz" } = req.body;
      const key = process.env.GEMINI_API_KEY;
      
      const fallbacks: Record<string, string> = {
        uz: "Salom! Men LOR virtual yordamchisiman. Hozirda Gemini API kaliti sozlanmaganga o'xshaydi. Shunga qaramay, sizga yordam bera olaman: Biz yuqori darajada otologiya, rinologiya va laringologiya xizmatlarini taklif etamiz.",
        ru: "Здравствуйте! Я ЛОР виртуальный ассистент. Похоже, API-ключ Gemini еще не настроен. Тем не менее, я могу сориентировать вас в сфере оториноларингологии.",
        en: "Hello! I am the ENT virtual assistant. It looks like the Gemini API Key is not configured yet. However, I can still guide you regarding otology, rhinology, and laryngology."
      };

      if (!key) {
        return res.json({
          reply: fallbacks[language] || fallbacks.uz,
          isFallback: true
        });
      }

      const gemini = getGemini();

      // Formulate system instructions based on language
      let languageInstructions = "Siz doimo O'zbek tilida, muloyim va shifokorlarga xos tarzda javob berishingiz kerak. O'zbekcha yozing.";
      if (language === "ru") {
        languageInstructions = "You MUST converse and reply strictly in the Russian language ('на русском языке').";
      } else if (language === "en") {
        languageInstructions = "You MUST converse and reply strictly in the English language.";
      }

      const systemInstruction = 
        "Sizning ismingiz shifokor Eldor Farxod o'g'li. Siz Marva Nur Med klinikasining Bosh LOR (Quloq, burun va tomoq kasalliklari - Otorinolaringolog) mutaxassisi va AI tibbiy konsultantizsiz. " +
        "You are Dr. Eldor Farxod o'g'li, chief ENT / otorhinolaryngologist specialist at Marva Nur Med clinic. " +
        "You are an expert in Otology (ears), Rhinology (nose), and Laryngology (throat). " +
        languageInstructions + " " +
        "Rules: " +
        "1. Never give final definitive medical diagnoses. Always include a short, elegant, professional disclaimer " +
        "indicating that these AI insights are educational, and highly encourage scheduled physical followups or examinations with Marva Nur Med doctors. " +
        "2. Keep answers reasonably concise (under 200 words), styled elegantly with lists if helpful. " +
        "3. Focus on specific ENT capabilities: Ear health checks, hearing tests, nasal congestion diagnostics, and vocal cord/throat assessments. " +
        "4. Be very empathetic, professional, and speak like a caring physician.";

      // Structure historical messages for Gemini context
      const chatContents = [];
      
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          chatContents.push({
            role: turn.role === "user" ? "user" : "model",
            parts: [{ text: turn.content }]
          });
        }
      }
      
      // Append latest user message
      chatContents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await generateWithFallback(gemini, {
        contents: chatContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "I apologize, I am analyzing some medical telemetry. Could you please rephrase your request?";
      res.json({ reply: replyText });
    } catch (error: any) {
      console.error("Gemini Chat API Error:", error);
      res.status(500).json({ error: "Failed to generate virtual consult response: " + error.message });
    }
  });

  // Diagnostic Report Generator (Generates comprehensive medical breakdown based on interactive check results)
  app.post("/api/diagnose/report", async (req: Request, res: Response) => {
    try {
      const { checkupType, scorecard, inputData, language = "uz" } = req.body;
      const key = process.env.GEMINI_API_KEY;

      const formattedScorecard = JSON.stringify(scorecard, null, 2);
      const formattedInputData = JSON.stringify(inputData, null, 2);

      if (!key) {
        // ── Scorecard-aware fallback: personalizes the report based on actual user data ──
        const report = buildPersonalizedFallbackReport(checkupType, scorecard, language);
        return res.json({ report, isFallback: true });
      }

      const gemini = getGemini();

      let reportLanguageCommand = "The medical assessment report must be written entirely in the Uzbek language ('o'zbek tilida'). Ensure all terminology is formatted naturally and professionally in Uzbek.";
      if (language === "ru") {
        reportLanguageCommand = "The medical assessment report must be written entirely in the Russian language ('на русском языке'). Ensure all terminology is formatted naturally and professionally in Russian.";
      } else if (language === "en") {
        reportLanguageCommand = "The medical assessment report must be written entirely in the English language.";
      }

      const prompt = 
        `You are the Marva Nur Med ENT Clinical Diagnostic Expert assisting Dr. Eldor. ` +
        `Generate a fully formatted, deeply detailed, and encouraging Medical Assessment Report for a patient who completed an interactive clinical diagnostic simulator.\n\n` +
        `**Assessment Specifics:**\n` +
        `- Type of Scan/Check: ${checkupType} Checkup\n` +
        `- Scorecard Data: ${formattedScorecard}\n` +
        `- User Information / Inputs: ${formattedInputData}\n\n` +
        reportLanguageCommand + `\n\n` +
        `Please formulate a structured report in elegant medical Markdown format containing:\n` +
        `1. **Report Header**: Clinical Assessment Report Name and Status (Draft - Simulator Output)\n` +
        `2. **Diagnostic Summary**: Evaluation of the performance scorecard.\n` +
        `3. **Key ENT Insights**: Explain in clear medical terminology what these scorecards could indicate in otology, rhinology, or laryngology (e.g. auditory pathways, nasal mucosal congestion, vocal cord hydration).\n` +
        `4. **Dr. Eldor's ENT Protocol**: 3 highly specific, beautiful lifestyle or dietary recommendations personalized to their ear, nose, or throat health.\n` +
        `5. **Marva Nur Med Clinical Follow-up**: Encourage scheduling a physical consultation with Dr. Eldor or other clinical staff at Marva Nur Med.\n\n` +
        `Style requirements: Keep it formatted perfectly in Markdown. Use academic, warm language. Make sure it has beautiful headings.`;

      const response = await generateWithFallback(gemini, {
        contents: prompt,
      });

      res.json({ report: response.text });
    } catch (err: any) {
      console.error("Report Generation API Error:", err);
      res.status(500).json({ error: "Failed to build diagnostic report: " + err.message });
    }
  });

  // Telegram bot notification integration
  app.post("/api/telegram/notify", async (req: Request, res: Response) => {
    try {
      const { patientName, patientEmail, date, time, department, doctorName, notes, chatId, isTest } = req.body;
      const botToken = process.env.TELEGRAM_BOT_TOKEN;

      if (!botToken) {
        return res.status(400).json({ 
          error: "Telegram Bot Token is not configured. Set TELEGRAM_BOT_TOKEN in environment secrets." 
        });
      }

      if (!chatId) {
        return res.status(400).json({ error: "Telegram Chat ID is required to send notifications." });
      }

      let text = "";
      if (isTest) {
        text = `🧪 *Marva Nur Med - Telegram Ulanishi Muvaffaqiyatli!*\n\n` +
               `Sizning Telegram bot ulanishingiz muvaffaqiyatli o'rnatildi. Endi yangi bandlovlar to'g'ridan-to'g'ri shu yerga yuboriladi!\n\n` +
               `📍 *Chat ID:* \`${chatId}\` (Ushbu IDni sozlamalarda saqlab qo'yishingiz mumkin)`;
      } else {
        text = `🔔 *Yangi LOR Bandlovi (Новая запись)*\n\n` +
               `👤 *Bemor (Пациент):* ${patientName}\n` +
               `📧 *Email:* ${patientEmail}\n` +
               `📅 *Sana (Дата):* ${date}\n` +
               `⏰ *Vaqt (Время):* ${time}\n` +
               `🏥 *Bo'lim (Отделение):* ${department || "LOR"}\n` +
               `👨‍⚕️ *Shifokor (Врач):* ${doctorName}\n` +
               `📝 *Izoh (Заметки):* ${notes || "-"}\n\n` +
               `🌐 *Tizim:* Marva Nur Med Portal`;
      }

      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "Markdown"
        })
      });

      const data = await response.json();
      if (!data.ok) {
        return res.status(400).json({ error: data.description || "Telegram API error" });
      }

      res.json({ success: true, message: "Notification sent successfully!" });
    } catch (err: any) {
      console.error("Telegram notify error:", err);
      res.status(500).json({ error: "Telegramga xabar yuborib bo'lmadi: " + err.message });
    }
  });

  // Vite static assets and client routing setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Marva Nur Med Server] Full-stack server running successfully on http://0.0.0.0:${PORT}`);
  });
}

startServer();
