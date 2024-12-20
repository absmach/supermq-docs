import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'SuperMQ',
  favicon: 'img/favicon.png',

  url: 'https://docs.supermq.abstractmachines.fr',
  baseUrl: '/',

  organizationName: 'absmach',
  projectName: 'supermq',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: 'sidebars.ts',
          editUrl:
            'https://github.com/absmach/supermq-docs/blob/main',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/absmach/supermq-docs/blob/main',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
          blogSidebarTitle: 'All Blog Posts',
          blogSidebarCount: 'ALL',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    'docusaurus-plugin-drawio',
  ],
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    navbar: {
      logo: {
        alt: 'SuperMQ Logo',
        srcDark: 'img/logo-dark.png',
        src: 'img/logo-light1.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'smqSidebar',
          position: 'left',
          label: 'Docs',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/absmach/supermq',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Overview',
              to: '/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/absmach/supermq',
            },
            {
              label: 'Gitter',
              href: 'https://app.gitter.im/#/room/#absmach_supermq:gitter.im?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge',
            },
            {
              label: 'Google Group',
              href: 'https://groups.google.com/forum/#!forum/mainflux',
            },
            {
              label: 'Twitter',
              href: 'hhttps://twitter.com/absmach',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
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
      fontFamily: 'Inter, sans-serif',
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
