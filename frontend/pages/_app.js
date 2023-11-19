import { createContext, useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export const CompanyInfoContext = createContext();

export default function App({ Component, pageProps }) {

  return (
    <CompanyInfoContext.Provider>
            <Component {...pageProps} />
    </CompanyInfoContext.Provider>
  );
}
