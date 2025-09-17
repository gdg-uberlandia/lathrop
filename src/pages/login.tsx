import { cn } from "@/assets/lib/utils";
import { Button } from "@/assets/components/ui/button";
import { Card, CardContent } from "@/assets/components/ui/card";
import { Input } from "@/assets/components/ui/input";
import { Label } from "@/assets/components/ui/label";
import Image from "next/image";
import DroidPhone from "@/assets/images/droid-phone.png";
import { useEffect, useState } from "react";
import { useAuth } from "context/AuthContext";
import { useRouter } from "next/router";

export default function LoginPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/admin/");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError("Usuário ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 w-full h-screen items-center justify-center",
        className,
      )}
      {...props}
    >
      <Card className="overflow-hidden bg-devGray-dark w-[40rem] border-devGray border-1">
        <CardContent className="grid p-0 md:grid-cols-2 ">
          <form onSubmit={handleLogin} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-white">Bem-vindo</h1>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-white text-sm">
                    Password
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-xl bg-devBlue-dark border-1 text-white border-devBlue-dark hover:border-1 hover:bg-devBlue-dark hover:!border-white text-sm"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Login"}
              </Button>
              {error && (
                <div className="text-red-500 text-sm mt-1">{error}</div>
              )}
            </div>
          </form>
          <div className="relative hidden md:block">
            <Image
              alt="Imagem do DevFest triângulo de 2024"
              src={DroidPhone}
              priority={true}
              layout="responsive"
              style={{
                objectFit: "contain",
                maxWidth: "300px",
                height: "auto",
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
