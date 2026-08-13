import { Suspense } from "react";
import Login from "@/src/components/Auth/Login";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <Login />
    </Suspense>
  );
}
