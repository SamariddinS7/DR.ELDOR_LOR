import React, { useState } from "react";
import { LanguageType, translations } from "../translations";
import { motion, AnimatePresence } from "motion/react";
import marvaLogo from "../assets/images/marva_logo_icon_1782713850223.jpg";

interface HeaderProps {
  lang: LanguageType;
  setLang: (lang: LanguageType) => void;
  onOpenConsult: () => void;
  onOpenAppt: (dept?: any) => void;
}

export default function Header({
  lang,
  setLang,
  onOpenConsult,
  onOpenAppt,
}: HeaderProps) {
  const t = translations[lang].nav;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 bg-[#03132e]/70 backdrop-blur-xl border-b border-white/5 shadow-sm flex justify-between items-center px-6 md:px-16 py-3 md:py-3.5 left-0 right-0"
      >
        
        {/* Logo block */}
        <div className="text-xl md:text-2xl font-sans font-extrabold text-white flex items-center gap-2.5 select-none group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden border border-[#00a2ff]/30 shadow-[0_0_15px_rgba(0,162,255,0.3)] bg-white/5 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
            <img 
              src={marvaLogo} 
              alt="Marva Nur Med Logo" 
              width="40"
              height="40"
              decoding="async"
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="tracking-tight text-white uppercase text-base md:text-lg group-hover:text-[#00a2ff] transition-colors duration-300">DR. ELDOR LOR</span>
        </div>

        {/* Desktop Nav Menu options */}
        <div className="hidden lg:flex gap-8 items-center font-sans">
          <a 
            className="text-white font-sans font-medium text-sm border-b border-[#00a2ff] pb-0.5 uppercase tracking-widest relative group hover:text-[#00a2ff] transition-colors" 
            href="#"
          >
            {t.home}
            <span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-[#00a2ff] transform origin-left transition-transform duration-300 scale-x-100"></span>
          </a>
          <a 
            onClick={() => {
              onOpenConsult();
              closeMobileMenu();
            }}
            className="text-slate-300 hover:text-white transition-colors font-sans font-medium text-sm cursor-pointer uppercase tracking-widest relative group"
          >
            {t.aiConsult}
            <span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-[#00a2ff] transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></span>
          </a>
          
          <a 
            onClick={() => {
              onOpenAppt();
              closeMobileMenu();
            }}
            className="text-slate-300 hover:text-white transition-colors font-sans font-medium text-sm cursor-pointer uppercase tracking-widest relative group"
          >
            {t.activeBookings}
            <span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-[#00a2ff] transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></span>
          </a>
        </div>

        {/* Language switch + CTA (Desktop) */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Language switcher pill */}
          <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md p-0.5 rounded-full border border-white/10 shadow-inner">
            <button 
              onClick={() => setLang("uz")}
              className={`px-3 py-1.5 rounded-full text-[10px] font-sans font-bold transition-all cursor-pointer ${lang === "uz" ? "bg-gradient-to-r from-[#007bff] to-[#00a2ff] text-white shadow-[0_2px_10px_rgba(0,162,255,0.4)]" : "text-slate-400 hover:text-white"}`}
              title="O'zbek tili"
            >
              UZ
            </button>
            <button 
              onClick={() => setLang("ru")}
              className={`px-3 py-1.5 rounded-full text-[10px] font-sans font-bold transition-all cursor-pointer ${lang === "ru" ? "bg-gradient-to-r from-[#007bff] to-[#00a2ff] text-white shadow-[0_2px_10px_rgba(0,162,255,0.4)]" : "text-slate-400 hover:text-white"}`}
              title="Русский язык"
            >
              RU
            </button>
            <button 
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 rounded-full text-[10px] font-sans font-bold transition-all cursor-pointer ${lang === "en" ? "bg-gradient-to-r from-[#007bff] to-[#00a2ff] text-white shadow-[0_2px_10px_rgba(0,162,255,0.4)]" : "text-slate-400 hover:text-white"}`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Primary CTA blue contact us button */}
          <button 
            onClick={() => onOpenAppt()}
            className="bg-gradient-to-r from-[#007bff] to-[#00a2ff] text-white font-sans font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-full hover:from-[#0055ff] hover:to-[#0088ff] transition-all duration-300 shadow-[0_5px_15px_rgba(0,123,255,0.4)] hover:shadow-[0_10px_25px_rgba(0,123,255,0.6)] hover:-translate-y-0.5 transform cursor-pointer"
          >
            {t.contactUs}
          </button>
        </div>

        {/* Hamburger + Small Lang controls (Mobile) */}
        <div className="flex lg:hidden items-center gap-3">
          {/* Touch-optimized simple language select cycle button for ultra convenience */}
          <button 
            onClick={() => setLang(lang === "uz" ? "ru" : lang === "ru" ? "en" : "uz")}
            className="bg-white/5 border border-white/10 rounded-full w-9 h-9 flex items-center justify-center font-sans font-bold text-xs text-white uppercase select-none active:scale-95 transition-transform backdrop-blur-md"
            title="Swith Language / Тилни ўзгартириш"
          >
            {lang.toUpperCase()}
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={toggleMobileMenu}
            className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white bg-white/5 hover:bg-white/10 transition-colors focus:outline-none active:scale-90 backdrop-blur-md"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-2xl font-bold">
              {isMobileMenuOpen ? "close" : "sort"}
            </span>
          </button>
        </div>

      </motion.nav>

      {/* Collapsible Mobile Menu with smooth AnimatePresence translation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed inset-x-0 top-[69px] md:top-[77px] z-40 bg-[#03132e] border-b border-white/10 px-6 py-8 flex flex-col gap-6 lg:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              <a 
                href="#"
                onClick={closeMobileMenu}
                className="text-white hover:text-[#007bff] py-2 border-b border-white/5 font-sans font-semibold text-base transition-colors flex items-center justify-between"
              >
                <span>{t.home}</span>
                <span className="material-symbols-outlined text-sm opacity-50">arrow_forward</span>
              </a>
              <a 
                onClick={() => {
                  onOpenConsult();
                  closeMobileMenu();
                }}
                className="text-slate-300 hover:text-white py-2 border-b border-white/5 font-sans font-semibold text-base transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>{t.aiConsult}</span>
                <span className="material-symbols-outlined text-sm opacity-50">arrow_forward</span>
              </a>
              
              <a 
                onClick={() => {
                  onOpenAppt();
                  closeMobileMenu();
                }}
                className="text-slate-300 hover:text-white py-2 border-b border-white/5 font-sans font-semibold text-base transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>{t.activeBookings}</span>
                <span className="material-symbols-outlined text-sm opacity-50">arrow_forward</span>
              </a>
            </div>

            {/* Quick mobile language list */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
              <span className="text-xs text-slate-400 font-sans tracking-wider uppercase font-medium">
                {lang === "uz" ? "Tillar" : lang === "ru" ? "Языки" : "Languages"}
              </span>
              <div className="flex gap-2">
                {(["uz", "ru", "en"] as LanguageType[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-sans font-bold transition-all ${
                      lang === l ? "bg-[#007bff] text-white" : "bg-[#0b214a] text-slate-400 hover:text-white"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Full width touch friendly consultation button */}
            <button 
              onClick={() => {
                onOpenAppt();
                closeMobileMenu();
              }}
              className="bg-[#007bff] text-white font-sans font-bold text-xs uppercase tracking-widest w-full py-4 rounded-full hover:bg-blue-600 transition-all active:scale-[0.98] shadow-lg shadow-[#007bff]/20 flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">event</span>
              {t.contactUs}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

