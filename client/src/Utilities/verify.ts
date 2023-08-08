const verify = async(navigate: (to: string) => void) => {
    

    if(!localStorage.getItem("token")){
        navigate("/login")
    }
    else {
      const response = await fetch(`http://localhost:1447/api/user/verify`, {
        method: "GET",
        headers: {
          'x-access-token': localStorage.getItem('token') || "",
          "Content-Type": "application/json"
        }
      });
      const data = await response.json()
      if(data.status === "error") {
          navigate("/")
      }
    }
    
}

export default verify;