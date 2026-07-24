import mongoose from 'mongoose';

const achievementItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const achievementsSchema = new mongoose.Schema(
  {
    subheading: {
      type: String,
      default: 'College Achievements',
    },
    heading: {
      type: String,
      default: 'Awards and Achievements',
    },
    achievements: {
      type: [achievementItemSchema],
      default: [
        {
          category: 'Academics',
          date: 'Oct 30, 2024',
          title: 'National Research Excellence Award',
          description: 'Recognizing outstanding contributions to sustainable technology research.',
          image: '/assets/Images/Home/achievement_award.png'
        },
        {
          category: 'Sports',
          date: 'Oct 25, 2024',
          title: 'Championship Victory in Inter-University League',
          description: 'Our varsity team secures the gold in the regional finals.',
          image: '/assets/Images/Home/achievement_sports.png'
        },
        {
          category: 'Community',
          date: 'Oct 20, 2024',
          title: 'Social Impact Leadership Award',
          description: 'Honoring our student volunteers for their dedication to local literacy programs.',
          image: '/assets/Images/Home/achievement_poster.png'
        }
      ]
    },
    showSubheading: { type: Boolean, default: true },
    showHeading: { type: Boolean, default: true },
    showAchievements: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// We only need one settings document, so we can use a static method to always get the first one
achievementsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      subheading: 'College Achievements',
      heading: 'Awards and Achievements',
      achievements: [
        {
          category: 'Academics',
          date: 'Oct 30, 2024',
          title: 'National Research Excellence Award',
          description: 'Recognizing outstanding contributions to sustainable technology research.',
          image: '/assets/Images/Home/achievement_award.png'
        },
        {
          category: 'Sports',
          date: 'Oct 25, 2024',
          title: 'Championship Victory in Inter-University League',
          description: 'Our varsity team secures the gold in the regional finals.',
          image: '/assets/Images/Home/achievement_sports.png'
        },
        {
          category: 'Community',
          date: 'Oct 20, 2024',
          title: 'Social Impact Leadership Award',
          description: 'Honoring our student volunteers for their dedication to local literacy programs.',
          image: '/assets/Images/Home/achievement_poster.png'
        }
      ],
      showSubheading: true,
      showHeading: true,
      showAchievements: true
    });
  }
  return settings;
};

const Achievements = mongoose.model('Achievements', achievementsSchema);

export default Achievements;
