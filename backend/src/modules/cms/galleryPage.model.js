import mongoose from 'mongoose';

const galleryPageSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: 'KSBM Sports Club:\nWhere Leaders Compete' },
      subtitle: { type: String, default: 'Forging the next generation of global leaders through the crucible of competitive sports. We believe that physical excellence is the cornerstone of mental fortitude and strategic brilliance.' },
      backgroundImage: { type: String, default: '/assets/Images/image 53.png' }
    },
    gallery: {
      heading: { type: String, default: 'Moments Captured in Campus' },
      badge: { type: String, default: 'Gallery' },
      items: {
        type: [
          {
            title: { type: String },
            type: { type: String, enum: ['image', 'video'], default: 'image' },
            img: { type: String }
          }
        ],
        default: [
          { title: 'Temple', type: 'image', img: 'https://images.unsplash.com/photo-1542840410-3092f99611a3?q=80&w=800&auto=format&fit=crop' },
          { title: 'Camp Fire', type: 'image', img: 'https://images.unsplash.com/photo-1523580494112-071d1694d8d6?q=80&w=800&auto=format&fit=crop' },
          { title: 'Mountain', type: 'video', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop' },
          { title: 'The Night Beauty', type: 'image', img: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f0393b?q=80&w=800&auto=format&fit=crop' },
          { title: 'Graduation', type: 'image', img: 'https://images.unsplash.com/photo-1523580494112-071d1694d8d6?q=80&w=800&auto=format&fit=crop' },
          { title: 'Study Boy', type: 'image', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop' }
        ]
      }
    }
  },
  { timestamps: true }
);

galleryPageSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const GalleryPageModel = mongoose.model('GalleryPage', galleryPageSchema);

export default GalleryPageModel;
