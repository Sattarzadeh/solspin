import React from "react";

export default function UserProfileLayout({ children }: { children: React.ReactNode }) {
  return <div className="w-full h-full p-4">{children}</div>;
}
