import Header from './header.model.js';
import About from './about.model.js';
import Hero from './hero.model.js';
import Programs from './programs.model.js';
import Accreditation from './accreditation.model.js';
import Facilities from './facilities.model.js';
import Management from './management.model.js';
import Placement from './placement.model.js';
import Testimonials from './testimonials.model.js';
import Achievements from './achievements.model.js';
import Recruiters from './recruiters.model.js';
import LifeAtKsbm from './lifeAtKsbm.model.js';
import News from './news.model.js';
import FooterModel from './footer.model.js';
import AboutUsHero from './aboutUsHero.model.js';
import VisionMission from './visionMission.model.js';
import Leadership from './leadership.model.js';
import Legacy from './legacy.model.js';
import AboutUsStats from './aboutUsStats.model.js';
import AdvisoryBoard from './advisoryBoard.model.js';
import GoverningBody from './governingBody.model.js';
import AboutCta from './aboutCta.model.js';
import FacilitiesPage from './facilitiesPage.model.js';
import Faculty from './faculty.model.js';
import AlumniPage from './alumniPage.model.js';
import ManagementDesk from './managementDesk.model.js';
import MbaPageSetting from './mbaPage.model.js';
import BbaPageSetting from './bbaPage.model.js';
import ExaminationsPage from './examinationsPage.model.js';
import AdmissionsPage from './admissionsPage.model.js';
// @desc    Get header settings
// @route   GET /api/cms/header
// @access  Public
export const getHeaderSettings = async (req, res) => {
  try {
    const settings = await Header.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching header settings', error: error.message });
  }
};

// @desc    Update header settings
// @route   PUT /api/cms/header
// @access  Private (Admin)
export const updateHeaderSettings = async (req, res) => {
  try {
    const { navItems, actionButton, alignment, logoUrl } = req.body;

    const settings = await Header.getSettings();

    if (navItems) settings.navItems = navItems;
    if (actionButton) settings.actionButton = actionButton;
    if (alignment) settings.alignment = alignment;
    if (logoUrl !== undefined) settings.logoUrl = logoUrl;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating header settings', error: error.message });
  }
};
// @desc    Get about settings
// @route   GET /api/cms/about
// @access  Public
export const getAboutSettings = async (req, res) => {
  try {
    const settings = await About.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching about settings', error: error.message });
  }
};

// @desc    Update about settings
// @route   PUT /api/cms/about
// @access  Private (Admin)
export const updateAboutSettings = async (req, res) => {
  try {
    const { subheading, heading, paragraphs, imageUrl, stats, showSubheading, showHeading, showParagraphs, showImage, showStats } = req.body;

    const settings = await About.getSettings();

    if (subheading !== undefined) settings.subheading = subheading;
    if (heading !== undefined) settings.heading = heading;
    if (paragraphs !== undefined) settings.paragraphs = paragraphs;
    if (imageUrl !== undefined) settings.imageUrl = imageUrl;
    if (stats !== undefined) settings.stats = stats;
    
    if (showSubheading !== undefined) settings.showSubheading = showSubheading;
    if (showHeading !== undefined) settings.showHeading = showHeading;
    if (showParagraphs !== undefined) settings.showParagraphs = showParagraphs;
    if (showImage !== undefined) settings.showImage = showImage;
    if (showStats !== undefined) settings.showStats = showStats;
     const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating about settings', error: error.message });
    res.status(500).json({ message: 'Server error updating hero settings', error: error.message });
  }
};
// @desc    Get Hero settings
// @route   GET /api/cms/hero
// @access  Public
export const getHeroSettings = async (req, res) => {
  try {
    const settings = await Hero.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching hero settings', error: error.message });
  }
};

