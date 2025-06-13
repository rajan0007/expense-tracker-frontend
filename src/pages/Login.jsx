// pages/Login.jsx
import { useForm } from "react-hook-form";
import API from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Login() {
  const { login } = useAuth();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", data);
      if (!res.data.success) {
        toast.error(res.data.message || "Email not found, please register");
        return;
      }
      login(res.data.token);
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white border-t-4 border-green-500 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            {...register("email")}
            placeholder="Email"
          />
          <input
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            type="password"
            {...register("password")}
            placeholder="Password"
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition duration-200"
          >
            {loading ? (
              <div className="flex justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?
          <Link
            to="/register"
            className="ml-1 text-green-600 hover:underline font-medium"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
