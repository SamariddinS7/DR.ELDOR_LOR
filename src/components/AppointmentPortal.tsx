import React, { useState, useEffect } from "react";
import { Appointment, DepartmentType } from "../types";
import { LanguageType, translations } from "../translations";
import { motion, AnimatePresence } from "motion/react";

interface AppointmentPortalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageType;
  defaultDepartment?: DepartmentType;
}

export default function AppointmentPortal({ isOpen, onClose, lang, defaultDepartment }: AppointmentPortalProps) {
  const t = translations[lang].bookings;
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [department, setDepartment] = useState<DepartmentType>("Otology");
  const [doctorName, setDoctorName] = useState("Dr. Eldor Farxod o'g'li");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [ticketFilter, setTicketFilter] = useState<"All" | "Confirmed" | "Completed">("All");

  // Custom states for toast notification and confirmation modal (so we don't use window.alert or window.confirm inside iframe)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  // Telegram state variables
  const [chatId, setChatId] = useState<string>(() => {
    return localStorage.getItem("marva_telegram_chat_id") || "";
  });
  const [telegramStatus, setTelegramStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [telegramError, setTelegramError] = useState<string>("");

  // Load appointments
  useEffect(() => {
    const saved = localStorage.getItem("marva_appointments");
    if (saved) {
      try {
        setAppointments(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const saveAppointments = (list: Appointment[]) => {
    setAppointments(list);
    localStorage.setItem("marva_appointments", JSON.stringify(list));
  };

  // Sync default department if passed
  useEffect(() => {
    if (defaultDepartment) {
      setDepartment(defaultDepartment);
    }
  }, [defaultDepartment]);

  // Adjust doctor name automatically based on department selection
  useEffect(() => {
    if (department === "Otology") {
      setDoctorName(lang === "uz" ? "Dr. Eldor Farxod o'g'li (Bosh otolog)" : lang === "ru" ? "Др. Эльдор Фарходович (Гл. отолог)" : "Dr. Eldor Farxod o'g'li (Chief Otology)");
    } else if (department === "Rhinology") {
      setDoctorName(lang === "uz" ? "Dr. Eldor Farxod o'g'li (Bosh rinolog)" : lang === "ru" ? "Др. Эльдор Фарходович (Гл. ринолог)" : "Dr. Eldor Farxod o'g'li (Chief Rhinology)");
    } else if (department === "Laryngology") {
      setDoctorName(lang === "uz" ? "Dr. Eldor Farxod o'g'li (Laringologiya mutaxassisi)" : lang === "ru" ? "Др. Эльдор Фарходович (Эксперт ларингологии)" : "Dr. Eldor Farxod o'g'li (Laryngology Expert)");
    } else if (department === "Endoscopy") {
      setDoctorName(lang === "uz" ? "Dr. Eldor Farxod o'g'li (Endoskopiya)" : lang === "ru" ? "Др. Эльдор Фарходович (Эндоскопия)" : "Dr. Eldor Farxod o'g'li (Endoscopy)");
    }
  }, [department, lang]);

  if (!isOpen) return null;

  const handleTestTelegram = async () => {
    if (!chatId.trim()) {
      setTelegramStatus("error");
      setTelegramError(lang === "uz" ? "Iltimos, Chat ID kiriting." : lang === "ru" ? "Пожалуйста, введите Chat ID." : "Please enter a Chat ID.");
      return;
    }

    setTelegramStatus("testing");
    setTelegramError("");

    try {
      const response = await fetch("/api/telegram/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: chatId.trim(),
          isTest: true
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setTelegramStatus("success");
        localStorage.setItem("marva_telegram_chat_id", chatId.trim());
        setToast({
          message: lang === "uz" ? "Test xabar botingizga yuborildi!" : lang === "ru" ? "Тестовое сообщение отправлено в ваш бот!" : "Test message sent to your bot!",
          type: "success"
        });
      } else {
        setTelegramStatus("error");
        setTelegramError(data.error || "Telegram connection failed.");
      }
    } catch (err: any) {
      setTelegramStatus("error");
      setTelegramError(err.message || "Network error.");
    }
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientEmail.trim() || !date || !time) {
      setToast({
        message: lang === "uz" ? "Iltimos, band qilishni yakunlash uchun barcha majburiy maydonlarni to'ldiring."
          : lang === "ru" ? "Пожалуйста, закройте все обязательные поля для завершения бронирования."
          : "Please fill all mandatory fields to finalize your clinic slot reserving.",
        type: "error"
      });
      return;
    }

    const newAppt: Appointment = {
      id: "MRV-" + Math.floor(Math.random() * 90000 + 10000),
      patientName,
      patientEmail,
      department,
      doctorName,
      date,
      time,
      notes: notes.trim() || (lang === "uz" ? "Rejali diagnostik tahlil" : lang === "ru" ? "Плановое диагностическое обследование" : "Routine baseline diagnostic evaluation"),
      status: "Confirmed"
    };

    const updated = [newAppt, ...appointments];
    saveAppointments(updated);
    
    // Custom toast notification instead of blocking alert
    setToast({
      message: lang === "uz" ? `Bandlov ${newAppt.id} muvaffaqiyatli yakunlandi! Dr. Eldor Farxod o'g'li va Marva Nur Med klinika jamoasi sizni ${date} kuni soat ${time}da kutishmoqda.`
        : lang === "ru" ? `Запись ${newAppt.id} успешно подтверждена! Др. Эльдор Фарходович и персонал клиники Marva Nur Med ждут вас ${date} в ${time}.`
        : `Appointment ${newAppt.id} successfully reserved! Dr. Eldor Farxod o'g'li and Marva Nur Med clinical staff are waiting for you on ${date} at ${time}.`,
      type: "success"
    });

    // Send Telegram Notification automatically to saved Chat ID (if configured)
    const savedChatId = localStorage.getItem("marva_telegram_chat_id") || "";
    if (savedChatId) {
      fetch("/api/telegram/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: newAppt.patientName,
          patientEmail: newAppt.patientEmail,
          date: newAppt.date,
          time: newAppt.time,
          department: newAppt.department,
          doctorName: newAppt.doctorName,
          notes: newAppt.notes,
          chatId: savedChatId
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log("Telegram notification sent successfully!");
        } else {
          console.warn("Telegram notification error:", data.error);
        }
      })
      .catch(err => {
        console.error("Failed to trigger Telegram notification:", err);
      });
    }

    setPatientName("");
    setPatientEmail("");
    setDate("");
    setTime("");
    setNotes("");
  };

  const startCancelAppointment = (id: string) => {
    setConfirmCancelId(id);
  };

  const executeCancelAppointment = () => {
    if (confirmCancelId) {
      const updated = appointments.filter(a => a.id !== confirmCancelId);
      saveAppointments(updated);
      setToast({
        message: lang === "uz" ? `Bandlov ${confirmCancelId} muvaffaqiyatli bekor qilindi.`
          : lang === "ru" ? `Запись ${confirmCancelId} успешно отменена.`
          : `Reservation ${confirmCancelId} has been successfully cancelled.`,
        type: "success"
      });
      setConfirmCancelId(null);
    }
  };

  const filteredAppointments = appointments.filter(a => {
    if (ticketFilter === "All") return true;
    return a.status === ticketFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-md p-4 overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/40 max-h-[92vh] my-4"
        id="appointments-manager-modal"
      >
        {/* Modal Header */}
        <div className="bg-primary text-white p-6 pb-3 border-b border-primary-container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#67ff8c] text-3xl">calendar_month</span>
            <div>
              <h2 className="font-sans font-extrabold text-xl tracking-wide">{t.title}</h2>
              <p className="text-xs text-white/70 font-sans mt-0.5">{t.subtitle}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all cursor-pointer"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Content body split to Form vs active Ticket logs */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-50/15">
          
          {/* Booking Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Booking Request Form */}
            <form onSubmit={handleBook} className="w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-sans font-bold text-base text-primary border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm font-semibold text-secondary">assignment</span>
                {t.newBookingHeader}
              </h3>

              <div className="space-y-3 font-sans text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">{t.patientNameLabel}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sandra Alcott"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">{t.patientEmailLabel}</label>
                  <input
                    type="email"
                    required
                    placeholder="sandra@example.com"
                    value={patientEmail}
                    onChange={e => setPatientEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">{t.departmentLabel}</label>
                    <select
                      value={department}
                      onChange={e => setDepartment(e.target.value as DepartmentType)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="Otology">👂 {lang === "uz" ? "Otologiya" : lang === "ru" ? "Отология" : "Otology"}</option>
                      <option value="Rhinology">👃 {lang === "uz" ? "Rinologiya" : lang === "ru" ? "Ринология" : "Rhinology"}</option>
                      <option value="Laryngology">🗣️ {lang === "uz" ? "Laringologiya" : lang === "ru" ? "Ларингология" : "Laryngology"}</option>
                      <option value="Endoscopy">🔬 {lang === "uz" ? "Endoskopiya" : lang === "ru" ? "Эндоскопия" : "Endoscopy"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">{t.doctorLabel}</label>
                    <input
                      type="text"
                      disabled
                      value={doctorName}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">{t.dateLabel}</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">{t.timeLabel}</label>
                    <select
                      required
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer focus:bg-white"
                    >
                      <option value="">{lang === "uz" ? "Vaqtni tanlang" : lang === "ru" ? "Выберите время" : "Select slot"}</option>
                      <option value="09:00 AM">09:00 AM ({lang === "uz" ? "Ertalabki" : lang === "ru" ? "Утренний" : "Early Slot"})</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="01:00 PM">01:00 PM ({lang === "uz" ? "Tushlikdan keyin" : lang === "ru" ? "После обеда" : "Afternoon Shift"})</option>
                      <option value="02:30 PM">02:30 PM</option>
                      <option value="04:00 PM">04:00 PM ({lang === "uz" ? "Kechki" : lang === "ru" ? "Вечерний" : "Late Slot"})</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">{t.notesLabel}</label>
                  <textarea
                    rows={2}
                    placeholder={lang === "uz" ? "Masalan, surunkali bosh og'rig'i, jigar og'rig'i..." : lang === "ru" ? "Например, хроническая мигрень..." : "e.g. Chronic dynamic migraine or basic hydration review."}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-secondary-fixed hover:bg-secondary text-primary hover:text-white font-sans font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-full flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  {t.createBtn}
                  <span className="material-symbols-outlined text-[15px]">add_circle</span>
                </button>
              </div>
            </form>

            {/* Telegram Bot Integration Card */}
            <div className="hidden bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 text-slate-800">
              <h3 className="font-sans font-bold text-base text-[#0088cc] border-b border-slate-100 pb-2.5 flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.94-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
                </svg>
                {lang === "uz" ? "Telegram Bot Integratsiyasi" : lang === "ru" ? "Интеграция с Telegram-ботом" : "Telegram Bot Integration"}
              </h3>

              <div className="font-sans text-[11px] text-slate-500 space-y-2 bg-sky-50/50 p-3 rounded-xl border border-sky-100/70 leading-relaxed">
                <p className="font-bold text-slate-700">
                  {lang === "uz" ? "Ulanish bo'yicha yo'riqnoma:" : lang === "ru" ? "Инструкция по подключению:" : "Connection Guide:"}
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>
                    {lang === "uz" ? "Telegramda " : lang === "ru" ? "В Telegram откройте " : "Open "}
                    <a href="https://t.me/SattorovS777_bot" target="_blank" rel="noreferrer" className="text-sky-600 font-bold hover:underline">@SattorovS777_bot</a>
                    {lang === "uz" ? " botiga kiring va Start bosing." : lang === "ru" ? " и нажмите Старт." : " and press Start."}
                  </li>
                  <li>
                    {lang === "uz" ? "O'zingizning " : lang === "ru" ? "Узнайте свой " : "Get your personal "}
                    <span className="font-bold text-slate-700 font-sans">Chat ID</span>
                    {lang === "uz" ? " raqamingizni oling (masalan, " : lang === "ru" ? " (например, через " : " (e.g., using "}
                    <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-sky-600 font-bold hover:underline">@userinfobot</a>
                    {lang === "uz" ? " boti orqali)." : lang === "ru" ? ")." : ")."}
                  </li>
                  <li>
                    {lang === "uz" ? "Ushbu Chat ID ni pastga kiritib, test xabar yuboring." : lang === "ru" ? "Введите полученный Chat ID ниже и протестируйте." : "Enter your Chat ID below and send a test notification."}
                  </li>
                </ol>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-sans">
                  {lang === "uz" ? "Telegram Chat ID" : lang === "ru" ? "Telegram Chat ID" : "Telegram Chat ID"}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 123456789"
                    value={chatId}
                    onChange={e => setChatId(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-400 focus:bg-white font-sans"
                  />
                  <button
                    type="button"
                    onClick={handleTestTelegram}
                    disabled={telegramStatus === "testing"}
                    className="px-4 py-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-xl font-sans font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm disabled:bg-slate-300 cursor-pointer"
                  >
                    {telegramStatus === "testing" ? (
                      <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                      <span className="material-symbols-outlined text-[15px]">send</span>
                    )}
                    {lang === "uz" ? "Test & Saqlash" : lang === "ru" ? "Тест и сохр." : "Test & Save"}
                  </button>
                </div>

                {telegramStatus === "success" && (
                  <p className="text-[10px] text-emerald-600 font-bold font-sans flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    {lang === "uz" ? "Bot muvaffaqiyatli ulandi va sozlama saqlandi!" : lang === "ru" ? "Бот успешно подключен и настройки сохранены!" : "Bot connected successfully and settings saved!"}
                  </p>
                )}

                {telegramStatus === "error" && (
                  <p className="text-[10px] text-rose-600 font-bold font-sans flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">error</span>
                    {telegramError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Ticket confirmations and current slots logs index */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs">book_online</span>
                {lang === "uz" ? "Tasdiqlangan talonlar" : lang === "ru" ? "Пропуска" : "Confirmed passes"} ({appointments.length})
              </h4>
              <div className="flex gap-1.5">
                {(["All", "Confirmed", "Completed"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setTicketFilter(f)}
                    className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase cursor-pointer ${
                      ticketFilter === f 
                        ? "bg-primary text-white" 
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    {f === "All" ? (lang === "uz" ? "Barchasi" : lang === "ru" ? "Все" : "All") : 
                     f === "Confirmed" ? (lang === "uz" ? "Tasdiqlangan" : lang === "ru" ? "Ожидаемые" : "Confirmed") : 
                     (lang === "uz" ? "Tugallangan" : lang === "ru" ? "Завершенные" : "Completed")}
                  </button>
                ))}
              </div>
            </div>

            {/* Confirmed list index */}
            <div className="flex-1 overflow-y-auto max-h-[440px] space-y-4 pr-1">
              {filteredAppointments.length === 0 ? (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-10 flex flex-col items-center justify-center text-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl text-slate-300">event_busy</span>
                  <p className="text-xs font-sans font-bold mt-2.5 text-slate-500">{t.emptyBookings}</p>
                  <p className="text-[10px] max-w-xs font-sans mt-0.5">
                    {lang === "uz" 
                      ? "Tasdiqlangan talonlarni faollashtirish uchun chap ro'yxatdan o'tish oynasidan o'zingiz xohlagan klinik bo'limni band qiling." 
                      : lang === "ru" 
                        ? "Пожалуйста, зарегистрируйте желаемое время приема в левой панели для активации пропуска." 
                        : "Please register your preferred clinical department slot on the left registration console to activate confirmed passes."}
                  </p>
                </div>
              ) : (
                filteredAppointments.map((appt) => (
                  <div 
                    key={appt.id}
                    className="bg-white border-l-4 border-l-primary border border-slate-100 p-4 rounded-r-xl shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center relative hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-1.5 font-sans">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-black text-primary bg-primary/5 px-2 py-0.5 rounded">
                          {appt.id}
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 font-bold text-[9px] uppercase px-2 py-0.5 rounded border border-emerald-100">
                          {appt.status === "Confirmed" ? (lang === "uz" ? "Tasdiqlandi" : lang === "ru" ? "Подтверждено" : "Confirmed") : appt.status}
                        </span>
                        <span className="text-xs text-slate-700 font-bold">
                          {appt.department === "Otology" ? "👂" : appt.department === "Rhinology" ? "👃" : appt.department === "Laryngology" ? "🗣️" : "🔬"}{" "}
                          {appt.department === "Otology" ? (lang === "uz" ? "Otologiya" : lang === "ru" ? "Отология" : "Otology") : 
                           appt.department === "Rhinology" ? (lang === "uz" ? "Rinologiya" : lang === "ru" ? "Ринология" : "Rhinology") : 
                           appt.department === "Laryngology" ? (lang === "uz" ? "Laringologiya" : lang === "ru" ? "Ларингология" : "Laryngology") : 
                           (lang === "uz" ? "Endoskopiya" : lang === "ru" ? "Эндоскопия" : "Endoscopy")}{" "}
                          {lang === "uz" ? "Bo'limi" : lang === "ru" ? "Отделение" : "Unit"}
                        </span>
                      </div>

                      <div className="text-xs font-sans text-slate-800">
                        {lang === "uz" ? "Bemor: " : lang === "ru" ? "Пациент: " : "Patient: "} <b>{appt.patientName}</b> • {lang === "uz" ? "Mas'ul shifokor: " : lang === "ru" ? "Врач: " : "Assigned: "} <span className="text-slate-500 font-medium">{appt.doctorName.split(" (")[0]}</span>
                      </div>

                      <div className="text-[10px] text-slate-500 font-semibold font-mono flex flex-wrap gap-x-3 gap-y-1 bg-slate-50 p-2 rounded-lg">
                        <span>📅 {lang === "uz" ? "Sana: " : lang === "ru" ? "Дата: " : "Date: "} {appt.date}</span>
                        <span>⏰ {lang === "uz" ? "Vaqt: " : lang === "ru" ? "Время: " : "Slot: "} {appt.time}</span>
                      </div>

                      {appt.notes && (
                        <p className="text-[10px] text-slate-400 italic font-sans max-w-md">
                          {lang === "uz" ? "Izoh parametrlari: " : lang === "ru" ? "Параметры заметки: " : "Note parameters: "} "{appt.notes}"
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => startCancelAppointment(appt.id)}
                      className="absolute md:static top-4 right-4 text-slate-300 hover:text-red-500 p-1.5 hover:bg-slate-50 rounded-full transition-colors cursor-pointer font-bold"
                      title="Cancel Appointment"
                    >
                      <span className="material-symbols-outlined text-base">cancel</span>
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {confirmCancelId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-100"
            >
              <div className="flex items-center gap-3 text-red-500 mb-4">
                <span className="material-symbols-outlined text-3xl">warning</span>
                <h3 className="font-sans font-black text-lg text-slate-900">
                  {lang === "uz" ? "Bekor qilishni tasdiqlang" : lang === "ru" ? "Подтвердите отмену" : "Confirm Cancellation"}
                </h3>
              </div>
              <p className="text-sm text-slate-600 font-sans mb-6 leading-relaxed">
                {lang === "uz" 
                  ? `Siz haqiqatan ham uchrashuv bandlovini bekor qilmoqchimisiz? Talon raqami: ${confirmCancelId}` 
                  : lang === "ru" 
                    ? `Вы уверены, что хотите отменить запись? Номер талона: ${confirmCancelId}` 
                    : `Are you sure you want to cancel this appointment slot? Ticket number: ${confirmCancelId}`}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setConfirmCancelId(null)}
                  className="px-4 py-2.5 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 font-sans font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {lang === "uz" ? "Yo'q, qolsin" : lang === "ru" ? "Нет, оставить" : "No, Keep it"}
                </button>
                <button
                  type="button"
                  onClick={executeCancelAppointment}
                  className="px-5 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-sans font-bold text-xs uppercase tracking-wider transition-colors shadow-md hover:shadow-lg cursor-pointer"
                >
                  {lang === "uz" ? "Ha, bekor qilinsin" : lang === "ru" ? "Да, отменить" : "Yes, Cancel"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Toast Notification */}
      <div className="fixed top-6 right-6 z-[70] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, x: 50, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`p-4 rounded-xl shadow-xl border flex items-start gap-3 pointer-events-auto ${
                toast.type === "success" 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              <span className={`material-symbols-outlined ${toast.type === "success" ? "text-emerald-500" : "text-rose-500"} shrink-0`}>
                {toast.type === "success" ? "check_circle" : "error"}
              </span>
              <div className="flex-1 min-w-0 font-sans">
                <p className="text-xs font-bold leading-normal">
                  {toast.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setToast(null)}
                className="text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