// @desc    Update Hero settings
// @route   PUT /api/cms/hero
// @access  Private (Admin)
export const updateHeroSettings = async (req, res) => {
  try {
    const { pillText, headingLine1, headingLine2, description, primaryButton, secondaryButton, bannerImages, statsCard } = req.body;

    const settings = await Hero.getSettings();

    if (pillText !== undefined) settings.pillText = pillText;
    if (headingLine1 !== undefined) settings.headingLine1 = headingLine1;
    if (headingLine2 !== undefined) settings.headingLine2 = headingLine2;
    if (description !== undefined) settings.description = description;
    if (primaryButton !== undefined) settings.primaryButton = primaryButton;
    if (secondaryButton !== undefined) settings.secondaryButton = secondaryButton;
    if (bannerImages !== undefined) settings.bannerImages = bannerImages;
    if (statsCard !== undefined) settings.statsCard = statsCard;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating about settings', error: error.message });
    res.status(500).json({ message: 'Server error updating hero settings', error: error.message });
  }
};

// @desc    Get Programs settings
// @route   GET /api/cms/programs
// @access  Public
export const getProgramsSettings = async (req, res) => {
  try {
    const settings = await Programs.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching programs settings', error: error.message });
  }
};

// @desc    Update Programs settings
// @route   PUT /api/cms/programs
// @access  Private (Admin)
export const updateProgramsSettings = async (req, res) => {
  try {
    const { subheading, heading, description, programs, showSubheading, showHeading, showDescription, showPrograms } = req.body;

    const settings = await Programs.getSettings();

    if (subheading !== undefined) settings.subheading = subheading;
    if (heading !== undefined) settings.heading = heading;
    if (description !== undefined) settings.description = description;
    if (programs !== undefined) settings.programs = programs;
    
    if (showSubheading !== undefined) settings.showSubheading = showSubheading;
    if (showHeading !== undefined) settings.showHeading = showHeading;
    if (showDescription !== undefined) settings.showDescription = showDescription;
    if (showPrograms !== undefined) settings.showPrograms = showPrograms;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating programs settings', error: error.message });
  }
};

// @desc    Get Accreditation settings
// @route   GET /api/cms/accreditation
// @access  Public
export const getAccreditationSettings = async (req, res) => {
  try {
    const settings = await Accreditation.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching accreditation settings', error: error.message });
  }
};

// @desc    Update Accreditation settings
// @route   PUT /api/cms/accreditation
// @access  Private (Admin)
export const updateAccreditationSettings = async (req, res) => {
  try {
    const { subheading, heading, imageUrl, showSubheading, showHeading, showImage } = req.body;

    const settings = await Accreditation.getSettings();

    if (subheading !== undefined) settings.subheading = subheading;
    if (heading !== undefined) settings.heading = heading;
    if (imageUrl !== undefined) settings.imageUrl = imageUrl;
    
    if (showSubheading !== undefined) settings.showSubheading = showSubheading;
    if (showHeading !== undefined) settings.showHeading = showHeading;
    if (showImage !== undefined) settings.showImage = showImage;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating accreditation settings', error: error.message });
  }
};

// @desc    Get Facilities settings
// @route   GET /api/cms/facilities
// @access  Public
export const getFacilitiesSettings = async (req, res) => {
  try {
    const settings = await Facilities.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching facilities settings', error: error.message });
  }
};

// @desc    Update Facilities settings
// @route   PUT /api/cms/facilities
// @access  Private (Admin)
export const updateFacilitiesSettings = async (req, res) => {
  try {
    const { subheading, heading, description, facilitiesList, showSubheading, showHeading, showDescription, showFacilities } = req.body;

    const settings = await Facilities.getSettings();

    if (subheading !== undefined) settings.subheading = subheading;
    if (heading !== undefined) settings.heading = heading;
    if (description !== undefined) settings.description = description;
    if (facilitiesList !== undefined) settings.facilitiesList = facilitiesList;
    
    if (showSubheading !== undefined) settings.showSubheading = showSubheading;
    if (showHeading !== undefined) settings.showHeading = showHeading;
    if (showDescription !== undefined) settings.showDescription = showDescription;
    if (showFacilities !== undefined) settings.showFacilities = showFacilities;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating facilities settings', error: error.message });
  }
};

export const getManagementSettings = async (req, res) => {
  try {
    const settings = await Management.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching management settings",
      error: error.message,
    });
  }
};

// @desc    Update Management settings
// @route   PUT /api/cms/management
// @access  Private (Admin)
export const updateManagementSettings = async (req, res) => {
  try {
    const { subheading, heading, description, members } = req.body;

    const settings = await Management.getSettings();

    if (subheading !== undefined) settings.subheading = subheading;
    if (heading !== undefined) settings.heading = heading;
    if (description !== undefined) settings.description = description;
    if (members !== undefined) settings.members = members;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({
      message: "Server error updating management settings",
      error: error.message,
    });
  }
};

