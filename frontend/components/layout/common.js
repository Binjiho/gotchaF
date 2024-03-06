import Head from "next/head";

export const metadata = {
  title: "HotForum : 당신의 이야기를 실현시키는 곳",
  description: "프론트엔드 개발자가 되고 싶은 취준생의 블로그",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>같차</title>
        <meta property="og:title" content="Santiago" key="title" />
        <link rel="icon" href="/favicon/gotcha.ico" />
      </Head>
      <div className={`min-h-full max-w-layout mx-auto my-0 bg-white`}>
        <div className={`min-h-[100vh]`}>{children}</div>
      </div>
    </>
  );
}
