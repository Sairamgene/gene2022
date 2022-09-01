import { ActionButton, Button, Flex, Form, Item, Picker, Text, TextField, View } from '@adobe/react-spectrum';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory} from 'react-router-dom';
import Back from '@spectrum-icons/workflow/BackAndroid';
import Edit from '@spectrum-icons/workflow/Edit';
import SaveFloppy from '@spectrum-icons/workflow/SaveFloppy';
import { Toast } from 'primereact/toast';
import * as utils from '../../../utils';
import { Country, State, City }  from 'country-state-city';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import './EmployeeDetails.css';
import FirebaseContext from '../../../firebase/Context';

import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Calendar } from 'primereact/calendar';

const EmployeeDetails = (props) => {

    console.log('employee details', props)

    const [employeeId]                      = useState(props.employee.id);
    const [firstName, setFirstName]          = useState(props.employee.firstName ?? '');
    const [lastName, setLastName]           = useState(props.employee.lastName ?? '');
    const [middleInitial, setMiddleInitial] = useState(props.employee.middleInitial ?? '');
    const [phone, setPhone]                 = useState(props.employee.phone ?? '');
    const [mobile, setMobile]               = useState(props.employee.mobile ?? '');
    const [address, setAddress]             = useState(props.employee.address ?? '');
    const [city , setCity]                    = useState(props.employee.city ?? '');
    const [state, setState]                   = useState(props.employee.state ?? '');
    const [country , setCountry]              = useState(props.employee.country ?? '');
    const [countryCode , setCountryCode ]     = useState(props.employee.countryCode ?? '');
    const [ stateCode , setStateCode]         = useState(props.employee.stateCode ?? '');

    const [zipCode , setZipcode]              = useState(props.employee.ZipCode ?? '');

    const [email, setEmail]                 = useState(props.employee.email ?? '');
    const [ssn, setSSN]                     = useState(props.employee.ssn ?? '');
    const [vendor, setVendor]                 = useState(props.employee.vendor ?? '');
    const [vendorLocation, setVendorLocation] = useState(props.employee.vendorLocation);
    const [vendorContact, setVendorContact]   = useState(props.employee.vendorContact);
    
    const [employeeType, setEmployeeType]     = useState(props.employee.employeeType ?? 'W2');
    const [startDate, setStartDate]           = useState(props.employee.startDate ?? '');
    const [employeeStatus, setEmployeeStatus] = useState(props.employee.employeeStatus ?? 'Active');
    const [profileTitle, setProfileTitle]       = useState(props.employee.profileTitle ?? null);
    const [maritalStatus, setMaritalStatus]   = useState(props.employee.maritalStatus ?? 'SINGLE');
    // const [currentLocation, setCurrentLocation] = useState(props.employee.currentLocation);
    const [dob, setDob]                         = useState(props.employee.dob ?? '');

    const [addpartnerDetails , setPartnerDetails] = useState([]);

    let employeeTypes = [
        {key: 'W2', name: 'W2'},
        {key: '1099', name: '1099'},
        {key: 'C2C', name: 'C2C'},
      ];

      let maritalStatusTypes = [
        {key: 'SINGLE', name: 'Single'},
        {key: 'MARRIED', name: 'Married'},
      ];

      let employeeStatuss = [
        {key: 'Active', name: 'Active'},
    {key: 'Inactive', name: 'Inactive'}
  ]

  const getAllCountries =  Country.getAllCountries()

    const [isLoading, setIsLoading] = useState(false);
    const [formMode, setFormMode] = useState('fixed')
    const history = useHistory();
    const firebase = useContext(FirebaseContext);
    const myToast = useRef(null);

    const showToast = (severityValue, summaryValue, detailValue) => {  
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }

    const onCancelEdit = () => {
        setFormMode('fixed');
        setFirstName(props.employee.firstName ?? '');
        setLastName(props.employee.lastName ?? '');
        setMiddleInitial(props.employee.middleInitial ?? '');
        setPhone(props.employee.phone ?? '');
        setMobile(props.employee.mobile ?? '');
        setAddress(props.employee.address ?? '');
        setEmail(props.employee.email ?? '');
        setSSN(props.employee.ssn ?? '')
        setEmployeeType(props.employee.employeeType ?? employeeType);
        setStartDate(props.employee.startDate ?? '');
        setEmployeeStatus(props.employee.employeeStatus ?? 'Active');
        setProfileTitle(props.employee.profileTitle ?? '');
        setMaritalStatus(props.employee.maritalStatus ?? 'SINGLE');
        setVendor(props.employee.vendor ?? '');
        // setCurrentLocation(props.employee.currentLocation);
        setDob(props.employee.dob);
        setCity(props.employee.city);
        setState(props.employee.state);
        setCountry(props.employee.country);
         setCountryCode(props.employee.counrtyCode);
        setStateCode(props.employee.stateCode );
        setZipcode(props.employee.ZipCode );
        
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

    useEffect(()=>{
        partnersDetails()
    },[]);

    
    const onChangeVendor = (e) => {
        console.log("e", e);
        setVendor(e.target.value)
    }

    const onFormToggleMode = () => {

        // Save To Firebase
        if (formMode === 'edit') {
            setFormMode('fixed');   
            setIsLoading(true);
            console.log(employeeId);

            const changes = {       
                firstName: firstName,
                lastName: lastName,
                middleInitial: middleInitial,
                phone: phone,
                mobile: mobile,
                address: address,
                email: email,
                ssn: ssn,
                vendor : vendor,
               
                city : city,
                country : country,
                state : state,
                countryCode : countryCode,
                stateCode : stateCode,
                zipCode : zipCode,

                startDate: startDate,
                employeeStatus: employeeStatus,
                profileTitle: profileTitle,
                maritalStatus: maritalStatus,
                employeeType : employeeType,
                // currentLocation: currentLocation,
                dob: dob
            }

            if (employeeId !== "") {
                firebase.employees(employeeId).set({...props.employee, ...changes, updatedAt: firebase.serverValue.TIMESTAMP}).then((res) => {
                    setIsLoading(false);
                    showToast('success', 
                    'Sucesffully Saved', 
                    'Changes to Employee Details Saved')
                });
            } else {
                setIsLoading(false);
                showToast('error', 
                'Saving Error', 
                'Failed to save changes to DB, missing ID')
            }

        } else if (formMode === 'fixed') {
            setFormMode('edit');
        }
    }

    if (isLoading) {
        return <div>Loading Details</div> // Implement Better Loading Screen
    }

    const buttonDisabled = () => {
        return !utils.validate_email(email) ||
         !utils.validate_firstName(firstName) || 
         !utils.validate_lastName(lastName)
    }
    

    const selectCountry = (e) => {
        setCountry(e.target.value);
        getAllCountries.map((val,i)=>{
            if (val.name === e.target.value)
            setCountryCode(val.isoCode);
        })
      
        
    }

    const selectState = (e) => {
        setState(e.target.value);
        State.getStatesOfCountry(countryCode).map((val,i)=>{
            if (val.name === e.target.value)
            setStateCode(val.isoCode);
        })
       
        console.log("========state", state);
        console.log("============code", stateCode);
    }

    
const onChangeType =(e) => {
    // console.log("e",e);
    setEmployeeType(e.target.value)
}

    return (<>
        <div style={{padding: '20px', height: 'inherit'}}>

            <Toast ref={myToast} />

            <Flex direction="row" justifyContent="space-between">

                <ActionButton onPress={() => history.push('/admin/employees')} isQuiet>
                    <Back />
                    <Text>Cancel</Text>
                </ActionButton>

                <View>
                    { formMode !== 'fixed' ?  <ActionButton  marginEnd="size-175" onPress={onCancelEdit}>Cancel</ActionButton>: null}
                    <ActionButton  onPress={() => onFormToggleMode()} isDisabled={buttonDisabled()}>
                        <Text>{formMode === 'fixed' ? 'Edit' : 'Save'}</Text>
                    </ActionButton>
                </View>

            </Flex>

        <Flex>
            <Form isQuiet marginTop="20px" direction="column" maxWidth="500px" minWidth="50%">

                <TextField validationState={utils.validate_firstName(firstName) ? 'valid' : 'invalid'} UNSAFE_className={'details-text-field'} isRequired inputMode="text"  name="firstName" onChange={setFirstName} label="First Name" labelPosition="side" value={firstName} isReadOnly={formMode === 'fixed'}/>
                <TextField validationState={utils.validate_middleInitial(middleInitial) ? 'valid' : 'invalid'} maxLength={1} UNSAFE_className={'details-text-field'} name="middleInitial" onChange={setMiddleInitial} label="M.I." labelPosition="side" value={middleInitial} isReadOnly={formMode === 'fixed'}/>
                <TextField validationState={utils.validate_lastName(lastName) ? 'valid' : 'invalid'} UNSAFE_className={'details-text-field'} isRequired name="lastName" onChange={setLastName} label="Last Name" labelPosition="side" value={lastName}  isReadOnly={formMode === 'fixed'}/>
                <TextField UNSAFE_className={'details-text-field'} name="email" 
                validationState={utils.validate_email(email) ? 'valid' : 'invalid'} 
                onChange={setEmail} label="Email" labelPosition="side" 
                value={email} isReadOnly={formMode === 'fixed'}/>
                <TextField validationState={utils.validate_phone(phone) ? 'valid' : 'invalid'} UNSAFE_className={'details-text-field'} name="phone" 
                 onChange={setPhone} label="Phone" type="telephone" labelPosition="side" value={phone} isReadOnly={formMode === 'fixed'}/>
                <TextField validationState={utils.validate_phone(mobile) ? 'valid' : 'invalid'} UNSAFE_className={'details-text-field'} name="mobile" onChange={setMobile} label="Mobile" labelPosition="side" value={mobile} isReadOnly={formMode === 'fixed'}/>
                <Flex UNSAFE_className="details-calendar-input">
                        <label htmlFor="dob">Date of Birth</label>
                        <Calendar yearNavigator disabled={formMode === 'fixed'}   yearRange="1910:2021" width="100%" id="dob" className="onboarding-calendar-input" value={new Date(dob)} showIcon onChange={(e) => setDob(new Date(e.value).toISOString())}  />
                    </Flex>
                    <TextField validationState={utils.validate_ssn(ssn) ? 'valid' : 'invalid'}
                 UNSAFE_className={'details-text-field'} name="ssn" onChange={setSSN} label="SSN"
                  labelPosition="side" value={ssn} isReadOnly={formMode === 'fixed'}/>

              
            </Form>
            {/* NEW FIELDS */}
            <Form isQuiet marginTop="20px" direction="column" maxWidth="500px" minWidth="50%" marginStart="15px">
            
                
             
           
            {/* <Picker
                    UNSAFE_className="onboarding-details-picker"
                    label="Employee Type"
                    isDisabled={formMode === 'fixed'}
                    labelPosition="side"
                    defaultSelectedKey={employeeType}
                    items={employeeTypes}
                    onSelectionChange={setEmployeeType}>
                    {(item) => <Item>{item.name}</Item>}
                </Picker> */}

<InputLabel style = {{marginRight : '15px'}} UNSAFE_className="onboarding-details-picker">Employee Type</InputLabel>
                    <Select  labelId="employee-projects-prime-react-input"
                            // id="demo-controlled-open-select"
                            name="employeeType"
                            disabled={formMode === 'fixed'}
                            value={employeeType} 
                            onChange={(e)=> onChangeType(e)} 
                            >

                        {employeeTypes.map((val,i)=> {
                            return  <MenuItem value={val.name} >{val.name}</MenuItem>
                       })}
                    
                    </Select>

                { employeeType === 'C2C' ?
                        <>
                           {/* <TextField labelPosition="side" UNSAFE_className="details-text-field" 
                    label="Vendor" inputMode="text" onChange={setVendor} defaultValue={vendor}  isReadOnly={formMode === 'fixed'}/> */}


<InputLabel style = {{marginRight : '15px'}} UNSAFE_className="onboarding-details-picker">Vendor</InputLabel>
                    <Select  labelId="employee-projects-prime-react-input"
                            // id="demo-controlled-open-select"
                            name="vendor"
                            disabled={formMode === 'fixed'}
                            value={vendor} 
                            onChange={(e)=> onChangeVendor(e)} 
                            >

                        {addpartnerDetails.map((val,i)=> {
                            return  <MenuItem value={val.label} >{val.label}</MenuItem>
                       })}
                    
                    </Select>
                    {/* <TextField labelPosition="side" UNSAFE_className="details-text-field" 
                    label="Vendor Location" inputMode="text" onChange={setVendorLocation} defaultValue={vendorLocation}  isReadOnly={formMode === 'fixed'}/>

                    <TextField labelPosition="side"  UNSAFE_className="details-text-field" 
                    label="Vendor Contact" inputMode="text" onChange={setVendorContact} defaultValue={vendorContact}  isReadOnly={formMode === 'fixed'}/> */}

                        </> : null
                    }

                <Flex UNSAFE_className="details-calendar-input">
                        <label htmlFor="startDate">Start Date</label>
                        <Calendar 
                            width="100%"
                            id="startDate" 
                            disabled={formMode === 'fixed'}
                            className="onboarding-calendar-input" 
                            value={new Date(startDate)} 
                            showIcon 
                            onChange={(e) => setStartDate(new Date(e.value).toISOString())}  />
                </Flex>

                <TextField labelPosition="side"    isDisabled={formMode === 'fixed'}  UNSAFE_className="onboarding-details-text-field" 
                    label="Profile Title" inputMode="text" onChange={setProfileTitle} defaultValue={profileTitle}/>



             
                    <Picker
                        UNSAFE_className="onboarding-details-picker"
                        label="Employee Status"
                        labelPosition="side"
                        isDisabled={formMode === 'fixed'}
                        defaultSelectedKey={employeeStatus === "" ? "Active" : employeeStatus}
                        items={employeeStatuss}
                        onSelectionChange={setEmployeeStatus}>
                        {(item) => <Item>{item.name}</Item>}
                    </Picker>

                    

                    <Picker
                        UNSAFE_className="onboarding-details-picker"
                        label="Marital Status"
                        labelPosition="side"
                        isDisabled={formMode === 'fixed'}
                        defaultSelectedKey={maritalStatus}
                        items={maritalStatusTypes}
                        onSelectionChange={setMaritalStatus}>
                        {(item) => <Item>{item.name}</Item>}
                    </Picker>

                    <TextField validationState={utils.validate_address(address) ? 'valid' : 'invalid'} UNSAFE_className={'details-text-field'} name="address" onChange={setAddress} label="Address" labelPosition="side" value={address} isReadOnly={formMode === 'fixed'}/>
                <TextField validationState={utils.validate_address(city) ? 'valid' : 'invalid'} 
                UNSAFE_className={'details-text-field'} name="city" onChange={setCity} label="City" labelPosition="side" value={city} isReadOnly={formMode === 'fixed'}/>
              
              
              <InputLabel id="label">Country</InputLabel>
                    <Select  labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select" value={country} onChange={(e)=> selectCountry(e)}>

                        {getAllCountries.map((val,i)=> {
                            return  <MenuItem value={val.name} >{val.name}</MenuItem>
                       })}
                    
                    </Select>
                                                
                <InputLabel id="label">State</InputLabel>
                <Select  labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select" value={`${state}`} onChange={(e)=> selectState(e)}>

                        { State.getStatesOfCountry(countryCode).map((val,i)=>{
                            return  <MenuItem value={`${val.name}`} >{`${val.name} - ${val.isoCode}`}</MenuItem>
                         })}
                    
                    </Select>
                    <TextField validationState={utils.validate_address(zipCode) ? 'valid' : 'invalid'} 
                UNSAFE_className={'details-text-field'} name="zipCode" onChange={setZipcode} label="Zip Code" labelPosition="side" value={zipCode} isReadOnly={formMode === 'fixed'}/>


            </Form>
        </Flex>
        
        </div>
        
    </>
    )
}

export default EmployeeDetails
