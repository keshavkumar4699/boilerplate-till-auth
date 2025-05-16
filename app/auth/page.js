// app/auth/page.js
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import AuthModal from "@/components/Header/AuthModal/AuthModal";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") || "login";

  const handleClose = () => {
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <AuthModal 
        isOpen={true} 
        onClose={handleClose} 
        initialMode={mode}
      />
    </div>
  );
}