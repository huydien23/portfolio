import React, { useState } from 'react';
import { FadeIn } from '../components/AnimatePresence';
import { ExternalLink, Github } from 'lucide-react';

// Import images
import portfolioImg from '../assets/images/project/portfolio.png';
import nhaTroImg from '../assets/images/project/nha-tro-ket-noi.png';
import noiThatImg from '../assets/images/project/noi-that.png';
import benhVienImg from '../assets/images/project/winform-qlbenhvien.png';
import dongVatImg from '../assets/images/project/pham-mem-nhan-dien-dong-vat.png';
import xuHuongImg from '../assets/images/project/phan-tich-xu-huong-thi-truong.png';


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
  const [activeFilter, setActiveFilter] = useState<string>('Tất cả');

  const projectsData: Project[] = [
    {
      id: 1,
      title: 'Portfolio Website',
      description: 'Website cá nhân hiện đại xây dựng bằng ReactJS, Tailwind CSS, TypeScript',
      image: portfolioImg,
      tags: ['Frontend', 'ReactJS', 'Tailwind CSS', 'TypeScript'],
      demoUrl: 'diendev.netlify.app',
      githubUrl: 'https://github.com/huydien23/portfolio.git',
    },
    {
      id: 2,
      title: 'Website Nhà Trọ Kết Nối',
      description: 'Website Nhà Trọ Kết Nối với HTML, CSS, JavaScript,Bootstrap, jQuery, Firebase',
      image: nhaTroImg,
      tags: ['Frontend', 'HTML', 'CSS', 'JavaScript', 'Bootstrap', 'jQuery', 'Firebase'],
      demoUrl: 'https://nhatroketnoi.id.vn/',
      githubUrl: 'https://github.com/huydien23/project-rooms.git',
    },
    {
      id: 3,
      title: 'Website Bán Nội Thất',
      description: 'Website bán Nội Thất Gia Phương Home được xây dựng bằng ReactJS, Tailwind CSS, TypeScript, Superbase',
      image: noiThatImg,
      tags: ['Frontend', 'ReactJS', 'Tailwind CSS', 'TypeScript', 'Superbase'],
      demoUrl: '#',
      githubUrl: '#',
    },
    {
      id: 4,
      title: 'Hệ Thống Quản Lý Công Việc',
      description: 'Ứng dụng quản lý công việc với ASP.NET Core, Entity Framework, SQL Server.',
      image: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['Backend', 'ASP.NET Core', 'Entity Framework', 'SQL Server', 'C#'],
      demoUrl: '#',
      githubUrl: '#',
    },
    {
      id: 5,
      title: 'WinForm Quản Lý Bệnh Viện',
      description: 'Xây dựng WinForm quản lý bệnh viện với C#, .NET Framework, Windows Forms, ADO.NET.',
      image: benhVienImg,
      tags: ['Backend', 'C#', '.NET Framework', 'Windows Forms', 'ADO.NET'],
      demoUrl: '#',
      githubUrl: '#',
    },
    {
      id: 6,
      title: 'Phần Mềm Nhận Diện Động Vật',
      description: 'Phần mềm nhận diện động vật với Python, Machine Learning, Flask.',
      image: dongVatImg,
      tags: ['AI', 'Python', 'Machine Learning', 'Flask', 'TensorFlow', 'Keras', 'OpenCV'],
      demoUrl: '#',
      githubUrl: '#',
    },
    {
      id: 7,
      title: 'Phần Mềm Phân Tích Xu Hướng Tài Chính Thị Trường',
      description: 'Phân tích xu hướng tài chính thị trường với Python, Machine Learning, Flask.',
      image: xuHuongImg,
      tags: ['AI', 'Python', 'Machine Learning', 'Flask'],
      demoUrl: '#',
      githubUrl: '#',
    },
  ];

  const filters = ['Tất cả', 'Frontend', 'Backend', 'Desktop', 'AI'];

  const filteredProjects = activeFilter === 'Tất cả'
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
                className={`px-4 py-2 rounded-full transition-all ${activeFilter === filter
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