import {
  $getSelection,
  $isRangeSelection,
  BaseSelection,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import * as React from "react";
import getSelectedNode from "../utils/getSelectedNode";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { mergeRegister } from "@lexical/utils";
import getPositionEditorElement from "../utils/getPositionEditorElement";

export interface IFloatingLinkEditorProps {
  editor: LexicalEditor;
  editIcon?: React.ReactNode;
}

export default function FloatingLinkEditor(props: IFloatingLinkEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const mouseDownRef = React.useRef(false);
  const [isEditMode, setEditMode] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");
  const [lastSelection, setLastSelection] =
    React.useState<BaseSelection | null>(null);

  const LowPriority = 1;

  const updateLinkEditor = React.useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node?.getParent();
      console.log(node, parent);

      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
    }

    console.log("selection", selection);

    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;
    console.log("activeElement", activeElement);

    if (editorElem === null) {
      return;
    }

    const rootElement = props.editor.getRootElement();

    if (
      selection !== null &&
      !nativeSelection?.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection!.anchorNode)
    ) {
      const domRange = nativeSelection!.getRangeAt(0);
      let rect;
      if (nativeSelection!.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild as HTMLElement;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        getPositionEditorElement(editorElem, rect);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== "link-input") {
      getPositionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl("");
    }
    return true;
  }, [props.editor]);

  React.useEffect(() => {
    return mergeRegister(
      props.editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),
      props.editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          console.log("selection change return ture");

          updateLinkEditor();
          return true;
        },
        LowPriority
      )
    );
  });

  React.useEffect(() => {
    props.editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [props.editor, updateLinkEditor]);

  React.useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <div ref={editorRef} className="link-editor">
      {isEditMode ? (
        <input
          ref={inputRef}
          className="link-input"
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (lastSelection !== null) {
                if (linkUrl !== "") {
                  props.editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                }
                setEditMode(false);
              }
            } else if (event.key === "Escape") {
              event.preventDefault();
              setEditMode(false);
            }
          }}
        />
      ) : (
        <>
          <div className="link-input">
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkUrl}
            </a>
            <div
              role="button"
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setEditMode(true);
              }}
            >
              {props.editIcon}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
