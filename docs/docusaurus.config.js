// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// /** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'iCare',
  // tagline: 'We Care',
  url: 'http://icare.dhis2.udsm.ac.tz/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'UDSM-DHIS2', // Usually your GitHub org/user name.
  projectName: 'iCARE', // Usually your repo name.

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/edit/main/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/main/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'ICARE',
        logo: {
          alt: 'My Site Logo',
          src: 'img/icare.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'iCare',
            position: 'left',
            label: 'Documentation',
          },
          // This will be enabled when a full content of about us is already prepared and well designed
          {to: '/blog', label: 'About Us', position: 'left'},
          {
            href: 'http://icare.dhis2.udsm.ac.tz/',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          // {e 4,
          //   title: 'Docs',
          //   items: [
          //     {
          //       label: 'Tutorial',
          //       to: '/docs/intro',
          //     },
          //   ],
          // },

        ],
        copyright: `Copyright © ${new Date().getFullYear()} UDSM-DHIS2`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
