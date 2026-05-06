import axios from "axios";
const API_URL = "https://medication-reminder-backend-production.up.railway.app/api/auth";

class AuthService {
  async register(user) {
    const response = await axios.post(`${API_URL}/register`, user);
    return response.data;
  }

  async login(email, password) {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
}

const authService = new AuthService();
export default authService;