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
            <span className="text-gray-400 text-xs sm:text-sm font-semibold tracking-wide pl-3">
              {article.date} &nbsp;&bull;&nbsp; {article.readTime}
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2">

              <span className="bg-primary text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-sm">
                {article.category}
              </span>

            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight tracking-tight">
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
              className="w-full h-[300px] sm:h-[400px] lg:h-[450px] rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(32,38,88,0.15)]"
            >
              <img src={article.image} alt={article.title} className="w-full h-full object-cover object-center" />
            </motion.div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-gray-100 mb-12">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Share this insight</span>
            <div className="flex gap-2">
              <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-blue-50 hover:text-blue-500 transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
              </button>
              <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg>
              </button>
              <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path></svg>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {article.readTime}
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
                  <div className="bg-primary/5 border-l-[6px] border-primary rounded-r-2xl p-8 sm:p-10 my-10 relative shadow-sm">
                    <span className="absolute top-4 left-6 text-6xl text-primary/20 font-serif leading-none">"</span>
                    <p className="text-xl sm:text-2xl text-[#202658] font-semibold italic relative z-10 leading-snug">
                      {section.content}
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 tracking-tight text-[#111827]">{section.title}</h2>
                    <p className="text-[15px] sm:text-[17px]">{section.content}</p>
                    {section.inlineImage && (
                      <figure className="my-10 shadow-lg rounded-2xl overflow-hidden border border-gray-100">
                        <img src={section.inlineImage} alt={section.title} className="w-full h-auto object-cover max-h-[400px]" />
                      </figure>
                    )}
                  </>
                )}
              </div>
            ))}
            </article>

            {/* Post Article Content: Author Bio & Navigation */}
            <div className="mt-12 pt-12 border-t border-gray-100">
            {/* Author Bio Box */}
            <div className="bg-gray-50/50 rounded-[20px] p-6 sm:p-8 flex items-center gap-6 mb-12 shadow-sm border border-gray-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  {article.author ? article.author.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Written By</h4>
                <p className="text-xl font-bold text-[#111827]">{article.author || 'Admin'}</p>
              </div>
            </div>

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

              {article.nextArticle ? (
                <Link href={`/blogs/${article.nextArticle._id || article.nextArticle.id}`} className="group flex flex-col p-6 rounded-2xl border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all text-right">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-end gap-2">
                    Next Article
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </span>
                  <h4 className="text-lg font-bold text-[#111827] leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {article.nextArticle.title}
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
                  {article.relatedArticles.map((rel) => (
                    <Link href={`/blogs/${rel.id}`} key={rel.id} className="flex items-center gap-4 group cursor-pointer">
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
