import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import { defaultCmsData } from './defaultCmsData.js';

import About from '../modules/cms/about.model.js';
import AboutCta from '../modules/cms/aboutCta.model.js';
import AboutUsHero from '../modules/cms/aboutUsHero.model.js';
import AboutUsStats from '../modules/cms/aboutUsStats.model.js';
import Accreditation from '../modules/cms/accreditation.model.js';
import Achievements from '../modules/cms/achievements.model.js';
import AdmissionsPage from '../modules/cms/admissionsPage.model.js';
import AdvisoryBoard from '../modules/cms/advisoryBoard.model.js';
import AlumniPage from '../modules/cms/alumniPage.model.js';
import BbaPageSettings from '../modules/cms/bbaPage.model.js';
import BlogsPage from '../modules/cms/blogsPage.model.js';
import CommitteesAndCellsCms from '../modules/cms/committeesAndCells.model.js';
import ContactPage from '../modules/cms/contactPage.model.js';
import DownloadPage from '../modules/cms/downloadPage.model.js';
import EventsPage from '../modules/cms/eventsPage.model.js';
import ExaminationsPage from '../modules/cms/examinationsPage.model.js';
import Facilities from '../modules/cms/facilities.model.js';
import FacilitiesPage from '../modules/cms/facilitiesPage.model.js';
import Faculty from '../modules/cms/faculty.model.js';
import FaqPage from '../modules/cms/faq.model.js';
import Footer from '../modules/cms/footer.model.js';
import GalleryPage from '../modules/cms/galleryPage.model.js';
import GoverningBody from '../modules/cms/governingBody.model.js';
import GrievancePage from '../modules/cms/grievancePage.model.js';
import Header from '../modules/cms/header.model.js';
import Hero from '../modules/cms/hero.model.js';
import Leadership from '../modules/cms/leadership.model.js';
import Legacy from '../modules/cms/legacy.model.js';
import LifeAtKsbm from '../modules/cms/lifeAtKsbm.model.js';
import Management from '../modules/cms/management.model.js';
import ManagementDesk from '../modules/cms/managementDesk.model.js';
import MandatoryDisclosure from '../modules/cms/mandatoryDisclosure.model.js';
import MbaPageSettings from '../modules/cms/mbaPage.model.js';
import News from '../modules/cms/news.model.js';
import Organogram from '../modules/cms/organogram.model.js';
import Placement from '../modules/cms/placement.model.js';
import PlacementPage from '../modules/cms/placementPage.model.js';
import PrivacyPolicyPage from '../modules/cms/privacyPolicy.model.js';
import Programs from '../modules/cms/programs.model.js';
import Recruiters from '../modules/cms/recruiters.model.js';
import TermsAndConditionsPage from '../modules/cms/termsAndConditions.model.js';
import Testimonials from '../modules/cms/testimonials.model.js';
import VisionMission from '../modules/cms/visionMission.model.js';

const modelMap = [
  { model: Hero, key: 'heros' },
  { model: About, key: 'abouts' },
  { model: AboutUsHero, key: 'aboutusheros' },
  { model: AboutUsStats, key: 'aboutusstats' },
  { model: AboutCta, key: 'aboutctas' },
  { model: VisionMission, key: 'visionmissions' },
  { model: Leadership, key: 'leaderships' },
  { model: Legacy, key: 'legacies' },
  { model: Management, key: 'managements' },
  { model: ManagementDesk, key: 'managementdesks' },
  { model: GoverningBody, key: 'governingbodies' },
  { model: AdvisoryBoard, key: 'advisoryboards' },
  { model: Programs, key: 'programs' },
  { model: MbaPageSettings, key: 'mbapagesettings' },
  { model: BbaPageSettings, key: 'bbapagesettings' },
  { model: AdmissionsPage, key: 'admissionspages' },
  { model: Placement, key: 'placements' },
  { model: PlacementPage, key: 'placementpages' },
  { model: Facilities, key: 'facilities' },
  { model: FacilitiesPage, key: 'facilitiespages' },
  { model: Faculty, key: 'faculties' },
  { model: EventsPage, key: 'eventspages' },
  { model: BlogsPage, key: 'blogspages' },
  { model: GalleryPage, key: 'gallerypages' },
  { model: AlumniPage, key: 'alumnipages' },
  { model: LifeAtKsbm, key: 'lifeatksbms' },
  { model: Achievements, key: 'achievements' },
  { model: Recruiters, key: 'recruiters' },
  { model: Testimonials, key: 'testimonials' },
  { model: News, key: 'news' },
  { model: Accreditation, key: 'accreditations' },
  { model: CommitteesAndCellsCms, key: 'committeesandcellscms' },
  { model: DownloadPage, key: 'downloadpages' },
  { model: ExaminationsPage, key: 'examinationspages' },
  { model: FaqPage, key: 'faqpages' },
  { model: ContactPage, key: 'contactpages' },
  { model: GrievancePage, key: 'grievancepages' },
  { model: PrivacyPolicyPage, key: 'privacypolicypages' },
  { model: TermsAndConditionsPage, key: 'termsandconditionspages' },
  { model: Header, key: 'headers' },
  { model: Footer, key: 'footers' },
  { model: MandatoryDisclosure, key: 'mandatorydisclosures' },
  { model: Organogram, key: 'organograms' },
];

export const seedCmsData = async () => {
  try {
    console.log('--- Starting CMS Data Seeding ---');
    for (const { model, key } of modelMap) {
      const data = defaultCmsData[key];
      if (!data) {
        console.warn(`No default data found for ${key}`);
        continue;
      }
      const existing = await model.findOne();
      if (existing) {
        await model.findOneAndUpdate({}, data, { new: true });
        console.log(`✓ Updated default CMS for [${key}]`);
      } else {
        await model.create(data);
        console.log(`✓ Inserted default CMS for [${key}]`);
      }
    }
    console.log('--- CMS Data Seeding Completed Successfully ---');
  } catch (error) {
    console.error('Error during CMS seeding:', error);
    throw error;
  }
};

// If run directly via node
if (process.argv[1]?.includes('cmsSeed.js')) {
  await connectDB();
  await seedCmsData();
  process.exit(0);
}
