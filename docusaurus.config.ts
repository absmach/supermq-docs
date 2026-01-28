import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "SuperMQ",
  favicon: "img/favicon.png",

  url: "https://docs.supermq.abstractmachines.fr",
  baseUrl: "/",

  organizationName: "absmach",
  projectName: "supermq",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "sidebars.ts",
          editUrl: "https://github.com/absmach/supermq-docs/blob/main",
        },
        theme: {
          customCss: "./static/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: ["docusaurus-plugin-drawio"],
  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],

  themeConfig: {
    navbar: {
      logo: {
        alt: "SuperMQ Logo",
        srcDark: "img/logo-dark.png",
        src: "img/logo-light1.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "smqSidebar",
          position: "left",
          label: "Docs",
        },
        {
          href: "https://github.com/absmach/supermq",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Overview",
              to: "/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/absmach/supermq",
            },
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/company/abstract-machines",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/absmach",
            },
            {
              label: "Matrix",
              href: "https://matrix.to/#/#supermq:matrix.org",
            },

            {
              label: "YouTube",
              href: "https://www.youtube.com/@absmach",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              href: "https://absmach.eu/blog",
            },
            {
              label: "Website",
              href: "https://absmach.eu/supermq",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Abstract Machines.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    typography: {
      fontFamily: "Inter, sans-serif",
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
