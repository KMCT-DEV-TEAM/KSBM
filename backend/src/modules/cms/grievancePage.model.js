import mongoose from 'mongoose';

const grievancePageSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: 'Grievance Form' },
    subtitle: { type: String, default: 'Submit your concerns securely through our Grievance Portal. Whether your grievance is related to academics, administration, facilities, or campus services, your feedback is handled with confidentiality, fairness, and transparency. Our dedicated grievance cells ensure every concern is reviewed promptly to foster a safe, supportive, and student-centric learning environment.' },
    backgroundImage: { type: String, default: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop' }
  },
  infoSection: {
    title: { type: String, default: 'Grievance Redressal' },
    description: { type: String, default: 'Our Grievance Redressal System is committed to fostering a safe, inclusive, and respectful campus environment where every student, faculty member, and staff member can voice their concerns with confidence. Through a transparent, fair, and confidential grievance resolution process, we ensure that issues related to academics, administration, campus facilities, student welfare, workplace conduct, and other institutional matters are addressed promptly and impartially. Managed by dedicated grievance committees, the system encourages open communication, accountability, and timely resolution while upholding the principles of integrity, equality, and justice. By listening to every concern and taking meaningful action, we strive to strengthen trust, enhance campus well-being, and create a supportive learning environment for the entire academic community.' },
    image: { type: String, default: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop' }
  },
  formSection: {
    backgroundImage: { type: String, default: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop' },
    cellOptions: { 
      type: [String], 
      default: [
        "Student Grievance Cell",
        "Student Grievance Cell",
        "Student Grievance Cell",
        "Student Grievance Cell",
        "Student Grievance Cell",
        "Student Grievance Cell"
      ] 
    }
  }
}, { timestamps: true });

const GrievancePage = mongoose.model('GrievancePage', grievancePageSchema);
export default GrievancePage;
