import { useRouter } from "next/router";
import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import HomeIcon from "@/public/icons/system/home-line.svg";
import HomeFillIcon from "@/public/icons/system/home-fill.svg";
import CupIcon from "@/public/icons/social/cup_line.svg";
import CupFillIcon from "@/public/icons/social/cup_fill.svg";
import TeamIcon from "@/public/icons/social/team_line.svg";
import TeamFillIcon from "@/public/icons/social/team_fill.svg";
import UserIcon from "@/public/icons/social/user_line.svg";
import UserFillIcon from "@/public/icons/social/user_fill.svg";

export default function NavBottom() {
  const router = useRouter();
  const renderChildrenByType = type => {
    return React.Children.toArray(children).filter(child => child.props.type === type);
  };

  const nav = [
    {
      title: "홈",
      icon: HomeIcon,
      activeIcon: HomeFillIcon,
      link: "/",
    },
    {
      title: "대회",
      icon: CupIcon,
      activeIcon: CupFillIcon,
      link: "/competition",
    },
    {
      title: "팀",
      icon: TeamIcon,
      activeIcon: TeamFillIcon,
      link: "/team",
    },
    {
      title: "마이페이지",
      icon: UserIcon,
      activeIcon: UserFillIcon,
      link: "/mypage",
    },
  ];

  return (
    <Navbar
      fixed="bottom"
      className={`bg-white py-0 max-w-[500px] left-[50%] translate-x-[-50%] w-full`}>
      <Nav className={`flex justify-around w-full`}>
        {nav.map((item, index) => (
          <Nav.Link
            key={"nav-" + index}
            href={item.link}
            className={`w-full flex flex-column align-items-center py-[10px] ${
              router.pathname === item.link ? "text-black" : "text-gray6"
            }`}>
            <div className={`w-[22px] mb-[2px]`}>
              {router.pathname === item.link ? <item.activeIcon /> : <item.icon />}
            </div>
            <p className={`text-[12px] ${router.pathname !== item.link && "text-gray7"}`}>
              {item.title}
            </p>
          </Nav.Link>
        ))}
      </Nav>
    </Navbar>
  );
}
