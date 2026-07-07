import Header from './header.model.js';
import About from './about.model.js';

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
  }
};
