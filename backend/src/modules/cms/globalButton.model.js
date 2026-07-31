import mongoose from 'mongoose';

const globalButtonSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  label: {
    type: String,
    required: [true, 'Button label is required'],
    trim: true,
  },
  link: {
    type: String,
    required: [true, 'Button link is required'],
    trim: true,
  },
  icon: {
    type: String,
    default: 'MessageCircle', // Lucide icon name
  },
  color: {
    type: String,
    default: 'bg-primary text-white', 
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

const GlobalButton = mongoose.model('GlobalButton', globalButtonSchema);

export default GlobalButton;
