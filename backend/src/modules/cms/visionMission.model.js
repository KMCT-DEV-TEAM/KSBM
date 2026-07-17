import mongoose from 'mongoose';

const visionMissionSchema = new mongoose.Schema(
  {
    visionTitle: { type: String, default: 'Our Vision' },
    visionContent: { type: [String], default: ['"To mould to competent healthcare professionals with leadership qualities through comprehensive nursing education, practice and research."'] },
    visionImage: { type: String, default: '/assets/Images/image 27.png' },
    missionTitle: { type: String, default: 'Our Mission' },
    missionContent: { 
      type: [String], 
      default: [
        'To mould to competent healthcare professionals with leadership qualities through comprehensive nursing education, practice and research.',
        'To provide high-quality healthcare education that integrates academic excellence with clinical practice.',
        'To foster a culture of continuous learning, ethical practice, and compassionate patient care.',
        'To contribute to the healthcare sector by producing highly skilled and dedicated nursing professionals.'
      ]
    },
    missionImage: { type: String, default: '/assets/Images/image 28.png' },
  },
  { timestamps: true }
);

visionMissionSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const VisionMission = mongoose.model('VisionMission', visionMissionSchema);
export default VisionMission;
