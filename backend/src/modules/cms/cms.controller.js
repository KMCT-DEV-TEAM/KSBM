import Header from './header.model.js';
import Hero from './hero.model.js';

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
    res.status(500).json({ message: 'Server error updating hero settings', error: error.message });
  }
};
