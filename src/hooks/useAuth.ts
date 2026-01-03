import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { User } from "@/types/user";
import { authService } from "@/services/authService";
import { autoRefreshToken } from "@/services/authHelpers";
import { store } from "@/store";
import { setAccessToken } from "@/store/slices/authSlice";
import type { RootState } from "@/store";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const reduxToken = useSelector((state: RootState) => state.auth.accessToken);
  const reduxUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        let token: string | null = null;

        if (reduxToken) {
          token = reduxToken;
          if (!localStorage.getItem("authToken")) {
            localStorage.setItem("authToken", token);
          }
        } else {
          token = localStorage.getItem("authToken");
        }

        if (!token) {
          const refreshedToken = await autoRefreshToken();
          if (refreshedToken) {
            token = refreshedToken;
            localStorage.setItem("authToken", refreshedToken);
          }
        }

        if (!token) {
          setIsAuthenticated(false);
          setUser(null);
          setIsLoading(false);
          return;
        }

        if (reduxUser) {
          const normalizedUser: User = {
            id: reduxUser.id || "",
            name: reduxUser.name,
            email: reduxUser.email,
            avatar: reduxUser.avatar || reduxUser.avatar_url,
          };
          setUser(normalizedUser);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(normalizedUser));
          setIsLoading(false);
          return;
        }

        const savedUser = localStorage.getItem("user");
        if (savedUser && token) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          } catch {}
        }

        const response = await authService.getCurrentUser();
        if (response.data && response.data.data) {
          const userData = response.data.data;
          const user: User = {
            id: userData.id,
            name: userData.fullName || userData.name,
            email: userData.email,
            avatar:
              userData.avatar ||
              `https://picsum.photos/seed/${userData.id}/100/100`,
          };
          setUser(user);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(user));
          if (response.data.token) {
            localStorage.setItem("authToken", response.data.token);
            store.dispatch(setAccessToken({ token: response.data.token }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("authToken");
        if (savedUser && savedToken) {
          try {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
          } catch {
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" && e.newValue === null) {
        console.log(
          "useAuth: Detected logout from storage, clearing auth state"
        );
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [reduxToken, reduxUser]);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  return { user, setUser, logout, isLoading, isAuthenticated };
}
