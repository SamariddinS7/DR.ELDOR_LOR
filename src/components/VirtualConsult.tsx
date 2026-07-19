import React, { useState, useEffect, useRef } from "react";
import { LanguageType, translations } from "../translations";
import { ChatTurn } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface VirtualConsultProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  onBookAppointmentShortcut?: (dept: string) => void;
  lang: LanguageType;
}

export default function VirtualConsult({
  isOpen,
  onClose,
  initialTopic,
  onBookAppointmentShortcut,
  lang
}: VirtualConsultProps) {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[lang].consult;

  // Load from local storage or set initial greeting
  useEffect(() => {
    const saved = localStorage.getItem("lor_consult_history_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If there's saved history, we keep it, otherwise initialize
        if (parsed.length > 0) {
          setMessages(parsed);
        } else {
          initializeGreeting();
        }
      } catch (e) {
        initializeGreeting();
      }
    } else {
      initializeGreeting();
    }
  }, [lang]);

  // Save history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("lor_consult_history_v2", JSON.stringify(messages));
    }
  }, [messages]);

  // Handle initial topic injection
  useEffect(() => {
    if (initialTopic && isOpen) {
      sendMessage(initialTopic);
    }
  }, [initialTopic, isOpen]);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const initializeGreeting = () => {
    setMessages([
      {
        role: "model",
        content: t.greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  const clearHistory = () => {
    setShowClearConfirm(true);
  };

  const confirmClearHistory = () => {
    localStorage.removeItem("lor_consult_history_v2");
    initializeGreeting();
    setShowClearConfirm(false);
  };

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userTurn: ChatTurn = {
      role: "user",
      content: textToSend,
      timestamp: userTime
    };

    setMessages(prev => [...prev, userTurn]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-10), // Send recent turns for context
          language: lang
        })
      });

      if (!response.ok) {
        throw new Error(t.apiError);
      }

      const data = await response.json();
      const assistantTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      
      setMessages(prev => [
        ...prev,
        {
          role: "model",
          content: data.reply,
          timestamp: assistantTime
        }
      ]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "model",
          content: t.fallbackResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage(inputValue);
    }
  };

  const presetQuestions = [
    { text: t.presetBrain, label: t.presetBrainLabel },
    { text: t.presetLiver, label: t.presetLiverLabel },
    { text: t.presetKidney, label: t.presetKidneyLabel }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-md p-4">
      <div 
        className="w-full max-w-2xl h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/50 relative"
        id="consultation-widget"
      >
        {/* Header */}
        <div className="bg-primary text-white px-6 py-0 h-[90px] flex justify-between items-center relative z-10 border-b border-primary-container">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-secondary-fixed/50 relative bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                face_6
              </span>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary-container border-2 border-primary rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-sans font-bold text-lg text-white">{t.title}</h3>
                <span className="bg-secondary-fixed/20 text-secondary-fixed text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                  {t.role}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={clearHistory}
              title="Clear Consultation Logs"
              className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-xl">delete_sweep</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </div>

        {/* Message Logs */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map((turn, i) => (
            <div 
              key={i} 
              className={`flex ${turn.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm text-sm leading-relaxed ${
                  turn.role === "user" 
                    ? "bg-primary text-white rounded-br-none" 
                    : "bg-white text-on-background-custom border border-slate-100 rounded-bl-none"
                }`}
              >
                {/* Render basic markdown/line breaks */}
                <div className="whitespace-pre-line font-sans">
                  {turn.content.split("\n").map((line, idx) => {
                    // Quick check for bolding markers
                    let content: React.ReactNode = line;
                    
                    // Simple replacement for **bold**
                    if (line.includes("**")) {
                      const parts = line.split("**");
                      content = parts.map((part, pIdx) => 
                        pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-secondary">{part}</strong> : part
                      );
                    }
                    
                    // Simple bullet replacement
                    if (line.startsWith("- ")) {
                      return (
                        <div key={idx} className="flex gap-2 pl-2 my-1">
                          <span className="text-secondary-fixed">•</span>
                          <span>{content}</span>
                        </div>
                      );
                    }
                    
                    return <p key={idx} className="mb-1.5 last:mb-0">{content}</p>;
                  })}
                </div>
                <div className={`text-[9px] mt-2 block text-right ${
                  turn.role === "user" ? "text-white/60" : "text-slate-400"
                }`}>
                  {turn.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-on-background-custom border border-slate-100 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm w-48">
                <div className="flex items-center gap-2 justify-center text-xs text-slate-500 font-sans">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                  <span>{lang === "uz" ? "Tahlil qilinmoqda..." : lang === "ru" ? "Анализируется..." : "Analyzing..."}</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Preset suggestions */}
        <div className="px-6 py-0 h-[50px] bg-white border-t border-slate-100 overflow-x-auto whitespace-nowrap flex gap-2 items-center scrollbar-none">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(q.text)}
              disabled={loading}
              className="text-xs font-sans px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-primary hover:bg-slate-50/50 text-slate-700 transition-all shrink-0 active:scale-95 disabled:opacity-50"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Input Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2 items-center">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
            placeholder={t.inputPlaceholder}
            className="flex-1 px-5 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans"
          />
          <button
            onClick={() => sendMessage(inputValue)}
            disabled={loading || !inputValue.trim()}
            className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center transition-transform active:scale-95 hover:bg-primary-container disabled:opacity-50 disabled:scale-100 cursor-pointer"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>

        {/* Quick shortcut to scheduler */}
        {onBookAppointmentShortcut && (
          <div className="bg-slate-100/50 border-t border-slate-200/50 px-6 py-0 h-[45px] text-center flex items-center gap-2 justify-center text-xs font-sans">
            <span className="text-slate-500 font-medium font-sans">{t.needPhysical}</span>
            <button 
              onClick={() => {
                onClose();
                onBookAppointmentShortcut("Neurology");
              }}
              className="text-primary hover:text-primary-container font-bold underline transition-colors"
            >
              {t.scheduleBtn}
            </button>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal for Clearing History */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 text-left"
            >
              <div className="flex items-center gap-3 text-red-500 mb-4">
                <span className="material-symbols-outlined text-3xl">warning</span>
                <h3 className="font-sans font-black text-lg text-slate-900">
                  {lang === "uz" ? "Tarixni tozalash" : lang === "ru" ? "Очистить историю" : "Clear History"}
                </h3>
              </div>
              <p className="text-sm text-slate-600 font-sans mb-6 leading-relaxed">
                {t.confirmClear}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2.5 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 font-sans font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {lang === "uz" ? "Bekor qilish" : lang === "ru" ? "Отмена" : "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={confirmClearHistory}
                  className="px-5 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-sans font-bold text-xs uppercase tracking-wider transition-colors shadow-md hover:shadow-lg cursor-pointer"
                >
                  {lang === "uz" ? "Tozalash" : lang === "ru" ? "Очистить" : "Clear"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
