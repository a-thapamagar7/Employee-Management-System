import { EuiButton, EuiFieldPassword, EuiFieldText, EuiFlexGrid, EuiFlexItem, EuiForm, EuiFormRow, EuiText } from "@elastic/eui";
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [repassword, setRePassword] = useState("")

    const ClearAll = () => {
        setName("")
        setEmail("")
        setPassword("")
        setRePassword("")
    }

    const OnRegister = async () => {

        if (!name || !email || !password || !repassword) {
            toast.error("The required fields are empty")
        }

        else if (password !== repassword) {
            toast.error("The passwords do not match")
        }

        else {
            const response = await fetch("http://localhost:1447/api/user/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            })

            const data = await response.json()
            if (data.status === "success") {
                ClearAll()
                toast.success(data.message, {
                    autoClose: 1000
                })
                toast.onChange(v => {
                    if(v.status === "removed" && v.type === toast.TYPE.SUCCESS){
                        navigate("/login")
                    }
                })
                
            }
        }


    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); OnRegister() }} className="detailsBG flex min-h-screen w-full justify-center items-center">
            <ToastContainer />
            <EuiForm style={{ backgroundColor: "white", width: "40%", borderRadius: "10px", fontWeight: "bold" }}>
                <EuiFlexGrid columns={1} className="w-full py-10 px-16" style={{ rowGap: "17px" }}>
                    <EuiFlexItem style={{ gap: "0px" }}>
                        <EuiText style={{ fontSize: "18px" }}>Register</EuiText>
                        <EuiText style={{ fontSize: "12px", color: "gray" }}>Please fill in all the details below and press the submit button.</EuiText>
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiFormRow label="Name">
                            <EuiFieldText required value={name} onChange={(e) => { setName(e.target.value) }} placeholder="Name" />
                        </EuiFormRow>
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
                    <EuiFlexItem>
                        <EuiFormRow label="Re-enter Password">
                            <EuiFieldPassword required value={repassword} type="dual" onChange={(e) => { setRePassword(e.target.value) }} placeholder="Re-enter Password" />
                        </EuiFormRow>
                    </EuiFlexItem>
                    <EuiFlexItem style={{ marginTop: "8px" }}>
                        <EuiButton type="submit" fill>Submit</EuiButton>
                    </EuiFlexItem>
                    <EuiFlexItem style={{ justifyContent: "center", alignItems: "center" }}>
                        <EuiText className="cursor-pointer hover:underline" onClick={()=>{navigate("/login")}}  style={{ fontSize: "11px" }}>Already have an account, Login</EuiText>
                    </EuiFlexItem>

                </EuiFlexGrid>

            </EuiForm>
        </form>
    );
}

export default Register;