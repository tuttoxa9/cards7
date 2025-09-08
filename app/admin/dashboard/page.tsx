"use client";

import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged will handle the redirect via the layout component
      // but we can also push manually to make it feel faster.
      router.push("/admin");
    } catch (error) {
      console.error("Failed to sign out:", error);
      // Optionally, show a toast notification for the error
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
      </header>
      <main>
        <p className="mb-4">Welcome back, <span className="font-semibold">{user ? user.email : "Admin"}</span>!</p>
        <div className="border-t pt-4">
          <p className="text-muted-foreground">This is the protected admin dashboard. Content management features will appear here.</p>
        </div>
      </main>
    </div>
  );
}
