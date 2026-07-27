"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, FileText } from 'lucide-react';

const DownloadContent = ({ documents = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All Documents');

  const tabs = ['All Documents', 'Academic', 'Compliance', 'Administration'];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All Documents' || doc.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <section className="relative w-full bg-white pb-24 -mt-10 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation / Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 md:p-3 flex flex-col md:flex-row gap-4 items-center justify-between mx-auto mb-12 transform -translate-y-1/2 md:translate-y-0 md:-top-8 relative z-30">
          
          <div className="relative w-full md:w-auto md:min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for document names.." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-transparent border-none text-sm focus:outline-none focus:ring-0 placeholder:text-gray-400"
            />
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-100 mx-2"></div>

          <div className="flex overflow-x-auto w-full md:w-auto gap-2 pb-2 md:pb-0 custom-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-gray-500 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Documents List */}
        <div className="max-w-5xl mx-auto space-y-4 pt-8 md:pt-0">
          <AnimatePresence mode="popLayout">
            {filteredDocs.length > 0 ? (
              filteredDocs.map((doc, idx) => (
                <motion.div
                  key={doc._id || idx}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-gray-100 rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="text-gray-700 font-semibold text-lg">{doc.title}</h3>
                  </div>

                  <a 
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={doc.title}
                    className="w-full sm:w-auto px-6 py-3 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 group/btn"
                  >
                    <Download className="w-4 h-4 text-gray-400 group-hover/btn:text-primary transition-colors" />
                    Click here to download
                  </a>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">No documents found</h3>
                <p className="text-gray-500">We couldn't find any documents matching your current filters.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default DownloadContent;
