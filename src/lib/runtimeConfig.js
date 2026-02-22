const browserConfig = typeof window !== 'undefined' ? window.__SHOWCASE_CONFIG__ || {} : {};

function readNodeEnv(name) {
  if (typeof process !== 'undefined' && process.env && process.env[name]) {
    return process.env[name];
  }
  return undefined;
}

export function getConfig(key, fallback) {
  return browserConfig[key] || readNodeEnv(key) || fallback;
}
