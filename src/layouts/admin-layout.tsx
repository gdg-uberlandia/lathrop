import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAuth } from "../context/AuthContext";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <div>Carregando...</div>;
  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="w-full mx-auto max-w-7xl">
      <header className="flex justify-between items-center py-4 px-6">
        <nav className="flex justify-between gap-4">
          <Link
            className="cursor-pointer whitespace-nowrap py-3 hover:!text-devBlue-dark text-white"
            href="/admin/"
          >
            Dashboard
          </Link>
          <Link
            className="cursor-pointer whitespace-nowrap py-3 text-white hover:!text-devBlue-dark"
            href="/admin/speakers"
          >
            Speakers
          </Link>
        </nav>
        <div className="flex gap-8 items-center">
          {user && <span className="text-sm">{user.email}</span>}{" "}
          <button
            onClick={handleLogout}
            className="bg-devBlue-dark border-1 border-devBlue-dark rounded-xl text-white cursor-poiter text-md font-semibold py-2 px-4 hover:border-1 hover:border-white"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex justify-between items-center py-4 px-6">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
