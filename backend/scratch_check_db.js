import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const placementPageSchema = new mongoose.Schema({}, { strict: false });
const PlacementPage = mongoose.model('PlacementPage', placementPageSchema, 'placementpages');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const defaultAchievers = [
    { name: 'Pratik Patil', program: 'MBA 2022-24', company: 'Google', role: 'Business Analyst', companyLogo: '/assets/Images/placements/google_logo.svg', image: '/assets/Images/placements/achiever_1.png' },
    { name: 'Megha Sharma', program: 'MBA 2022-24', company: 'Microsoft', role: 'Product Manager', companyLogo: '/assets/Images/placements/microsoft_logo.svg', image: '/assets/Images/placements/achiever_2.png' },
    { name: 'Rohit Verma', program: 'MBA 2022-24', company: 'Infosys', role: 'Software Engineer', companyLogo: '/assets/Images/placements/infosys_logo.svg', image: '/assets/Images/placements/achiever_1.png' },
    { name: 'Neha Gupta', program: 'MBA 2022-24', company: 'Cognizant', role: 'Consultant', companyLogo: '/assets/Images/placements/cognizant_logo.svg', image: '/assets/Images/placements/achiever_2.png' },
  ];

  await PlacementPage.updateOne({}, {
    $set: {
      'proudAchievers.items': defaultAchievers,
      'proudAchievers.showSection': true
    }
  });
  
  console.log("Restored default proud achievers.");
  mongoose.disconnect();
}
test();
