import { ReactNode, useEffect } from "react";
import verify from "../Utilities/verify";
import { useNavigate } from "react-router-dom";

type Props = {
    children: ReactNode
}

const ProtectedRoute = ({children}: Props) => {

    const navigate = useNavigate()

    useEffect(()=>{
        verify(navigate)
    },[])

    
    

    return (
        <>
            {children}
        </>
    );
}
 
export default ProtectedRoute;