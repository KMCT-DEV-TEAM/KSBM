import mongoose from 'mongoose';

const OrganogramSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  pdfUrl: {
    type: String,
    required: [true, 'PDF URL is required'],
  },
  isDefault: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

// Ensure only one default exists
OrganogramSchema.pre('save', async function() {
  if (this.isDefault) {
    await this.constructor.updateMany({ _id: { $ne: this._id } }, { isDefault: false });
  }
});

export default mongoose.model('Organogram', OrganogramSchema);
