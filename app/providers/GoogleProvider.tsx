"use client";

import React, { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleProvider({ children }: { children: ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
}
