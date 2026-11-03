import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";  
import api from "../../utils/api";

import { CiEdit } from "react-icons/ci";
import LoadingScreen from "../../components/loadingScreen";
import ProductDeleteButton from "../../components/productDeleteButton";

function categoryKey(product) {
  const value = (product.category || "").trim().toLowerCase();
  return value === "laptops" ? "laptop" : value;
}

function inStock(product) {
  return product.isAvailable && Number(product.stock) > 0;
}

export default function AdminProductPage() {
     
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [availability, setAvailability] = useState("");
    const categoryOptions = [...new Set(products.map(categoryKey).filter(Boolean))].sort();
    const query = search.trim().toLowerCase();
    const filteredProducts = products.filter(product => {
      const matchesSearch = [product.productId, product.name, product.brand, product.model]
        .some(value => String(value ?? "").toLowerCase().includes(query));
      return matchesSearch && (!category || categoryKey(product) === category)
        && (!availability || Boolean(inStock(product)) === (availability === "available"));
    });
  //load the date forom backend
    useEffect(() => {
      if(loading) {
        const token = localStorage.getItem("token");
        api.get("/products", {
          headers: { 
            Authorization : `Bearer ${token}`
          }
        }).then((res) => {
          setProducts(res.data);
          setLoading(false);
        })
      }  
    },[loading]
    );
    
      
    return (

      <div className = "w-full min-full">

        <div className="w-full min-h-[90px] bg-white shadow-lg rounded-2xl flex items-center justify-between px-6 py-4 border border-gray-100">
  
          <div>
            <p className="text-sm text-gray-500 font-medium">Product Overview</p>
            <h1 className="text-2xl font-bold text-accent mt-1">Products</h1>
          </div>

          <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
            <span aria-label="Matching product count" className="text-2xl font-bold text-accent">{filteredProducts.length}</span>
          </div>

        </div>

        <section aria-label="Product filters" className="mt-4 grid gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-end">
          <label className="grid gap-1 text-sm font-medium">Search products
            <input type="search" value={search} onChange={event => setSearch(event.target.value)}
              placeholder="Name, ID, brand or model" className="min-w-0 rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm font-medium">Category
            <select value={category} onChange={event => setCategory(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2">
              <option value="">All categories</option>
              {Array.from(new Set([...categoryOptions, category].filter(Boolean))).map(value => (
                <option key={value} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium">Availability
            <select value={availability} onChange={event => setAvailability(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2">
              <option value="">All products</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </label>
          <button type="button" className="rounded-lg border border-gray-300 px-4 py-2 text-sm" onClick={() => {
            setSearch("");
            setCategory("");
            setAvailability("");
          }}>Clear filters</button>
        </section>

        {
          loading && <LoadingScreen />
        }

        <div className="w-full overflow-x-auto mt-6 rounded-2xl shadow-lg border border-gray-200 bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-accent text-white uppercase text-xs">
              <tr className="h-14">
                <th className="px-4 py-3 text-center">Image</th>
                <th className="px-4 py-3">Product ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Labelled Price</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-center">Availability</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {!loading && filteredProducts.length === 0 && (
                <tr><td colSpan={11} className="p-8 text-center text-gray-500">
                  {products.length ? "No products match these filters." : "No products yet."}
                </td></tr>
              )}
              {filteredProducts.map((product) => (
                <tr key={product.productId} className="bg-white hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <img src={product.images[0]} alt={product.name} className="w-14 h-14 object-cover rounded-xl border border-gray-200 shadow-sm" />
                    </div>
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-700">{product.productId}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{product.name}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">Rs. {product.price}</td>
                  <td className="px-4 py-3 text-gray-500 line-through">Rs. {product.labelledPrice}</td>
                  <td className="px-4 py-3 text-gray-600">{product.brand}</td>
                  <td className="px-4 py-3 text-gray-600">{product.model}</td>

                  <td className="px-4 py-3">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {inStock(product) ? (
                      <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        Available
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                        Unavailable
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center font-semibold text-gray-700">{product.stock}</td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center items-center gap-5">
                      
                      <Link to="/admin/edit-product" state={product}>
                        <CiEdit className="text-blue-800 hover:text-blue-950 text-xl font-bold cursor-pointer " />
                      </Link>
                      
                      <ProductDeleteButton productId={product.productId} refresh={() => setLoading(true)} />

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      
        

      </div>
        
        
    )
} 
