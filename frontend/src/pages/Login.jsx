import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        formData
      );

      const token =
        response.data.accessToken ||
        response.data.token;

      if (token) {
        localStorage.setItem("accessToken", token);
      }

      navigate("/products");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      const validationErrors =
        error.response?.data?.errors;

      if (validationErrors) {
        const errorObject = {};

        validationErrors.forEach((item) => {
          errorObject[item.field] = item.message;
        });

        setErrors(errorObject);
      } else {
        setErrors({
          general:
            error.response?.data?.message ||
            "Login failed.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f3ef] flex items-center justify-center px-6">

      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">

        <h1 className="text-3xl font-black text-[#111318]">
          NOVA<span className="text-[#ff6b35]">.</span>
        </h1>

        <h2 className="mt-8 text-2xl font-bold">
          Welcome back
        </h2>

        <p className="mt-2 text-sm text-zinc-500">
          Login to manage your products.
        </p>

        {errors.general && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errors.general}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-5"
        >

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Email
            </label>

            <input
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              className={`h-12 w-full rounded-xl border px-4 outline-none ${
                errors.email
                  ? "border-red-400"
                  : "border-zinc-200 focus:border-[#ff6b35]"
              }`}
              placeholder="you@example.com"
            />

            {errors.email && (
              <p className="mt-2 text-xs text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Password
            </label>

            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`h-12 w-full rounded-xl border px-4 outline-none ${
                errors.password
                  ? "border-red-400"
                  : "border-zinc-200 focus:border-[#ff6b35]"
              }`}
              placeholder="••••••••"
            />

            {errors.password && (
              <p className="mt-2 text-xs text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-[#111318] font-bold text-white hover:bg-[#ff6b35] disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="font-semibold text-[#ff6b35]"
          >
            Register
          </button>
        </p>

      </div>

    </div>
  );
};

export default Login;