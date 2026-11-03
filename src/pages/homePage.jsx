import { Routes, Route } from "react-router-dom";  
import  Header from "../components/header";
import ProductPage from "./productPage";
import ProductOverViewPage from "./productOverViewPage";
import CartPage from "./cartPage";
import CheckoutPage from "./checkoutPage";
import Footer from "../components/footer";
import UserHomePage from "./userHomePage";
import ContactUsPage from "./conatactUsPage";
import ChangePassword from "./changePassword";
import Settings from "./settings";
import MyOrders from "../components/myOrders";
import NotFoundPage from "./notFoundPage";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <div className="flex-1">
        
            <Routes>
              <Route path="/" element={<UserHomePage/>}/>
              <Route path="/products" element={<ProductPage/>}/>
              <Route path="/contact-us" element={<ContactUsPage/>}/>
              <Route path="/about-us" element={<p>about-us</p>}/>
              <Route path="/cart" element={<CartPage/>}/>
              <Route path="/checkout" element={<CheckoutPage/>}/>
              <Route path="/overview/:productId" element={<ProductOverViewPage/>}/>
              <Route path="/settings/password" element={<ChangePassword/>}/>
              <Route path="/settings" element={<Settings/>}/>
              <Route path="/my-orders" element={<MyOrders/>}/>
              <Route path="*" element={<NotFoundPage />}/>
            </Routes>
      </div>  

      <Footer />
      
    </div>

    

  )
}
