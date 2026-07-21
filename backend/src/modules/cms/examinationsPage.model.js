import mongoose from 'mongoose';

const notificationItemSchema = new mongoose.Schema({
  label: { type: String, default: 'EXAMINATION ANNOUNCEMENT' },
  title: { type: String, required: true },
  date: { type: String, default: '17 Jul 2026' },
  pdfUrl: { type: String, default: '#' }
});

const resultItemSchema = new mongoose.Schema({
  slNo: { type: String, default: '01' },
  dateDuration: { type: String, default: 'NOV 10' },
  courseName: { type: String, required: true },
  semesterInfo: { type: String, default: 'VIII Sem MBA 2026' },
  pdfUrl: { type: String, default: '#' }
});

const examinationsPageSchema = new mongoose.Schema(
  {
    heroBadgeText: { type: String, default: 'Examinations 2026' },
    heroTitle: { type: String, default: 'Stay Informed. Stay Prepared. Excel in Every Examination.' },
    heroSubtitle: {
      type: String,
      default: 'Access examination schedules, important notifications, and semester results in one place. Stay updated with key dates and academic announcements to ensure a smooth and well-organized examination experience throughout your MBA journey.'
    },
    heroImage: { type: String, default: '/assets/Images/image 73.png' },

    overviewTitle: { type: String, default: 'Examination Overview' },
    overviewText1: {
      type: String,
      default: 'Our examination system is designed to evaluate students through a comprehensive and transparent assessment process that reflects both academic knowledge and practical application. A balanced combination of internal assessments, assignments, presentations, case studies, projects, and end-semester examinations ensures continuous learning and holistic development throughout the program.'
    },
    overviewText2: {
      type: String,
      default: 'The examination process follows the academic calendar and is conducted with fairness, consistency, and integrity. Students are encouraged to demonstrate analytical thinking, problem-solving abilities, and managerial competencies through various evaluation methods. Timely notifications, published examination schedules, and prompt result declarations help students stay informed and well-prepared.'
    },
    overviewImage: { type: String, default: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop' },

    calendarTitle: { type: String, default: 'Download the Official Exam Calendar' },
    calendarText: {
      type: String,
      default: 'Stay informed with the official Exam Calendar. Access semester schedules, examination dates, academic milestones, holidays, project timelines, and important university events—all in one place.'
    },
    calendarViewBtnText: { type: String, default: 'View Calendar' },
    calendarViewBtnUrl: { type: String, default: '/assets/Images/image 64.png' },
    calendarDownloadBtnText: { type: String, default: 'Download Calendar' },
    calendarDownloadBtnUrl: { type: String, default: '/assets/Images/image 64.png' },
    calendarImage: { type: String, default: '/assets/Images/image 64.png' },

    notifications: {
      type: [notificationItemSchema],
      default: [
        {
          label: 'EXAMINATION ANNOUNCEMENT',
          title: 'REVISED TIME TABLE FOR FOURTH SEMESTER MBA (REGULAR / SUPPLEMENTARY EXAMINATIONS - JULY 2026)',
          date: '17 Jul 2026',
          pdfUrl: '#'
        },
        {
          label: 'EXAMINATION ANNOUNCEMENT',
          title: 'CONDUCT OF PRACTICAL & VIVA - VOCE IN RESPECT OF FOURTH SEMESTER M.A SOCIOLOGY (CBCSS - CODL) APRIL 2026',
          date: '17 Jul 2026',
          pdfUrl: '#'
        }
      ]
    },

    results: {
      type: [resultItemSchema],
      default: [
        {
          slNo: '01',
          dateDuration: 'NOV 10',
          courseName: 'CS502: Advanced Algorithms',
          semesterInfo: 'VIII Sem MBA 2026',
          pdfUrl: '#'
        },
        {
          slNo: '02',
          dateDuration: 'NOV 15',
          courseName: 'CS502: Advanced Algorithms',
          semesterInfo: 'VIII Sem MBA 2026',
          pdfUrl: '#'
        },
        {
          slNo: '03',
          dateDuration: 'NOV 18',
          courseName: 'CS502: Advanced Algorithms',
          semesterInfo: 'VIII Sem MBA 2026',
          pdfUrl: '#'
        }
      ]
    }
  },
  { timestamps: true }
);

examinationsPageSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const ExaminationsPage = mongoose.model('ExaminationsPage', examinationsPageSchema);
export default ExaminationsPage;
