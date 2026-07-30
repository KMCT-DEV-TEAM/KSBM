import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  service: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['New', 'Read', 'Resolved'],
    default: 'New',
  },
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
