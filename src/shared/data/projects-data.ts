import { ProjectEntity } from '../../entities/project/model';

/* ─── Local image imports ─── */
import portfolioImg from '../../assets/images/project/portfolio.png';
import nhaTroImg from '../../assets/images/project/nha-tro-ket-noi.png';
import noiThatImg from '../../assets/images/project/noi-that.png';
import benhVienImg from '../../assets/images/project/winform-qlbenhvien.png';
import dongVatImg from '../../assets/images/project/pham-mem-nhan-dien-dong-vat.png';
import xuHuongImg from '../../assets/images/project/phan-tich-xu-huong-thi-truong.png';
import quanLyTaiLieuImg from '../../assets/images/project/quanly-tailieu.png';
import monNgonImg from '../../assets/images/project/mon-ngon-viet-nam.png';
import xlyAnhImg from '../../assets/images/project/phan-mem-xu-ly-anh.png';

export type ProjectSeedData = Omit<ProjectEntity, 'status' | 'order'>;

export const PROJECTS_DATA: ProjectSeedData[] = [
  {
    id: 'prj-portfolio',
    title: 'Portfolio Website',
    description: 'Website cá nhân hiện đại xây dựng bằng ReactJS, Tailwind CSS, TypeScript với hiệu ứng chuyển động mượt mà.',
    longDescription: 'Website cá nhân đóng vai trò như CV sống động với hiệu ứng chuyển động, tối ưu hiệu suất và responsive hoàn toàn trên mọi thiết bị.',
    category: 'Frontend',
    tags: ['ReactJS', 'TypeScript', 'Tailwind CSS'],
    imageUrl: portfolioImg,
    gallery: [portfolioImg],
    highlights: [
      'Thiết kế dark/light mode với ThemeContext.',
      'Thiết lập CI/CD tự động với Netlify.',
      'Tái sử dụng component dạng mô-đun giúp mở rộng nhanh.',
    ],
    githubUrl: 'https://github.com/huydien23/portfolio.git',
    liveUrl: 'https://diendev.netlify.app',
    year: 2024,
    featured: true,
  },
  {
    id: 'prj-nha-tro',
    title: 'Website Nhà Trọ Kết Nối',
    description: 'Nền tảng kết nối chủ trọ và người thuê với Firebase Realtime Database, lọc phòng thông minh.',
    longDescription: 'Nền tảng kết nối chủ trọ và người thuê với quy trình đăng tin, lọc phòng và quản lý yêu cầu tập trung. Tích hợp Firebase để đồng bộ realtime.',
    category: 'Frontend',
    tags: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'jQuery', 'Firebase'],
    imageUrl: nhaTroImg,
    gallery: [nhaTroImg],
    videoUrl: 'https://www.youtube.com/embed/Q7HnRA3OQEY',
    highlights: [
      'Realtime database Firebase để đồng bộ trạng thái phòng.',
      'Tối ưu SEO on-page giúp gia tăng lưu lượng tự nhiên.',
      'Form liên hệ tự động gửi email xác nhận.',
    ],
    githubUrl: 'https://github.com/huydien23/project-rooms.git',
    liveUrl: 'https://nhatroketnoi.id.vn/',
    year: 2023,
    featured: true,
  },
  {
    id: 'prj-noi-that',
    title: 'Website Bán Nội Thất',
    description: 'Website thương mại điện tử nội thất Gia Phương Home với hệ thống giỏ hàng và bảng quản trị.',
    longDescription: 'MVP thương mại điện tử nội thất với hệ thống danh mục, giỏ hàng realtime và bảng quản trị. Tích hợp Supabase làm backend-as-a-service.',
    category: 'Frontend',
    tags: ['ReactJS', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    imageUrl: noiThatImg,
    gallery: [noiThatImg],
    year: 2024,
    featured: true,
  },
  {
    id: 'prj-ql-cv',
    title: 'Hệ Thống Quản Lý Công Việc',
    description: 'Ứng dụng quản lý công việc doanh nghiệp với ASP.NET Core, phân quyền theo nhóm và dashboard tiến độ.',
    longDescription: 'Hệ thống quản lý công việc cho doanh nghiệp vừa và nhỏ với giao diện trực quan, phân quyền đa cấp và biểu đồ burn-down theo dõi tiến độ.',
    category: 'Backend',
    tags: ['ASP.NET Core', 'C#', 'Entity Framework', 'SQL Server'],
    imageUrl: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    highlights: [
      'Phân quyền người dùng theo nhóm dự án.',
      'Dashboard tiến độ và biểu đồ burn-down.',
      'API RESTful chuẩn OpenAPI / Swagger.',
    ],
    year: 2023,
    featured: false,
  },
  {
    id: 'prj-benh-vien',
    title: 'WinForm Quản Lý Bệnh Viện',
    description: 'Phần mềm desktop quản lý bệnh viện với C#, .NET Framework, Windows Forms và ADO.NET.',
    longDescription: 'Hệ thống quản lý bệnh viện toàn diện: quản lý bệnh nhân, lịch khám, kê đơn và lập báo cáo thống kê trên nền tảng WinForms.',
    category: 'Desktop',
    tags: ['C#', '.NET Framework', 'Windows Forms', 'ADO.NET'],
    imageUrl: benhVienImg,
    gallery: [benhVienImg],
    year: 2022,
    featured: false,
  },
  {
    id: 'prj-dong-vat',
    title: 'Phần Mềm Nhận Diện Động Vật',
    description: 'Phần mềm AI nhận diện động vật qua camera với TensorFlow, Keras, OpenCV và Flask API.',
    longDescription: 'Ứng dụng nhận diện hình ảnh động vật theo thời gian thực sử dụng mô hình CNN huấn luyện với TensorFlow. Backend Flask phục vụ inference qua REST API.',
    category: 'AI',
    tags: ['Python', 'TensorFlow', 'Keras', 'OpenCV', 'Flask'],
    imageUrl: dongVatImg,
    videoUrl: 'https://www.youtube.com/embed/aqz-KE-bpKQ',
    year: 2023,
    featured: false,
  },
  {
    id: 'prj-tai-chinh',
    title: 'Phân Tích Xu Hướng Thị Trường',
    description: 'Phần mềm phân tích xu hướng tài chính thị trường bằng Python, Machine Learning và Flask.',
    longDescription: 'Hệ thống phân tích dữ liệu thị trường tài chính sử dụng mô hình ML để dự đoán xu hướng ngắn hạn. Trực quan hóa biểu đồ real-time qua giao diện web.',
    category: 'AI',
    tags: ['Python', 'Machine Learning', 'Flask', 'Pandas'],
    imageUrl: xuHuongImg,
    videoUrl: 'https://www.youtube.com/embed/9No-FiEInLA',
    year: 2023,
    featured: false,
  },
  {
    id: 'prj-tai-lieu',
    title: 'Quản Lý Tài Liệu Khoa Học',
    description: 'Hệ thống quản lý tài liệu học thuật với ASP.NET Core MVC, Razor View và SQL Server.',
    longDescription: 'Website quản lý tài liệu khoa học hỗ trợ upload, phân loại và tìm kiếm tài liệu. Xây dựng theo mô hình MVC chuẩn với phân quyền tác giả/quản trị viên.',
    category: 'Backend',
    tags: ['ASP.NET Core', 'C#', 'MVC', 'Razor View', 'SQL Server', 'Bootstrap'],
    imageUrl: quanLyTaiLieuImg,
    gallery: [quanLyTaiLieuImg],
    year: 2022,
    featured: false,
  },
  {
    id: 'prj-mon-ngon',
    title: 'Ứng Dụng Món Ngon Việt Nam',
    description: 'Ứng dụng tra cứu và chia sẻ công thức món ăn Việt Nam với giao diện thân thiện.',
    longDescription: 'Ứng dụng từ điển công thức món ăn Việt Nam với chức năng tìm kiếm, lọc theo vùng miền và lưu yêu thích. Dữ liệu phong phú với hình ảnh và hướng dẫn chi tiết.',
    category: 'Frontend',
    tags: ['ReactJS', 'TypeScript', 'Tailwind CSS'],
    imageUrl: monNgonImg,
    gallery: [monNgonImg],
    year: 2024,
    featured: false,
  },
  {
    id: 'prj-xu-ly-anh',
    title: 'Phần Mềm Xử Lý Ảnh',
    description: 'Phần mềm xử lý ảnh số với các bộ lọc cơ bản và nâng cao sử dụng OpenCV và Python.',
    longDescription: 'Phần mềm xử lý ảnh với các tính năng: điều chỉnh độ sáng/tương phản, áp dụng bộ lọc Gaussian/Sobel, phát hiện cạnh và biến đổi hình học.',
    category: 'AI',
    tags: ['Python', 'OpenCV', 'NumPy'],
    imageUrl: xlyAnhImg,
    gallery: [xlyAnhImg],
    year: 2022,
    featured: false,
  },

];
