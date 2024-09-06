module.exports = {
  env: {
    SERVICE_WORKER_REGISTER_AUTOMATICALLY: true,
    TRANSLATIONS_ENABLED: false,
    PREFETCHING_STRATEGY: "link",
    ERROR_OVERLAY: true,
    VERBOSE: false,
  },
  plugins: {},
  breakpoints: [
    { name: "xs", maxWidth: 600 },
    { name: "sm", maxWidth: 900 },
    { name: "md", maxWidth: 1200 },
    { name: "lg", maxWidth: 1536 },
    { name: "xl", maxWidth: undefined },
  ],
}
