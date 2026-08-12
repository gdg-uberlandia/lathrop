import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  browserLocalPersistence,
  onIdTokenChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/utils/firebaseClient";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAdminRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchAdminRole(currentUser: User, forceTokenRefresh = false) {
  const token = await currentUser.getIdToken(forceTokenRefresh);
  const response = await fetch("/api/auth/session", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return false;
  const session = (await response.json()) as { isAdmin?: boolean };
  return session.isAdmin === true;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
          if (!currentUser) {
            setUser(null);
            setIsAdmin(false);
            setLoading(false);
            return;
          }

          try {
            setUser(currentUser);
            setIsAdmin(await fetchAdminRole(currentUser));
          } catch {
            setUser(null);
            setIsAdmin(false);
          } finally {
            setLoading(false);
          }
        });
      })
      .catch(() => {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const refreshAdminRole = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      const isCurrentUserAdmin = await fetchAdminRole(currentUser, true);
      setUser(currentUser);
      setIsAdmin(isCurrentUserAdmin);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, loading, login, logout, refreshAdminRole }}
    >
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
