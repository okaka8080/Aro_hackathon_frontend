"use client"

import { Inter } from 'next/font/google'
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const inter = Inter({ subsets: ['latin'] })

export default function Top() {
  //router
  const router = useRouter();

  //Cookieのチェック（これをいろいろ認証タイプにより変更）
  const signedIn = Cookies.get("signedIn");
  //signedInがtrueじゃなければ/loginへ
  if (signedIn !== "true") router.replace("/login")
  else {
    router.replace("/main")
  };
}
