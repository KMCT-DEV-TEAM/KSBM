import mongoose from 'mongoose';

const blogSectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String },
  content: { type: String, required: true },
  isQuote: { type: Boolean, default: false },
  inlineImage: { type: String }
});

const relatedArticleSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: String, required: true }
});

const blogSchema = new mongoose.Schema({
  category: { type: String, required: true },
  filterCategory: { type: String, required: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  lead: { type: String },
  image: { type: String, required: true },
  readTime: { type: String, required: true },
  date: { type: String, required: true },
  author: { type: String },
  sections: [blogSectionSchema],
  relatedArticles: [relatedArticleSchema]
});

const defaultBlogs = [
  {
    id: '1',
    category: 'AI IN PROFESSIONAL EDUCATION',
    filterCategory: 'Industry Trends',
    title: 'The Future of Professional Education in the AI Era',
    excerpt: 'How executive training is evolving to meet the demands of a machine-assisted workplace, emphasizing human-centric leadership and strategic decision-making in high-pressure environments.',
    lead: 'How artificial intelligence is reshaping professional education, empowering future leaders, and preparing students for a smarter tomorrow.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
    readTime: '5 min read',
    date: 'October 24, 2026',
    author: 'Editorial Team',
    sections: [
      {
        id: 'introduction',
        title: 'Introduction',
        content: 'Artificial Intelligence (AI) is no longer the future—it is the present. From automation to data-driven decision making, AI is transforming industries and redefining the skills employers expect. In this new era, professional education must evolve to equip students with the right knowledge, mindset, and tools to navigate a landscape where human creativity meets machine intelligence.'
      },
      {
        id: 'ai-transforming',
        title: 'AI in Transforming Business Education',
        content: 'We\'re moving beyond simply learning AI tools to fundamentally transforming how we learn. Intelligent learning platforms, AI-powered analytics, and virtual simulators are creating personalized learning experiences that adapt to how you absorb information.',
        inlineImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop'
      },
      {
        id: 'why-matters',
        title: 'Why This Matters for MBA Students',
        content: 'The modern MBA equips future executives not just to understand data, but to harness it. Data privacy, ethical AI, strategic thinking, and emotional intelligence—areas where human capability far exceeds technologies—aren\'t just an elective; it is the core of future leadership.'
      },
      {
        id: 'quote',
        isQuote: true,
        content: 'AI will not replace professionals, but professionals who leverage AI will replace those who don\'t.'
      },
      {
        id: 'road-ahead',
        title: 'The Road Ahead',
        content: 'The future of professional education is human-AI collaboration. Institutions that integrate technology with human resilience and critical reasoning will train future-ready graduates who can solve complex problems.'
      },
      {
        id: 'conclusion',
        title: 'Conclusion',
        content: 'AI isn\'t just a technological shift; it\'s an educational revolution. The future belongs to learners who are curious, adaptable, and ready to collaborate with intelligent machines. At KSBM, we are leading this historic journey.'
      }
    ],
    relatedArticles: [
      { id: '2', title: 'The AI Revolution in MBA: Preparing Today for Tomorrow', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=400&auto=format&fit=crop', date: 'Oct 15, 2026' },
      { id: '3', title: 'Top 5 Skills Every Modern Manager Needs to Succeed', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', date: 'Sep 28, 2026' }
    ]
  },
  {
    id: '2',
    category: 'LEADERSHIP',
    filterCategory: 'Career Advice',
    title: 'The AI Revolution in MBA: Preparing Today for Tomorrow',
    excerpt: 'Strategic alignment of technology and leadership in modern business administration courses.',
    lead: 'A deep dive into the integration of AI tools within the core MBA curriculum.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    readTime: '6 min read',
    date: 'October 15, 2026',
    author: 'KSBM Faculty',
    sections: [],
    relatedArticles: []
  },
  {
    id: '3',
    category: 'SKILL DEVELOPMENT',
    filterCategory: 'Skill Development',
    title: 'Top 5 Skills Every Modern Manager Needs to Succeed',
    excerpt: 'Essential competencies for navigating complex and rapidly changing business environments.',
    lead: 'What separates a good manager from a great one in today\'s digital-first economy?',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    readTime: '4 min read',
    date: 'September 28, 2026',
    author: 'Career Services',
    sections: [],
    relatedArticles: []
  }
];

const blogsPageSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: 'Insights & Blogs' },
    subtitle: { type: String, default: 'Explore expert articles, student success stories, industry trends, and academic insights to stay informed and inspired.' },
    backgroundImage: { type: String, default: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600&auto=format&fit=crop' }
  },
  blogs: { type: [blogSchema], default: defaultBlogs }
}, { timestamps: true });

blogsPageSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const BlogsPage = mongoose.model('BlogsPage', blogsPageSchema);
export default BlogsPage;
