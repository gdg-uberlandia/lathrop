import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

import styles from "../styles/Login.module.css";
import Image from "next/image";
import DroidPhone from "@/assets/images/droid-phone.jpg";
import clsx from "clsx";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/admin/");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Erro ao autenticar");
    }
  };

  return (
    <div className={styles.LoginWrapper}>
      <div>
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
      <form onSubmit={handleLogin} className={styles.LoginForm}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.LoginFormInput}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.LoginFormInput}
        />
        <button
          type="submit"
          disabled={loading}
          className={clsx(styles.LoginButton)}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
};

export default LoginPage;