// @desc    Get Placement settings
// @route   GET /api/cms/placement
// @access  Public
export const getPlacementSettings = async (req, res) => {
  try {
    const settings = await Placement.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching placement settings",
      error: error.message,
    });
  }
};

// @desc    Update Placement settings
// @route   PUT /api/cms/placement
// @access  Private (Admin)
export const updatePlacementSettings = async (req, res) => {
  try {
    const {
      subheading,
      heading,
      description,
      stat1Value,
      stat1Label,
      stat2Value,
      stat2Label,
      showSubheading,
      showHeading,
      showDescription,
      showStats,
    } = req.body;

    const settings = await Placement.getSettings();

    if (subheading !== undefined) settings.subheading = subheading;
    if (heading !== undefined) settings.heading = heading;
    if (description !== undefined) settings.description = description;
    if (stat1Value !== undefined) settings.stat1Value = stat1Value;
    if (stat1Label !== undefined) settings.stat1Label = stat1Label;
    if (stat2Value !== undefined) settings.stat2Value = stat2Value;
    if (stat2Label !== undefined) settings.stat2Label = stat2Label;

    if (showSubheading !== undefined)
      settings.showSubheading = showSubheading;
    if (showHeading !== undefined)
      settings.showHeading = showHeading;
    if (showDescription !== undefined)
      settings.showDescription = showDescription;
    if (showStats !== undefined)
      settings.showStats = showStats;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({
      message: "Server error updating placement settings",
      error: error.message,
    });
  }
};

// @desc    Get Testimonials settings
// @route   GET /api/cms/testimonials
// @access  Public
export const getTestimonialsSettings = async (req, res) => {
  try {
    const settings = await Testimonials.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching testimonials settings",
      error: error.message,
    });
  }
};

// @desc    Update Testimonials settings
// @route   PUT /api/cms/testimonials
// @access  Private (Admin)
export const updateTestimonialsSettings = async (req, res) => {
  try {
    const { subheading, heading, testimonials } = req.body;

    const settings = await Testimonials.getSettings();

    if (subheading !== undefined) settings.subheading = subheading;
    if (heading !== undefined) settings.heading = heading;
    if (testimonials !== undefined) settings.testimonials = testimonials;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({
      message: "Server error updating testimonials settings",
      error: error.message,
    });
  }
};

// @desc    Get achievements settings
// @route   GET /api/cms/achievements
// @access  Public
export const getAchievementsSettings = async (req, res) => {
  try {
    const settings = await Achievements.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching achievements settings', error: error.message });
  }
};

// @desc    Update achievements settings
// @route   PUT /api/cms/achievements
// @access  Private (Admin)
export const updateAchievementsSettings = async (req, res) => {
  try {
    const { subheading, heading, achievements, showSubheading, showHeading, showAchievements } = req.body;

    const settings = await Achievements.getSettings();

    if (subheading !== undefined) settings.subheading = subheading;
    if (heading !== undefined) settings.heading = heading;
    if (achievements !== undefined) settings.achievements = achievements;
    if (showSubheading !== undefined) settings.showSubheading = showSubheading;
    if (showHeading !== undefined) settings.showHeading = showHeading;
    if (showAchievements !== undefined) settings.showAchievements = showAchievements;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating achievements settings', error: error.message });
  }
};

// @desc    Get recruiters settings
// @route   GET /api/cms/recruiters
// @access  Public
export const getRecruitersSettings = async (req, res) => {
  try {
    const settings = await Recruiters.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching recruiters settings', error: error.message });
  }
};

// @desc    Update recruiters settings
// @route   PUT /api/cms/recruiters
// @access  Private (Admin)
export const updateRecruitersSettings = async (req, res) => {
  try {
    const { recruiters, showRecruiters } = req.body;

    const settings = await Recruiters.getSettings();

    if (recruiters !== undefined) settings.recruiters = recruiters;
    if (showRecruiters !== undefined) settings.showRecruiters = showRecruiters;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating recruiters settings', error: error.message });
  }
};

