export type SkillGroup = {
  label: string;
  items: string[];
};

/** Source of truth for both the static chip fallback and the 3D chips. */
export const skillGroups: SkillGroup[] = [
  {
    label: "Research",
    items: [
      "User interviews",
      "Moderated usability testing",
      "A/B & first-click testing",
      "Heuristic evaluation",
      "Journey mapping",
      "Personas",
      "Competitive analysis",
    ],
  },
  {
    label: "Design",
    items: [
      "Interaction design",
      "Visual design",
      "Information architecture",
      "Wireframing to hi-fi prototyping",
      "Design systems & tokens",
      "Figma Auto Layout & variables",
      "Typography & color theory",
      "Motion design",
    ],
  },
  {
    label: "Build",
    items: [
      "HTML / CSS / JS",
      "React & Material UI",
      "Webflow & Framer",
      "Accessibility (WCAG 2.1 AA)",
      "Design-to-dev handoff",
    ],
  },
];
