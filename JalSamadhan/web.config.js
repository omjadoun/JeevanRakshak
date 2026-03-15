const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure for web platform
config.resolver.platforms = ['web'];
config.resolver.assetExts.push('svg');

module.exports = config;
