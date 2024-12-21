'use client'
import { useEffect } from "react";
import { getUser } from "./services/AuthService";

export default function Home() {
  useEffect(() => {
    redirect();
  }, []);

  async function redirect() {
    if (await getUser()) {
      window.location.href = "/pages/home";
    } else {
      window.location.href = "/pages/login";
    }
  }

  return (<></>);
}
