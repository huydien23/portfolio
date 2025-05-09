import React, { useState, useEffect } from 'react';
import { FadeIn } from '../components/AnimatePresence';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  const [typed, setTyped] = useState('');
  const fullText = 'Lập Trình Viên Frontend';
  const typingSpeed = 100;
  
  useEffect(() => {
    if (typed.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTyped(fullText.slice(0, typed.length + 1));
      }, typingSpeed);
      
      return () => clearTimeout(timeout);
    }
  }, [typed]);
  
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-16">
      <div className="absolute inset-0 bg-gradient-radial from-blue-100 to-transparent dark:from-blue-900/20 dark:to-transparent opacity-40"></div>
      
      {/* Floating elements animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 md:w-40 md:h-40 rounded-full bg-blue-400/10 dark:bg-blue-600/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          ></div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Xin chào, tôi là{' '}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 text-transparent bg-clip-text">
                Điền Dev
              </span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={2}>
            <div className="h-10 my-6">
              <h2 className="text-2xl md:text-3xl font-medium">
                <span className="inline-block min-h-[1.5em]">{typed}</span>
                <span className="animate-blink ml-1">|</span>
              </h2>
            </div>
          </FadeIn>
          
          <FadeIn delay={4} direction="up">
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Tôi tạo ra những trang web đẹp, tương thích với mọi thiết bị và mang lại trải nghiệm người dùng tuyệt vời.
              Chuyên môn về công nghệ web hiện đại và các giải pháp sáng tạo.
            </p>
          </FadeIn>
          
          <FadeIn delay={6}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="#projects"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Xem Dự Án
              </a>
              <a
                href="#contact"
                className="px-6 py-3 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 font-medium rounded-lg transition-colors"
              >
                Liên Hệ
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
      
      <button
        onClick={scrollToAbout}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all animate-bounce"
        aria-label="Cuộn xuống phần giới thiệu"
      >
        <ArrowDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </button>
    </section>
  );
};

export default Hero;