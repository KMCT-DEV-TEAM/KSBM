import mongoose from 'mongoose';

const MandatoryDisclosureSchema = new mongoose.Schema({
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
MandatoryDisclosureSchema.pre('save', async function() {
  if (this.isDefault) {
    await this.constructor.updateMany({ _id: { $ne: this._id } }, { isDefault: false });
  }
});

export default mongoose.model('MandatoryDisclosure', MandatoryDisclosureSchema);
