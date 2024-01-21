import { Button } from "react-bootstrap";
import PlusIcon from "@/public/icons/system/add-line.svg";
import { useRouter } from "next/router";

export default function FloatAddBtn({ path, text, isNav }) {
  const router = useRouter();

  return (
    <div
      className={`w-full fixed ${
        isNav ? "bottom-[82px]" : "bottom-[20px]"
      } flex max-w-[500px] left-[50%] translate-x-[-50%]`}>
      <Button
        className={`bg-green_primary text-white rounded-[23px] h-[46px] pl-[15px] pr-[18px] flex align-items-center shadow-[0px_3px_10px_0px_rgba(0,_0,_0,_0.15)] ml-auto mr-[20px]`}
        onClick={() => router.push(path)}>
        <PlusIcon width={24} />
        <span className={`text-[16px]`}>{text}</span>
      </Button>
    </div>
  );
}
