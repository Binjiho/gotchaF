'use client'

import axios from "axios";
import { useEffect } from "react";

export default function Home() {

    useEffect(() => {
        axios({
            url: "/api/hello",
            method: "get",
            data: { category: "0" },
        }).then((res : any) => {
            console.log(res)
        });
    }, []);

  return (
    <div>dd</div>
  )
}
