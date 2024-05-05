import { AutoLinkNode, LinkNode } from "@lexical/link";
import MyTheme from "../theme/MyTheme";
import { ListItemNode, ListNode } from "@lexical/list";
import { YouTubeNode } from "../nodes/YoutubeNode";
import { ImageNode } from "../nodes/ImageNode";

const onError = (error: any) => {
  console.log("Error:", error);
  throw error;
};
const lexicalConfig = {
  namespace: "MyEditor",
  onError,
  theme: MyTheme,
  nodes: [
    LinkNode,
    AutoLinkNode,
    ListNode,
    ListItemNode,
    YouTubeNode,
    ImageNode,
  ],
};

export default lexicalConfig;
