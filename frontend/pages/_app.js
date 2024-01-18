import Layout from "@/components/layout/common";
import "@/styles/global.scss";
import { ToastContainer, Slide } from "react-toastify";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, wrapper } from "@/store";
import { ModalProvider } from "@/context/ModalContext";

export default function App({ Component, pageProps }) {
  const { store, props } = wrapper.useWrappedStore(pageProps);

  return (
    <Layout>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ModalProvider>
            <Component {...pageProps} />
            <ToastContainer
              position="bottom-center"
              hideProgressBar
              autoClose={1000}
              theme="dark"
              transition={Slide}
            />
          </ModalProvider>
        </PersistGate>
      </Provider>
    </Layout>
  );
}
