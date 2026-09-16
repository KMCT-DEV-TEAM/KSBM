import {
  DEFAULT_HERO,
  DEFAULT_ABOUT,
  DEFAULT_ABOUT_US_HERO,
  DEFAULT_ABOUT_US_STATS,
  DEFAULT_ABOUT_CTA,
  DEFAULT_VISION_MISSION,
  DEFAULT_LEADERSHIP,
  DEFAULT_LEGACY,
  DEFAULT_MANAGEMENT,
  DEFAULT_MANAGEMENT_DESK,
  DEFAULT_GOVERNING_BODY,
  DEFAULT_ADVISORY_BOARD,
  DEFAULT_PROGRAMS,
  DEFAULT_MBA_PAGE,
  DEFAULT_BBA_PAGE,
  DEFAULT_ADMISSIONS_PAGE,
  DEFAULT_PLACEMENT_HOME,
  DEFAULT_PLACEMENT_PAGE,
  DEFAULT_FACILITIES_HOME,
  DEFAULT_FACILITIES_PAGE,
  DEFAULT_FACULTIES,
  DEFAULT_EVENTS_PAGE,
  DEFAULT_BLOGS_PAGE,
  DEFAULT_GALLERY_PAGE,
  DEFAULT_ALUMNI_PAGE,
  DEFAULT_LIFE_AT_KSBM,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_RECRUITERS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_NEWS,
  DEFAULT_ACCREDITATIONS,
  DEFAULT_COMMITTEES_AND_CELLS,
  DEFAULT_DOWNLOAD_PAGE,
  DEFAULT_EXAMINATIONS_PAGE,
  DEFAULT_FAQ_PAGE,
  DEFAULT_CONTACT_PAGE,
  DEFAULT_GRIEVANCE_PAGE,
  DEFAULT_PRIVACY_POLICY,
  DEFAULT_TERMS_AND_CONDITIONS,
  DEFAULT_HEADER,
  DEFAULT_FOOTER,
  DEFAULT_MANDATORY_DISCLOSURE,
  DEFAULT_ORGANOGRAM
} from '../features/admin/cms/constants/defaultCmsData';

export const DEFAULT_GLOBAL_BUTTONS = [
  { identifier: 'global_apply', label: 'Apply Now', link: '/admissions', isExternal: false, isActive: true },
  { identifier: 'hero_brochure', label: 'Download Brochure', link: '/download', isExternal: false, isActive: true }
];

export const DEFAULT_SEO = {
  metaTitle: 'KMCT School of Business Management (KSBM) | Empowering Future Business Leaders',
  metaDescription: 'KMCT School of Business Management (KSBM) offers top-ranked MBA & BBA programs, experiential learning, robust industry connections, and high-impact corporate placements.',
  ogTitle: 'KMCT School of Business Management (KSBM)',
  ogDescription: 'Transforming potential into leadership through premier management education, visionary faculty, and modern campus infrastructure.',
  keywords: 'KMCT, KSBM, MBA Kerala, BBA College, Business School, Management Institute Calicut, Best MBA College'
};

const routeMap = {
  // Navigation & Globals
  'header': DEFAULT_HEADER,
  'footer': DEFAULT_FOOTER,
  'global-buttons': DEFAULT_GLOBAL_BUTTONS,
  
  // Home Page sections
  'hero': DEFAULT_HERO,
  'about': DEFAULT_ABOUT,
  'programs': DEFAULT_PROGRAMS,
  'accreditation': DEFAULT_ACCREDITATIONS,
  'accreditations': DEFAULT_ACCREDITATIONS,
  'management': DEFAULT_MANAGEMENT,
  'facilities': DEFAULT_FACILITIES_HOME,
  'placement': DEFAULT_PLACEMENT_HOME,
  'testimonials': DEFAULT_TESTIMONIALS,
  'achievements': DEFAULT_ACHIEVEMENTS,
  'recruiters': DEFAULT_RECRUITERS,
  'life-at-ksbm': DEFAULT_LIFE_AT_KSBM,
  'life': DEFAULT_LIFE_AT_KSBM,
  'news': DEFAULT_NEWS,

  // About Us Page sections
  'about-us-hero': DEFAULT_ABOUT_US_HERO,
  'vision-mission': DEFAULT_VISION_MISSION,
  'leadership': DEFAULT_LEADERSHIP,
  'legacy': DEFAULT_LEGACY,
  'about-us-stats': DEFAULT_ABOUT_US_STATS,
  'about-us-cta': DEFAULT_ABOUT_CTA,
  'about-cta': DEFAULT_ABOUT_CTA,
  'advisory-board': DEFAULT_ADVISORY_BOARD,
  'governing-body': DEFAULT_GOVERNING_BODY,
  'management-desk': DEFAULT_MANAGEMENT_DESK,

  // Dedicated Pages
  'facilities-page': DEFAULT_FACILITIES_PAGE,
  'faculty': DEFAULT_FACULTIES,
  'alumni-page': DEFAULT_ALUMNI_PAGE,
  'mba-page': DEFAULT_MBA_PAGE,
  'bba-page': DEFAULT_BBA_PAGE,
  'examinations': DEFAULT_EXAMINATIONS_PAGE,
  'examinations-page': DEFAULT_EXAMINATIONS_PAGE,
  'admissions': DEFAULT_ADMISSIONS_PAGE,
  'admissions-page': DEFAULT_ADMISSIONS_PAGE,
  'placement-page': DEFAULT_PLACEMENT_PAGE,
  'contact-page': DEFAULT_CONTACT_PAGE,
  'privacy-policy': DEFAULT_PRIVACY_POLICY,
  'terms-and-conditions': DEFAULT_TERMS_AND_CONDITIONS,
  'faq': DEFAULT_FAQ_PAGE,
  'faq-page': DEFAULT_FAQ_PAGE,
  'gallery-page': DEFAULT_GALLERY_PAGE,
  'gallery': DEFAULT_GALLERY_PAGE,
  'events-page': DEFAULT_EVENTS_PAGE,
  'events': DEFAULT_EVENTS_PAGE,
  'blogs-page': DEFAULT_BLOGS_PAGE,
  'blogs': DEFAULT_BLOGS_PAGE,
  'grievance-page': DEFAULT_GRIEVANCE_PAGE,
  'grievance': DEFAULT_GRIEVANCE_PAGE,
  'download-page': DEFAULT_DOWNLOAD_PAGE,
  'download': DEFAULT_DOWNLOAD_PAGE,
  'committees-and-cells': DEFAULT_COMMITTEES_AND_CELLS,

  // PDF Compliance Documents
  'mandatory-disclosure/default': DEFAULT_MANDATORY_DISCLOSURE,
  'mandatory-disclosure': [DEFAULT_MANDATORY_DISCLOSURE],
  'organogram/default': DEFAULT_ORGANOGRAM,
  'organogram': [DEFAULT_ORGANOGRAM]
};

