import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";

export const Auth = () => {
  const cookies = new Cookies();

  const SignInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p>Sign in with Google to continue.</p>
      <button onClick={SignInWithGoogle}>Sign in</button>
    </div>
  );
};
