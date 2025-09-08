"use client";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

// This component handles the redirection logic
function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // If not loading and no user, redirect to login page,
      // but don't redirect if we are already on the login page.
      if (!user && pathname !== "/admin") {
        router.push("/admin");
      }
      // If user is logged in and tries to access the login page, redirect to dashboard.
      if (user && pathname === "/admin") {
        router.push("/admin/dashboard");
      }
    }
  }, [user, loading, router, pathname]);

  // While loading, we can show a spinner or a blank screen
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // If there's a user or we're on the login page, show the content
  if (user || pathname === '/admin') {
      return <>{children}</>;
  }

  // If no user and not on login page, we've already started the redirect,
  // but we can return null to prevent flashing the content.
  return null;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProtectedRoutes>{children}</ProtectedRoutes>
    </AuthProvider>
  );
}
