import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    brand: "",
    image: "",
    stock: "",
  });

  const [sizes, setSizes] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setErrors({});

        const response = await api.get(`/products/${id}`);

        const product = response.data.product || response.data;

        console.log("EDIT PRODUCT:", product);

        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price ?? "",
          brand: product.brand || "",
          image: product.image || "",
          stock: product.stock ?? "",
        });

        setSizes(product.size || []);
      } catch (error) {
        console.error("FETCH PRODUCT ERROR:", error);

        setErrors({
          general:
            error.response?.data?.message ||
            "Failed to load product.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const handleSizeToggle = (size) => {
    setSizes((prev) => {
      if (prev.includes(size)) {
        return prev.filter((item) => item !== size);
      }

      return [...prev, size];
    });

    if (errors.size) {
      setErrors((prev) => ({
        ...prev,
        size: "",
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    if (sizes.length === 0) {
      setErrors({
        size: "Please select at least one size.",
      });

      return;
    }

    setSaving(true);

    try {
      await api.put(`/products/${id}`, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        size: sizes,
      });

      navigate("/products");
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);

      const validationErrors = error.response?.data?.errors;

      if (validationErrors) {
        const errorObject = {};

        validationErrors.forEach((error) => {
          errorObject[error.field] = error.message;
        });

        setErrors(errorObject);
      } else {
        setErrors({
          general:
            error.response?.data?.message ||
            "Failed to update product.",
        });
      }
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f3ef]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-[#ff6b35]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f3ef]">

      {/* HEADER */}

      <header className="border-b border-zinc-200 bg-white">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <button
            onClick={() => navigate("/products")}
            className="text-2xl font-black tracking-tight text-[#111318]"
          >
            NOVA<span className="text-[#ff6b35]">.</span>
          </button>

          <button
            onClick={() => navigate("/products")}
            className="text-sm font-semibold text-zinc-500 transition hover:text-[#111318]"
          >
            ← Back to products
          </button>

        </div>

      </header>

      {/* MAIN */}

      <main className="mx-auto max-w-3xl px-6 py-10">

        {/* TITLE */}

        <div className="mb-8">

          <p className="text-xs font-bold tracking-[0.25em] text-[#ff6b35]">
            CATALOG
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-[#111318]">
            Edit product
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Update the details of your product.
          </p>

        </div>

        {/* FORM */}

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">

          {errors.general && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errors.general}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* NAME */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-[#111318]">
                Product name
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Air Max 270"
                className={`h-14 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:ring-4 ${
                  errors.name
                    ? "border-red-400 focus:ring-red-100"
                    : "border-zinc-200 focus:border-[#ff6b35] focus:ring-orange-100"
                }`}
              />

              {errors.name && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.name}
                </p>
              )}

            </div>

            {/* BRAND + PRICE */}

            <div className="grid gap-5 sm:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-semibold text-[#111318]">
                  Brand
                </label>

                <input
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Nike"
                  className={`h-14 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:ring-4 ${
                    errors.brand
                      ? "border-red-400 focus:ring-red-100"
                      : "border-zinc-200 focus:border-[#ff6b35] focus:ring-orange-100"
                  }`}
                />

                {errors.brand && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.brand}
                  </p>
                )}

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-[#111318]">
                  Price
                </label>

                <input
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="8999"
                  className={`h-14 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:ring-4 ${
                    errors.price
                      ? "border-red-400 focus:ring-red-100"
                      : "border-zinc-200 focus:border-[#ff6b35] focus:ring-orange-100"
                  }`}
                />

                {errors.price && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.price}
                  </p>
                )}

              </div>

            </div>

            {/* DESCRIPTION */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-[#111318]">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the product..."
                className={`w-full resize-none rounded-xl border bg-white px-4 py-4 text-sm outline-none transition focus:ring-4 ${
                  errors.description
                    ? "border-red-400 focus:ring-red-100"
                    : "border-zinc-200 focus:border-[#ff6b35] focus:ring-orange-100"
                }`}
              />

              {errors.description && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.description}
                </p>
              )}

            </div>

            {/* IMAGE */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-[#111318]">
                Image URL
              </label>

              <input
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/product.jpg"
                className={`h-14 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:ring-4 ${
                  errors.image
                    ? "border-red-400 focus:ring-red-100"
                    : "border-zinc-200 focus:border-[#ff6b35] focus:ring-orange-100"
                }`}
              />

              {errors.image && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.image}
                </p>
              )}

            </div>

            {/* STOCK */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-[#111318]">
                Stock
              </label>

              <input
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
                className={`h-14 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:ring-4 ${
                  errors.stock
                    ? "border-red-400 focus:ring-red-100"
                    : "border-zinc-200 focus:border-[#ff6b35] focus:ring-orange-100"
                }`}
              />

              {errors.stock && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.stock}
                </p>
              )}

            </div>

            {/* SIZES */}

            <div>

              <label className="mb-3 block text-sm font-semibold text-[#111318]">
                Available sizes
              </label>

              <div className="flex flex-wrap gap-3">

                {[
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12",
                ].map((size) => (

                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`min-w-[52px] rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                      sizes.includes(size)
                        ? "border-[#ff6b35] bg-[#ff6b35] text-white"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-[#ff6b35]"
                    }`}
                  >
                    {size}
                  </button>

                ))}

              </div>

              {errors.size && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.size}
                </p>
              )}

              {sizes.length > 0 && (
                <p className="mt-2 text-xs text-zinc-400">
                  Selected: {sizes.join(", ")}
                </p>
              )}

            </div>

            {/* BUTTONS */}

            <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="h-12 rounded-xl border border-zinc-200 px-6 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex h-12 items-center justify-center gap-3 rounded-xl bg-[#111318] px-7 text-sm font-bold text-white transition hover:bg-[#ff6b35] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}

              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
};

export default EditProduct;