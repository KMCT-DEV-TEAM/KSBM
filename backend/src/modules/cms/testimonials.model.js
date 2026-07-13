import mongoose from 'mongoose';

const testimonialItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  quote: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  }
});

const testimonialsSchema = new mongoose.Schema(
  {
    subheading: {
      type: String,
      default: 'Testimonials',
    },
    heading: {
      type: String,
      default: 'Voices of Success',
    },
    testimonials: {
      type: [testimonialItemSchema],
      default: [
        {
          id: '1',
          name: 'Anjali Menon',
          course: 'MBA (2022-2024)',
          quote: '"KSBM transformed my potential into professional success."',
          body: 'From interactive classroom sessions to industry-oriented projects, every experience prepared me for real business challenges. The faculty, placement team, and supportive learning environment helped me grow both professionally and personally, giving me the confidence to excel in the corporate world.',
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop'
        },
        {
          id: '2',
          name: 'Rahul Sharma',
          course: 'BBA (2021-2024)',
          quote: '"The practical approach to learning is unmatched here."',
          body: 'The practical approach to learning and the amazing campus life made my time at KSBM unforgettable. The placement cell was instrumental in getting me my dream job right out of college, providing excellent mentorship.',
          image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop'
        },
        {
          id: '3',
          name: 'Priya Patel',
          course: 'MBA (2021-2023)',
          quote: '"A true stepping stone to global corporate opportunities."',
          body: 'KSBM gave me the platform to interact with industry leaders and participate in global competitions. The rigorous curriculum is exactly what the corporate world demands, making the transition seamless and rewarding.',
          image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974&auto=format&fit=crop',
          avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=150&auto=format&fit=crop'
        }
      ]
    }
  },
  {
    timestamps: true,
  }
);

// Static method to always get the first (and only) settings document
testimonialsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Testimonials = mongoose.model('Testimonials', testimonialsSchema);

export default Testimonials;
