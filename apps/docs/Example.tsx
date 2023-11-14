import {
  SandpackProvider,
  useActiveCode,
  SandpackLayout,
  SandpackStack,
  useSandpack,
  SandpackPreview,
  Sandpack,
  OpenInCodeSandboxButton,
} from "@codesandbox/sandpack-react";

import Editor from "@monaco-editor/react";

function MonacoEditor() {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();

  return (
    <SandpackStack>
      <div
        style={{
          flex: 1,
          paddingTop: 8,
          background: "#1e1e1e",
          borderRadius: 4,
        }}
      >
        <Editor
          width="100%"
          options={{
            minimap: { enabled: false },
            scrollbar: { vertical: "hidden" },
            lineNumbers: "off",
          }}
          height="50%"
          language={"typescript"}
          theme="vs-dark"
          key={sandpack.activeFile}
          defaultValue={code}
          onChange={(value) => updateCode(value || "")}
        />
      </div>
    </SandpackStack>
  );
}

// export const Example = () => {
//   return (
//     <SandpackProvider
//       template="react-ts"
//       customSetup={{
//         dependencies: {
//           "@bryx-inc/ts-utils": "latest",
//         }
//       }}
//     >
//       <SandpackLayout
//         theme="dark"
//         style={{ border: "none", borderRadius: "4px" }}
//       >
//         <MonacoEditor />
//         <SandpackPreview />
//       </SandpackLayout>
//     </SandpackProvider>
//   );
// };

export const Example = (props: { code: string }) => {
  const files = {
    "index.ts": props.code
  };

  return (
    <Sandpack
      files={files}
      theme="auto"
      template="vanilla-ts"
      options={{
        layout: "console",
        wrapContent: true,
        autorun: false,
        showRefreshButton: true,
      }}
      customSetup={{
        dependencies: {
          "@bryx-inc/ts-utils": "latest",
        },
      }}
    />
  );
};
