import { getParameters } from "codesandbox/lib/api/define";
import { Button } from "nextra/components";
import { CodesandboxIcon } from "lucide-react";

export const OpenPlayground = (props: { code: string }) => {
  const parameters = getParameters({
    files: {
      "index.ts": {
        isBinary: false,
        content: props.code,
      },
        "package.json": {
        isBinary: false,
        content: JSON.stringify({
          dependencies: {
            "@typescriptly/arr": "latest",
            "@typescriptly/core": "latest",
            "@typescriptly/deep": "latest",
            "@typescriptly/hooks": "latest",
            "@typescriptly/iter": "latest",
            "@typescriptly/maybe": "latest",
            "@typescriptly/obj": "latest",
          },
        }),
      },
      "tsconfig.json": {
        isBinary: false,
        content: JSON.stringify({
          $schema: "https://json.schemastore.org/tsconfig",
          display: "Default",
          compilerOptions: {
            composite: false,
            declaration: true,
            declarationMap: true,
            esModuleInterop: true,
            forceConsistentCasingInFileNames: true,
            inlineSources: false,
            isolatedModules: true,
            moduleResolution: "node",
            noUnusedLocals: false,
            noUnusedParameters: false,
            preserveWatchOutput: true,
            skipLibCheck: true,
            strict: true,
            strictNullChecks: true,
          },
          exclude: ["node_modules"]
        }),
      },
    },
  });

  const url = `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`;

  return (
    <Button
      onClick={() => (window.location.href = url)}
      style={{ display: "flex", gap: "4px", marginLeft: "auto" }}
    >
      <CodesandboxIcon />
      Open Playground
    </Button>
  );
};
