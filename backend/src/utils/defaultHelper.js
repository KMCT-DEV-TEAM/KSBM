import { defaultCmsData } from '../seeds/defaultCmsData.js';

/**
 * Helper to get default CMS data for any collection / key
 * @param {string} key
 * @returns {object}
 */
export const getDefaultCms = (key) => {
  return defaultCmsData[key] || {};
};

export { defaultCmsData };
export default defaultCmsData;
