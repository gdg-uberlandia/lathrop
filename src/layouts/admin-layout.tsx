import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Container } from "reactstrap";

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
    <Container>
      <header>
        <nav>
          <Link href="/admin/">Dashboard</Link>
          <Link href="/admin/speakers">Speakers</Link>
        </nav>
        <div>
          {user && <span>{user.email}</span>}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main>{children}</main>
    </Container>
  );
}

export default AdminLayout;
