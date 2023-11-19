import { createContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "@/components/layout/common";
import "@/styles/global.scss";

export const CompanyInfoContext = createContext();

export default function App({ Component, pageProps }) {
  return (
    <CompanyInfoContext.Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CompanyInfoContext.Provider>
  );
}
