import { useState } from "react";
import toast from "react-hot-toast";
// import axios from "axios"; // Commented out if unused to clean up warnings
import { MdEmail, MdPassword } from "react-icons/md";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate} from "react-router-dom";
import api from "../utils/api";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
  const googleLogin = useGoogleLogin({
      onSuccess: async (response) => {
      console.log(response);

      const res = await api.post("/users/google-login", {
        accessToken: response.access_token
      });

      localStorage.setItem("token", res.data.token);
      console.log(res.data.token);

      if (res.data.isAdmin == true) {
        navigate("/admin");
      } else {
        navigate("/");
      }
  },
  onError: (err) => {
    console.log(err);
  }
});

  async function handleLogin() {
    // Optional: Keep toast for debugging, or remove for production
    // toast.success("Email:" + email + "Password:" + password);
    if(!email || !password){
        toast.error("Please fill in all fields")
        return
    }

    setLoading(true)

    try {

      const res = await api.post("/users/login", {
        email: email,
        password: password,
      });

      localStorage.setItem("token" , res.data.token)
     // const token = localStorage.getItem("token")

      if(res.data.isAdmin){
        navigate("/admin")
      }else{
        navigate("/")
      }
      
      

    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Login failed");
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen w-full bg-[url('/login-bg.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4">
      {/* Glassmorphism Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8 flex flex-col gap-5">
        
        <h1 className="text-white text-3xl font-bold text-center mb-2">
          Welcome Back
        </h1>

        {/* Email Input */}
        <div className="flex flex-col gap-1">
          <label className="text-white flex items-center gap-2 font-medium">
            <MdEmail className="text-lg" /> Email
          </label>
          <input
            className="w-full h-11 bg-white/20 border border-white/30 rounded-lg px-4 text-white placeholder:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-1">
          <label className="text-white flex items-center gap-2 font-medium">
            <MdPassword className="text-lg" /> Password
          </label>
          <input
            className="w-full h-11 bg-white/20 border border-white/30 rounded-lg px-4 text-white placeholder:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Forgot Password */}
        <div className="text-right -mt-2">
          <Link
            to="/forget-Password"
            className="text-sm text-blue-300 hover:text-blue-400 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Login Button */}
        <button disabled={loading}className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-lg transition-colors shadow-lg"
          onClick={handleLogin}
        >
          {
            loading ? "Loadin..." : "Login"
          }  
          
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="h-px w-full bg-white/30"></div>
          <span className="text-white/70 text-sm">or</span>
          <div className="h-px w-full bg-white/30"></div>
        </div>

        {/* Google Sign In */}
        <button onClick={googleLogin} className="w-full h-11 bg-white hover:bg-gray-100 text-gray-800 rounded-lg font-semibold text-[16px] flex items-center justify-center gap-2 transition-colors shadow-lg">
          <FaGoogle className="text-red-500" />
          Sign in with Google
        </button>

        {/* Register Link */}
        <p className="text-white/80 text-center text-sm mt-2">
          Don't have an account?{" "}
          <Link
            to="/registerPage"
            className="text-blue-300 hover:text-blue-400 font-medium transition-colors"
          >
            Sign up here
          </Link>
        </p>

      </div>
    </div>
  );
}