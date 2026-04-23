// All GROQ queries live here. Pages must never inline GROQ — they import from this module
// and pass params through lib/sanity/fetch helpers once those exist.

export const globalSettingsQuery = /* groq */ `
  *[_type == "globalSettings"][0]
`;

// ─── Singleton pages ────────────────────────────────────────────
export const homePageQuery = /* groq */ `
  *[_type == "homePage"][0]
`;

export const aboutPageQuery = /* groq */ `
  *[_type == "aboutPage"][0]
`;

export const contactPageQuery = /* groq */ `
  *[_type == "contactPage"][0]
`;

export const workIndexPageQuery = /* groq */ `
  *[_type == "workIndexPage"][0]
`;

export const blogIndexPageQuery = /* groq */ `
  *[_type == "blogIndexPage"][0]
`;

export const thankYouPageQuery = /* groq */ `
  *[_type == "thankYouPage"][0]
`;

// ─── Services ──────────────────────────────────────────────────
export const serviceBySlugQuery = /* groq */ `
  *[_type == "service" && slug.current == $slug][0]
`;

export const allServiceSlugsQuery = /* groq */ `
  *[_type == "service"].slug.current
`;

// ─── Case studies ──────────────────────────────────────────────
export const caseStudyBySlugQuery = /* groq */ `
  *[_type == "caseStudy" && slug.current == $slug][0]
`;

export const allCaseStudySlugsQuery = /* groq */ `
  *[_type == "caseStudy"].slug.current
`;

export const latestCaseStudiesQuery = /* groq */ `
  *[_type == "caseStudy"] | order(publishedAt desc) [0...$limit]
`;

// ─── Blog ──────────────────────────────────────────────────────
export const blogPostBySlugQuery = /* groq */ `
  *[_type == "blogPost" && slug.current == $slug][0]
`;

export const allBlogPostSlugsQuery = /* groq */ `
  *[_type == "blogPost"].slug.current
`;

export const latestBlogPostsQuery = /* groq */ `
  *[_type == "blogPost"] | order(publishedAt desc) [0...$limit]
`;

export const blogPostsByCategoryQuery = /* groq */ `
  *[_type == "blogPost" && $category in categories[]->slug.current] | order(publishedAt desc)
`;

export const allBlogCategorySlugsQuery = /* groq */ `
  *[_type == "blogCategory"].slug.current
`;

// ─── Legal ─────────────────────────────────────────────────────
export const legalPageBySlugQuery = /* groq */ `
  *[_type == "legalPage" && slug.current == $slug][0]
`;
