import { useEffect, useState} from "react"
import { Link } from "react-router-dom"
import api from "../utils/api"
import { useNavigate } from "react-router-dom"

export default function UserData() {
      const [user, setUser] = useState(null)
      const [selectedOption, setSelectedOption] = useState("me")
      const navigate = useNavigate()

      useEffect(
            ()=> {
                  const token = localStorage.getItem("token")

                  if(token != null){
                        api.get("/users/me", {
                              headers: {
                                    Authorization: `Bearer ${token}`
                              }
                        }).then((res)=> {
                              setUser(res.data)
                        }).catch((err)=> {
                              console.log(err)
                              setUser(null)
                        })
                  }
            },
            []
      )
      return(
            <div>
            {
                  user == null ? <div>
                        <Link to="/login" className="text-white bg-red-500 hover:text-gray-500 w-[100px] h-[60px]">Login</Link>
                  </div>:
                  
                  <div>
                        <img src={user.image} alt="" className="w-[40px] h-[40px] rounded-full"/>
                        <select value={selectedOption} onChange={
                              (e)=> {
                                    setSelectedOption(e.target.value)

                                    if(e.target.value == "my-orders"){
                                          navigate("/my-orders")
                                    }
                                    
                                    if(e.target.value == "settings") {
                                          navigate("/settings")
                                    }

                                    if(e.target.value == "log-out"){
                                          localStorage.removeItem("token")
                                          setUser(null)
                                          setSelectedOption("me")
                                          navigate("/")
                                    }
                              }
                        }>
                              <option value="me">{user.firstName}</option>
                              <option value="settings">settings</option>
                              <option value="my-orders">My Orders</option>
                              <option value="log-out">Log Out</option>
                        </select>
                  </div>
                  
            }
                  
            </div>
      )
}