// @desc    Get Life at KSBM settings
// @route   GET /api/cms/life-at-ksbm
// @access  Public
export const getLifeAtKsbmSettings = async (req, res) => {
  try {
    const settings = await LifeAtKsbm.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching Life at KSBM settings', error: error.message });
  }
};

// @desc    Update Life at KSBM settings
// @route   PUT /api/cms/life-at-ksbm
// @access  Private (Admin)
export const updateLifeAtKsbmSettings = async (req, res) => {
  try {
    const { subheading, heading, description, images, showSubheading, showHeading, showDescription, showImages, showSection } = req.body;
    const settings = await LifeAtKsbm.getSettings();

    if (subheading !== undefined) settings.subheading = subheading;
    if (heading !== undefined) settings.heading = heading;
    if (description !== undefined) settings.description = description;
    if (images !== undefined) settings.images = images;
    if (showSubheading !== undefined) settings.showSubheading = showSubheading;
    if (showHeading !== undefined) settings.showHeading = showHeading;
    if (showDescription !== undefined) settings.showDescription = showDescription;
    if (showImages !== undefined) settings.showImages = showImages;
    if (showSection !== undefined) settings.showSection = showSection;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating Life at KSBM settings', error: error.message });
  }
};

// @desc    Get News settings
// @route   GET /api/cms/news
// @access  Public
export const getNewsSettings = async (req, res) => {
  try {
    const settings = await News.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching News settings', error: error.message });
  }
};

// @desc    Update News settings
// @route   PUT /api/cms/news
// @access  Private (Admin)
export const updateNewsSettings = async (req, res) => {
  try {
    const { subheading, heading, featuredArticle, sideArticles, showSubheading, showHeading, showSection } = req.body;
    const settings = await News.getSettings();

    if (subheading !== undefined) settings.subheading = subheading;
    if (heading !== undefined) settings.heading = heading;
    if (featuredArticle !== undefined) settings.featuredArticle = featuredArticle;
    if (sideArticles !== undefined) settings.sideArticles = sideArticles;
    if (showSubheading !== undefined) settings.showSubheading = showSubheading;
    if (showHeading !== undefined) settings.showHeading = showHeading;
    if (showSection !== undefined) settings.showSection = showSection;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating News settings', error: error.message });
  }
};

// @desc    Get Footer settings
// @route   GET /api/cms/footer
// @access  Public
export const getFooterSettings = async (req, res) => {
  try {
    const settings = await FooterModel.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching Footer settings', error: error.message });
  }
};

// @desc    Update Footer settings
// @route   PUT /api/cms/footer
// @access  Private (Admin)
export const updateFooterSettings = async (req, res) => {
  try {
    const { description, socialLinks, programs, quickLinks, contactInfo, copyrightText } = req.body;
    const settings = await FooterModel.getSettings();

    if (description !== undefined) settings.description = description;
    if (socialLinks !== undefined) settings.socialLinks = socialLinks;
    if (programs !== undefined) settings.programs = programs;
    if (quickLinks !== undefined) settings.quickLinks = quickLinks;
    if (contactInfo !== undefined) settings.contactInfo = contactInfo;
    if (copyrightText !== undefined) settings.copyrightText = copyrightText;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating Footer settings', error: error.message });
  }
};

// @desc    Get About Us Hero settings
export const getAboutUsHeroSettings = async (req, res) => {
  try {
    const settings = await AboutUsHero.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching About Us Hero settings', error: error.message });
  }
};

export const updateAboutUsHeroSettings = async (req, res) => {
  try {
    const { title, subtitle, backgroundImage } = req.body;
    const settings = await AboutUsHero.getSettings();
    if (title !== undefined) settings.title = title;
    if (subtitle !== undefined) settings.subtitle = subtitle;
    if (backgroundImage !== undefined) settings.backgroundImage = backgroundImage;
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating About Us Hero settings', error: error.message });
  }
};

// @desc    Get Vision Mission settings
export const getVisionMissionSettings = async (req, res) => {
  try {
    const settings = await VisionMission.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching Vision Mission settings', error: error.message });
  }
};

