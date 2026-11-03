import {useState} from "react";
import { Link } from "react-router-dom";
import UploadMedia from "../../utils/uploadMedia";
import { toast } from "react-hot-toast";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
const categoryOptions = {
    "graphic card": "Graphic Card",
    "motherboard": "Motherboard",
    "processor": "Processor",
    "ram": "RAM",
    "storage": "Storage",
    "power supply": "Power Supply",
    "case": "Case",
    "cooling": "Cooling",
    "monitor": "Monitor",
    "keyboard": "Keyboard",
    "mouse": "Mouse",
    "headset": "Headset",
    "speaker": "Speaker",
    "laptops": "Laptops",
    "desktop": "Desktop",
    "gaming": "Gaming",
    "workstation": "Workstation",
    "accessories": "Accessories",
    "other": "Other",
};

const brandOptions = {
    "asus": "Asus",
    "msi": "MSI",
    "gigabyte": "Gigabyte",
    "evga": "EVGA",
    "zotac": "Zotac",
    "pny": "PNY",
    "sapphire": "Sapphire",
    "xfx": "XFX",
    "other": "Other",
};

export default function AdminProductForm({ product }) {

    const [productId, setProductId] = useState(product?.productId ?? "");
    const [name, setName] = useState(product?.name ?? "");
    const [altNames, setAltNames] = useState(product?.altNames?.join(", ") ?? "");
    const [price, setPrice] = useState(product?.price ?? 0);
    const [description, setDescription] = useState(product?.description ?? "");
    const [labelledPrice, setLabelledPrice] = useState(product?.labelledPrice ?? "");
    const [images, setImages] = useState([]);
    const [isAvailable, setIsAvailable] = useState(product?.isAvailable ?? true);
    const [category, setCategory] = useState(product?.category ?? "");
    const [stock, setStock] = useState(product?.stock ?? 0);
    const [brand, setBrand] = useState(product?.brand ?? "");
    const [model, setModel] = useState(product?.model ?? "");
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function submitData(event) {
        event.preventDefault();
        if (isLoading) return;
        setLoading(true);

        const token = localStorage.getItem("token");
        if(!token) {
            toast.error("You are not logged in");
            navigate("/login");
            return;
        }

        try {
            const imageUrls = await Promise.all(Array.from(images, UploadMedia));
            const altNamesArray = altNames.split(",").map(value => value.trim()).filter(Boolean);
            
            const productData = {
                name : name,
                altNames : altNamesArray,
                price : price,
                description : description,
                labelledPrice : labelledPrice,
                isAvailable : isAvailable,
                category : category,
                stock : stock,
                brand : brand,
                model : model
            }

            const config = { headers: { Authorization: "Bearer " + token } };
            if (product) {
                if (imageUrls.length) productData.images = imageUrls;
                await api.put(`/products/${encodeURIComponent(product.productId)}`, productData, config);
            } else {
                await api.post("/products", { ...productData, productId, images: imageUrls }, config);
            }

            toast.success(product ? "Product updated successfully" : "Product added successfully");
            navigate("/admin/products");

            setLoading(false);
        }catch (error) {
            toast.error(error?.response?.data?.message || "Failed to save product");
            setLoading(false);
        }

    }
    const fieldClass = "w-full min-w-0 rounded-lg border-2 border-gray-400 bg-transparent px-3 py-2.5 text-sm font-normal focus:border-blue-500 focus:outline-none";

    return (
        <form onSubmit={submitData} className="min-h-full w-full space-y-4 pb-4">
            <header className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-5 shadow-2xl sm:p-6">
                <h1 className="text-2xl font-semibold">{product ? "Edit Product" : "Add New Product"}</h1>
                <div className="flex gap-3">
                    <Link to="/admin/products" className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">Cancel</Link>
                    <button type="submit" disabled={isLoading} className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-60">
                        {isLoading ? "Saving..." : "Save product"}
                    </button>
                </div>
            </header>
            <section className="rounded-lg bg-white p-5 shadow-2xl sm:p-6">
                <h2 className="mb-5 text-lg font-semibold">Product details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid min-w-0 content-start gap-1.5 text-sm font-semibold">
                        Product ID
                        <input type="text" value={productId} readOnly={Boolean(product)} onChange={(e) => setProductId(e.target.value)} placeholder="e.g. GPU-001" required className={fieldClass} />
                    </label>
                    <label className="grid min-w-0 content-start gap-1.5 text-sm font-semibold">
                        Product name
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. GeForce RTX 5090" required className={fieldClass} />
                    </label>
                    <label className="grid min-w-0 content-start gap-1.5 text-sm font-semibold">
                        Category
                        <select value={category} onChange={(e) => setCategory(e.target.value)} required className={fieldClass}>
                            <option value="" disabled>Select a category</option>
                            {product?.category && !Object.hasOwn(categoryOptions, product.category) && (
                                <option value={product.category}>{product.category}</option>
                            )}
                            {Object.entries(categoryOptions).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </label>
                    <label className="grid min-w-0 content-start gap-1.5 text-sm font-semibold">
                        Brand
                        <select value={brand} onChange={(e) => setBrand(e.target.value)} required className={fieldClass}>
                            <option value="" disabled>Select a brand</option>
                            {product?.brand && !Object.hasOwn(brandOptions, product.brand) && (
                                <option value={product.brand}>{product.brand}</option>
                            )}
                            {Object.entries(brandOptions).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </label>
                    <label className="grid min-w-0 content-start gap-1.5 text-sm font-semibold">
                        Model
                        <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. RTX 5090" required className={fieldClass} />
                    </label>
                    <label className="grid min-w-0 content-start gap-1.5 text-sm font-semibold">
                        Alternative names (optional)
                        <input type="text" value={altNames} onChange={(e) => setAltNames(e.target.value)} placeholder="Separate names with commas" className={fieldClass} />
                    </label>
                </div>
            </section>
            <section className="rounded-lg bg-white p-5 shadow-2xl sm:p-6">
                <h2 className="mb-5 text-lg font-semibold">Pricing and inventory</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid min-w-0 content-start gap-1.5 text-sm font-semibold">
                        Selling price (LKR)
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01" required className={fieldClass} />
                    </label>
                    <label className="grid min-w-0 content-start gap-1.5 text-sm font-semibold">
                        Labelled price (LKR)
                        <input type="number" value={labelledPrice} onChange={(e) => setLabelledPrice(e.target.value)} min="0" step="0.01" required className={fieldClass} />
                    </label>
                    <label className="grid min-w-0 content-start gap-1.5 text-sm font-semibold">
                        Stock quantity
                        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} min="0" step="1" required className={fieldClass} />
                    </label>
                    <label className="grid min-w-0 content-start gap-1.5 text-sm font-semibold">
                        Availability
                        <select value={isAvailable} onChange={(e) => setIsAvailable(e.target.value === "true")} required className={fieldClass}>
                            <option value={true}>Available</option>
                            <option value={false}>Not Available</option>
                        </select>
                    </label>
                </div>
            </section>
            <section className="rounded-lg bg-white p-5 shadow-2xl sm:p-6">
                <h2 className="mb-5 text-lg font-semibold">Description and images</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid min-w-0 content-start gap-1.5 text-sm font-semibold">
                        Description
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className={fieldClass} />
                    </label>
                    <label className="grid min-w-0 content-start gap-1.5 text-sm font-semibold">
                        {product ? "Replacement images (optional)" : "Product images"}
                        <input type="file" accept="image/*" multiple onChange={(e) => setImages(e.target.files)} className={fieldClass} />
                    </label>
                </div>
                {product?.images?.length > 0 && (
                    <div className="mt-4">
                        <p className="mb-2 text-sm font-semibold">Current images</p>
                        <div className="flex flex-wrap gap-2">
                            {product.images.map((image, index) => (
                                <img key={index} src={typeof image === "string" ? image : image?.url}
                                    alt={`${product.name}, image ${index + 1}`}
                                    className="h-16 w-16 rounded-lg border border-gray-400 object-contain" />
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </form>
    );
}

