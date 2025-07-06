import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'SurfAI Docs',
  tagline: 'The official documentation for SurfAI Project.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://surfai.github.io', // Your actual docs site URL
  baseUrl: '/surfai-docs/', // Should match your repo name if deploying to GitHub Pages

  organizationName: 'jaytsol', // Replace with your GitHub username
  projectName: 'surfai-docs', // Your repo name

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/jaytsol/comfy-surfai/tree/main/surfai-docs/website/',
        },
        blog: false, // Disable the blog plugin
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'SurfAI Documentation',
      logo: {
        alt: 'SurfAI Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/jaytsol/comfy-surfai',
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
              to: '/docs/OVERVIEW',
            },
            {
              label: 'Architecture',
              to: '/docs/ARCHITECTURE',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/jaytsol/comfy-surfai',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} SurfAI Project. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;