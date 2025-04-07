"use client";

import { loginWithGoogle } from "@/lib/actions/user.actions";
import { Button } from "./button";

function GoogleLogin() {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="py-6 text-left w-full"
      onClick={async () => await loginWithGoogle()}
    >
      <img src="/google.png" alt="Google" width={20} />
      <span className="ml-2">Sign in with google</span>
    </Button>
  )
}
export default GoogleLogin;
