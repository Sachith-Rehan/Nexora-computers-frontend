import { Navigate, useLocation } from "react-router-dom";
import AdminProductForm from "./adminProductForm";

export default function AdminEditProductForm() {
    const { state: product } = useLocation();
    if (!product?.productId) return <Navigate to="/admin/products" replace />;
    return <AdminProductForm key={product.productId} product={product} />;
}
