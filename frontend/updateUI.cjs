const fs = require('fs');
let code = fs.readFileSync('src/features/admin/cms/ManagePlacementPage.jsx', 'utf-8');

// 1. Add missing lucide-react icons
code = code.replace(/import \{ Save, Plus, Trash2, ArrowUp, ArrowDown \} from 'lucide-react';/,
  `import { Save, Plus, Trash2, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Award, FileText, Briefcase, Users, Activity } from 'lucide-react';`
);

// 2. Add tabsContainerRef
if (!code.includes('tabsContainerRef')) {
  code = code.replace(/const \[activeTab, setActiveTab\] = useState\('hero'\);/,
    `const [activeTab, setActiveTab] = useState('hero');\n  const tabsContainerRef = React.useRef(null);\n  const scrollTabs = (direction) => {\n    if (tabsContainerRef.current) {\n      const scrollAmount = direction === 'left' ? -320 : 320;\n      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });\n    }\n  };`
  );
}

// 3. Replace tabs array
const oldTabs = `  const tabs = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'overview', label: 'Overview' },
    { id: 'proudAchievers', label: 'Achievers' },
    { id: 'topRecruiters', label: 'Recruiters' },
    { id: 'excellenceSupport', label: 'Excellence' },
    { id: 'facultyInCharge', label: 'Faculty' },
    { id: 'placementCommittee', label: 'Committee' },
    { id: 'activities', label: 'Activities' },
  ];`;
const newTabs = `  const tabs = [
    { id: 'hero', name: 'Hero Section', icon: <Award className="w-4 h-4" /> },
    { id: 'overview', name: 'Overview', icon: <FileText className="w-4 h-4" /> },
    { id: 'proudAchievers', name: 'Achievers', icon: <Award className="w-4 h-4" /> },
    { id: 'topRecruiters', name: 'Recruiters', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'excellenceSupport', name: 'Excellence', icon: <Award className="w-4 h-4" /> },
    { id: 'facultyInCharge', name: 'Faculty', icon: <Users className="w-4 h-4" /> },
    { id: 'placementCommittee', name: 'Committee', icon: <Users className="w-4 h-4" /> },
    { id: 'activities', name: 'Activities', icon: <Activity className="w-4 h-4" /> },
  ];`;
code = code.replace(oldTabs, newTabs);

// 4. Replace main wrapper
const oldMainWrapper = `<div className="space-y-6">`;
const newMainWrapper = `<div className="space-y-8 pb-16">`;
code = code.replace(oldMainWrapper, newMainWrapper);

// 5. Replace Tab Bar
const oldTabBarRegex = /<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">[\s\S]*?<\/div>\s*<div className="p-6">/;
const newTabBar = `
      <div className="relative flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <button
          type="button"
          onClick={() => scrollTabs('left')}
          className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-[#111836] transition-all shadow-sm focus:outline-none"
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
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div>`;

code = code.replace(oldTabBarRegex, newTabBar);

// 6. Replace SectionForm tags
code = code.replace(/<SectionForm title="(.*?)">/g, `<div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">\n              <h2 className="text-lg font-bold text-[#111836] border-b pb-4">$1</h2>`);
code = code.replace(/<\/SectionForm>/g, `</div>`);

// 7. Replace inputs styling
code = code.replace(/rounded-lg focus:ring-primary focus:border-primary/g, 'rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-medium');
code = code.replace(/border border-gray-300 rounded-lg/g, 'border border-gray-200 rounded-xl text-sm font-medium');

// 8. Replace inner item container
code = code.replace(/p-4 bg-gray-50 rounded-lg border border-gray-200/g, 'p-6 bg-gray-50/80 rounded-2xl border border-gray-200 relative shadow-sm');
code = code.replace(/flex justify-between items-center mb-4/g, 'flex justify-between items-center mb-5 border-b pb-3');
code = code.replace(/text-gray-900/g, 'text-[#111836]');
code = code.replace(/text-gray-700/g, 'text-gray-800');

fs.writeFileSync('src/features/admin/cms/ManagePlacementPage.jsx', code);
