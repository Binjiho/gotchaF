import NavBottom from "@/components/layout/NavBottom";
import LogoIcon from "@/public/icons/logos/black_logo.svg";
import MainHeader from "@/components/layout/MainHeader";

export default function Index() {
  return (
    <>
      <MainHeader>
        <a type={"left"}>
          <LogoIcon width={42}></LogoIcon>
        </a>
      </MainHeader>
      <main></main>
      <NavBottom></NavBottom>
    </>
  );
}
