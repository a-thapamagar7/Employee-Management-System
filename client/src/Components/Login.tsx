import { useState } from "react";
import { EuiButton, EuiFieldPassword, EuiFieldText, EuiFlexGrid, EuiFlexItem, EuiForm, EuiFormRow, EuiText } from "@elastic/eui";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const OnLogin = async () => {

        if (!email || !password) {
            toast.error("The required fields are empty")
        }

        else {
            const response = await fetch("http://localhost:1447/api/user/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })

            const data = await response.json()
            if (data.status === "success") {
                localStorage.setItem("token", data.user)
                toast.success(data.message, {
                    autoClose: 1000
                })
                toast.onChange(v => {
                    if(v.status === "removed" && v.type === toast.TYPE.SUCCESS){
                        navigate("/")
                    }
                })

            }
            else {
                toast.error(data.message)
            }
        }


    }

    return (
        <form onSubmit={(e) => {e.preventDefault(); OnLogin() }} className="detailsBG flex min-h-screen w-full justify-center items-center">
            <ToastContainer />
            <EuiForm style={{ backgroundColor: "white", width: "40%", borderRadius: "10px", fontWeight: "bold" }}>
                <EuiFlexGrid columns={1} className="w-full py-10 px-16" style={{ rowGap: "17px" }}>
                    <EuiFlexItem style={{ gap: "0px" }}>
                        <EuiText style={{ fontSize: "18px" }}>Login</EuiText>
                        <EuiText style={{ fontSize: "12px", color: "gray" }}>Please fill in all the details below and press the submit button.</EuiText>
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiFormRow label="Email">
                            <EuiFieldText required value={email} onChange={(e) => { setEmail(e.target.value) }} type="email" placeholder="Email" />
                        </EuiFormRow>
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiFormRow label="Password">
                            <EuiFieldPassword required value={password} type="dual" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" />
                        </EuiFormRow>
                    </EuiFlexItem>
                    <EuiFlexItem style={{ marginTop: "8px" }}>
                        <EuiButton type="submit" fill>Submit</EuiButton>
                    </EuiFlexItem>
                    <EuiFlexItem style={{ justifyContent: "center", alignItems: "center" }}>
                        <EuiText className="cursor-pointer hover:underline" onClick={()=>{navigate("/register")}} style={{ fontSize: "11px" }}>Don't have an account, Register</EuiText>
                    </EuiFlexItem>

                </EuiFlexGrid>

            </EuiForm>
        </form>
    );
}
 
export default Login;