import { createContext, useEffect, useState } from "react";

export const CompanyInfoContext = createContext();

export default function App({ Component, pageProps }) {

  return (
    <CompanyInfoContext.Provider>
            <Component {...pageProps} />
    </CompanyInfoContext.Provider>
  );
}
