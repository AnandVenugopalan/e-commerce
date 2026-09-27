import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Product selected for deletion
  const [deleteProduct, setDeleteProduct] = useState(null);

  // Delete loading state
  const [deleting, setDeleting] = useState(false);

  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products");

      setProducts(response.data.products);
    } catch (error) {
      console.error("FETCH PRODUCTS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };



  const handleDelete = async () => {
    if (!deleteProduct) return;

    try {
      setDeleting(true);
      setError("");

      await api.delete(`/products/${deleteProduct._id}`);

      // Remove deleted product from UI
      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) => product._id !== deleteProduct._id
        )
      );

      // Close modal
      setDeleteProduct(null);
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("accessToken");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f4f3ef]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-zinc-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* BRAND */}

          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#111318]">
              NOVA<span className="text-[#ff6b35]">.</span>
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Product management
            </p>
          </div>

          {/* HEADER ACTIONS */}

          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate("/products/add")}
              className="rounded-xl bg-[#111318] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#ff6b35]"
            >
              + Add Product
            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* PAGE TITLE */}

        <div className="mb-8">

          <p className="text-xs font-bold tracking-[0.25em] text-[#ff6b35]">
            CATALOG
          </p>

          <h2 className="mt-2 text-4xl font-black tracking-tight text-[#111318]">
            Products
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Manage your product collection.
          </p>

        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="font-bold text-red-500 hover:text-red-700"
            >
              ×
            </button>

          </div>
        )}

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">

            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-[#ff6b35]" />

          </div>
        )}

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {!loading && products.length === 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-16 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f4f3ef] text-2xl">
              🛍️
            </div>

            <h3 className="text-xl font-bold text-[#111318]">
              No products yet
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Start building your collection by adding a product.
            </p>

            <button
              onClick={() => navigate("/products/add")}
              className="mt-6 rounded-xl bg-[#111318] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#ff6b35]"
            >
              Add your first product
            </button>

          </div>
        )}

        {/* =====================================================
            PRODUCT GRID
        ===================================================== */}

        {!loading && products.length > 0 && (

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {products.map((product) => (

              <div
                key={product._id}
                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
              >

                {/* PRODUCT IMAGE */}

                <div className="aspect-[4/5] overflow-hidden bg-zinc-100">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                </div>

                {/* PRODUCT INFORMATION */}

                <div className="p-5">

                  {/* BRAND */}

                  <p className="text-xs font-bold uppercase tracking-wider text-[#ff6b35]">
                    {product.brand}
                  </p>

                  {/* NAME */}

                  <h3 className="mt-2 line-clamp-1 text-lg font-bold text-[#111318]">
                    {product.name}
                  </h3>

                  {/* DESCRIPTION */}

                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-zinc-500">
                    {product.description}
                  </p>

                  {/* PRICE + STOCK */}

                  <div className="mt-4 flex items-center justify-between">

                    <span className="text-lg font-black text-[#111318]">
                      ₹{product.price}
                    </span>

                    <span
                      className={`text-xs font-semibold ${
                        product.stock === 0
                          ? "text-red-500"
                          : product.stock < 10
                          ? "text-orange-500"
                          : "text-zinc-500"
                      }`}
                    >
                      {product.stock === 0
                        ? "Out of stock"
                        : `Stock: ${product.stock}`}
                    </span>

                  </div>

                  {/* ACTION BUTTONS */}

                  <div className="mt-5 flex gap-2">

                    {/* EDIT */}

                    <button
                      onClick={() =>
                        navigate(
                          `/products/edit/${product._id}`
                        )
                      }
                      className="flex-1 rounded-lg border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-[#111318] hover:text-[#111318]"
                    >
                      Edit
                    </button>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        setDeleteProduct(product)
                      }
                      className="flex-1 rounded-lg bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {deleteProduct && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">

            {/* WARNING ICON */}

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-lg font-black text-red-600">
              !
            </div>

            {/* TITLE */}

            <h3 className="mt-5 text-xl font-bold text-[#111318]">
              Delete product?
            </h3>

            {/* DESCRIPTION */}

            <p className="mt-2 text-sm leading-6 text-zinc-500">

              Are you sure you want to delete{" "}

              <span className="font-semibold text-[#111318]">
                {deleteProduct.name}
              </span>

              ?

              <br />

              This action cannot be undone.

            </p>

            {/* MODAL ACTIONS */}

            <div className="mt-7 flex gap-3">

              {/* CANCEL */}

              <button
                onClick={() => setDeleteProduct(null)}
                disabled={deleting}
                className="flex-1 rounded-xl border border-zinc-200 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
              >
                Cancel
              </button>

              {/* CONFIRM DELETE */}

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {deleting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Deleting...
                  </>
                ) : (
                  "Delete product"
                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Products;