const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push(
  // Adds support for `.cjs` files for Google Firebase
  'cjs', 
  // Adds support for `.db` files for SQLite databases
  'db',
);

module.exports = config;
