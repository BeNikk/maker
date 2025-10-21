import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export const AppBar = () => {
  return (
    <div className="p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent">
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center ">
        <Link href={"/"} className="flex items-center gap-2">
          <Image src={"/logo.svg"} alt="logo" width={24} height={24} />
          <span className="font-semibol text-lg"> Maker</span>
        </Link>
        <SignedOut>
          <div className="flex gap-2">
            <SignUpButton>
              <Button variant={"outline"} size={"sm"}>
                Signup
              </Button>
            </SignUpButton>
            <SignInButton>
              <Button variant={"outline"} size={"sm"}>
                Signin
              </Button>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
            <UserButton/>
        </SignedIn>
      </div>
    </div>
  );
};
