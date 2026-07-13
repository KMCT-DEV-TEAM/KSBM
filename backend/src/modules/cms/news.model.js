import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  tag: { type: String, default: '' },
  date: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, required: true }
});

const newsSchema = new mongoose.Schema(
  {
    subheading: { type: String, default: 'News and Events' },
    heading: { type: String, default: 'Latest From KSBM' },
    featuredArticle: {
      type: articleSchema,
      default: {
        tag: 'FEATURED',
        date: 'OCTOBER 24, 2024',
        title: 'KSBM National Business Summit 2024: Navigating the AI Frontier',
        description: 'Over 50 industry experts converged at KSBM to discuss the transformative power of AI in modern business management. The summit highlighted key strategies for integrating AI into core business operations, creating new avenues for growth and innovation.',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop'
      }
    },
    sideArticles: {
      type: [articleSchema],
      default: [
        {
          date: 'OCTOBER 15, 2024',
          title: 'KSBM Students Win National HR Conclave 2024',
          image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop'
        },
        {
          date: 'OCTOBER 08, 2024',
          title: "Inauguration of the 'Innovate KSBM' Incubation Lab",
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop'
        },
        {
          date: 'SEPTEMBER 28, 2024',
          title: 'New Global Faculty Partnership with Zurich School of Finance',
          image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000&auto=format&fit=crop'
        },
        {
          date: 'AUGUST 12, 2024',
          title: 'Annual Alumni Meet 2024: Bridging Generations',
          image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1973&auto=format&fit=crop'
        }
      ]
    },
    showSubheading: { type: Boolean, default: true },
    showHeading: { type: Boolean, default: true },
    showSection: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);

newsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const News = mongoose.model('News', newsSchema);

export default News;
