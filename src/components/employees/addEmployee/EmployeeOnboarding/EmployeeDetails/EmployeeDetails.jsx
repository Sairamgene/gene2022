import React, { useEffect, useState, useContext } from 'react';
import { TextField, Form, ActionButton, Picker, Item, Flex } from '@adobe/react-spectrum'
import { Country, State, City } from 'country-state-city';
import * as utils from '../../../../../utils';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FirebaseContext from '../../../../../firebase/Context';

import { Dropdown } from 'primereact/dropdown';
import "./EmployeeDetails.css"
import { Calendar } from 'primereact/calendar';

const EmployeeDetails = (props) => {
    // state= this.props.employeeDetails
    const [firstName, setFirstName] = useState(props.employeeDetails.firstName);
    const [lastName, setLastName] = useState(props.employeeDetails.lastName);
    const [middleInitial, setMiddleInitial] = useState(props.employeeDetails.middleInitial);
    const [phone, setPhone] = useState(props.employeeDetails.phone);
    const [mobile, setMobile] = useState(props.employeeDetails.mobile);
    const [address, setAddress] = useState(props.employeeDetails.address);
    const [city, setCity] = useState(props.employeeDetails.city);
    const [state, setState] = useState(props.employeeDetails.state);
    const [country, setCountry] = useState(props.employeeDetails.country);
    const [countryCode, setCountryCode] = useState('');
    const [stateCode, setStateCode] = useState('');

    const [zipCode, setZipcode] = useState(props.employeeDetails.ZipCode);
    const [email, setEmail] = useState(props.employeeDetails.email);
    const [ssn, setSSN] = useState(props.employeeDetails.ssn);
    const [vendor, setVendor] = useState(props.employeeDetails.vendor);
    const [vendorLocation, setVendorLocation] = useState(props.employeeDetails.vendorLocation);
    const [vendorContact, setVendorContact] = useState(props.employeeDetails.vendorContact);

    const [employeeType, setEmployeeType] = useState(props.employeeDetails.employeeType);
    const [startDate, setStartDate] = useState(props.employeeDetails.startDate);
    const [employeeStatus, setEmployeeStatus] = useState(props.employeeDetails.employeeStatus);
    const [profileTitle, setProfileTitle] = useState(props.employeeDetails.profileTitle);
    const [maritalStatus, setMaritalStatus] = useState(props.employeeDetails.maritalStatus);
    const [currentLocation, setCurrentLocation] = useState(props.employeeDetails.currentLocation);
    const [dob, setDob] = useState(props.employeeDetails.dob);

    const [addpartnerDetails, setPartnerDetails] = useState([])

    const firebase = useContext(FirebaseContext);
    // console.log("country==================",Country.getAllCountries())
    const getAllCountries = Country.getAllCountries()

    // console.log("State============",State.getStatesOfCountry("AF"))
    let employeeTypes = [
        { key: 'W2', name: 'W2' },
        { key: '1099', name: '1099' },
        { key: 'C2C', name: 'C2C' },
    ];

    let maritalStatusTypes = [
        { key: 'SINGLE', name: 'Single' },
        { key: 'MARRIED', name: 'Married' },
    ];

    let employeeStatuss = [
        { key: 'Active', name: 'Active' },
        { key: 'Inactive', name: 'Inactive' }
    ]


    const buttonDisabled = () => {
        return !utils.validate_email(email) ||
            !utils.validate_firstName(firstName) ||
            !utils.validate_lastName(lastName)
    }


    const selectCountry = (e) => {
        setCountry(e.target.value);
        getAllCountries.map((val, i) => {
            if (val.name === e.target.value)
                setCountryCode(val.isoCode);
        })

    }

    const partnersDetails = () => {
        let firebasePartnersRef = `${firebase.tenantId}_Partners`;
        firebase.db.ref(firebasePartnersRef).once('value').then(res => {
            const partners = res.val();
            // console.log('HERE', partners)
            const options = Object.keys(partners).map(partnerKey => {
                // console.log('JR', partners[partnerKey].OrganizationName)
                return {
                    label: partners[partnerKey].OrganizationName + ', ' + partnerKey,
                    name: partners[partnerKey].OrganizationName,
                    managers: partners[partnerKey].Managers ?? [],
                    Locations: partners[partnerKey].Locations ?? [],
                    key: partnerKey
                }
            });

            console.log("partner-==========", options);
            setPartnerDetails(options)
        })
    }

    useEffect(() => {
        partnersDetails()
    }, [])

    const selectState = (e) => {
        setState(e.target.value);
        State.getStatesOfCountry(countryCode).map((val, i) => {
            if (val.name === e.target.value)
                setStateCode(val.isoCode);
        })

        console.log("========state", state);
        console.log("============code", stateCode);
    }

    const onChangeVendor = (e) => {
        console.log("e", e);
        setVendor(e.target.value)
    }

    const onChangeType = (e) => {
        // console.log("e",e);
        setEmployeeType(e.target.value)
    }

    return (<>
        <div className="row">
            <div className="col-md-6">
                <Form isQuiet marginTop="20px" direction="column" width="100%">

                    {/* <Picker
                        UNSAFE_className="onboarding-details-picker"
                        label="Employee Type"
                        labelPosition="side"
                        defaultSelectedKey={employeeType}
                        items={employeeTypes}
                        onSelectionChange={setEmployeeType}>
                        {(item) => <Item>{item.name}</Item>}
                    </Picker> */}



                    <TextField labelPosition="side" validationState={utils.validate_firstName(firstName) ? 'valid' : 'invalid'} UNSAFE_className="onboarding-details-text-field"
                        label="First Name" isRequired inputMode="text" onChange={setFirstName} defaultValue={firstName} />

                    <TextField labelPosition="side" UNSAFE_className="onboarding-details-text-field"
                        label="Middle Initial" inputMode="text" onChange={setMiddleInitial} defaultValue={middleInitial} />

                    <TextField labelPosition="side" validationState={utils.validate_lastName(lastName) ? 'valid' : 'invalid'} UNSAFE_className="onboarding-details-text-field"
                        label="Last Name" isRequired inputMode="text" onChange={setLastName} defaultValue={lastName} />

                    <TextField labelPosition="side" validationState={utils.validate_email(email) ? 'valid' : 'invalid'} UNSAFE_className="onboarding-details-text-field"
                        label="Email" inputMode="text" isRequired onChange={setEmail} defaultValue={email} />

                    <TextField labelPosition="side" UNSAFE_className="onboarding-details-text-field"
                        label="Phone" inputMode="text" onChange={setPhone} defaultValue={phone} />

                    <TextField labelPosition="side" UNSAFE_className="onboarding-details-text-field"
                        label="Mobile" inputMode="text" onChange={setMobile} defaultValue={mobile} />

                    <Flex UNSAFE_className="details-calendar-input">
                        <label htmlFor="dob">Date of Birth</label>
                        <Calendar yearNavigator yearRange="1910:2021" width="100%" id="dob" className="onboarding-calendar-input" value={new Date(dob)} showIcon onChange={(e) => setDob(new Date(e.value).toISOString())} />
                    </Flex>

                    <TextField labelPosition="side" UNSAFE_className="onboarding-details-text-field"
                        label="SSN" inputMode="text" onChange={setSSN} defaultValue={ssn} />



                    {/* <TextField labelPosition="side"  UNSAFE_className="onboarding-details-text-field" 
                    label="Marital Status" inputMode="text" onChange={setMaritalStatus} defaultValue={maritalStatus}/> */}




                    {/* <TextField labelPosition="side"  UNSAFE_className="onboarding-details-text-field" 
                    label="Employee Status" inputMode="text" onChange={setEmployeeStatus} defaultValue={employeeStatus}/> */}


                </Form>
            </div>
            <div className="col-md-6">
                <Form isQuiet marginTop="20px" direction="column" width="100%">


                    <InputLabel style={{ marginRight: '15px' }} UNSAFE_className="onboarding-details-picker">Employee Type</InputLabel>
                    <Select labelId="employee-projects-prime-react-input"
                        // id="demo-controlled-open-select"
                        name="employeeType"
                        // disabled={formMode === 'fixed'}
                        value={employeeType}
                        onChange={(e) => onChangeType(e)}
                    >

                        {employeeTypes.map((val, i) => {
                            return <MenuItem value={val.name} >{val.name}</MenuItem>
                        })}

                    </Select>
                    {employeeType === 'C2C' ?
                        <>
                            {/* <TextField labelPosition="side" UNSAFE_className="onboarding-details-text-field" 
                    label="Vendor" inputMode="text" onChange={setVendor} defaultValue={vendor}/> */}
                            <InputLabel style={{ marginRight: '15px' }} UNSAFE_className="onboarding-details-picker">Vendor</InputLabel>
                            <Select labelId="employee-projects-prime-react-input"
                                // id="demo-controlled-open-select"
                                name="vendor"
                                // disabled={formMode === 'fixed'}
                                value={vendor}
                                onChange={(e) => onChangeVendor(e)}
                            >

                                {addpartnerDetails.map((val, i) => {
                                    return <MenuItem value={val.label} >{val.label}</MenuItem>
                                })}

                            </Select>

                            {/* <TextField labelPosition="side" UNSAFE_className="onboarding-details-text-field" 
                    label="Vendor Location" inputMode="text" onChange={setVendorLocation} defaultValue={vendorLocation}/>

                    <TextField labelPosition="side"  UNSAFE_className="onboarding-details-text-field" 
                    label="Vendor Contact" inputMode="text" onChange={setVendorContact} defaultValue={vendorContact}/> */}

                        </> : null
                    }

                    <Flex UNSAFE_className="details-calendar-input">
                        <label htmlFor="visaExpiry">Start Date</label>
                        <Calendar width="100%" id="visaExpiry" className="onboarding-calendar-input" value={new Date(startDate)} showIcon onChange={(e) => setStartDate(new Date(e.value).toISOString())} />
                    </Flex>

                    <TextField labelPosition="side" UNSAFE_className="onboarding-details-text-field"
                        label="Profile Title" inputMode="text" onChange={setProfileTitle} defaultValue={profileTitle} />



                    <Picker
                        UNSAFE_className="onboarding-details-picker"
                        label="Employee Status"
                        labelPosition="side"
                        defaultSelectedKey={employeeStatus}
                        items={employeeStatuss}
                        onSelectionChange={setEmployeeStatus}>
                        {(item) => <Item>{item.name}</Item>}
                    </Picker>

                    <Picker
                        UNSAFE_className="onboarding-details-picker"
                        label="Marital Status"
                        labelPosition="side"
                        defaultSelectedKey={maritalStatus}
                        items={maritalStatusTypes}
                        onSelectionChange={setMaritalStatus}>
                        {(item) => <Item>{item.name}</Item>}
                    </Picker>


                    <TextField labelPosition="side" UNSAFE_className="onboarding-details-text-field"
                        label="Address" inputMode="text" onChange={setAddress} defaultValue={address} />

                    <TextField labelPosition="side" UNSAFE_className="onboarding-details-text-field"
                        label="City" inputMode="text" onChange={setCity} defaultValue={city} />

                    <InputLabel id="label">Country</InputLabel>
                    <Select labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select" value={country} onChange={(e) => selectCountry(e)}>

                        {getAllCountries.map((val, i) => {
                            return <MenuItem value={val.name} >{val.name}</MenuItem>
                        })}

                    </Select>

                    <InputLabel id="label">State</InputLabel>
                    <Select labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select" value={state} onChange={(e) => selectState(e)}>

                        {State.getStatesOfCountry(countryCode).map((val, i) => {
                            return <MenuItem value={val.name} >{`${val.name} - ${val.isoCode}`}</MenuItem>
                        })}

                    </Select>


                    <TextField labelPosition="side" UNSAFE_className="onboarding-details-text-field"
                        label="Zip Code" inputMode="text" onChange={setZipcode} defaultValue={zipCode} />



                    {/* <Picker
                        UNSAFE_className="onboarding-details-picker"
                        label="Employee Status"
                        labelPosition="side"
                        defaultSelectedKey={vendor}
                        items={setPartnerDetails}
                        onSelectionChange={setVendor}>
                        {(item) => <Item>{item.name}</Item>}
                    </Picker> */}

                    {/* <Flex>
                                            <label className="textLabelProjects" >Vendor</label>
                                            <Dropdown className="textLabelDropDowns" 
                                            // value={projects[activeProject].projectItenerary[activeHierarchy].organizationName} 
                                            value=""
                                            options={setPartnerDetails} 
                                            name="vendor" 
                                            filter 
                                            filterBy="label" 
                                            // dataKey="key"
                                            optionLabel="label"
                                            // disabled={formMode === 'fixed'}
                                            onChange={setVendor} 
                                            placeholder="Vendor"/>
                                        </Flex> */}


                    {/* <TextField labelPosition="side"  UNSAFE_className="onboarding-details-text-field" 
                    label="Current Location" inputMode="text" onChange={setCurrentLocation} defaultValue={currentLocation}/> */}




                </Form>
            </div>
        </div>

        <div className="row">
            <div className="col-md-12">
                <div style={{ width: '100%', height: '100px', background: 'transparent', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ alignSelf: 'center', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <ActionButton UNSAFE_className="global-action-btn" isDisabled={props.activeStep === 0} onPress={() => props.handleBack()}>Back</ActionButton>
                        <div>
                            <ActionButton UNSAFE_className="global-action-btn" isDisabled={buttonDisabled()} onPress={() => props.handleNext({
                                ...{
                                    firstName, lastName, middleInitial,
                                    phone, mobile, address, city, country, zipCode, stateCode, state,
                                    email, ssn, vendor,
                                    vendorLocation, vendorContact,
                                    startDate, employeeStatus, profileTitle,
                                    maritalStatus, currentLocation,
                                    dob, employeeType
                                }
                            })}>Save</ActionButton>
                            <ActionButton UNSAFE_className="global-action-btn" isDisabled={buttonDisabled()} onPress={() => props.handleNext({
                                ...{
                                    firstName, lastName, middleInitial,
                                    phone, mobile, address, city, country, zipCode, stateCode, state,
                                    email, ssn, vendor,
                                    vendorLocation, vendorContact,
                                    startDate, employeeStatus, profileTitle,
                                    maritalStatus, currentLocation,
                                    dob, employeeType
                                }
                            })} marginStart="size-250">Save & Next</ActionButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>);

}

export default EmployeeDetails;