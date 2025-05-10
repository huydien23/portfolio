import React, { useState } from 'react';
import { FadeIn } from '../components/AnimatePresence';
import { ExternalLink, Github } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl: string;
  githubUrl: string;
}

const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('tất cả');

  const projectsData: Project[] = [
    {
      id: 1,
      title: 'Website Thương Mại Điện Tử',
      description: 'Nền tảng thương mại điện tử đáp ứng đầy đủ được xây dựng bằng React và Node.js, với các tính năng lọc sản phẩm, giỏ hàng và tích hợp thanh toán.',
      image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['React', 'Node.js', 'MongoDB'],
      demoUrl: '#',
      githubUrl: '#',
    },
    {
      id: 2,
      title: 'Ứng Dụng Quản Lý Công Việc',
      description: 'Ứng dụng năng suất để quản lý các nhiệm vụ và dự án với chức năng kéo thả, thông báo và tính năng cộng tác nhóm.',
      image: 'https://images.pexels.com/photos/6956353/pexels-photo-6956353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['React', 'Firebase', 'TypeScript'],
      demoUrl: '#',
      githubUrl: '#',
    },
    {
      id: 3,
      title: 'Bảng Điều Khiển Tài Chính',
      description: 'Bảng điều khiển phân tích để hiển thị dữ liệu tài chính với các biểu đồ tương tác, lọc dữ liệu và cập nhật theo thời gian thực.',
      image: 'https://images.pexels.com/photos/7567441/pexels-photo-7567441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['Vue.js', 'D3.js', 'REST API'],
      demoUrl: '#',
      githubUrl: '#',
    },
    {
      id: 4,
      title: 'Ứng Dụng Thời Tiết',
      description: 'Ứng dụng thời tiết cung cấp điều kiện hiện tại và dự báo cho các địa điểm trên toàn thế giới, với hình ảnh trực quan đẹp mắt.',
      image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['JavaScript', 'API', 'CSS'],
      demoUrl: '#',
      githubUrl: '#',
    },
  ];

  const filters = ['tất cả', 'React', 'JavaScript', 'TypeScript', 'Node.js', 'Vue.js'];

  const filteredProjects = activeFilter === 'tất cả'
    ? projectsData
    : projectsData.filter(project => project.tags.includes(activeFilter));

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Dự Án Của Tôi
          </h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 mx-auto mb-12"></div>
        </FadeIn>

        <FadeIn>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full transition-all ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <FadeIn key={project.id} delay={index} direction="up">
              <div className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-600 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Xem Demo</span>
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>Mã Nguồn</span>
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;