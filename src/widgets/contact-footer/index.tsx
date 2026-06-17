import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Mail,
  Handshake,
  Briefcase,
  Zap,
  Clock,
  MessageCircle,
  GithubIcon,
  Linkedin,
  Globe,
  Pin,
  Send,
  Loader2
} from 'lucide-react';
import { db } from '../../shared/api/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useSiteProfile } from '../../entities/site/hooks';
import { pickLocale, LocalizedString } from '../../entities/site/model';

type ChatStep = 'typing_message' | 'collect_info' | 'success';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

export const ContactFooter = () => {
  const { t } = useTranslation();
  const { profile, lang } = useSiteProfile();
  const contact = profile.contact;
  const loc = (s: LocalizedString) => pickLocale(s, lang);
  const [step, setStep] = useState<ChatStep>('typing_message');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const chatRef = useRef<HTMLDivElement>(null);

  const initialMessages: Message[] = [
    { id: '1', text: `${t('contact.greeting_1')} ${t('hero.title_first')} ${t('hero.title_last')}`.replace('.', ''), isBot: true },
    { id: '2', text: t('contact.greeting_2'), isBot: true },
  ];

  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isBotTyping, step]);

  const addBotMessage = (text: string, delay = 600) => {
    setIsBotTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), text, isBot: true }]);
      setIsBotTyping(false);
    }, delay);
  };

  const handleSendMessage = (e?: React.FormEvent, directMessage?: string) => {
    if (e) e.preventDefault();
    const textToSend = directMessage || inputValue.trim();
    if (!textToSend) return;

    // Save user message
    setMessages(prev => [...prev, { id: Date.now().toString(), text: textToSend, isBot: false }]);
    setUserMessage(textToSend);
    setInputValue('');
    
    setStep('collect_info');
    
    addBotMessage(t('contact.bot_ask_info'), 800);
  };

  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), text: `Tên: ${name} - Email: ${email}`, isBot: false }]);
    setStatus('loading');

    try {
      try {
        await addDoc(collection(db, 'inbox'), {
          name,
          email,
          message: userMessage,
          createdAt: serverTimestamp(),
          source: 'Portfolio Telegram Chat',
          isRead: false,
        });
      } catch (fbError) {

      }

      const teleToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
      
      if (teleToken && chatId && teleToken !== '') {
        const text = `**Thông báo có tin nhắn mới từ Web Portfolio** 
        \n\n *Tên:* ${name}\n 
        *Email:* ${email}\n *Tin nhắn:*\n_${userMessage}_`;
        
        const response = await fetch(`https://api.telegram.org/bot${teleToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown'
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(`Lỗi API bot: ${errData.description}`);
        }
      } else {  

      }

      setStatus('success');
      setStep('success');
      addBotMessage(t('contact.bot_success'), 1000);
    } catch (error) {
      setStatus('error');
      addBotMessage(t('contact.bot_error'), 500);
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const topicButtons = [
    { id: 'topic_1', label: t('contact.topic_1'), Icon: Handshake },
    { id: 'topic_2', label: t('contact.topic_2'), Icon: Briefcase },
    { id: 'topic_3', label: t('contact.topic_3'), Icon: Zap },
  ];

  return (
    <footer id="contact" className="w-full relative z-10 bg-slate-50 dark:bg-slate-900 pt-32 pb-12 border-t border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-ocean-500 to-transparent opacity-50" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="h-[2px] w-8 bg-ocean-500" />
          <span className="text-ocean-400 font-mono text-sm tracking-widest uppercase">{t('contact.section_label')}</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white"
        >
          {t('contact.heading')}<span className="text-ocean-500">.</span>
        </motion.h2>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          {/* ─── Chat Interface ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-[65%] bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden backdrop-blur-sm flex flex-col"
          >
            {/* Chat header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-sm font-mono text-slate-500 ml-2">{t('contact.chat_title')}</span>
              <div className="ml-auto flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-mono text-slate-500">Online</span>
              </div>
            </div>

            {/* Chat messages */}
            <div ref={chatRef} className="h-[380px] overflow-y-auto p-6 flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[85%] ${msg.isBot ? 'order-1' : 'order-2'}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          msg.isBot
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-sm'
                            : 'bg-ocean-600 text-white rounded-tr-sm'
                        }`}
                      >
                        <p className="text-[15px] leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {isBotTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%] order-1">
                      <div className="px-4 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-700 rounded-tl-sm flex gap-1.5 items-center">
                        <motion.div className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                        <motion.div className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                        <motion.div className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
              
              {step === 'typing_message' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                    {topicButtons.map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        onClick={() => handleSendMessage(undefined, label)}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-ocean-50 dark:hover:bg-ocean-900/50 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-600 hover:border-ocean-300 dark:hover:border-ocean-500 transition-all hover:-translate-y-0.5"
                      >
                        <Icon className="w-3.5 h-3.5 text-ocean-600 dark:text-ocean-400" />
                        {label}
                      </button>
                    ))}
                  </div>
                  
                  {/* Real Input */}
                  <form onSubmit={handleSendMessage} className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={t('contact.placeholder')}
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      className="w-full pl-5 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-ocean-500 focus:ring-4 focus:ring-ocean-500/10 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-ocean-600 disabled:text-slate-300 hover:text-ocean-500 transition-colors disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 'collect_info' && !isBotTyping && (
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSubmitFinal}
                  className="flex flex-col gap-3"
                >
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder={t('contact.name_placeholder')}
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="w-1/2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-ocean-500 focus:ring-4 focus:ring-ocean-500/10 transition-all"
                    />
                    <input
                      type="email"
                      placeholder={t('contact.email_placeholder')}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                      className="w-1/2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-ocean-500 focus:ring-4 focus:ring-ocean-500/10 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading' || !email || !name}
                    className="w-full py-3 bg-ocean-600 hover:bg-ocean-500 disabled:bg-slate-400 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> {t('contact.submitting')}</>
                    ) : (
                      <>{t('contact.submit')} <Send className="w-4 h-4" /></>
                    )}
                  </button>
                </motion.form>
              )}
              {step === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-1 flex items-center justify-center text-ocean-600 font-medium text-sm gap-2"
                >
                  <div className="w-6 h-6 bg-ocean-100 rounded-full flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  {t('contact.sent_success')}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Quick Contact Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-[35%] sticky top-32"
          >
            <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <Pin className="w-4 h-4 text-ocean-500" />
                {t('contact.quick_contact')}
              </h3>

              <div className="flex flex-col gap-3">
                <a
                  href={`tel:${contact.phone.replace(/\./g, '')}`}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-slate-700/50 rounded-xl hover:bg-ocean-50 dark:hover:bg-ocean-900/30 transition-colors group"
                >
                  <span className="w-10 h-10 bg-ocean-100 dark:bg-ocean-900/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5 text-ocean-600 dark:text-ocean-400" />
                  </span>
                  <div>
                    <p className="text-xs font-mono text-slate-500 uppercase">{t('contact.phone_label')}</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{contact.phone}</p>
                  </div>
                </a>

                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-slate-700/50 rounded-xl hover:bg-ocean-50 dark:hover:bg-ocean-900/30 transition-colors group"
                >
                  <span className="w-10 h-10 bg-ocean-100 dark:bg-ocean-900/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-ocean-600 dark:text-ocean-400" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-slate-500 uppercase">Email</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{contact.email}</p>
                  </div>
                </a>

                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={contact.zalo}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-slate-700/50 rounded-xl hover:bg-ocean-50 dark:hover:bg-ocean-900/30 transition-colors group"
                >
                  <span className="w-10 h-10 bg-ocean-100 dark:bg-ocean-900/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <img src="https://cdn.simpleicons.org/zalo/0068FF" alt="Zalo" className="w-5 h-5 object-contain" />
                  </span>
                  <div>
                    <p className="text-xs font-mono text-slate-500 uppercase">Zalo</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Zalo App</p>
                  </div>
                </a>
              </div>

              <div className="my-4 h-px bg-slate-200 dark:bg-slate-700" />

              {/* Social Links */}
              <div className="flex flex-col gap-2">
                <p className="text-xs font-mono text-slate-500 uppercase mb-1">{t('contact.social_label')}</p>
                <div className="flex gap-2">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={contact.github}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2.5 bg-white dark:bg-slate-700/50 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-900 hover:text-white transition-colors text-sm font-medium"
                  >
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="GitHub" className="w-4 h-4 dark:invert group-hover:invert-0" />
                    <span>GitHub</span>
                  </a>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={contact.linkedin}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2.5 bg-white dark:bg-slate-700/50 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-900 hover:text-white transition-colors text-sm font-medium"
                  >
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg" alt="LinkedIn" className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={contact.facebook}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2.5 bg-white dark:bg-slate-700/50 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-900 hover:text-white transition-colors text-sm font-medium"
                  >
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/facebook/facebook-original.svg" alt="Facebook" className="w-4 h-4" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-mono text-slate-500 uppercase mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {loc(contact.hoursLabel)}
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{loc(contact.hoursValue)}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer - Copyright only */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-20 pt-8 border-t border-slate-200 dark:border-slate-800 text-center md:text-left text-slate-500 text-sm font-mono tracking-wider">
        <p>© {new Date().getFullYear()} {profile.brand.shorthand}. All rights reserved.</p>
      </div>
    </footer>
  );
};
