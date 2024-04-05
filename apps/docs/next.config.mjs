import codesandbox from "remark-codesandbox";
import nextra from "nextra";

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
  mdxOptions: {
    remarkPlugins: [
      [
        codesandbox,
        {
          mode: "button",
          query: {
            file: "/src/demo.ts",
          },
          customTemplates: {
            tsly: { extends: "tsly-2cvl39", entry: "src/demo.ts" },
          },
        },
      ],
    ],
  },
});

export default withNextra();
