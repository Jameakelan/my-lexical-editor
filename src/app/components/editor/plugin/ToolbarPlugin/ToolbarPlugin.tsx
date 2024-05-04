import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import * as React from "react";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import getSelectedNode from "../../utils/getSelectedNode";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import FloatingLinkEditor from "../../components/FloatingLinkEditor";
import { createPortal } from "react-dom";

export interface IToolbarPluginProps {}

export default function ToolbarPlugin(props: IToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const [isLink, setIsLink] = React.useState(false);

  const LowPriority = 1;

  const updateToolbar = React.useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // update link
      const node = getSelectedNode(selection);
      const parent = node?.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, []);

  const insertLink = React.useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
    console.log("isLink", isLink);
  }, [editor, isLink]);

  React.useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (payload: any) => {
          updateToolbar();
          console.log("selection change payload", payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  return (
    <>
      <div className="toolbar flex flex-wrap">
        <button className="toolbar-button px-3 py-2 font-bold">Bold</button>
        <button className="toolbar-button px-3 py-2 font-bold">Italic</button>
        <button className="toolbar-button px-3 py-2 font-bold">
          Underline
        </button>
        <button className="toolbar-button px-3 py-2 font-bold">
          Strikethrough
        </button>
        <button className="toolbar-button px-3 py-2 font-bold">Code</button>
        <button className="toolbar-button px-3 py-2 font-bold">Hashtag</button>
        <button
          className="toolbar-button px-3 py-2 font-bold"
          onClick={insertLink}
        >
          Link
        </button>
        {isLink &&
          createPortal(
            <FloatingLinkEditor editor={editor} editIcon={<div>df</div>} />,
            document.body
          )}
        <button className="toolbar-button px-3 py-2 font-bold">Quote</button>
        <button className="toolbar-button px-3 py-2 font-bold">
          Heading 1
        </button>
        <button className="toolbar-button px-3 py-2 font-bold">
          Heading 2
        </button>
        <button className="toolbar-button px-3 py-2 font-bold">
          Heading 3
        </button>
        <button className="toolbar-button px-3 py-2 font-bold">
          Heading 4
        </button>
        <button className="toolbar-button px-3 py-2 font-bold">
          Heading 5
        </button>
        <button className="toolbar-button px-3 py-2 font-bold">List</button>
        <button className="toolbar-button px-3 py-2 font-bold">
          Ordered List
        </button>
        <button className="toolbar-button px-3 py-2 font-bold">
          Unordered List
        </button>
        <button className="toolbar-button px-3 py-2 font-bold">Image</button>
        <button className="toolbar-button px-3 py-2 font-bold">LTR</button>
        <button className="toolbar-button px-3 py-2 font-bold">RTL</button>
        <button className="toolbar-button px-3 py-2 font-bold">
          Overflowed
        </button>
      </div>
    </>
  );
}