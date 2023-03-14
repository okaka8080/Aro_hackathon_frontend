import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface Props {
children: React.ReactNode;
}

const Auth = ({ children }: Props) => {

//router
const router = useRouter();

//Cookieのチェック（これをいろいろ認証タイプにより変更）
const signedIn = Cookies.get("signedIn");
//signedInがtrueじゃなければ/loginへ
if (signedIn !== "true") router.replace("/login");

//何もなければ次へ（そのまま処理）
return <>{children}</>;
}

export default Auth;