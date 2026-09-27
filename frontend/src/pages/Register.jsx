import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (
      formData.password !== formData.confirmPassword
    ) {
      setErrors({
        confirmPassword: "Passwords do not match",
      });

      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", formData);

      navigate("/login");
    } catch (error) {
      console.error("REGISTER ERROR:", error);

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
            "Registration failed.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f3ef] flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-md rounded-2xl bg-white border border-zinc-200 p-8 shadow-sm">

        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#111318]">
            NOVA<span className="text-[#ff6b35]">.</span>
          </h1>

          <h2 className="mt-6 text-2xl font-bold text-[#111318]">
            Create account
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Create your account to continue.
          </p>
        </div>

        {errors.general && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Name
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`h-12 w-full rounded-xl border px-4 outline-none ${
                errors.name
                  ? "border-red-400"
                  : "border-zinc-200 focus:border-[#ff6b35]"
              }`}
              placeholder="Your name"
            />

            {errors.name && (
              <p className="mt-2 text-xs text-red-500">
                {errors.name}
              </p>
            )}
          </div>

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

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Confirm password
            </label>

            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`h-12 w-full rounded-xl border px-4 outline-none ${
                errors.confirmPassword
                  ? "border-red-400"
                  : "border-zinc-200 focus:border-[#ff6b35]"
              }`}
              placeholder="••••••••"
            />

            {errors.confirmPassword && (
              <p className="mt-2 text-xs text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-[#111318] font-bold text-white hover:bg-[#ff6b35] disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-semibold text-[#ff6b35]"
          >
            Login
          </button>
        </p>

      </div>

    </div>
  );
};

export default Register;