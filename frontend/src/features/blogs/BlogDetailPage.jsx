"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BlogHero from './components/BlogHero';
import Link from 'next/link';
import api from '../../api/axios';
import { Loader2 } from 'lucide-react';

const BlogDetailPage = ({ id }) => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [article, setArticle] = useState(null);
  const [pageHero, setPageHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await api.get('/cms/blogs-page');
        setPageHero(data?.hero || null);
        const allBlogs = data?.blogs || [];
        const foundArticle = allBlogs.find(b => b.id === id || b._id === id);
        if (foundArticle) {
          // Populate related articles for the sidebar dynamically
          const related = allBlogs.filter(b => b.id !== id && b._id !== id).slice(0, 3);

          const currentIndex = allBlogs.findIndex(b => b.id === id || b._id === id);
          const prevArticle = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
          const nextArticle = currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;

          setArticle({ ...foundArticle, relatedArticles: related, prevArticle, nextArticle });
          if (foundArticle.sections?.length > 0) {
            setActiveSection(foundArticle.sections[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching blog article:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  // Sticky scroll spy logic for Table of Contents
  useEffect(() => {
    const handleScroll = () => {
      if (!article?.sections) return;
      const sections = article.sections.filter(s => s.title);
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && window.scrollY >= el.offsetTop - 150) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex justify-center items-center flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Article Not Found</h2>
          <Link href="/blogs" className="text-primary hover:underline">Return to Blogs</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-pink-500 selection:text-white">
      <Header />

      {/* Reusing existing Hero layout with dynamic title and full screen size */}
      <BlogHero
        fullScreen={true}
        heroData={pageHero || {
          title: 'Insights & Blogs',
          subtitle: 'Explore expert articles, student success stories, industry trends, and academic insights to stay informed and inspired.',
          backgroundImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600&auto=format&fit=crop'
        }}
      />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

        {/* Article Header Row */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center mb-16">
          <div className="flex-1 space-y-6 order-2 lg:order-1">
            <div className="flex items-center gap-4">

              <span className="text-text-secondary text-[10px] font-semibold tracking-wide">
                {article.date ? (() => {
                  const d = new Date(article.date);
                  return isNaN(d.getTime()) ? article.date : `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
                })() : ''}
              </span>
              <div className="w-[80%] h-[1px] bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <span className="bg-primary text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-2 py-1.5 shadow-sm">
                {article.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary leading-tight tracking-tight">
              {article.title}
            </h1>

            <p className="text-[18px] text-text-secondary leading-relaxed max-w-2xl">
              {article.lead}
            </p>
          </div>

          <div className="flex-1 w-full order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full h-[250px] sm:h-[350px] lg:h-[400px] rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(32,38,88,0.15)]"
            >
              <img src={article.image} alt={article.title} className="w-full h-full object-cover object-center" />
            </motion.div>
          </div>
        </div>

        {/* Two-Column Grid: Content Left, Sidebar Right */}
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 relative">

          <div className="flex-[2] min-w-0">
            {/* Main Article Body */}
            <article className="prose prose-lg prose-gray max-w-none prose-headings:text-[#202658] prose-p:text-gray-600 prose-p:leading-[1.85] prose-img:rounded-2xl">
              {article.sections.map((section, idx) => (
                <div key={idx} id={section.id} className="scroll-mt-32 mb-12">
                  {section.isQuote ? (
                    <div className="bg-primary/5 border-l-[4px] sm:border-l-[6px] border-primary rounded-r-2xl p-6 sm:p-8 my-8 relative shadow-sm">
                      <span className="absolute top-3 left-4 sm:top-4 sm:left-5 text-5xl sm:text-6xl text-primary/20 font-serif leading-none">"</span>
                      <p className="text-lg sm:text-xl text-text-primary font-medium italic relative z-10 leading-snug">
                        {section.content}
                      </p>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl sm:text-2xl font-bold mb-6 tracking-tight text-text-primary">{section.title}</h2>
                      <p className="text-[15px] text-text-secondary sm:text-[17px] whitespace-pre-wrap">{section.content}</p>
                      {section.inlineImage && (
                        <figure className="my-10 shadow-md rounded-2xl overflow-hidden border border-gray-100 w-[90%] sm:w-3/4 md:w-2/3 mx-auto">
                          <img src={section.inlineImage} alt={section.title} className="w-full h-auto object-cover max-h-[300px]" />
                        </figure>
                      )}
                    </>
                  )}
                </div>
              ))}
            </article>

            {/* Post Article Content: Author Bio & Navigation */}
            <div className="mt-12 pt-12 border-t border-gray-100">

              {/* Next / Previous Article Navigation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {article.prevArticle ? (
                  <Link href={`/blogs/${article.prevArticle._id || article.prevArticle.id}`} className="group flex flex-col p-6 rounded-2xl border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                      Previous Article
                    </span>
                    <h4 className="text-lg font-bold text-[#111827] leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {article.prevArticle.title}
                    </h4>
                  </Link>
                ) : <div></div>}
              </div>
            </div>
          </div>

          {/* Sticky Right Sidebar */}
          <aside className="flex-1 lg:max-w-[380px]">
            <div className="sticky top-28 space-y-12">

              {/* Table of Contents */}
              <div className="bg-gray-50/50 p-6 sm:p-8 rounded-[20px] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                  <h4 className="text-lg font-bold text-text-primary">Table of Contents</h4>
                </div>
                <ul className="space-y-4">
                  {article.sections.filter(s => s.title).map((section, i) => (
                    <li key={section.id}>
                      <button
                        onClick={() => {
                          document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className={`text-[14.5px] font-medium transition-all text-left w-full hover:text-primary flex gap-3 ${activeSection === section.id ? 'text-primary translate-x-1' : 'text-gray-500'}`}
                      >
                        <span className={`font-semibold ${activeSection === section.id ? 'text-pink-500' : 'text-gray-400'}`}>{i + 1}.</span>
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related Articles */}
              <div className="bg-white p-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-[#C837AB] rounded-full"></div>
                  <h4 className="text-lg font-bold text-text-primary">Related Articles</h4>
                </div>
                <div className="flex flex-col gap-6">
                  {article.relatedArticles.map((rel, idx) => (
                    <Link href={`/blogs/${rel._id || rel.id}`} key={rel._id || rel.id || `rel-${idx}`} className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-[85px] h-[75px] rounded-xl overflow-hidden shrink-0 shadow-sm">
                        <img src={rel.image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-[14px] font-semibold text-[#111827] leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
                          {rel.title}
                        </h5>
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">{rel.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </aside>
        </div>
      </main>

      {/* Bottom CTA Banner (Begin Your Leadership Journey) */}
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-[#2B3175] rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_20px_40px_rgba(43,49,117,0.2)] border border-white/10 relative overflow-hidden">
          {/* Decorative Glow inside CTA */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="flex-1 z-10 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
              Begin Your Leadership Journey at KSBM
            </h2>
            <p className="text-white/80 text-sm sm:text-base font-medium max-w-xl mx-auto md:mx-0">
              Applications for the academic year 2025-26 are now open. Secure your seat in the college of institution.
            </p>
          </div>
          <div className="shrink-0 z-10">
            <Link
              href="/admission"
              className="inline-block bg-white text-primary font-bold text-sm sm:text-base px-8 sm:px-12 py-4 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300"
            >
              Apply Now Online
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetailPage;
