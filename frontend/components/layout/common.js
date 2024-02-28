import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </Head>
      <div className={`min-h-full max-w-layout mx-auto my-0 bg-white`}>
        <div className={`min-h-[100vh]`}>{children}</div>
      </div>
    </>
  );
}
