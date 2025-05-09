import React from 'react';
import { FadeIn } from '../components/AnimatePresence';
import { Code, Palette, Globe, Cpu } from 'lucide-react';

const About: React.FC = () => {
  const skills = [
    { name: 'Phát triển Frontend', icon: <Code className="w-6 h-6" />, description: 'Xây dựng giao diện người dùng đáp ứng và tương tác với công nghệ hiện đại.' },
    { name: 'Thiết kế UI/UX', icon: <Palette className="w-6 h-6" />, description: 'Tạo trải nghiệm người dùng trực quan và hấp dẫn.' },
    { name: 'Hiệu suất Web', icon: <Globe className="w-6 h-6" />, description: 'Tối ưu hóa trang web cho tốc độ, khả năng truy cập và SEO.' },
    { name: 'Kỹ năng Kỹ thuật', icon: <Cpu className="w-6 h-6" />, description: 'Thành thạo JavaScript, TypeScript, React và các framework web hiện đại.' },
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Giới Thiệu
          </h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 mx-auto mb-12"></div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left">
            <div className="relative">
              <div className="w-full h-[400px] bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg overflow-hidden">
                <div className="absolute inset-4 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden shadow-inner">
                  <img
                    src="https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                    alt="Professional Profile"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-blue-600 dark:bg-blue-400 rounded-full mix-blend-multiply dark:mix-blend-normal opacity-70 dark:opacity-20"></div>
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-normal opacity-70 dark:opacity-20"></div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                Xin chào, tôi là{' '}
                <span className="text-blue-600 dark:text-blue-400">Điền Dev</span>
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Tôi là một lập trình viên web đầy đam mê với 2 năm kinh nghiệm tạo ra các 
                trang web và ứng dụng web hiện đại, đáp ứng. Hành trình của tôi trong phát 
                triển web bắt đầu với sự tò mò về cách mọi thứ hoạt động trên internet, 
                điều này đã dẫn tôi đến con đường tạo ra các trải nghiệm số.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Cách tiếp cận của tôi kết hợp giữa chuyên môn kỹ thuật và giải quyết vấn đề 
                sáng tạo để mang lại các giải pháp không chỉ đẹp mà còn hoạt động cực kỳ tốt. 
                Tôi luôn học hỏi và thích nghi với các công nghệ mới để đảm bảo kỹ năng của 
                mình luôn ở đỉnh cao của ngành phát triển web.
              </p>
              <a
                href="#contact"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg inline-block"
              >
                Liên Hệ Ngay
              </a>
            </div>
          </FadeIn>
        </div>

        <div className="mt-20">
          <FadeIn>
            <h3 className="text-2xl font-bold text-center mb-12">Kỹ Năng Của Tôi</h3>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skill, index) => (
              <FadeIn key={skill.name} delay={index} direction="up">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-400 dark:group-hover:text-gray-900 transition-colors">
                    {skill.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{skill.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{skill.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;