export default {
  logo: <span>Typescriptly</span>,
  project: {
    link: "https://github.com/bryx-inc/typescriptly",
  },
  docsRepositoryBase: "https://github.com/bryx-inc/typescriptly/tree/main/docs",
  useNextSeoProps() {
    return {
      titleTemplate: "%s - Typescriptly",
    };
  },
  // ... other theme options
};
