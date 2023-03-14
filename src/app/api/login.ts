import { useRouter } from "next/router";
import Cookies from "js-cookie";

export function APILogin (name:string, password:string) {
    const router = useRouter();
    console.log(name + password);

    //ログイン処理（CookieにsignedIn=trueとする）
    const login = () => {
        Cookies.set("signedIn", "true");
        router.replace("/top");
    }
}

export default APILogin;
