"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, Loader2, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import Loader from '../../../components/Loader';
import SingleImageUploader from './components/SingleImageUploader';
import confirmAction from '../../../utils/confirmAction';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});

const ManageClubDetails = () => {
  const { clubId } = useParams();
  const router = useRouter();
  
  const [facilitiesData, setFacilitiesData] = useState(null);
  const [clubIndex, setClubIndex] = useState(-1);
  const [club, setClub] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    fetchSettings();
  }, [clubId]);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/cms/facilities-page');
      if (data && data.clubs && data.clubs.items) {
        setFacilitiesData(data);
        const index = data.clubs.items.findIndex(item => item._id === clubId);
        if (index !== -1) {
          setClubIndex(index);
          // Initialize empty nested objects if they don't exist yet
          const foundClub = data.clubs.items[index];
          setClub({
            ...foundClub,
            hero: foundClub.hero || { title: '', subtitle: '', backgroundImage: '' },
            about: {
              heading: foundClub.about?.heading || '',
              paragraphs: foundClub.about?.paragraphs || [],
              image: foundClub.about?.image || ''
            },
            activities: {
              heading: foundClub.activities?.heading || '',
              items: foundClub.activities?.items || []
            },
            faculty: {
              heading: foundClub.faculty?.heading || '',
              subheading: foundClub.faculty?.subheading || '',
              description: foundClub.faculty?.description || '',
              members: foundClub.faculty?.members || []
            },
            gallery: {
              heading: foundClub.gallery?.heading || '',
              images: foundClub.gallery?.images || []
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      Toast.fire({ icon: 'error', title: 'Failed to load club details.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!facilitiesData || clubIndex === -1 || !club) return;

    await confirmAction({
      title: 'Save Changes?',
      message: 'Are you sure you want to save the club page details?',
      confirmText: 'Yes, save it!',
      variant: 'primary',
      action: async () => {
        setIsSaving(true);
        try {
          // Update the specific club in the facilities data
          const updatedClubsItems = [...facilitiesData.clubs.items];
          updatedClubsItems[clubIndex] = club;
          
          const updatedClubsData = {
            ...facilitiesData.clubs,
            items: updatedClubsItems
          };

          await api.put('/cms/facilities-page', { clubs: updatedClubsData });
          Toast.fire({ icon: 'success', title: 'Club details saved successfully!' });
        } catch (error) {
          console.error('Error saving settings:', error);
          Toast.fire({ icon: 'error', title: 'Failed to save club details.' });
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  if (isLoading) return <Loader theme="light" text="Loading Club Details..." />;
  if (!club) return <div className="p-8 text-center text-gray-500">Club not found.</div>;

  const tabs = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'about', label: 'About Content' },
    { id: 'activities', label: 'Activities Grid' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'gallery', label: 'Gallery' }
  ];

  return (
    <div className="space-y-6 w-full pb-20">
      <div className="flex justify-between items-end">
        <div>
          <button 
            onClick={() => router.push('/admin/cms/facilities/clubs')}
            className="flex items-center text-sm font-semibold text-primary hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Clubs
          </button>
          <h1 className="text-2xl font-bold text-[#566A7F] tracking-tight">Edit Club: {club.title}</h1>
          <p className="text-[#697A8D] mt-1 text-sm">Manage the detailed page content for this club.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-70"
          >
            {isSaving || isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : isUploading ? 'Uploading...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-5xl mx-auto">
        {/* Tabs Header */}
        <div className="flex overflow-x-auto border-b border-gray-100 hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors relative ${
                activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8">
          
          {/* HERO TAB */}
          {activeTab === 'hero' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hero Title</label>
                <input
                  type="text"
                  value={club.hero.title}
                  onChange={(e) => setClub({ ...club, hero: { ...club.hero, title: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  placeholder="e.g. KSBM Sports Club: Where Leaders Compete"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hero Subtitle</label>
                <textarea
                  rows="3"
                  value={club.hero.subtitle}
                  onChange={(e) => setClub({ ...club, hero: { ...club.hero, subtitle: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
                  placeholder="Brief introductory text..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Background Image</label>
                <SingleImageUploader 
                  imageUrl={club.hero.backgroundImage} 
                  onUploadComplete={(url) => setClub({ ...club, hero: { ...club.hero, backgroundImage: url } })}
                  onUploadStateChange={setIsUploading}
                  label="Upload Hero Background"
                />
              </div>
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <div className="space-y-6 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section Heading</label>
                    <input
                      type="text"
                      value={club.about.heading}
                      onChange={(e) => setClub({ ...club, about: { ...club.about, heading: e.target.value } })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary/20 text-sm"
                      placeholder="e.g. The Spirit of Competition"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-sm font-semibold text-gray-700">Paragraphs</label>
                      <button 
                        onClick={() => setClub({ ...club, about: { ...club.about, paragraphs: [...club.about.paragraphs, ''] } })}
                        className="text-xs font-semibold text-primary"
                      >
                        + Add Paragraph
                      </button>
                    </div>
                    <div className="space-y-3">
                      {club.about.paragraphs.map((p, idx) => (
                        <div key={idx} className="flex gap-2">
                          <textarea
                            rows="3"
                            value={p}
                            onChange={(e) => {
                              const newParas = [...club.about.paragraphs];
                              newParas[idx] = e.target.value;
                              setClub({ ...club, about: { ...club.about, paragraphs: newParas } });
                            }}
                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none"
                          />
                          <button onClick={() => {
                              const newParas = [...club.about.paragraphs];
                              newParas.splice(idx, 1);
                              setClub({ ...club, about: { ...club.about, paragraphs: newParas } });
                            }} className="text-red-400 hover:text-red-600 px-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {club.about.paragraphs.length === 0 && (
                        <p className="text-sm text-gray-400 italic">No paragraphs added.</p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Side Image</label>
                  <SingleImageUploader 
                    imageUrl={club.about.image} 
                    onUploadComplete={(url) => setClub({ ...club, about: { ...club.about, image: url } })}
                    onUploadStateChange={setIsUploading}
                    label="Upload About Image"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ACTIVITIES TAB */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="max-w-2xl">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Activities Section Heading</label>
                <input
                  type="text"
                  value={club.activities.heading}
                  onChange={(e) => setClub({ ...club, activities: { ...club.activities, heading: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  placeholder="e.g. THE ART OF EXPRESSION"
                />
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-semibold text-gray-700">Activity Cards</label>
                  <button onClick={() => setClub({ ...club, activities: { ...club.activities, items: [...club.activities.items, { title: '', subtitle: '', image: '' }] } })} className="text-sm font-semibold text-primary flex items-center bg-primary/10 px-3 py-1.5 rounded-lg">
                    <Plus className="w-4 h-4 mr-1" /> Add Activity
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {club.activities.items.map((item, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative group">
                      <button onClick={() => {
                          const newItems = [...club.activities.items];
                          newItems.splice(idx, 1);
                          setClub({ ...club, activities: { ...club.activities, items: newItems } });
                        }} className="absolute top-3 right-3 text-red-400 hover:text-red-600 bg-white rounded p-1 shadow-sm opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-3">
                        <SingleImageUploader 
                          imageUrl={item.image} 
                          onUploadComplete={(url) => {
                            const newItems = [...club.activities.items];
                            newItems[idx].image = url;
                            setClub({ ...club, activities: { ...club.activities, items: newItems } });
                          }}
                          onUploadStateChange={setIsUploading}
                          label="Activity Image"
                        />
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const newItems = [...club.activities.items];
                            newItems[idx].title = e.target.value;
                            setClub({ ...club, activities: { ...club.activities, items: newItems } });
                          }}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm font-semibold"
                          placeholder="Title (e.g. Mohiniyattam)"
                        />
                        <input
                          type="text"
                          value={item.subtitle}
                          onChange={(e) => {
                            const newItems = [...club.activities.items];
                            newItems[idx].subtitle = e.target.value;
                            setClub({ ...club, activities: { ...club.activities, items: newItems } });
                          }}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm"
                          placeholder="Subtitle (optional)"
                        />
                      </div>
                    </div>
                  ))}
                  {club.activities.items.length === 0 && (
                    <div className="col-span-full py-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      No activities added.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* FACULTY TAB */}
          {activeTab === 'faculty' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subheading (Top)</label>
                  <input
                    type="text"
                    value={club.faculty.subheading}
                    onChange={(e) => setClub({ ...club, faculty: { ...club.faculty, subheading: e.target.value } })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    placeholder="e.g. Faculty In Charge"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Main Heading</label>
                  <input
                    type="text"
                    value={club.faculty.heading}
                    onChange={(e) => setClub({ ...club, faculty: { ...club.faculty, heading: e.target.value } })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold"
                    placeholder="e.g. Guide, Mentor, Inspire."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description text</label>
                  <textarea
                    rows="2"
                    value={club.faculty.description}
                    onChange={(e) => setClub({ ...club, faculty: { ...club.faculty, description: e.target.value } })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-semibold text-gray-700">Faculty Members</label>
                  <button onClick={() => setClub({ ...club, faculty: { ...club.faculty, members: [...club.faculty.members, { name: '', role: '', image: '' }] } })} className="text-sm font-semibold text-primary flex items-center bg-primary/10 px-3 py-1.5 rounded-lg">
                    <Plus className="w-4 h-4 mr-1" /> Add Member
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {club.faculty.members.map((member, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative group">
                      <button onClick={() => {
                          const newMembers = [...club.faculty.members];
                          newMembers.splice(idx, 1);
                          setClub({ ...club, faculty: { ...club.faculty, members: newMembers } });
                        }} className="absolute top-3 right-3 text-red-400 hover:text-red-600 bg-white rounded p-1 shadow-sm opacity-0 group-hover:opacity-100 z-10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-3">
                        <SingleImageUploader 
                          imageUrl={member.image} 
                          onUploadComplete={(url) => {
                            const newMembers = [...club.faculty.members];
                            newMembers[idx].image = url;
                            setClub({ ...club, faculty: { ...club.faculty, members: newMembers } });
                          }}
                          onUploadStateChange={setIsUploading}
                          label="Profile Image"
                        />
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => {
                            const newMembers = [...club.faculty.members];
                            newMembers[idx].name = e.target.value;
                            setClub({ ...club, faculty: { ...club.faculty, members: newMembers } });
                          }}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm font-semibold"
                          placeholder="Name"
                        />
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => {
                            const newMembers = [...club.faculty.members];
                            newMembers[idx].role = e.target.value;
                            setClub({ ...club, faculty: { ...club.faculty, members: newMembers } });
                          }}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm"
                          placeholder="Role (e.g. Director)"
                        />
                      </div>
                    </div>
                  ))}
                  {club.faculty.members.length === 0 && (
                    <div className="col-span-full py-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      No faculty added.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="max-w-2xl">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gallery Heading</label>
                <input
                  type="text"
                  value={club.gallery.heading}
                  onChange={(e) => setClub({ ...club, gallery: { ...club.gallery, heading: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  placeholder="e.g. Captured in Culture"
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-semibold text-gray-700">Gallery Images</label>
                  <button onClick={() => setClub({ ...club, gallery: { ...club.gallery, images: [...club.gallery.images, { title: '', image: '' }] } })} className="text-sm font-semibold text-primary flex items-center bg-primary/10 px-3 py-1.5 rounded-lg">
                    <Plus className="w-4 h-4 mr-1" /> Add Image
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {club.gallery.images.map((img, idx) => (
                    <div key={idx} className="p-3 border border-gray-200 rounded-xl bg-gray-50 relative group">
                      <button onClick={() => {
                          const newImgs = [...club.gallery.images];
                          newImgs.splice(idx, 1);
                          setClub({ ...club, gallery: { ...club.gallery, images: newImgs } });
                        }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 bg-white rounded p-1 shadow-sm opacity-0 group-hover:opacity-100 z-10">
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <div className="space-y-2">
                        <SingleImageUploader 
                          imageUrl={img.image} 
                          onUploadComplete={(url) => {
                            const newImgs = [...club.gallery.images];
                            newImgs[idx].image = url;
                            setClub({ ...club, gallery: { ...club.gallery, images: newImgs } });
                          }}
                          onUploadStateChange={setIsUploading}
                          label="Upload Image"
                        />
                        <input
                          type="text"
                          value={img.title}
                          onChange={(e) => {
                            const newImgs = [...club.gallery.images];
                            newImgs[idx].title = e.target.value;
                            setClub({ ...club, gallery: { ...club.gallery, images: newImgs } });
                          }}
                          className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-md text-xs"
                          placeholder="Caption (Optional)"
                        />
                      </div>
                    </div>
                  ))}
                  {club.gallery.images.length === 0 && (
                    <div className="col-span-full py-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      No gallery images added.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ManageClubDetails;
