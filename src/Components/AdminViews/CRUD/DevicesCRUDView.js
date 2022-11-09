import React, {useEffect, useState} from "react";
import SingleSelect from "../../SingleSelect";
import {Button, Col, Form, Row} from "react-bootstrap";
import AddDeviceButton from "../../AddDeviceButton";

export default function DevicesCRUDView(props){

    const [devices,setDevices]=useState([]);
    const [selectedDeviceFromDropdown,setSelectedDeviceFromDropdown] = useState("");

    const [selectedDevice,setSelectedDevice] = useState(
        {
            id:"",
            description:"",
            address:"",
            consumption:"",
            clientUsername:""
        }
    )

    const [newDescription,setNewDescription] = useState("")
    const [newAddress,setNewAddress] = useState("")
    const [newConsumption,setNewConsumption] = useState("")
    const [newClient,setNewClient] = useState("")

    const [errorMessageForLabel,setErrorMessageForLabel]=useState("");

    const initializeForm = () => {

        console.log(devices);

        let device = devices.find(device => device.description===selectedDeviceFromDropdown);
        console.log(selectedDeviceFromDropdown);
        setSelectedDevice(device);

        setNewDescription(device.description);
        setNewAddress(device.address);
        setNewConsumption(device.consumption);
        setNewClient(device.clientUsername);
        setErrorMessageForLabel("");

    }

    const changesOccurredInFormData = () =>{
        return newDescription !== selectedDevice.description ||
            newAddress !== selectedDevice.address ||
            newConsumption !== selectedDevice.consumption ||
            newClient !== selectedDevice.clientUsername;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let changesOccurredStatus = changesOccurredInFormData();
        console.log(newClient);
        if(changesOccurredStatus===true) {
            let d = {
                id: selectedDevice.id,
                description:newDescription,
                address:newAddress,
                consumption:newConsumption,
                clientUsername:newClient
            }
            await fetch("http://localhost:8081/backend/updateDevice", {
                method: 'PUT',
                headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                },
                body: JSON.stringify(d)
            }).then(function (res) {
                    return res.text();
            }).then(function (res) {
                console.log(res)
                setErrorMessageForLabel(res);
            })
        }
        else{
            setErrorMessageForLabel("No changes.");
        }
    }

    const handleDelete = () =>{
        fetch("http://localhost:8081/backend/deleteDevice/"+selectedDevice.id,{
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        })
            .then(function (res) {
                return res.text();
            }).then(function (res) {
                setErrorMessageForLabel(res);
                setDevices(devices.filter(device=>device.id!==device.id));
                setSelectedDeviceFromDropdown("");
            }
        )
            .catch(error => {
                console.error('There was an error!', error);
            })
    }

    const getDevices = () =>{
        if(devices.length===0) {
            fetch("http://localhost:8081/backend/getDevices")
                .then(async response => {
                    const data = await response.json();
                    //check for response
                    if (!response.ok) {
                        //get error message from body or default to response statusText
                        if (data.name === "") return false;
                        else {
                            return Promise.reject("Some weird error.");
                        }
                    } else {
                        setDevices(data);
                    }

                })
                .catch(error => {
                    console.error('There was an error!', error);
                })
        }
    }

    useEffect(getDevices,[]);

    useEffect(()=>{
        if(selectedDeviceFromDropdown!=="") {
            initializeForm();
        }
    },[selectedDeviceFromDropdown])

    return (
        <>
            {devices.length>0 &&
                <SingleSelect parentFunction={setSelectedDeviceFromDropdown} inputStrings={devices.map(el => el.description)}/>
            }
            <br/>
            {selectedDeviceFromDropdown!==""&&
                <Form>
                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalDescription">
                        <Col mb={2}>
                            <Form.Control type="text" placeholder="Description" value={newDescription}
                                          onChange={(e) => setNewDescription(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalAddress">
                        <Col mb={2}>
                            <Form.Control type="text" placeholder="New address" value={newAddress}
                                          onChange={(e) => setNewAddress(e.target.value)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalConsumption">
                        <Col mb={2}>
                            <Form.Control type="text" placeholder="Consumption" value={newConsumption}
                                          onChange={(e) => setNewConsumption(e.target.value)}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalClient">
                        <Col mb={2}>
                            <Form.Control type="text" placeholder="Client" value={newClient}
                                          onChange={(e) => setNewClient(e.target.value)}/>
                        </Col>
                    </Form.Group>
                    {
                        errorMessageForLabel !== "" &&
                        <>
                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalLabel">

                                <Col mb={2}>
                                    <Form.Label className="HomepageLabel">{errorMessageForLabel}</Form.Label>
                                </Col>
                            </Form.Group>
                        </>
                    }
                    <Button className="HomepageButton right-margin-sm" onClick={(e) => handleSubmit(e)}>
                        Update
                    </Button>
                    <Button className="HomepageButton" onClick={(e) => handleDelete(e)}>
                        Delete
                    </Button>

                </Form>
            }
            <br/>
            <Form.Group as={Row} className="mb-3" controlId="formHorizontalAdd">
                <Col mb={2}>
                    <AddDeviceButton/>
                </Col>
            </Form.Group>
        </>
    );
}