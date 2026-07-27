import mongoose from 'mongoose';

const grievanceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  idNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  complaint: {
    type: String,
    required: true,
  },
  selectedCells: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Dismissed'],
    default: 'Pending'
  }
}, { timestamps: true });

const Grievance = mongoose.model('Grievance', grievanceSchema);
export default Grievance;
