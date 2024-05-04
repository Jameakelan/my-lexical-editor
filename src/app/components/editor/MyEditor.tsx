import { LexicalComposer } from "@lexical/react/LexicalComposer";
import * as React from "react";
import lexicalConfig from "./config/lexical.config";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./plugin/ToolbarPlugin/ToolbarPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import TreeViewPlugin from "./plugin/TreeViewPlugin/TreeViewPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { MATCHERS } from "./utils/matchersLink";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState, LexicalEditor } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import YouTubePlugin from "./plugin/YoutubePlugin/YoutubePlugin";

export interface IMyEditorProps {}

export default function MyEditor(props: IMyEditorProps) {
  const [content, setContent] = React.useState("");
  return (
    <>
      <LexicalComposer initialConfig={lexicalConfig}>
        <ToolbarPlugin />
        <div className=" relative m-3">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className=" border-2 rounded-2xl min-h-[450px] editor-input" />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <TreeViewPlugin />
          <LinkPlugin />
          <ListPlugin />
          <AutoLinkPlugin matchers={MATCHERS} />
          <YouTubePlugin />
        </div>
      </LexicalComposer>
      {/* <div dangerouslySetInnerHTML={{ __html: content }}></div> */}
    </>
  );

  function Placeholder() {
    return (
      <>
        <div className=" absolute top-5 left-2 text-gray-300 ">
          Enter text here
        </div>
      </>
    );
  }

  function onChange(editorState: EditorState, editor: LexicalEditor) {
    editor.update(() => {
      const raw = $generateHtmlFromNodes(editor, null);
      // setContent(raw);
    });
  }
}
