"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ArrowLeft, LayoutTemplate, Layers, Edit2, ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import AdminSkeleton from './components/AdminSkeleton';
import PageHeader from './components/PageHeader';
import SectionForm from './components/SectionForm';
import LogoUploader from './components/LogoUploader';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ManageBlogsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const tabsContainerRef = useRef(null);

  const tabs = [
    { id: 'hero', label: 'Hero Banner', icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: 'blogs', label: 'Manage Articles', icon: <Layers className="w-4 h-4" /> }
  ];

  const [formData, setFormData] = useState({
    hero: {
      title: 'Insights & Blogs',
      subtitle: 'Explore expert articles, student success stories, industry trends, and academic insights to stay informed and inspired.',
      backgroundImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600&auto=format&fit=crop'
    },
    blogs: []
  });

  const [editingBlog, setEditingBlog] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/blogs-page');
      if (data) {
        setFormData({
          hero: data.hero || formData.hero,
          blogs: data.blogs || []
        });
      }
    } catch (error) {
      console.error('Error fetching blogs settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load blogs data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/cms/blogs-page', formData);
      Toast.fire({ icon: 'success', title: 'Blogs page updated successfully' });
    } catch (error) {
      console.error('Error saving blogs page:', error);
      Toast.fire({ icon: 'error', title: 'Failed to update page' });
    } finally {
      setSaving(false);
    }
  };

  const handleHeroChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  // --- BLOG EDITOR LOGIC ---
  const handleAddNewBlog = () => {
    setEditingBlog({
      id: Date.now().toString(),
      category: 'GENERAL',
      filterCategory: 'All Topics',
      title: '',
      excerpt: '',
      lead: '',
      image: '',
      readTime: '5 min read',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: 'Admin',
      sections: [],
      relatedArticles: []
    });
  };

  const handleSaveBlogToState = () => {
    if (!editingBlog.title || !editingBlog.image) {
      Toast.fire({ icon: 'warning', title: 'Title and Cover Image are required' });
      return;
    }
    
    setFormData(prev => {
      const exists = prev.blogs.find(b => b.id === editingBlog.id);
      let newBlogs;
      if (exists) {
        newBlogs = prev.blogs.map(b => b.id === editingBlog.id ? editingBlog : b);
      } else {
        newBlogs = [...prev.blogs, editingBlog];
      }
      return { ...prev, blogs: newBlogs };
    });
    setEditingBlog(null); 
    Toast.fire({ icon: 'success', title: 'Article applied. Click Save Changes to publish.' });
  };

  const handleDeleteBlog = (blogId) => {
    if(window.confirm('Are you sure you want to delete this blog post?')) {
      setFormData(prev => ({
        ...prev,
        blogs: prev.blogs.filter(b => b.id !== blogId)
      }));
    }
  };

  const handleAddSection = () => {
    setEditingBlog(prev => ({
      ...prev,
      sections: [
        ...prev.sections, 
        { id: `sec-${Date.now()}`, title: '', content: '', isQuote: false, inlineImage: '' }
      ]
    }));
  };

  const handleUpdateSection = (idx, field, value) => {
    setEditingBlog(prev => {
      const newSections = [...prev.sections];
      newSections[idx] = { ...newSections[idx], [field]: value };
      return { ...prev, sections: newSections };
    });
  };

  const handleRemoveSection = (idx) => {
    setEditingBlog(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== idx)
    }));
  };

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) return <AdminSkeleton />;

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Blogs Page Management</h1>
          <p className="text-sm text-gray-500">Manage all sections of the blogs page from a single unified interface. Select a tab below to edit its content.</p>
        </div>
        <button
          onClick={editingBlog ? handleSaveBlogToState : handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {editingBlog ? 'Apply Changes' : 'Save All Changes'}
        </button>
      </div>

      {editingBlog ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setEditingBlog(null)}
              className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors text-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              {editingBlog.title ? editingBlog.title : 'New Article'}
            </h2>
          </div>

          <SectionForm title="Article Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Article Title</label>
                  <input
                    type="text"
                    value={editingBlog.title}
                    onChange={(e) => setEditingBlog(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-primary/50"
                    placeholder="E.g. The Future of AI in MBA"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Badge Label</label>
                    <input
                      type="text"
                      value={editingBlog.category}
                      onChange={(e) => setEditingBlog(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Filter Topic</label>
                    <select
                      value={editingBlog.filterCategory}
                      onChange={(e) => setEditingBlog(prev => ({ ...prev, filterCategory: e.target.value }))}
                      className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-primary/50"
                    >
                      <option value="All Topics">All Topics</option>
                      <option value="Career Advice">Career Advice</option>
                      <option value="Industry Trends">Industry Trends</option>
                      <option value="Skill Development">Skill Development</option>
                      <option value="Student Success">Student Success</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Read Time</label>
                    <input
                      type="text"
                      value={editingBlog.readTime}
                      onChange={(e) => setEditingBlog(prev => ({ ...prev, readTime: e.target.value }))}
                      className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Author</label>
                    <input
                      type="text"
                      value={editingBlog.author}
                      onChange={(e) => setEditingBlog(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Card Excerpt (Grid)</label>
                  <textarea
                    value={editingBlog.excerpt}
                    onChange={(e) => setEditingBlog(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none min-h-[80px]"
                    placeholder="Short description for the blog card..."
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Lead Paragraph (Details Page)</label>
                  <textarea
                    value={editingBlog.lead}
                    onChange={(e) => setEditingBlog(prev => ({ ...prev, lead: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none min-h-[100px]"
                    placeholder="Introductory paragraph on the detail page..."
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Cover Image</label>
                <div className="h-[280px] w-full">
                  <LogoUploader
                    currentImage={editingBlog.image}
                    onImageSelected={(url) => setEditingBlog(prev => ({ ...prev, image: url }))}
                  />
                </div>
              </div>
            </div>
          </SectionForm>

          <SectionForm title="Article Content Blocks (Sections)">
            <div className="space-y-6">
              {editingBlog.sections.map((sec, idx) => (
                <div key={idx} className="p-5 border border-gray-200 rounded-lg bg-gray-50 relative group">
                  <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleRemoveSection(idx)}
                      className="text-red-500 p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500">Block Title</label>
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => handleUpdateSection(idx, 'title', e.target.value)}
                        className="w-full p-2 bg-white border border-gray-200 rounded-md text-sm outline-none"
                        placeholder="Leave blank if not a header"
                      />
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sec.isQuote}
                          onChange={(e) => handleUpdateSection(idx, 'isQuote', e.target.checked)}
                          className="w-4 h-4 text-primary rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Display as Blockquote</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    <label className="text-xs font-semibold text-gray-500">Text Content</label>
                    <textarea
                      value={sec.content}
                      onChange={(e) => handleUpdateSection(idx, 'content', e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-1 w-full md:w-1/2">
                    <label className="text-xs font-semibold text-gray-500">Optional Inline Image</label>
                    <LogoUploader
                      currentImage={sec.inlineImage}
                      onImageSelected={(url) => handleUpdateSection(idx, 'inlineImage', url)}
                    />
                  </div>
                </div>
              ))}
              
              <button 
                onClick={handleAddSection}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-medium hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Content Block
              </button>
            </div>
          </SectionForm>
        </motion.div>
      ) : (
        <>
          {/* Tabs with Scroll Arrows */}
          <div className="relative flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
            <button
              type="button"
              onClick={() => scrollTabs('left')}
              className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-[#111836] transition-all shadow-sm focus:outline-none"
              title="Scroll Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div
              ref={tabsContainerRef}
              className="flex overflow-x-auto gap-2 scroll-smooth flex-1 py-1 px-1 custom-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap shrink-0 ${activeTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#111836]'
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollTabs('right')}
              className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-[#111836] transition-all shadow-sm focus:outline-none"
              title="Scroll Right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              {activeTab === 'hero' && (
                <motion.div
                  key="hero"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <SectionForm title="Hero Banner Configuration">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-500">Main Title</label>
                          <input
                            type="text"
                            value={formData.hero.title}
                            onChange={(e) => handleHeroChange('title', e.target.value)}
                            className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-primary/50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-500">Subtitle/Description</label>
                          <textarea
                            value={formData.hero.subtitle}
                            onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                            className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none min-h-[120px] focus:border-primary/50"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500">Background Image</label>
                        <div className="w-full h-[220px]">
                          <LogoUploader
                            currentImage={formData.hero.backgroundImage}
                            onImageSelected={(url) => handleHeroChange('backgroundImage', url)}
                          />
                        </div>
                      </div>
                    </div>
                  </SectionForm>
                </motion.div>
              )}

              {activeTab === 'blogs' && (
                <motion.div
                  key="blogs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <SectionForm title="Manage Articles">
                    <div className="flex justify-end mb-6">
                      <button 
                        onClick={handleAddNewBlog}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Write New Article
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {formData.blogs.map((blog, idx) => (
                        <div key={`${blog._id || blog.id || 'blog'}-${idx}`} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                          <div className="relative h-40 w-full overflow-hidden">
                            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-gray-700 tracking-wider">
                              {blog.category}
                            </div>
                          </div>
                          
                          <div className="p-4 flex flex-col flex-1">
                            <h3 className="font-bold text-gray-900 leading-tight mb-2 line-clamp-2">{blog.title}</h3>
                            <p className="text-xs text-gray-500 mb-4 flex-1 line-clamp-2">{blog.excerpt}</p>
                            
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                              <span className="text-xs font-medium text-gray-400">{blog.date}</span>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => setEditingBlog(blog)}
                                  className="p-1.5 text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteBlog(blog.id)}
                                  className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {formData.blogs.length === 0 && (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                          <Layers className="w-12 h-12 mb-3 opacity-20" />
                          <p>No articles found. Create your first post!</p>
                        </div>
                      )}
                    </div>
                  </SectionForm>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageBlogsPage;
