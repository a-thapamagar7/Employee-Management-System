import { EuiBasicTable, EuiButton, EuiButtonEmpty, EuiButtonIcon, EuiDatePicker, EuiFieldNumber, EuiFieldText, EuiFilePicker, EuiFlexGrid, EuiFlexItem, EuiForm, EuiFormRow, EuiIcon, EuiModal, EuiModalBody, EuiModalFooter, EuiModalHeader, EuiModalHeaderTitle, EuiText } from "@elastic/eui";
import { Moment } from "moment";
import moment from "moment"
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import NavigationBar from "./NavigationBar";
import { ToastContainer, toast } from "react-toastify";

type employeeObj = {
    _id: string,
    name: string,
    department: string,
    designation: string,
    salary: number,
    joinDate: Date,
    image: string,
    citizenship: string
}[]

type employeeObj1 = {
    _id: string,
    name: string,
    department: string,
    designation: string,
    salary: number,
    joinDate: Date,
    image: string,
    citizenship: string
}

const Employee = () => {

    

    //useStates
    const [editPressed, setEditPressed] = useState(false)
    const [name, setName] = useState<string>("")
    const [designation, setDesignation] = useState<string>("")
    const [salary, setSalary] = useState(0)
    const [joinDate, setJoinDate] = useState<Moment | null>(null)
    const [citizenship, setCitizenship] = useState<File | null>(null)
    const [image, setImage] = useState<File | null>(null)
    const [department, setDepartment] = useState<string>("")
    const [employee, setEmployee] = useState<employeeObj | []>([])
    const [idPressed, setIdPressed] = useState<string>("");
    const [isModalVisible, setIsModalVisible] = useState(false);


    //useRefs
    const filePickerRef = useRef<EuiFilePicker | null>(null);
    const imagePickerRef = useRef<EuiFilePicker | null>(null);
    

    useEffect(() => {
        GetEmployees()
    }, [])


    const tableColumns = [
        {
            field: 'name',
            name: "Name",
            width: "20%",
            render: (name: string, employ: employeeObj1) => (
                <div className="flex flex-row items-center">
                    <img src={`http://localhost:1447/${employ.image}`} alt={employ.name} className="w-12 h-12 rounded-full mr-4" />
                    {name}
                    
                </div>
            )
        },
        {
            field: "department",
            name: "Department",
            width: "20%"
        },
        {
            field: "designation",
            name: "Designation",
            width: "20%"
        },
        {
            field: "salary",
            name: "Salary",
            width: "20%",
            render: (salary: string) => (
                <div className="flex flex-row items-center">
                    Rs. {salary}
                    
                </div>
            )
        },
        {
            field: 'citizenship',
            name: "Citizenship",
            width: "10%",
            render: (citizenship: string) => (
                <div className="flex flex-row ml-4 w-full">
                    <EuiButtonIcon iconType="link" onClick={()=>{window.location.href = (`http://localhost:1447/${citizenship}`)}}/>
                    
                </div>
            )
        },
        {
            name: "Actions",
            width: "10%",
            actions: [
                {
                    render: (item: employeeObj1) => (
                        <EuiButtonIcon
                            iconType="pencil"
                            aria-label="Edit"
                            color="primary"
                            onClick={() => { setIdPressed(item._id); ShowEditMode(item) }}
                        />
                    ),
                },
                {
                    render: (item: employeeObj1) => (
                        <EuiButtonIcon
                            iconType="trash"
                            aria-label="Delete"
                            color="danger"
                            onClick={() => { DeleteEmployee(item._id) }}
                        />
                    ),
                },
            ],
        },
    ]

    const GetEmployees = async () => {
        const response = await fetch("http://localhost:1447/api/getemployeeinfo", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const answer = await response.json();
        setEmployee(answer.data)
    }

    const CreateEmployee = async () => {
        if(!editPressed && (!name || !department || !designation || !salary || !joinDate || !image || !citizenship)){
            console.log("jheo")
            toast.error("Please fill all the required fields")
        }
        else if(!editPressed){
            const formData = new FormData();
            formData.append('name', name);
            formData.append('department', department);
            formData.append('designation', designation);
            formData.append('salary', salary.toString()); // Convert salary to a string
            formData.append('joinDate', joinDate?.toISOString() || ''); // Convert joinDate to ISO string or use empty string if null

            // Append the image and citizenship files
            if (image) {
                formData.append('image', image, image.name);
            }

            if (citizenship) {
                formData.append('citizenship', citizenship, citizenship.name);
            }
            const response = await fetch("http://localhost:1447/api/employee/create", {
                method: "POST",
                body: formData
            })
            const data = await response.json()
            if (data.status === "success") {
                setEmployee(data.data)
                ClearAll()
            }
        }
        else {
            EditEmployee()
        }
        
    }

    const ShowEditMode = (employeeDetails: employeeObj1) => {

        setIdPressed(employeeDetails._id)
        setName(employeeDetails.name)
        setDepartment(employeeDetails.department)
        setDesignation(employeeDetails.designation)
        setSalary(employeeDetails.salary)
        setJoinDate(moment(employeeDetails.joinDate))
        setEditPressed(true)
        setIsModalVisible(true)
    }

    const ClearAll = () => {
        setName("")
        setDesignation("")
        setSalary(0)
        setDepartment("")
        setCitizenship(null)
        setImage(null)
        setJoinDate(null)
        filePickerRef.current?.removeFiles()
        imagePickerRef.current?.removeFiles()
    }

    const EditEmployee = async () => {

        if(!name || !department || !designation || !salary || !joinDate ){
            
            toast.error("Please enter all the required fields")
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('department', department);
        formData.append('designation', designation);
        formData.append('salary', salary.toString());
        formData.append('joinDate', joinDate?.toISOString() || ''); // Convert joinDate to ISO string or use empty string if null

        // Append the image and citizenship files
        if (image) {
            formData.append('image', image, image.name);
        }

        if (citizenship) {
            formData.append('citizenship', citizenship, citizenship.name);
        }

        const response = await fetch(`http://localhost:1447/api/employee/edit/${idPressed}`, {
            method: "PATCH",
            body: formData
        })
        const data : {status: string, message: string, data: employeeObj1} = await response.json()
        if (data.status === "success") {
            const index = employee.findIndex(random => random._id === idPressed);
            const updatedEmployee = Object.assign({}, employee[index], data.data )
            const newState = [...employee]
            newState[index] = updatedEmployee
            setEmployee(newState)
            setEditPressed(false)
            ClearAll()
            setIsModalVisible(false)
        }
    }

    const DeleteEmployee = async (employeeID: string) => {
        const response = await fetch(`http://localhost:1447/api/employee/delete/${employeeID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json()
        if (data.status === "success") {
            const newData = employee.filter(item => item._id !== employeeID);
            setEmployee(newData)
            ClearAll()
        }
    }


    const handleChange = (date: Moment) => {
        setJoinDate(date);
    };

    const handleImageChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            setImage(files[0]);
        } else {
            setImage(null);
        }
    };

    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            setCitizenship(files[0]);
        } else {
            setCitizenship(null);
        }
    };

    

    return (
        <div className="h-full w-full min-h-screen roboto" style={{ backgroundColor: "#f5f4fa" }}>
            <ToastContainer/>
            {isModalVisible && (
                <EuiModal onClose={() => { setEditPressed(false); ClearAll(); setIsModalVisible(false) }} style={{ width: "1000px" }}>
                    <EuiModalHeader>
                        <EuiModalHeaderTitle><EuiText textAlign="center" size="m" style={{ fontWeight: "bold" }}>{editPressed? "Edit Employee" : "Create Employee"}</EuiText></EuiModalHeaderTitle>
                    </EuiModalHeader>

                    <EuiModalBody>
                        <EuiForm>
                            <EuiFlexGrid columns={2} gutterSize="l" style={{ padding: "10px" }}>
                                <EuiFlexItem>
                                    <EuiFormRow label="Name">
                                        <EuiFieldText value={name} onChange={(e) => { setName(e.target.value) }} placeholder="Name" />
                                    </EuiFormRow>

                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow label="Department">
                                        <EuiFieldText value={department} onChange={(e) => { setDepartment(e.target.value) }} placeholder="Department" />
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow label="Designation">
                                        <EuiFieldText value={designation} onChange={(e) => { setDesignation(e.target.value) }} placeholder="Designation" />
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow label="Salary">
                                        <EuiFieldNumber value={salary} min={0} onChange={(e) => { setSalary(parseInt(e.target.value)) }} placeholder="Salary" />
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow label="Join Date">
                                        <EuiDatePicker selected={joinDate} onSelect={handleChange} placeholder="Join Date" />
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow label="Image" >
                                        <EuiFilePicker ref={filePickerRef} onChange={handleImageChange} initialPromptText="Select or drag and drop an image" accept=".jpg" display="default" />
                                    </EuiFormRow>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiFormRow label="Citizenship">
                                        <EuiFilePicker ref={imagePickerRef} onChange={handleFileChange} placeholder="Name" initialPromptText="Select or drag and drop a pdf" accept=".pdf" />
                                    </EuiFormRow>
                                </EuiFlexItem>
                            </EuiFlexGrid>

                        </EuiForm>
                    </EuiModalBody>

                    <EuiModalFooter>
                        <EuiButtonEmpty onClick={() => { setEditPressed(false); setIsModalVisible(false); ClearAll(); }}>Cancel</EuiButtonEmpty>
                        <EuiButton type="submit" onClick={() => { CreateEmployee() }} fill>
                            Submit
                        </EuiButton>
                    </EuiModalFooter>
                </EuiModal>
            )}
            <NavigationBar/>
            <div className="flex flex-col gap-y-7 px-14 pt-10 w-full">
                <div className="flex flex-row items-center gap-x-1">
                    <EuiText size="xs">Employees</EuiText><EuiIcon type={"user"} />
                </div>
                <div className="bg-white gap-y-4 flex flex-col px-6 py-4 w-full">
                    <div>
                        <EuiText size="xs">All Employees</EuiText>
                    </div>
                    <div>
                        <EuiButton onClick={() => { setIsModalVisible(true) }} size="s">
                            Create<EuiIcon type={"plus"} />
                        </EuiButton>
                    </div>
                    <EuiBasicTable items={employee} columns={tableColumns} hasActions={true} />
                </div>
            </div>
        </div>
    );
};

export default Employee;