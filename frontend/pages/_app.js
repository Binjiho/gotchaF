import Layout from "@/components/layout/common";
import "@/styles/global.scss";
import { ToastContainer, Slide } from "react-toastify";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, wrapper } from "@/store";

export default function App({ Component, pageProps }) {
  const { store, props } = wrapper.useWrappedStore(pageProps);

  return (
    <Layout>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Component {...pageProps} />
          <ToastContainer
            position="bottom-center"
            hideProgressBar
            autoClose={1000}
            theme="dark"
            transition={Slide}
          />
        </PersistGate>
      </Provider>
    </Layout>
  );
}
