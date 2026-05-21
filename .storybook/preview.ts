import type { Preview } from '@storybook/react-vite';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f8fafc' },
        { name: 'dark', value: '#0b1437' },
      ],
    },
    a11y: {
      element: '#storybook-root',
      manual: false,
    },
  },
  globalTypes: {
    locale: {
      description: 'i18n locale',
      defaultValue: 'tr',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [
          { value: 'tr', title: 'Türkçe' },
          { value: 'en', title: 'English' },
          { value: 'de', title: 'Deutsch' },
        ],
      },
    },
  },
};

export default preview;
