"use client";
import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Loader2, Plus, Trash2, ArrowUp, ArrowDown, UserPlus } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import Loader from '../../../components/Loader';
import SingleImageUploader from './components/SingleImageUploader';
import confirmAction from '../../../utils/confirmAction';
import PageHeader from './components/PageHeader';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const defaultLeaders = [
  {
    id: '1',
    subheading: 'OUR VISIONARY LEADER DR. NAVAS K.M',
    heading: 'Leadership Vision',
    name: 'Dr. Navas K M',
    title: 'MANAGING TRUSTEE - KMCT',
    description: [
      `"The evolution of business continually shapes the experiences that define tomorrow's management culture. When understanding path in leadership starts to merge, a true perspective of real theoretical knowledge – they reveal the defining nature of KSBM."`,
      `We believe that robust leaders are forged by instilling a commitment to personal excellence and inspiring organizational cultures. Our primary mandate is to groom talent that is ethically grounded, and as KSBM, this is our overarching commitment to shaping a transformative future.`,
      `As KSBM accelerates towards already accelerating milestones, it is crucial to recognize that true leadership transcends beyond mere numbers; it is about human connections and impact, a mandate that echoes through our legacy. We are proud of what KSBM is accomplishing and its role in creating a future built on ethical, responsible, and visionary leadership."`
    ],
    image: '/assets/Images/Group 164.png',
    signatureImage: '/assets/Images/image 32.png'
  },
  {
    id: '2',
    subheading: 'MEET OUR LEADER',
    name: 'Dr. James Starlin',
    title: 'PRINCIPAL',
    description: [
      `"The world of business demands a new caliber of professionals, one that navigates complexities with a balanced mindset and strong ethical compass. It is through comprehensive education and strategic insight that these future leaders are shaped, making KSBM a catalyst in creating capable minds."`,
      `We continually strive to cultivate an environment where rigorous academics meet real-world strategy, ensuring our graduates are not just business operators, but management leaders. Our curriculum reflects KSBM's dedication to robust, responsible, and forward-looking education.`,
      `KSBM focuses on instilling a culture of continuous learning and critical thinking. By nurturing entrepreneurship and values-driven leadership, we ensure that every individual leaving our doors is equipped not just to succeed, but to make a lasting impact. We empower our students to shape successful careers and turn ambitious goals into reality."`
    ],
    image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80',
    signatureImage: ''
  }
];

