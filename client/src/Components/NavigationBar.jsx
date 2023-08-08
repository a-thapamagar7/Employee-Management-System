import { EuiAvatar, EuiIcon, EuiText } from "@elastic/eui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState("User")
    
    useEffect(()=>{
        findUser()
    },[])

    const findUser = async() => {
        const response = await fetch(`http://localhost:1447/api/user/verify`, {
            method: "GET",
            headers: {
                'x-access-token': localStorage.getItem('token') || "",
                "Content-Type": "application/json"
            }
        });
        const data = await response.json()
        if(data.status === "success") {
            
            setUser(data.data.name)
        }
    }

    const Logout = () =>{
        localStorage.removeItem("token"); // removes the token from local storage
        navigate("/login"); // redirect the user to the login page
    }
    return (
        <div className="h-16 w-full grid grid-cols-12 bg-rose-600 items-center px-14">
            <EuiText onClick={()=>{navigate("/")}} className="col-span-9 hover:animate-pulse cursor-pointer"  style={{fontSize: "15px", color: "white", fontWeight: "bold"}}>Employee Management System</EuiText>
            <EuiText onClick={()=>{navigate("/")}} className="col-span-1 cursor-pointer flex justify-end items-center gap-x-2"  style={{fontSize: "12px", color: "white"}}>
                
                <span>{user}</span>
                <EuiAvatar name="" size="s" iconSize="s" color="#FFFFFF" iconType="user" style={{backgroundColor: "white"}}/>
                
            </EuiText>
            <EuiText onClick={()=>{navigate("/")}} className="col-span-1 hover:animate-pulse cursor-pointer flex justify-end"  style={{fontSize: "12px", color: "white"}}>Home</EuiText>
            <EuiText onClick={()=>{Logout()}} className="col-span-1 hover:animate-pulse cursor-pointer flex justify-end"  style={{fontSize: "12px", color: "white"}}>Logout</EuiText>
        </div>
    );
}
 
export default NavigationBar;