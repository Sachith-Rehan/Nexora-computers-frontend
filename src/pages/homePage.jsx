import { Routes, Route } from "react-router-dom";  
import  Header from "../components/header";
import ProductPage from "./productPage";
import ProductOverViewPage from "./productOverViewPage";
import CartPage from "./cartPage";
import CheckoutPage from "./checkoutPage";
import Footer from "../components/footer";
import UserHomePage from "./userHomePage";
import ContactUsPage from "./conatactUsPage";
import Settings from "../components/settings";
import MyOrders from "../components/myOrders";

export default function HomePage() {
  return (
    <div className="min-h-scree flex flex-col">
      <Header />

      <main className="">
        <div className="w-full min-h-[calc(100vh-100px)] bg-white flex-grow">
            <Routes>
              <Route path="/" element={<UserHomePage/>}/>
              <Route path="/products" element={<ProductPage/>}/>
              <Route path="/contact-us" element={<ContactUsPage/>}/>
              <Route path="/about-us" element={<p>about-us</p>}/>
              <Route path="/cart" element={<CartPage/>}/>
              <Route path="/checkout" element={<CheckoutPage/>}/>
              <Route path="/overview/:productId" element={<ProductOverViewPage/>}/>
              <Route path="/settings" element={<Settings/>}/>
              <Route path="/my-orders" element={<MyOrders/>}/>
              <Route path="/*" element={<p>404 page</p>}/>
            </Routes>
        </div>
      </main>  

      <Footer />
      
    </div>

    

  )
}