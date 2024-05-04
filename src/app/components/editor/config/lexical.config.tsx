import { AutoLinkNode, LinkNode } from "@lexical/link";
import MyTheme from "../theme/MyTheme";

const onError = (error: any) => {
  console.log("Error:", error);
  throw error;
};
const lexicalConfig = {
  namespace: "MyEditor",
  onError,
  theme: MyTheme,
  nodes: [LinkNode, AutoLinkNode],
};

export default lexicalConfig;
