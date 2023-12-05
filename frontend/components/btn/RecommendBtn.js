import { Button } from "react-bootstrap";

export default function RecommendBtn({
  title,
  content,
  btnVariant = "green-primary",
  btnMessage,
  active,
  className = "",
}) {
  return (
    <div className={`p-[14px] border !border-gray3 rounded-[3px] ${className}`}>
      <strong className={`text-[15px] font-medium`}>{title}</strong>
      <p className={`text-gray8 mt-[5px] mb-[10px] text-[14px]`}>{content}</p>
      <Button
        size={40}
        variant={btnVariant}
        className={`w-full font-bold`}
        onClick={active}>
        {btnMessage}
      </Button>
    </div>
  );
}
