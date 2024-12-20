'use client'

import { useEffect } from "react";
import { isLogged } from "./scripts/Verifications";

export default function Home() {
  useEffect(() => {
    if (isLogged()) {
      
    } else {
      window.location.href = '/pages/login';
    }
  }, []);

  return (
    <></>
  );
}
