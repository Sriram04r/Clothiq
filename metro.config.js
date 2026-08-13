const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ignore the React web app folder so it doesn't collide with React Native haste map
config.resolver.blockList = [
  /admin-dashboard\/.*/,
];

module.exports = config;
