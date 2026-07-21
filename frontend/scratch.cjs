const fs = require('fs');
const filePath = 'd:/KMCT/KSBM/frontend/src/features/admin/cms/ManageAdmissionsPage.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update Tabs layout and logic
if (!content.includes('tabsContainerRef')) {
  // Add tabsContainerRef to imports and state
  content = content.replace(/import React, \{ useState, useEffect \} from 'react';/, "import React, { useState, useEffect, useRef } from 'react';");
  content = content.replace(/import \{ Save, Plus, /g, "import { ChevronLeft, ChevronRight, Save, Plus, ");
  content = content.replace(/const \[activeTab, setActiveTab\] = useState\('hero'\);/g, "const [activeTab, setActiveTab] = useState('hero');\n  const tabsContainerRef = useRef(null);\n  const scrollTabs = (direction) => { if (tabsContainerRef.current) { const scrollAmount = direction === 'left' ? -320 : 320; tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' }); } };");
}

// 2. Update the Page Container and Tabs rendering
content = content.replace(/<div className="max-w-\[1400px\] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">/, '<div className="space-y-8 pb-16">');

// 3. Update Tabs HTML
const oldTabsHTML = /\{\/\* Tabs Navigation \*\/\}\s*<div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">\s*\{tabs\.map\(\(tab\) => \(\s*<button[\s\S]*?<\/button>\s*\)\)\}\s*<\/div>/;

const newTabsHTML = `{/* Tabs with Scroll Arrows */}
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
              className={\`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap shrink-0 \${activeTab === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#111836]'
                }\`}
            >
              {tab.icon}
              <span>{tab.name}</span>
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
      </div>`;
content = content.replace(oldTabsHTML, newTabsHTML);

// 4. Update tab content wrappers
content = content.replace(/<div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">/g, '<div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(43,47,102,0.06)] border border-gray-100">');
content = content.replace(/<div className="space-y-6">/g, '<div className="space-y-8 max-w-4xl">');
content = content.replace(/<div className="space-y-8 max-w-4xl">\s*<h2 className="text-lg font-bold text-gray-900 border-b pb-4">/g, '<div className="space-y-8 max-w-4xl">\n            <h2 className="text-xl font-bold text-[#111836] border-b border-gray-100 pb-4">');
content = content.replace(/<h2 className="text-lg font-bold text-gray-900 border-b pb-4">/g, '<h2 className="text-xl font-bold text-[#111836] border-b border-gray-100 pb-4">');

// 5. Update Labels
content = content.replace(/className="block text-xs font-bold uppercase text-gray-500 mb-2"/g, 'className="block text-sm font-semibold text-gray-700 mb-2"');
content = content.replace(/className="text-xs font-bold uppercase text-gray-500 mb-2 block"/g, 'className="block text-sm font-semibold text-gray-700 mb-2"');

// 6. Update Inputs and Textareas
content = content.replace(/className="w-full px-4 py-2\.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-\[#1b2559\]"/g, 'className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"');

// 7. Change buttons from #1b2559 to primary
content = content.replace(/bg-\[#1b2559\]/g, 'bg-primary');
content = content.replace(/text-\[#1b2559\]/g, 'text-primary');

// Additional UI fixes for Delete buttons (make them less aggressive)
content = content.replace(/className="text-red-500 hover:text-red-700 p-2"/g, 'className="text-red-500 hover:text-red-700 p-3 hover:bg-red-50 rounded-xl transition-colors"');
content = content.replace(/className="text-red-500 hover:bg-red-50 p-2 rounded-xl"/g, 'className="text-red-500 hover:text-red-700 p-3 hover:bg-red-50 rounded-xl transition-colors"');


fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated ManageAdmissionsPage.jsx design patterns to match ManageMbaPage.jsx.');
