"use client";
import React, { useState, useEffect } from 'react';
import { Save, Eye, Plus, Trash2, ArrowUp, ArrowDown, FileText, Calendar, Bell, Award, BookOpen } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../../api/axios';
import Loader from '../../../components/Loader';
import confirmAction from '../../../utils/confirmAction';
import LogoUploader from './components/LogoUploader';
import PageHeader from './components/PageHeader';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});

const ManageExaminationsPage = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [heroBadgeText, setHeroBadgeText] = useState('Examinations 2026');
  const [heroTitle, setHeroTitle] = useState('Stay Informed. Stay Prepared. Excel in Every Examination.');
  const [heroSubtitle, setHeroSubtitle] = useState('Access examination schedules, important notifications, and semester results in one place. Stay updated with key dates and academic announcements to ensure a smooth and well-organized examination experience throughout your MBA journey.');
  const [heroImage, setHeroImage] = useState('/assets/Images/image 73.png');

  const [overviewTitle, setOverviewTitle] = useState('Examination Overview');
  const [overviewText1, setOverviewText1] = useState('Our examination system is designed to evaluate students through a comprehensive and transparent assessment process that reflects both academic knowledge and practical application. A balanced combination of internal assessments, assignments, presentations, case studies, projects, and end-semester examinations ensures continuous learning and holistic development throughout the program.');
  const [overviewText2, setOverviewText2] = useState('The examination process follows the academic calendar and is conducted with fairness, consistency, and integrity. Students are encouraged to demonstrate analytical thinking, problem-solving abilities, and managerial competencies through various evaluation methods. Timely notifications, published examination schedules, and prompt result declarations help students stay informed and well-prepared.');
  const [overviewImage, setOverviewImage] = useState('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop');

  const [calendarTitle, setCalendarTitle] = useState('Download the Official Exam Calendar');
  const [calendarText, setCalendarText] = useState('Stay informed with the official Exam Calendar. Access semester schedules, examination dates, academic milestones, holidays, project timelines, and important university events—all in one place.');
  const [calendarViewBtnText, setCalendarViewBtnText] = useState('View Calendar');
  const [calendarViewBtnUrl, setCalendarViewBtnUrl] = useState('/assets/Images/image 64.png');
  const [calendarDownloadBtnText, setCalendarDownloadBtnText] = useState('Download Calendar');
  const [calendarDownloadBtnUrl, setCalendarDownloadBtnUrl] = useState('/assets/Images/image 64.png');
  const [calendarImage, setCalendarImage] = useState('/assets/Images/image 64.png');

  const [notifications, setNotifications] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/cms/examinations-page');
      const data = res?.data || {};

      if (data.heroBadgeText) setHeroBadgeText(data.heroBadgeText);
      if (data.heroTitle) setHeroTitle(data.heroTitle);
      if (data.heroSubtitle) setHeroSubtitle(data.heroSubtitle);
      if (data.heroImage) setHeroImage(data.heroImage);

      if (data.overviewTitle) setOverviewTitle(data.overviewTitle);
      if (data.overviewText1) setOverviewText1(data.overviewText1);
      if (data.overviewText2) setOverviewText2(data.overviewText2);
      if (data.overviewImage) setOverviewImage(data.overviewImage);

      if (data.calendarTitle) setCalendarTitle(data.calendarTitle);
      if (data.calendarText) setCalendarText(data.calendarText);
      if (data.calendarViewBtnText) setCalendarViewBtnText(data.calendarViewBtnText);
      if (data.calendarViewBtnUrl) setCalendarViewBtnUrl(data.calendarViewBtnUrl);
      if (data.calendarDownloadBtnText) setCalendarDownloadBtnText(data.calendarDownloadBtnText);
      if (data.calendarDownloadBtnUrl) setCalendarDownloadBtnUrl(data.calendarDownloadBtnUrl);
      if (data.calendarImage) setCalendarImage(data.calendarImage);

      if (data.notifications && Array.isArray(data.notifications)) setNotifications(data.notifications);
      if (data.results && Array.isArray(data.results)) setResults(data.results);
    } catch (err) {
      console.error('Error fetching examinations settings:', err);
      Toast.fire({ icon: 'error', title: 'Failed to load examinations page settings.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    await confirmAction({
      title: 'Save Changes?',
      message: 'Are you sure you want to save these changes to the Examinations page?',
      confirmText: 'Yes, save changes!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          const payload = {
            heroBadgeText, heroTitle, heroSubtitle, heroImage,
            overviewTitle, overviewText1, overviewText2, overviewImage,
            calendarTitle, calendarText, calendarViewBtnText, calendarViewBtnUrl, calendarDownloadBtnText, calendarDownloadBtnUrl, calendarImage,
            notifications, results
          };
          await api.put('/cms/examinations-page', payload);
          Toast.fire({ icon: 'success', title: 'Examinations page settings saved successfully!' });
        } catch (err) {
          console.error('Error saving examinations settings:', err);
          Toast.fire({ icon: 'error', title: 'Failed to save settings.' });
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  // Notification CRUD helpers
  const addNotification = () => {
    setNotifications([
      ...notifications,
      {
        label: 'EXAMINATION ANNOUNCEMENT',
        title: 'New Examination Announcement Title',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        pdfUrl: '#'
      }
    ]);
  };

  const updateNotification = (index, field, value) => {
    const updated = [...notifications];
    updated[index][field] = value;
    setNotifications(updated);
  };

  const deleteNotification = (index) => {
    setNotifications(notifications.filter((_, idx) => idx !== index));
  };

  const moveNotification = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === notifications.length - 1) return;
    const updated = [...notifications];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[targetIdx]] = [updated[targetIdx], updated[index]];
    setNotifications(updated);
  };

  // Results CRUD helpers
  const addResult = () => {
    setResults([
      ...results,
      {
        slNo: String(results.length + 1).padStart(2, '0'),
        dateDuration: 'NOV ' + (10 + results.length),
        courseName: 'CS502: Advanced Algorithms',
        semesterInfo: 'VIII Sem MBA 2026',
        pdfUrl: '#'
      }
    ]);
  };

  const updateResult = (index, field, value) => {
    const updated = [...results];
    updated[index][field] = value;
    setResults(updated);
  };

  const deleteResult = (index) => {
    setResults(results.filter((_, idx) => idx !== index));
  };

  const moveResult = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === results.length - 1) return;
    const updated = [...results];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[targetIdx]] = [updated[targetIdx], updated[index]];
    setResults(updated);
  };

  const tabs = [
    { id: 'hero', name: 'Hero Banner', icon: <Award className="w-4 h-4" /> },
    { id: 'overview', name: 'Overview Section', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'calendar', name: 'Exam Calendar Banner', icon: <Calendar className="w-4 h-4" /> },
    { id: 'notifications', name: 'Notifications & Announcements', icon: <Bell className="w-4 h-4" /> },
    { id: 'results', name: 'Semester Results List', icon: <FileText className="w-4 h-4" /> },
  ];

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <PageHeader
        title="Examinations Page Management"
        description="Manage hero banner, overview, official calendar links, notification announcements, and semester results."
        onPreview={() => window.open('/examinations', '_blank')}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#1b2559] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
        {/* Tab 1: Hero */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Hero Banner Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Badge Text</label>
                <input
                  type="text"
                  value={heroBadgeText}
                  onChange={(e) => setHeroBadgeText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#1b2559]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Hero Title</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#1b2559]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Subtitle / Description</label>
                <textarea
                  rows="3"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#1b2559]"
                />
              </div>
              <div className="md:col-span-2">
                <LogoUploader
                  label="Hero Background Image"
                  value={heroImage}
                  onChange={(url) => setHeroImage(url)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Examination Overview Section</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Section Title</label>
                <input
                  type="text"
                  value={overviewTitle}
                  onChange={(e) => setOverviewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#1b2559]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Paragraph 1 Text</label>
                <textarea
                  rows="4"
                  value={overviewText1}
                  onChange={(e) => setOverviewText1(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#1b2559]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Paragraph 2 Text</label>
                <textarea
                  rows="4"
                  value={overviewText2}
                  onChange={(e) => setOverviewText2(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#1b2559]"
                />
              </div>
              <div>
                <LogoUploader
                  label="Right Side Lecture Hall Image"
                  value={overviewImage}
                  onChange={(url) => setOverviewImage(url)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Calendar Banner */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Official Exam Calendar Banner Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Banner Title</label>
                <input
                  type="text"
                  value={calendarTitle}
                  onChange={(e) => setCalendarTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#1b2559]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Banner Description</label>
                <textarea
                  rows="3"
                  value={calendarText}
                  onChange={(e) => setCalendarText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#1b2559]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">View Button Label</label>
                <input
                  type="text"
                  value={calendarViewBtnText}
                  onChange={(e) => setCalendarViewBtnText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#1b2559]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">View Button URL / PDF Link</label>
                <input
                  type="text"
                  value={calendarViewBtnUrl}
                  onChange={(e) => setCalendarViewBtnUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#1b2559]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Download Button Label</label>
                <input
                  type="text"
                  value={calendarDownloadBtnText}
                  onChange={(e) => setCalendarDownloadBtnText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#1b2559]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Download Button URL / PDF Link</label>
                <input
                  type="text"
                  value={calendarDownloadBtnUrl}
                  onChange={(e) => setCalendarDownloadBtnUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#1b2559]"
                />
              </div>
              <div className="md:col-span-2">
                <LogoUploader
                  label="Right Side Calendar Illustration"
                  value={calendarImage}
                  onChange={(url) => setCalendarImage(url)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Notifications & Announcements List</h2>
                <p className="text-xs text-gray-500 mt-1">Manage exam announcements shown with download buttons.</p>
              </div>
              <button
                onClick={addNotification}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Notification</span>
              </button>
            </div>

            <div className="space-y-4">
              {notifications.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-2xs">
                      Announcement #{idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveNotification(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveNotification(idx, 'down')}
                        disabled={idx === notifications.length - 1}
                        className="p-1.5 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteNotification(idx)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-600 bg-white hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Top Label Tag</label>
                      <input
                        type="text"
                        value={item.label || ''}
                        onChange={(e) => updateNotification(idx, 'label', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Date</label>
                      <input
                        type="text"
                        value={item.date || ''}
                        onChange={(e) => updateNotification(idx, 'date', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">PDF File URL</label>
                      <input
                        type="text"
                        value={item.pdfUrl || ''}
                        onChange={(e) => updateNotification(idx, 'pdfUrl', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Announcement Title</label>
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => updateNotification(idx, 'title', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Results */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Semester Results List</h2>
                <p className="text-xs text-gray-500 mt-1">Manage exam results table entries and PDF view links.</p>
              </div>
              <button
                onClick={addResult}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Result Entry</span>
              </button>
            </div>

            <div className="space-y-4">
              {results.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-2xs">
                      Row Entry #{idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveResult(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveResult(idx, 'down')}
                        disabled={idx === results.length - 1}
                        className="p-1.5 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteResult(idx)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-600 bg-white hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">SL NO</label>
                      <input
                        type="text"
                        value={item.slNo || ''}
                        onChange={(e) => updateResult(idx, 'slNo', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Date & Duration</label>
                      <input
                        type="text"
                        value={item.dateDuration || ''}
                        onChange={(e) => updateResult(idx, 'dateDuration', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Semester / Year Info</label>
                      <input
                        type="text"
                        value={item.semesterInfo || ''}
                        onChange={(e) => updateResult(idx, 'semesterInfo', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">PDF File URL</label>
                      <input
                        type="text"
                        value={item.pdfUrl || ''}
                        onChange={(e) => updateResult(idx, 'pdfUrl', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Program / Course Name</label>
                      <input
                        type="text"
                        value={item.courseName || ''}
                        onChange={(e) => updateResult(idx, 'courseName', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageExaminationsPage;
