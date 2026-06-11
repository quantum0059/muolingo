const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

/**
 * Stream Video packages ship a "react-native" field that points at TypeScript
 * source. Metro can fail to resolve nested .ts hooks on Android, so force the
 * compiled dist entry points instead.
 */
const streamPackageEntries = {
  "@stream-io/video-react-native-sdk": path.resolve(
    __dirname,
    "node_modules/@stream-io/video-react-native-sdk/dist/module/index.js",
  ),
  "@stream-io/react-native-webrtc": path.resolve(
    __dirname,
    "node_modules/@stream-io/react-native-webrtc/lib/module/index.js",
  ),
};

const configWithNativewind = withNativewind(config);
const originalResolveRequest = configWithNativewind.resolver.resolveRequest;

configWithNativewind.resolver.resolveRequest = (
  context,
  moduleName,
  platform,
) => {
  const streamEntry = streamPackageEntries[moduleName];
  if (streamEntry) {
    return context.resolveRequest(context, streamEntry, platform);
  }

  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = configWithNativewind;
