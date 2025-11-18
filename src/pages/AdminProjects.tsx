import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import AdminLayout from '../components/AdminLayout';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Github, 
  Image as ImageIcon,
  Star,
  Calendar,
  Tag,
  Upload,
  X,
  Save,
  Eye
} from 'lucide-react';
import { fileToBase64, validateImageFile, resizeImageToBase64 } from '../utils/imageUtils';
import type { Project } from '../services/firebase';

const AdminProjects: React.FC = () => {
  const { projects, createProject, updateProject, deleteProject, loading } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    gallery: [] as string[],
    technologies: [] as string[],
    demoUrl: '',
    githubUrl: '',
    featured: false
  });
  const [newTech, setNewTech] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      thumbnail: '',
      gallery: [],
      technologies: [],
      demoUrl: '',
      githubUrl: '',
      featured: false
    });
    setEditingProject(null);
    setNewTech('');
  };

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        thumbnail: project.thumbnail,
        gallery: project.gallery,
        technologies: project.technologies,
        demoUrl: project.demoUrl || '',
        githubUrl: project.githubUrl || '',
        featured: project.featured
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
      } else {
        await createProject(formData);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Có lỗi xảy ra khi lưu dự án!');
    }
  };

  const handleDelete = async (project: Project) => {
    if (confirm(`Bạn có chắc muốn xóa dự án "${project.title}"?`)) {
      try {
        await deleteProject(project.id);
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Có lỗi xảy ra khi xóa dự án!');
      }
    }
  };

  const handleImageUpload = async (file: File, type: 'thumbnail' | 'gallery') => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    try {
      setUploadingImage(true);
      const base64 = await resizeImageToBase64(file, 800, 600, 0.8);
      
      if (type === 'thumbnail') {
        setFormData(prev => ({ ...prev, thumbnail: base64 }));
      } else {
        setFormData(prev => ({ ...prev, gallery: [...prev.gallery, base64] }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Có lỗi xảy ra khi tải ảnh!');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const addTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  return (
    <AdminLayout currentPage="projects">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quản lý Dự án
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Thêm, sửa và xóa các dự án trong portfolio
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm dự án
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Project Image */}
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                {project.thumbnail ? (
                  <img 
                    src={project.thumbnail} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => openModal(project)}
                    className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(project)}
                    className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span 
                      key={tech}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <Tag className="w-2 h-2 mr-1" />
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>

                {/* Links & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        title="Xem demo"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="Xem code"
                      >
                        <Github className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(project.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && !loading && (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Chưa có dự án nào
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Hãy bắt đầu bằng cách thêm dự án đầu tiên của bạn
            </p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm dự án đầu tiên
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tải...</span>
          </div>
        )}
      </div>

      {/* Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal} />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingProject ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tên dự án *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Ví dụ: E-commerce Platform"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Demo URL
                    </label>
                    <input
                      type="url"
                      value={formData.demoUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, demoUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="https://demo.example.com"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mô tả *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Mô tả ngắn về dự án..."
                    required
                  />
                </div>

                {/* GitHub URL & Featured */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Dự án nổi bật
                      </span>
                    </label>
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Công nghệ sử dụng
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.technologies.map((tech) => (
                      <span 
                        key={tech}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Ví dụ: React, TypeScript..."
                    />
                    <button
                      type="button"
                      onClick={addTechnology}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Thêm
                    </button>
                  </div>
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ảnh thumbnail
                  </label>
                  <div className="flex items-center space-x-4">
                    {formData.thumbnail ? (
                      <div className="relative">
                        <img 
                          src={formData.thumbnail} 
                          alt="Thumbnail"
                          className="w-20 h-20 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                          className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    
                    <label className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadingImage ? 'Đang tải...' : 'Chọn ảnh'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'thumbnail')}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Đang lưu...' : 'Lưu dự án'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProjects;