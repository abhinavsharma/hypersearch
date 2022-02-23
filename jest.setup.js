Object.assign(global, require('jest-chrome'));
global.fetch = jest.fn(() => Promise.resolve({
  json: async () => {},
}));