module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0],
    'body-max-line-length': [1, 'always', 200],
    'header-max-length': [2, 'always', 120],
  },
};
