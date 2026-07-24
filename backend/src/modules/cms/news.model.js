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
        image: '/assets/Images/Home/news_featured.jpg'
      }
    },
    sideArticles: {
      type: [articleSchema],
      default: [
        {
          date: 'OCTOBER 15, 2024',
          title: 'KSBM Students Win National HR Conclave 2024',
          image: '/assets/Images/Home/news_side_1.jpg'
        },
        {
          date: 'OCTOBER 08, 2024',
          title: "Inauguration of the 'Innovate KSBM' Incubation Lab",
          image: '/assets/Images/Home/news_side_2.jpg'
        },
        {
          date: 'SEPTEMBER 28, 2024',
          title: 'New Global Faculty Partnership with Zurich School of Finance',
          image: '/assets/Images/Home/news_side_3.jpg'
        },
        {
          date: 'AUGUST 12, 2024',
          title: 'Annual Alumni Meet 2024: Bridging Generations',
          image: '/assets/Images/Home/news_side_4.jpg'
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
