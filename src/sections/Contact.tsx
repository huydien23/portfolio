import React, { useState } from 'react';
import { FadeIn } from '../components/AnimatePresence';
import { Send, MapPin, Phone, Mail } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset submission status after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };
  
  const contactInfo = [
    { icon: <MapPin className="w-5 h-5" />, text: 'Cần Thơ, Việt Nam' },
    { icon: <Phone className="w-5 h-5" />, text: '+84 945700813' },
    { icon: <Mail className="w-5 h-5" />, text: 'nhdiendnc.dev@gmail.com' },
  ];

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Liên Hệ
          </h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 mx-auto mb-12"></div>
        </FadeIn>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <FadeIn direction="left">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Hãy Kết Nối</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Bạn có một dự án trong đầu hoặc chỉ muốn nói xin chào? Đừng ngại liên hệ!
                Tôi luôn sẵn sàng thảo luận về các dự án mới, ý tưởng sáng tạo hoặc cơ hội
                để trở thành một phần trong tầm nhìn của bạn.
              </p>
              
              <div className="space-y-4 mb-8">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mr-4 text-blue-600 dark:text-blue-400">
                      {item.icon}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-lg">
                <h4 className="text-lg font-medium mb-3">Sẵn sàng cho:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Dự án freelance</li>
                  <li>Cơ hội toàn thời gian</li>
                  <li>Dịch vụ tư vấn</li>
                  <li>Phát biểu tại sự kiện</li>
                </ul>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn direction="right">
            <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Đã gửi tin nhắn!</h3>
                  <p className="text-gray-600 dark:text-gray-400">Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi sớm nhất có thể.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">Họ và tên</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">Email của bạn</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">Tiêu đề</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Nội dung tin nhắn</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-3 flex items-center justify-center gap-2 rounded-lg text-white font-medium transition-colors ${
                      isSubmitting
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Gửi tin nhắn</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default Contact;