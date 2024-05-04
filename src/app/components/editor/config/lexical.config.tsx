import { AutoLinkNode, LinkNode } from "@lexical/link";
import MyTheme from "../theme/MyTheme";
import { ListItemNode, ListNode } from "@lexical/list";
import { YouTubeNode } from "../nodes/YoutubeNode";

const onError = (error: any) => {
  console.log("Error:", error);
  throw error;
};
const lexicalConfig = {
  namespace: "MyEditor",
  onError,
  theme: MyTheme,
  nodes: [LinkNode, AutoLinkNode, ListNode, ListItemNode, YouTubeNode],
};

export default lexicalConfig;