export const updateVisionMissionSettings = async (req, res) => {
  try {
    const { visionTitle, visionContent, visionImage, missionTitle, missionContent, missionImage } = req.body;
    const settings = await VisionMission.getSettings();
    if (visionTitle !== undefined) settings.visionTitle = visionTitle;
    if (visionContent !== undefined) settings.visionContent = visionContent;
    if (visionImage !== undefined) settings.visionImage = visionImage;
    if (missionTitle !== undefined) settings.missionTitle = missionTitle;
    if (missionContent !== undefined) settings.missionContent = missionContent;
    if (missionImage !== undefined) settings.missionImage = missionImage;
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating Vision Mission settings', error: error.message });
  }
};

// @desc    Get Leadership settings
export const getLeadershipSettings = async (req, res) => {
  try {
    const settings = await Leadership.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching Leadership settings', error: error.message });
  }
};

export const updateLeadershipSettings = async (req, res) => {
  try {
    const { leaders, subheading, heading, name, title, description, image, signatureImage, leader2Name, leader2Title, leader2Description, leader2Image } = req.body;
    const settings = await Leadership.getSettings();
    if (leaders !== undefined) {
      settings.leaders = leaders;
      settings.markModified('leaders');
      // Also sync first two entries to legacy fields if present
      if (leaders[0]) {
        if (leaders[0].subheading !== undefined) settings.subheading = leaders[0].subheading;
        if (leaders[0].name !== undefined) settings.name = leaders[0].name;
        if (leaders[0].title !== undefined) settings.title = leaders[0].title;
        if (leaders[0].description !== undefined) settings.description = leaders[0].description;
        if (leaders[0].image !== undefined) settings.image = leaders[0].image;
        if (leaders[0].signatureImage !== undefined) settings.signatureImage = leaders[0].signatureImage;
      }
      if (leaders[1]) {
        if (leaders[1].name !== undefined) settings.leader2Name = leaders[1].name;
        if (leaders[1].title !== undefined) settings.leader2Title = leaders[1].title;
        if (leaders[1].description !== undefined) settings.leader2Description = leaders[1].description;
        if (leaders[1].image !== undefined) settings.leader2Image = leaders[1].image;
      } else {
        settings.leader2Name = '';
        settings.leader2Title = '';
        settings.leader2Description = [];
        settings.leader2Image = '';
      }
    } else {
      if (subheading !== undefined) settings.subheading = subheading;
      if (heading !== undefined) settings.heading = heading;
      if (name !== undefined) settings.name = name;
      if (title !== undefined) settings.title = title;
      if (description !== undefined) settings.description = description;
      if (image !== undefined) settings.image = image;
      if (signatureImage !== undefined) settings.signatureImage = signatureImage;
      if (leader2Name !== undefined) settings.leader2Name = leader2Name;
      if (leader2Title !== undefined) settings.leader2Title = leader2Title;
      if (leader2Description !== undefined) settings.leader2Description = leader2Description;
      if (leader2Image !== undefined) settings.leader2Image = leader2Image;
    }
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating Leadership settings', error: error.message });
  }
};

// @desc    Get Legacy settings
export const getLegacySettings = async (req, res) => {
  try {
    const settings = await Legacy.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching Legacy settings', error: error.message });
  }
};

export const updateLegacySettings = async (req, res) => {
  try {
    const { subheading, heading, description, cards } = req.body;
    const settings = await Legacy.getSettings();
    if (subheading !== undefined) settings.subheading = subheading;
    if (heading !== undefined) settings.heading = heading;
    if (description !== undefined) settings.description = description;
    if (cards !== undefined) settings.cards = cards;
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating Legacy settings', error: error.message });
  }
};

// @desc    Get About Us Stats settings
export const getAboutUsStatsSettings = async (req, res) => {
  try {
    const settings = await AboutUsStats.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching About Us Stats settings', error: error.message });
  }
};

export const updateAboutUsStatsSettings = async (req, res) => {
  try {
    const { stats } = req.body;
    const settings = await AboutUsStats.getSettings();
    if (stats !== undefined) settings.stats = stats;
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating About Us Stats settings', error: error.message });
  }
};

