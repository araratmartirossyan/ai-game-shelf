export const SEARCH_CONFIG = {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "description", weight: 0.15 },
    { name: "category", weight: 0.1 },
    { name: "genre", weight: 0.1 },
    { name: "platform", weight: 0.1 },
    { name: "year", weight: 0.05 },
  ],
  threshold: 0.3,
  includeScore: true,
};