const ManageLeadership = () => {
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/leadership');
      if (data && data.leaders && data.leaders.length > 0) {
        setLeaders(data.leaders);
      } else if (data) {
        // Construct leaders from legacy fields if leaders array not present
        setLeaders([
          {
            id: '1',
            subheading: data.subheading || 'OUR VISIONARY LEADER DR. NAVAS K.M',
            heading: data.heading || 'Leadership Vision',
            name: data.name || 'Dr. Navas K M',
            title: data.title || 'MANAGING TRUSTEE - KMCT',
            description: data.description && data.description.length > 0 ? data.description : defaultLeaders[0].description,
            image: data.image || '/assets/Images/Group 164.png',
            signatureImage: data.signatureImage || '/assets/Images/image 32.png'
          },
          {
            id: '2',
            subheading: 'MEET OUR LEADER',
            name: data.leader2Name || 'Dr. James Starlin',
            title: data.leader2Title || 'PRINCIPAL',
            description: data.leader2Description && data.leader2Description.length > 0 ? data.leader2Description : defaultLeaders[1].description,
            image: data.leader2Image || 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80',
            signatureImage: ''
          }
        ]);
      } else {
        setLeaders(defaultLeaders);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load settings.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    await confirmAction({
      title: 'Save Changes?',
      message: 'Are you sure you want to save these leadership profiles to the website?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          await api.put('/cms/leadership', {
            leaders,
            heading: leaders[0]?.heading || 'Visionary Leadership for a Better Tomorrow',
            subheading: leaders[0]?.subheading,
            name: leaders[0]?.name,
            title: leaders[0]?.title,
            description: leaders[0]?.description,
            image: leaders[0]?.image,
            signatureImage: leaders[0]?.signatureImage,
            leader2Name: leaders[1]?.name,
            leader2Title: leaders[1]?.title,
            leader2Description: leaders[1]?.description,
            leader2Image: leaders[1]?.image
          }, { hideLoader: true });
          Toast.fire({ icon: 'success', title: 'Leadership settings saved successfully!' });
        } catch (error) {
          console.error('Error saving settings:', error);
          Toast.fire({ icon: 'error', title: 'Failed to save leadership settings.' });
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const handleResetToDefault = async () => {
    await confirmAction({
      title: 'Reset to Defaults?',
      message: 'This will reset the leadership list to original defaults. Click "Save Changes" afterwards to apply.',
      confirmText: 'Yes, reset it!',
      variant: 'primary',
      action: async () => {
        setLeaders(defaultLeaders);
        Toast.fire({ icon: 'info', title: 'Reset to default. Click Save Changes to apply.' });
      }
    });
  };

  const handleAddLeader = () => {
    const newLeader = {
      id: Date.now().toString(),
      subheading: 'MEET OUR LEADER',
      heading: '',
      name: 'New Leader Name',
      title: 'LEADER DESIGNATION',
      description: ['Add message or description here...'],
      image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80',
      signatureImage: ''
    };
    setLeaders([...leaders, newLeader]);
    Toast.fire({ icon: 'success', title: 'New leader added! Scroll down to edit.' });
  };

  const handleRemoveLeader = (index) => {
    if (leaders.length <= 1) {
      Toast.fire({ icon: 'warning', title: 'You must keep at least one leader profile.' });
      return;
    }
    const leaderName = leaders[index]?.name || 'Leader';
    setLeaders((prevLeaders) => prevLeaders.filter((_, i) => i !== index));
    Toast.fire({ icon: 'success', title: `${leaderName} removed! Click "Save Changes" at the top right to apply.` });
  };

  const handleMoveLeader = (index, direction) => {
    const newLeaders = [...leaders];
    if (direction === 'up' && index > 0) {
      [newLeaders[index - 1], newLeaders[index]] = [newLeaders[index], newLeaders[index - 1]];
    } else if (direction === 'down' && index < newLeaders.length - 1) {
      [newLeaders[index + 1], newLeaders[index]] = [newLeaders[index], newLeaders[index + 1]];
    }
    setLeaders(newLeaders);
  };

  const updateLeaderField = (index, field, value) => {
    const newLeaders = [...leaders];
    newLeaders[index] = { ...newLeaders[index], [field]: value };
    setLeaders(newLeaders);
  };

  const addLeaderPara = (leaderIdx) => {
    const newLeaders = [...leaders];
    const currentDesc = Array.isArray(newLeaders[leaderIdx].description) ? newLeaders[leaderIdx].description : [newLeaders[leaderIdx].description || ''];
    newLeaders[leaderIdx].description = [...currentDesc, ''];
    setLeaders(newLeaders);
  };

  const updateLeaderPara = (leaderIdx, paraIdx, value) => {
    const newLeaders = [...leaders];
    const currentDesc = Array.isArray(newLeaders[leaderIdx].description) ? [...newLeaders[leaderIdx].description] : [newLeaders[leaderIdx].description || ''];
    currentDesc[paraIdx] = value;
    newLeaders[leaderIdx].description = currentDesc;
    setLeaders(newLeaders);
  };

  const removeLeaderPara = (leaderIdx, paraIdx) => {
    const newLeaders = [...leaders];
    const currentDesc = Array.isArray(newLeaders[leaderIdx].description) ? [...newLeaders[leaderIdx].description] : [newLeaders[leaderIdx].description || ''];
    newLeaders[leaderIdx].description = currentDesc.filter((_, i) => i !== paraIdx);
    setLeaders(newLeaders);
  };

  if (isLoading) return <Loader theme="light" text="Loading Leadership Profiles..." />;

  return (
    <div className="space-y-6 w-full pb-16">
      <PageHeader
        title="About Us - Leadership Section"
        description="Add and manage leaders. They automatically display on the About Us page in an alternating left/right layout."
        onPreview={() => window.open('/about', '_blank')}
        onReset={handleResetToDefault}
        onSave={handleSave}
        isSaving={isSaving || isUploading}
      />

      <div className="flex justify-between items-center w-full mt-4">
        <h2 className="text-xl font-bold text-[#566A7F] font-heading">Leadership Profiles</h2>
        <button
          onClick={handleAddLeader}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-[#1e2358] transition-colors shadow-sm cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Add Person
        </button>
      </div>

      {/* Leaders List */}
      <div className="space-y-8 w-full">
        {leaders.map((leader, index) => {
          const isEven = index % 2 === 0;
          const layoutBadgeText = isEven ? "Alternative Layout: Image Left, Content Right" : "Alternative Layout: Content Left, Image Right";

          return (
            <div
              key={leader.id || index}
              className="bg-white rounded-xl shadow-[0_2px_6px_0_rgba(67,89,113,0.12)] border border-gray-100 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-[#f8f9fc] px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    #{index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-[#566A7F] text-base">
                      {leader.name || 'Untitled Leader'}
                    </h3>
                    <span className="text-xs font-semibold text-primary/80 bg-primary/10 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                      {layoutBadgeText}
                    </span>
                  </div>
                </div>

                {/* Move & Delete Controls */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleMoveLeader(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveLeader(index, 'down')}
                    disabled={index === leaders.length - 1}
                    className="p-1.5 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveLeader(index)}
                    className="p-1.5 rounded bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors ml-2"
                    title="Remove Person"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Images */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-[#566A7F] uppercase tracking-wider border-b pb-2">
                      Images
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-3">
                        Person Image / Photo
                      </label>
                      <SingleImageUploader
                        imageUrl={leader.image}
                        onUploadComplete={(url) => updateLeaderField(index, 'image', url)}
                        onUploadStateChange={setIsUploading}
                        label="Upload Photo"
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-3">
                        Signature Image (Optional)
                      </label>
                      <SingleImageUploader
                        imageUrl={leader.signatureImage}
                        onUploadComplete={(url) => updateLeaderField(index, 'signatureImage', url)}
                        onUploadStateChange={setIsUploading}
                        label="Upload Signature"
                      />
                    </div>
                  </div>

                  {/* Right Column: Titles and Description */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-[#566A7F] uppercase tracking-wider border-b pb-2">
                      Profile Details
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        value={leader.name || ''}
                        onChange={(e) => updateLeaderField(index, 'name', e.target.value)}
                        placeholder="e.g. Dr. Navas K.M"
                        className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">
                        Title / Designation
                      </label>
                      <input
                        type="text"
                        value={leader.title || ''}
                        onChange={(e) => updateLeaderField(index, 'title', e.target.value)}
                        placeholder="e.g. MANAGING TRUSTEE - KMCT"
                        className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">
                        Subheading Tag (Small Top Text)
                      </label>
                      <input
                        type="text"
                        value={leader.subheading || ''}
                        onChange={(e) => updateLeaderField(index, 'subheading', e.target.value)}
                        placeholder="e.g. MEET OUR LEADER"
                        className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    {index === 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide mb-1.5">
                          Main Heading (Optional)
                        </label>
                        <input
                          type="text"
                          value={leader.heading || ''}
                          onChange={(e) => updateLeaderField(index, 'heading', e.target.value)}
                          placeholder="e.g. Leadership Vision"
                          className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    )}

                    {/* Paragraphs */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-semibold text-[#566A7F] uppercase tracking-wide">
                          Message / Paragraphs
                        </label>
                        <button
                          type="button"
                          onClick={() => addLeaderPara(index)}
                          className="text-primary hover:bg-primary/10 p-1.5 rounded font-semibold text-xs flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Paragraph
                        </button>
                      </div>
                      <div className="space-y-3">
                        {(Array.isArray(leader.description) ? leader.description : [leader.description || '']).map((para, paraIndex) => (
                          <div key={paraIndex} className="flex gap-2 items-start">
                            <textarea
                              value={para || ''}
                              onChange={(e) => updateLeaderPara(index, paraIndex, e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 bg-white border border-[#D9DEE3] rounded-md text-[#566A7F] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                            <button
                              type="button"
                              onClick={() => removeLeaderPara(index, paraIndex)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-md mt-0.5"
                              title="Remove Paragraph"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageLeadership;