/**
 * Resolves a requested API endpoint URL to its canonical default fallback data.
 * @param {string} url - The URL of the requested endpoint.
 * @returns {object|null} - A deep-cloned fallback data object or null if not a CMS route.
 */
export const getCmsFallbackData = (url) => {
  if (!url) return null;

  // Clean URL: Strip protocol/domain, query parameters, leading/trailing slashes, and common prefixes (/api/cms/ or /cms/)
  let cleanPath = url.split('?')[0].split('#')[0];
  cleanPath = cleanPath.replace(/^https?:\/\/[^\/]+/, '');
  cleanPath = cleanPath.replace(/^\/api\//, '/');
  
  if (!cleanPath.startsWith('/cms/')) {
    return null;
  }

  const cmsEndpoint = cleanPath.replace(/^\/cms\//, '').trim();

  // 1. Direct match in routeMap
  if (routeMap[cmsEndpoint] !== undefined) {
    return JSON.parse(JSON.stringify(routeMap[cmsEndpoint]));
  }

  // 2. Check for dynamic SEO route: seo/:pageIdentifier
  if (cmsEndpoint.startsWith('seo/')) {
    const pageId = cmsEndpoint.replace(/^seo\//, '');
    return {
      ...JSON.parse(JSON.stringify(DEFAULT_SEO)),
      pageIdentifier: pageId
    };
  }

  // 3. Dynamic blog detail route: blogs-page/:id or blogs/:id
  if (cmsEndpoint.startsWith('blogs-page/') || cmsEndpoint.startsWith('blogs/')) {
    const blogId = cmsEndpoint.split('/')[1];
    const allBlogs = [
      ...(DEFAULT_BLOGS_PAGE.blogs || []),
      ...(DEFAULT_BLOGS_PAGE.recentPosts || []),
      DEFAULT_BLOGS_PAGE.featuredBlog
    ].filter(Boolean);

    const found = allBlogs.find(b => String(b._id) === String(blogId) || String(b.id) === String(blogId) || b.slug === blogId);
    return JSON.parse(JSON.stringify(found || DEFAULT_BLOGS_PAGE.featuredBlog || allBlogs[0] || {}));
  }

  // 4. Dynamic event detail route: events-page/:id or events/:id
  if (cmsEndpoint.startsWith('events-page/') || cmsEndpoint.startsWith('events/')) {
    const eventId = cmsEndpoint.split('/')[1];
    const allEvents = [
      ...(DEFAULT_EVENTS_PAGE.upcomingEvents || []),
      ...(DEFAULT_EVENTS_PAGE.pastEvents || []),
      ...(DEFAULT_EVENTS_PAGE.featuredEvents || [])
    ];
    const found = allEvents.find(e => String(e._id) === String(eventId) || String(e.id) === String(eventId));
    return JSON.parse(JSON.stringify(found || allEvents[0] || {}));
  }

  // 5. Dynamic club detail route: facilities/clubs/:clubId
  if (cmsEndpoint.includes('clubs/')) {
    const clubId = cmsEndpoint.split('clubs/')[1];
    const clubs = DEFAULT_FACILITIES_PAGE?.clubs?.items || [];
    const found = clubs.find(c => String(c._id) === String(clubId) || c.slug === clubId);
    return JSON.parse(JSON.stringify(found || clubs[0] || {}));
  }

  return null;
};

export default getCmsFallbackData;
