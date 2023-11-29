import Layout from "@/components/layout/common";
import "@/styles/global.scss";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
