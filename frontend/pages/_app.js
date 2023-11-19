import { createContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "@/components/layout/common";
import "@/styles/global.scss";
import "@/public/fonts/font.css";

export const CompanyInfoContext = createContext();

export default function App({ Component, pageProps }) {
  const companyInfoState = useState(null);

  return (
    <CompanyInfoContext.Provider value={companyInfoState}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CompanyInfoContext.Provider>
  );
}
