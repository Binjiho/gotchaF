import Layout from "@/components/layout/common";
import "@/styles/global.scss";
import { ToastContainer, Slide } from "react-toastify";
import { AppWrapper } from "@/store";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <AppWrapper>
        <Component {...pageProps} />
        <ToastContainer
          position="bottom-center"
          hideProgressBar
          autoClose={1000}
          theme="dark"
          transition={Slide}
        />
      </AppWrapper>
    </Layout>
  );
}
