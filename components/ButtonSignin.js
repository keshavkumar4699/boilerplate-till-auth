/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import config from "@/config";

const ButtonSignin = ({ text = "SignIn", extraStyle }) => {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return (
      <Link
        href={config.auth.callbackUrl}
        className={`btn ${extraStyle ? extraStyle : ""}`}
      >
        {session.user?.image ? (
          <img
            src={session.user?.image}
            alt={session.user?.name || "Account"}
            className="w-6 h-6 rounded-full shrink-0"
            referrerPolicy="no-referrer"
            width={24}
            height={24}
          />
        ) : (
          <span className="w-6 h-6 bg-base-300 flex justify-center items-center rounded-full shrink-0">
            {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
          </span>
        )}
        {session.user?.name || session.user?.email || "Account"}
      </Link>
    );
  }

  return (
    <Link
      href="/api/auth/signin"
      className={`btn ${extraStyle ? extraStyle : ""}`}
      onClick={(e) => {
        e.preventDefault();
        signIn(undefined, { callbackUrl: config.auth.callbackUrl });
      }}
    >
      {text}
    </Link>
  );
};

export default ButtonSignin;