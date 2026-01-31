import { linkifyText } from "@/utils/linkifyText";

interface LinkifiedTextProps {
  text: string;
}

const LinkifiedText = ({ text }: LinkifiedTextProps) => linkifyText(text);

export default LinkifiedText;