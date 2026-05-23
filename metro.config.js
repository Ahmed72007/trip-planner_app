const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// This line is the magic fix for the 'import.meta' error.
// It forces the bundler to use stable versions of libraries like Zustand.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;