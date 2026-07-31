import mongoose from 'mongoose';

const eventsPageSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: 'THE SPIRIT OF CULTURE' },
      subtitle: { type: String, default: 'Experience the vibrancy and dynamic energy of our college campus. From cultural extravaganzas to technical symposiums, our events are the heartbeat of student life, fostering creativity, leadership, and lifelong memories.' },
      backgroundImage: { type: String, default: '/assets/Images/Group 250.png' }
    },
    about: {
      subheading: { type: String, default: 'About' },
      heading: { type: String, default: 'THE SPIRIT OF CULTURE' },
      paragraph1: { type: String, default: 'Discover a celebration where creativity knows no limits and every performance tells a story worth remembering. Kaleido is more than a cultural festival—it\'s a vibrant platform where passion meets purpose, traditions blend with innovation, and talent shines without boundaries. Bringing together students, artists, performers, and creative minds from diverse backgrounds, the festival transforms the campus into a spectacular stage filled with energy, color, and inspiration.' },
      paragraph2: { type: String, default: 'Immerse yourself in a world of mesmerizing dance performances, soul-stirring music, captivating theatre, expressive fine arts, photography, fashion, literature, and countless cultural experiences that celebrate the richness of artistic expression. Whether you\'re stepping into the spotlight as a performer, competing to showcase your skills, cheering for your peers, or simply enjoying the electrifying atmosphere, every moment at Kaleido is designed to inspire, connect, and create lasting memories.' },
      image: { type: String, default: '/assets/Images/image 91.png' },
      brochureUrl: { type: String, default: '' },
      calendarUrl: { type: String, default: '' }
    },
    upcomingEvents: {
      heading: { type: String, default: 'THE UPCOMING EVENTS' },
      events: {
        type: [
          {
            title: { type: String },
            description: { type: String },
            date: { type: String },
            month: { type: String },
            img: { type: String }
          }
        ],
        default: [
          {
            title: 'CELEBRITY VISIT',
            description: 'Join us for an exclusive evening with renowned personalities. Experience an inspiring session filled with insights, interactions, and memorable moments.',
            date: '12',
            month: 'OCT',
            img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop'
          },
          {
            title: 'DJ PARTY & DANCE',
            description: 'Get ready to groove to the electrifying beats! A night of non-stop music, spectacular lighting, and an unforgettable dance floor experience.',
            date: '15',
            month: 'NOV',
            img: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop'
          },
          {
            title: 'SPORTS FESTIVAL',
            description: 'Witness the ultimate display of athleticism and team spirit. Cheer for your favorite teams in this high-energy, action-packed sports extravaganza.',
            date: '04',
            month: 'DEC',
            img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop'
          }
        ]
      }
    },
    highlightedPrograms: {
      heading: { type: String, default: 'THE HIGHLIGHTED PROGRAMS' },
      images: {
        type: [{ img: String, alt: String }],
        default: [
          { img: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=600&auto=format&fit=crop', alt: 'Program 1' },
          { img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop', alt: 'Program 2' },
          { img: 'https://images.unsplash.com/photo-1533174000273-7d5d1c2ec7ce?q=80&w=600&auto=format&fit=crop', alt: 'Program 3' },
          { img: 'https://images.unsplash.com/photo-1508215885820-4585e56135c8?q=80&w=600&auto=format&fit=crop', alt: 'Program 4' },
          { img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop', alt: 'Program 5' },
          { img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop', alt: 'Program 6' },
          { img: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=600&auto=format&fit=crop', alt: 'Program 7' },
          { img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format&fit=crop', alt: 'Program 8' }
        ]
      }
    },
    essenceOfCulture: {
      heading: { type: String, default: 'THE ESSENCE OF CULTURE' },
      items: {
        type: [
          { 
            img: { type: String }, 
            category: { type: String },
            description: { type: String },
            programs: { type: [String], default: [] }
          }
        ],
        default: [
          { img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop', category: 'Music', description: 'Feel the rhythm, embrace the energy, and immerse yourself in the electrifying world of music at Kaleido.', programs: ['Solo Light Music', 'Solo Singing Classical', 'Solo Singing Western', 'Group Song Malayalam', 'Group Song Western', 'Naadan Pattu'] },
          { img: 'https://images.unsplash.com/photo-1540039155732-6761b3464195?q=80&w=800&auto=format&fit=crop', category: 'Dance', description: 'Immerse yourself in mesmerizing dance performances and high-energy choreographies.', programs: ['Solo Dance Classical', 'Solo Dance Folk', 'Group Dance Western', 'Group Dance Folk'] },
          { img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop', category: 'Fine Arts', description: 'Explore expressive fine arts, photography, fashion, and creative masterpieces.', programs: ['Pencil Drawing', 'Watercolor Painting', 'Oil Painting', 'Photography', 'Collage Making'] },
          { img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop', category: 'Drama', description: 'Experience captivating theatre and soul-stirring dramatic performances.', programs: ['Mime', 'Skit', 'One Act Play', 'Mono Act'] }
        ]
      }
    },
    stayConnected: {
      heading: { type: String, default: 'STAY CONNECTED' },
      posters: {
        type: [{ img: String }],
        default: [
          { img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop' },
          { img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop' }
        ]
      }
    },
    momentsCaptured: {
      heading: { type: String, default: 'MOMENTS CAPTURED' },
      images: {
        type: [{ img: String }],
        default: [
          { img: 'https://images.unsplash.com/photo-1508215885820-4585e56135c8?q=80&w=600&auto=format&fit=crop' },
          { img: 'https://images.unsplash.com/photo-1533174000273-7d5d1c2ec7ce?q=80&w=600&auto=format&fit=crop' },
          { img: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=600&auto=format&fit=crop' },
          { img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop' },
          { img: 'https://images.unsplash.com/photo-1540039155732-6761b3464195?q=80&w=600&auto=format&fit=crop' }
        ]
      }
    }
  },
  { timestamps: true, strict: false }
);

eventsPageSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const EventsPageModel = mongoose.model('EventsPage', eventsPageSchema);

export default EventsPageModel;