// @desc    Get Advisory Board settings
export const getAdvisoryBoardSettings = async (req, res) => {
  try {
    const settings = await AdvisoryBoard.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching Advisory Board settings', error: error.message });
  }
};

export const updateAdvisoryBoardSettings = async (req, res) => {
  try {
    const { 
      heroHeading, heroSubtext, heroBgImage, 
      contentSubheading, contentHeading, contentDescription, 
      members 
    } = req.body;
    const settings = await AdvisoryBoard.getSettings();
    
    if (heroHeading !== undefined) settings.heroHeading = heroHeading;
    if (heroSubtext !== undefined) settings.heroSubtext = heroSubtext;
    if (heroBgImage !== undefined) settings.heroBgImage = heroBgImage;
    if (contentSubheading !== undefined) settings.contentSubheading = contentSubheading;
    if (contentHeading !== undefined) settings.contentHeading = contentHeading;
    if (contentDescription !== undefined) settings.contentDescription = contentDescription;
    if (members !== undefined) settings.members = members;
    
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating Advisory Board settings', error: error.message });
  }
};

// @desc    Get Governing Body settings
export const getGoverningBodySettings = async (req, res) => {
  try {
    const settings = await GoverningBody.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching Governing Body settings', error: error.message });
  }
};

export const updateGoverningBodySettings = async (req, res) => {
  try {
    const { 
      heroHeading, heroSubtext, heroBgImage, 
      contentSubheading, contentHeading, contentDescription, 
      members 
    } = req.body;
    const settings = await GoverningBody.getSettings();
    
    if (heroHeading !== undefined) settings.heroHeading = heroHeading;
    if (heroSubtext !== undefined) settings.heroSubtext = heroSubtext;
    if (heroBgImage !== undefined) settings.heroBgImage = heroBgImage;
    if (contentSubheading !== undefined) settings.contentSubheading = contentSubheading;
    if (contentHeading !== undefined) settings.contentHeading = contentHeading;
    if (contentDescription !== undefined) settings.contentDescription = contentDescription;
    if (members !== undefined) settings.members = members;
    
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating Governing Body settings', error: error.message });
  }
};

// @desc    Get About Us CTA settings
export const getAboutCtaSettings = async (req, res) => {
  try {
    const settings = await AboutCta.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching About Us CTA settings', error: error.message });
  }
};

// @desc    Update About Us CTA settings
export const updateAboutCtaSettings = async (req, res) => {
  try {
    const { heading, subtext, buttonText, buttonLink, backgroundColor } = req.body;
    const settings = await AboutCta.getSettings();
    
    if (heading !== undefined) settings.heading = heading;
    if (subtext !== undefined) settings.subtext = subtext;
    if (buttonText !== undefined) settings.buttonText = buttonText;
    if (buttonLink !== undefined) settings.buttonLink = buttonLink;
    if (backgroundColor !== undefined) settings.backgroundColor = backgroundColor;
    
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating About Us CTA settings', error: error.message });
  }
};

// @desc    Get Facilities Page settings
export const getFacilitiesPageSettings = async (req, res) => {
  try {
    const settings = await FacilitiesPage.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching Facilities Page settings', error: error.message });
  }
};

// @desc    Update Facilities Page settings
export const updateFacilitiesPageSettings = async (req, res) => {
  try {
    const { hero, institutionalResources, library, otherResources, clubs } = req.body;
    const settings = await FacilitiesPage.getSettings();
    
    if (hero !== undefined) settings.hero = hero;
    if (institutionalResources !== undefined) settings.institutionalResources = institutionalResources;
    if (library !== undefined) {
      settings.library = library;
      settings.markModified('library');
    }
    if (otherResources !== undefined) {
      settings.otherResources = otherResources;
      settings.markModified('otherResources');
    }
    if (clubs !== undefined) {
      settings.clubs = clubs;
      settings.markModified('clubs');
    }
    
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating Facilities Page settings', error: error.message });
  }
};

// @desc    Get Faculty settings
export const getFacultySettings = async (req, res) => {
  try {
    const settings = await Faculty.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching Faculty settings', error: error.message });
  }
};

