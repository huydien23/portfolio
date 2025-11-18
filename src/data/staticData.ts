// Static data for portfolio - will be exported to JSON for Firebase import

export const staticPortfolioData = {
  version: "1.0",
  exportDate: new Date().toISOString(),
  
  // Personal Information
  personalInfo: {
    name: "Điền Dev",
    title: "Lập Trình Viên Full Stack", 
    bio: "Tôi là một lập trình viên web đam mê, chuyên tạo ra những trang web đẹp và hiệu quả. Với kinh nghiệm trong việc phát triển ứng dụng web hiện đại, tôi luôn tìm kiếm cơ hội để học hỏi và áp dụng công nghệ mới.",
    avatar: "", // Base64 image will be added later
    email: "nhdiendndc.dev@gmail.com",
    phone: "+84 123 456 789",
    location: "Việt Nam",
    resume: "", // Base64 PDF will be added later
    updatedAt: Date.now()
  },

  // Site Content
  siteContent: {
    hero: {
      title: "Xin chào, tôi là Điền Dev",
      subtitle: "Lập Trình Viên Full Stack",
      description: "Tôi tạo ra những trang web đẹp, tương thích với mọi thiết bị và mang lại trải nghiệm người dùng tuyệt vời. Chuyên môn về công nghệ web hiện đại và các giải pháp sáng tạo.",
      backgroundImage: "", // Base64 image will be added later
      ctaButton: {
        text: "Xem Dự Án",
        link: "#projects"
      }
    },
    about: {
      title: "Giới Thiệu",
      content: "Tôi là một lập trình viên web với niềm đam mê tạo ra những ứng dụng web hiện đại và hiệu quả. Với kinh nghiệm trong việc phát triển cả frontend và backend, tôi có thể mang đến những giải pháp toàn diện cho doanh nghiệp của bạn.",
      skills: [
        "React", "TypeScript", "JavaScript", "Node.js", "Express",
        "MongoDB", "PostgreSQL", "Firebase", "AWS", "Docker",
        "Git", "HTML5", "CSS3", "Tailwind CSS", "Material-UI"
      ],
      experience: [
        {
          title: "Full Stack Developer",
          company: "Tech Company",
          period: "2022 - Hiện tại",
          description: "Phát triển và duy trì các ứng dụng web sử dụng React, Node.js, và MongoDB."
        },
        {
          title: "Frontend Developer", 
          company: "Digital Agency",
          period: "2021 - 2022",
          description: "Tạo giao diện người dùng responsive và interactive cho các website thương mại điện tử."
        }
      ]
    },
    contact: {
      title: "Liên Hệ",
      description: "Hãy liên hệ với tôi để thảo luận về dự án của bạn hoặc cơ hội hợp tác.",
      socialLinks: [
        {
          platform: "GitHub",
          url: "https://github.com/diendev",
          icon: "github"
        },
        {
          platform: "LinkedIn", 
          url: "https://linkedin.com/in/diendev",
          icon: "linkedin"
        },
        {
          platform: "Email",
          url: "mailto:nhdiendndc.dev@gmail.com",
          icon: "mail"
        },
        {
          platform: "Phone",
          url: "tel:+84123456789", 
          icon: "phone"
        }
      ]
    },
    footer: {
      copyright: "© 2025 Điền Dev. Đã đăng ký bản quyền.",
      links: [
        {
          text: "Privacy Policy",
          url: "/privacy"
        },
        {
          text: "Terms of Service", 
          url: "/terms"
        }
      ]
    },
    updatedAt: Date.now()
  },

  // Sample Projects
  projects: [
    {
      id: "project_1",
      title: "E-commerce Platform",
      description: "Một nền tảng thương mại điện tử hoàn chỉnh với giỏ hàng, thanh toán và quản lý đơn hàng.",
      thumbnail: "", // Base64 image will be added later
      gallery: [], // Array of Base64 images
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "Express"],
      demoUrl: "https://demo-ecommerce.example.com",
      githubUrl: "https://github.com/diendev/ecommerce-platform",
      featured: true,
      createdAt: Date.now() - (30 * 24 * 60 * 60 * 1000), // 30 days ago
      updatedAt: Date.now()
    },
    {
      id: "project_2", 
      title: "Task Management App",
      description: "Ứng dụng quản lý công việc với tính năng real-time collaboration và notification.",
      thumbnail: "", // Base64 image will be added later
      gallery: [],
      technologies: ["React", "Firebase", "Material-UI", "TypeScript"],
      demoUrl: "https://task-manager.example.com",
      githubUrl: "https://github.com/diendev/task-manager",
      featured: true,
      createdAt: Date.now() - (60 * 24 * 60 * 60 * 1000), // 60 days ago
      updatedAt: Date.now()
    },
    {
      id: "project_3",
      title: "Portfolio Website",
      description: "Website portfolio cá nhân với admin panel và analytics tích hợp.",
      thumbnail: "", // Base64 image will be added later  
      gallery: [],
      technologies: ["React", "TypeScript", "Tailwind CSS", "Firebase", "Vite"],
      demoUrl: "https://diendev-portfolio.netlify.app",
      githubUrl: "https://github.com/diendev/portfolio",
      featured: false,
      createdAt: Date.now() - (10 * 24 * 60 * 60 * 1000), // 10 days ago
      updatedAt: Date.now()
    }
  ],

  // Site Settings
  siteSettings: {
    siteName: "Điền Dev Portfolio",
    siteDescription: "Portfolio chuyên nghiệp của Điền Dev - Lập trình viên Full Stack",
    siteUrl: "https://diendev-portfolio.netlify.app",
    logo: "", // Base64 image will be added later
    favicon: "🔥", // Emoji favicon
    theme: {
      primaryColor: "#3B82F6", // Blue-500
      secondaryColor: "#1E40AF", // Blue-700  
      accentColor: "#60A5FA", // Blue-400
      darkMode: true
    },
    seo: {
      metaTitle: "Điền Dev - Lập Trình Viên Full Stack",
      metaDescription: "Portfolio chuyên nghiệp giới thiệu về công việc, kỹ năng và kinh nghiệm của tôi như một lập trình viên web.",
      keywords: [
        "lập trình viên", "full stack developer", "react", "nodejs", 
        "typescript", "javascript", "web developer", "vietnam developer"
      ],
      ogImage: "" // Base64 image will be added later
    },
    analytics: {
      googleAnalyticsId: "", // Will be configured later
      facebookPixelId: "" // Will be configured later  
    },
    updatedAt: Date.now()
  }
};

// Function to export data as JSON file
export const exportStaticData = () => {
  const dataStr = JSON.stringify(staticPortfolioData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(link.href);
};

// Function to validate imported data
export const validateImportData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.version) {
    errors.push("Missing version field");
  }
  
  if (!data.personalInfo) {
    errors.push("Missing personalInfo section");
  }
  
  if (!data.siteContent) {
    errors.push("Missing siteContent section");
  }
  
  if (!data.projects || !Array.isArray(data.projects)) {
    errors.push("Missing or invalid projects array");
  }
  
  if (!data.siteSettings) {
    errors.push("Missing siteSettings section");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};