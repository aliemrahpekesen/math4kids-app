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
      default: 'space',
      values: [
        { name: 'space', value: '#0b1437' },
        { name: 'light', value: '#f8fafc' },
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
    theme: {
      description: 'Active theme',
      defaultValue: 'space',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'space', title: 'Uzay' },
          { value: 'jungle', title: 'Orman (preview)' },
          { value: 'ocean', title: 'Okyanus (preview)' },
          { value: 'candy', title: 'Şeker (preview)' },
        ],
      },
    },
  },
};

export default preview;
