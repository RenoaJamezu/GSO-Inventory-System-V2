import { useNavigate } from "react-router-dom";
import { signOut } from "../api/auth.api";

export function useLogout() {
  const navigate = useNavigate();

  async function logout() {
    try {
      await signOut();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      alert("Failed to logout.");
    }
  }

  return logout;
}
