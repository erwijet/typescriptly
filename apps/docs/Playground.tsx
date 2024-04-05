// import { getParameters } from "codesandbox/lib/api/define";
// import { Button } from "nextra/components";
// import { CodesandboxIcon } from "lucide-react";

// export const OpenPlayground = (props: { code: string }) => {
//   const parameters = getParameters({
//     files: {
//       "index.ts": {
//         isBinary: false,
//         content: `import './prelude.ts';\n` + props.code,
//       },
//       "prelude.ts": {
//         isBinary: false,
//         content: "console.log = alert.bind(); // make logs visible, otherwise they would be written to devtools\n\nexport {};"
//       },
//       "package.json": {
//         isBinary: false,
//         content: JSON.stringify({
//           dependencies: {
//             "@tsly/arr": "latest",
//             "@tsly/core": "latest",
//             "@tsly/deep": "latest",
//             "@tsly/hooks": "latest",
//             "@tsly/iter": "latest",
//             "@tsly/maybe": "latest",
//             "@tsly/obj": "latest",
//           },
//         }),
//       },
//       "tsconfig.json": {
//         isBinary: false,
//         content: JSON.stringify({
//           $schema: "https://json.schemastore.org/tsconfig",
//           display: "Default",
//           compilerOptions: {
//             composite: false,
//             declaration: true,
//             declarationMap: true,
//             esModuleInterop: true,
//             forceConsistentCasingInFileNames: true,
//             inlineSources: false,
//             isolatedModules: true,
//             moduleResolution: "node",
//             noUnusedLocals: false,
//             noUnusedParameters: false,
//             preserveWatchOutput: true,
//             skipLibCheck: true,
//             strict: true,
//             strictNullChecks: true,
//           },
//           exclude: ["node_modules"],
//         }),
//       },
//     },
//   });

//   const url = `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}&query=file=%2Findex.ts`;

//   return (
//     <Button
//       onClick={() => (window.location.href = url)}
//       style={{ display: "flex", gap: "4px", marginLeft: "auto" }}
//     >
//       <CodesandboxIcon />
//       Open Playground
//     </Button>
//   );
// };

export const OpenPlayground = (props: { code: string }) => {
  return <button>PLACEHOLDER</button>
}