export const updateFacultySettings = async (req, res) => {
  try {
    const { 
      heroHeading, heroSubtext, heroBgImage, 
      introSubheading, introHeading, introText, 
      ksbmFaculty, adjunctFaculty 
    } = req.body;
    const settings = await Faculty.getSettings();
    
    if (heroHeading !== undefined) settings.heroHeading = heroHeading;
    if (heroSubtext !== undefined) settings.heroSubtext = heroSubtext;
    if (heroBgImage !== undefined) settings.heroBgImage = heroBgImage;
    if (introSubheading !== undefined) settings.introSubheading = introSubheading;
    if (introHeading !== undefined) settings.introHeading = introHeading;
    if (introText !== undefined) settings.introText = introText;
    if (ksbmFaculty !== undefined) settings.ksbmFaculty = ksbmFaculty;
    if (adjunctFaculty !== undefined) settings.adjunctFaculty = adjunctFaculty;
    
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating Faculty settings', error: error.message });
  }
};

// @desc    Get Alumni Page settings
export const getAlumniPageSettings = async (req, res) => {
  try {
    const settings = await AlumniPage.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching Alumni Page settings', error: error.message });
  }
};

// @desc    Update Alumni Page settings
export const updateAlumniPageSettings = async (req, res) => {
  try {
    const { hero, legacy, events, notableAlumni, gallery, cta } = req.body;
    const settings = await AlumniPage.getSettings();

    if (hero !== undefined) settings.hero = hero;
    if (legacy !== undefined) settings.legacy = legacy;
    if (events !== undefined) settings.events = events;
    if (notableAlumni !== undefined) settings.notableAlumni = notableAlumni;
    if (gallery !== undefined) settings.gallery = gallery;
    if (cta !== undefined) settings.cta = cta;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating Alumni Page settings', error: error.message });
  }
};

// @desc    Get Management Desk settings
export const getManagementDeskSettings = async (req, res) => {
  try {
    const settings = await ManagementDesk.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching Management Desk settings', error: error.message });
  }
};

// @desc    Update Management Desk settings
export const updateManagementDeskSettings = async (req, res) => {
  try {
    const { showHero, heroHeading, heroSubtext, heroBgImage, showIntro, introSubheading, introHeading, introDescription, showMembers, members } = req.body;
    const settings = await ManagementDesk.getSettings();

    if (showHero !== undefined) settings.showHero = showHero;
    if (heroHeading !== undefined) settings.heroHeading = heroHeading;
    if (heroSubtext !== undefined) settings.heroSubtext = heroSubtext;
    if (heroBgImage !== undefined) settings.heroBgImage = heroBgImage;
    if (showIntro !== undefined) settings.showIntro = showIntro;
    if (introSubheading !== undefined) settings.introSubheading = introSubheading;
    if (introHeading !== undefined) settings.introHeading = introHeading;
    if (introDescription !== undefined) settings.introDescription = introDescription;
    if (showMembers !== undefined) settings.showMembers = showMembers;
    if (members !== undefined) settings.members = members;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating Management Desk settings', error: error.message });
  }
};

// @desc    Get MBA Page settings
export const getMbaPageSettings = async (req, res) => {
  try {
    const settings = await MbaPageSetting.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching MBA Page settings', error: error.message });
  }
};

// @desc    Update MBA Page settings
export const updateMbaPageSettings = async (req, res) => {
  try {
    const fields = [
      'shortTitle', 'title', 'heroTitleLine1', 'heroTitleLine2', 'description', 'heroImage',
      'heroPrimaryBtnText', 'heroSecondaryBtnText', 'heroCardTitle', 'heroCardStat1Title', 'heroCardStat1Sub', 'heroCardStat2Title', 'heroCardStat2Sub',
      'overviewTitle', 'overviewText', 'overviewSubtext', 'overviewImage',
      'overviewBadgeText', 'overviewFloatingBadgeText', 'overviewPrimaryBtnText', 'overviewSecondaryBtnText',
      'highlights', 'dimensions', 'internshipTitle', 'internshipDesc',
      'internshipBgImage', 'internshipBadge', 'internshipBtnText', 'internshipBtnLink', 'internshipImages',
      'eligibility', 'whyChoosePills', 'dynamicLearning', 'momentsGallery', 'academicCalendarBanner'
    ];
    const settings = await MbaPageSetting.getSettings();
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });
    if (req.body.academicCalendarBanner !== undefined) {
      settings.markModified('academicCalendarBanner');
    }
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating MBA Page settings', error: error.message });
  }
};

