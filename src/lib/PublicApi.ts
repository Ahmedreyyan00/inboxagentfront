import axios from "axios";
import { AxiosInstance } from "axios";
import { NEXT_PUBLIC_API_BASE_URL } from "../../env";
import { getSession } from "next-auth/react";
class PUBLIC_API {
  private instance: AxiosInstance;
  constructor(token?: string) {
    this.instance = axios.create({
      baseURL: NEXT_PUBLIC_API_BASE_URL,
      headers: {
        Authorization: token,
      },
      timeout: 300000, // 5 minutes timeout for long-running operations
    });
    this.setInterceptor();
  }

  setInterceptor() {
    this.instance.interceptors.request.use(
      async (config) => {
        const session = await getSession();
        if (session?.accessToken) {
          config.headers.Authorization = session.accessToken;
        } else {
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  googleLogin() {
    return this.instance.get("/api/auth/google");
  }

  verify2FA(token: string, email: string) {
    return this.instance.post("/api/auth/2fa/login-verify", {
      token,
      email,
    });
  }
}

const PublicApi = new PUBLIC_API();
export default PublicApi;
