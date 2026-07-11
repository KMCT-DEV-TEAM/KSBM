import Header from './header.model.js';
import About from './about.model.js';
import Hero from './hero.model.js';
import Programs from './programs.model.js';
import Accreditation from './accreditation.model.js';
import Facilities from './facilities.model.js';
import Management from './management.model.js';
import Placement from './placement.model.js';
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
    const { pillText, headingLine1, headingLine2, description, primaryButton, secondaryButton, bannerImages } = req.body;

    const settings = await Hero.getSettings();

    if (pillText !== undefined) settings.pillText = pillText;
    if (headingLine1 !== undefined) settings.headingLine1 = headingLine1;
    if (headingLine2 !== undefined) settings.headingLine2 = headingLine2;
    if (description !== undefined) settings.description = description;
    if (primaryButton !== undefined) settings.primaryButton = primaryButton;
    if (secondaryButton !== undefined) settings.secondaryButton = secondaryButton;
    if (bannerImages !== undefined) settings.bannerImages = bannerImages;

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