// @desc    Get BBA Page settings
export const getBbaPageSettings = async (req, res) => {
  try {
    const settings = await BbaPageSetting.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching BBA Page settings', error: error.message });
  }
};

// @desc    Update BBA Page settings
export const updateBbaPageSettings = async (req, res) => {
  try {
    const fields = [
      'shortTitle', 'title', 'heroTitleLine1', 'heroTitleLine2', 'description', 'heroImage',
      'heroPrimaryBtnText', 'heroSecondaryBtnText', 'heroCardTitle', 'heroCardStat1Title', 'heroCardStat1Sub', 'heroCardStat2Title', 'heroCardStat2Sub',
      'overviewTitle', 'overviewText', 'overviewSubtext', 'overviewImage',
      'overviewBadgeText', 'overviewFloatingBadgeText', 'overviewPrimaryBtnText', 'overviewSecondaryBtnText',
      'highlights', 'dimensions', 'internshipTitle', 'internshipDesc',
      'internshipBgImage', 'internshipBadge', 'internshipBtnText', 'internshipBtnLink', 'internshipImages',
      'eligibility', 'whyChoosePills', 'dynamicLearning', 'momentsGallery', 'academicCalendarBanner'
    ];
    const settings = await BbaPageSetting.getSettings();
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });
    if (req.body.academicCalendarBanner !== undefined) {
      settings.markModified('academicCalendarBanner');
    }
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating BBA Page settings', error: error.message });
  }
};

// @desc    Get Examinations Page settings
// @route   GET /api/cms/examinations-page
// @access  Public
export const getExaminationsPageSettings = async (req, res) => {
  try {
    const settings = await ExaminationsPage.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching Examinations Page settings', error: error.message });
  }
};

// @desc    Update Examinations Page settings
// @route   PUT /api/cms/examinations-page
// @access  Private/Admin
export const updateExaminationsPageSettings = async (req, res) => {
  try {
    const fields = [
      'heroBadgeText', 'heroTitle', 'heroSubtitle', 'heroImage',
      'overviewTitle', 'overviewText1', 'overviewText2', 'overviewImage',
      'calendarTitle', 'calendarText', 'calendarViewBtnText', 'calendarViewBtnUrl', 'calendarDownloadBtnText', 'calendarDownloadBtnUrl', 'calendarImage',
      'notifications', 'results'
    ];
    const settings = await ExaminationsPage.getSettings();
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating Examinations Page settings', error: error.message });
  }
};

// @desc    Get Admissions Page settings
// @route   GET /api/cms/admissions-page
// @access  Public
export const getAdmissionsPageSettings = async (req, res) => {
  try {
    const settings = await AdmissionsPage.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching Admissions Page settings', error: error.message });
  }
};

// @desc    Update Admissions Page settings
// @route   PUT /api/cms/admissions-page
// @access  Private/Admin
export const updateAdmissionsPageSettings = async (req, res) => {
  try {
    const fields = [
      'heroBadgeText', 'heroTitle', 'heroSubtitle', 'heroApplyBtnText', 'heroApplyBtnUrl', 'heroBrochureBtnText', 'heroBrochureBtnUrl', 'heroBgImage', 'heroStats',
      'eliteHeading', 'eliteSubtitle', 'eliteDesc', 'eliteImage', 'eliteAdvantages',
      'journeyHeading', 'journeySubtitle', 'journeySteps',
      'eligibilityHeading', 'eligibilitySubtitle', 'feeStructure', 'mba', 'bba',
      'ctaHeading', 'ctaDesc', 'ctaApplyBtnText', 'ctaApplyBtnUrl', 'ctaEnquiryBtnText', 'ctaEnquiryBtnUrl', 'ctaImage',
      'faqHeading', 'faqs'
    ];
    const settings = await AdmissionsPage.getSettings();
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });
    settings.markModified('feeStructure');
    settings.markModified('mba');
    settings.markModified('bba');
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating Admissions Page settings', error: error.message });
  }
};