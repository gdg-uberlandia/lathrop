import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import firebaseApp from "@/utils/firebaseClient";
import axios from "axios";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const restoreUser = async () => {
      setLoading(true);
      const token = sessionStorage.getItem("devfest-2025-session");
      if (token) {
        try {
          const res = await axios.post("/api/auth/verify", { token });
          setUser(res.data.user);
        } catch (err) {
          setUser(null);
        }
      }
      setLoading(false);
    };
    restoreUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const auth = getAuth(firebaseApp);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const token = await cred.user.getIdToken();
    sessionStorage.setItem("devfest-2025-session", token);

    try {
      const res = await axios.post("/api/auth/verify", { token });
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    }
    setLoading(false);
  };

  const logout = async () => {
    const auth = getAuth(firebaseApp);
    await signOut(auth);
    setUser(null);
    sessionStorage.removeItem("devfest-2025-session");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
