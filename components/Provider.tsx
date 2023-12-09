"use client";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

function Provider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | undefined;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

export default Provider;
