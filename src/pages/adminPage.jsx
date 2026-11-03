
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  IoMenu,
  IoClose,
  IoReceiptOutline,
  IoCubeOutline,
  IoPeopleOutline,
  IoChevronForwardOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";

import AdminProductPage from "./admin/adminProductPage";
import AdminUserPage from "./admin/adminUsersPage";
import AdminAddProductForm from "./admin/adminAddProductForm";
import AdminEditProductForm from "./admin/adminEditProductForm";
import AdminOrdersPage from "./admin/adminOrderPage";
import toast from "react-hot-toast";
import LoadingScreen from "../components/loadingScreen";
import api from "../utils/api";


const menuItems = [
  {
    name: "Orders",
    path: "/admin/orders",
    icon: IoReceiptOutline,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: IoCubeOutline,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: IoPeopleOutline,
  },
];

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(
    () => {
      const token = localStorage.getItem("token")
      
      if(token == null){
        navigate("/")
      }

      if(token != null){
        api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => {
          setUser(res.data);  
        }).catch((err) => {
          console.log(err);
          toast.error("You are not authorized to access this page");
          navigate("/");
        })
                
      }
    }
  , [])

 

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (

    
    <div className="w-full h-screen flex bg-primary overflow-hidden">

      {/* Mobile Header */}
      <header
        className="md:hidden fixed top-0 left-0 z-30
        w-full h-[64px] bg-[#10151F]
        border-b border-white/10
        flex items-center justify-between px-5"
      >
        <img
          src="/header-logo.png"
          alt="Logo"
          className="h-10 max-w-[180px] object-contain"
        />

        <button
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open sidebar"
          className="p-2 text-slate-300
          hover:text-white transition-colors"
        >
          <IoMenu size={27} />
        </button>
      </header>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={handleCloseSidebar}
          className="fixed inset-0 z-40
          bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-[280px] lg:w-[320px]
          h-full shrink-0
          flex flex-col
          bg-[#10151F]
          border-r border-white/10
          shadow-2xl
          transform transition-transform
          duration-300 ease-in-out
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          md:translate-x-0
        `}
      >

        {/* Sidebar Header */}
        <div
          className="h-[90px] shrink-0
          flex items-center justify-between
          px-6 border-b border-white/10"
        >
          <img
            src="/header-logo.png"
            alt="Logo"
            className="h-14 max-w-[200px] object-contain"
          />

          <button
            onClick={handleCloseSidebar}
            aria-label="Close sidebar"
            className="md:hidden p-2 rounded-lg
            text-slate-400 hover:text-white
            hover:bg-white/10 transition-all"
          >
            <IoClose size={25} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 px-4 py-8 overflow-y-auto">

          <p
            className="px-4 mb-5 text-[11px]
            font-semibold text-slate-500
            uppercase tracking-[2px]"
          >
            Main Menu
          </p>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={handleCloseSidebar}
                  className={({ isActive }) =>
                    `group flex items-center gap-4
                    h-[54px] px-4 rounded-xl
                    border transition-all duration-300
                    ${
                      isActive
                        ? "bg-blue-500/15 text-blue-400 border-blue-500/20"
                        : "text-slate-400 border-transparent hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className="text-[23px] shrink-0" />

                      <span className="flex-1 text-[15px] font-medium">
                        {item.name}
                      </span>

                      <IoChevronForwardOutline
                        className={`
                          text-sm transition-all duration-300
                          ${
                            isActive
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }
                        `}
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <div
            className="flex items-center gap-3
            p-3 rounded-xl bg-white/[0.04]"
          >
            <div
              className="w-11 h-11 shrink-0
              rounded-full bg-blue-500/15
              flex items-center justify-center
              text-blue-400"
            >
              <IoShieldCheckmarkOutline size={23} />
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">
                Admin Panel
              </span>

              <span className="text-xs text-slate-500">
                Store Management
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 min-w-0 h-full
        bg-primary p-4 pt-20 md:pt-4
        overflow-y-auto"
      >

        {user == null ? <LoadingScreen/> :
        <Routes>
          <Route
            index
            element={<Navigate to="orders" replace />}
          />

          <Route
            path="orders"
            element={<AdminOrdersPage />}
          />

          <Route
            path="products"
            element={<AdminProductPage />}
          />

          <Route
            path="users"
            element={<AdminUserPage />}
          />

          <Route
            path="add-product"
            element={<AdminAddProductForm />}
          />

          <Route
            path="edit-product"
            element={<AdminEditProductForm />}
          />
        </Routes>
        }
      </main>
    </div>
  );
}
