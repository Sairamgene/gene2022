import React, { useState, useEffect, useContext, useRef } from 'react';
import FirebaseContext from '../../firebase/Context';
import { ActionButton, Text,Flex,  Picker, Item, TextField,ProgressCircle} from '@adobe/react-spectrum';
import { useHistory } from 'react-router-dom';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import { useSelector } from 'react-redux';
import { Calendar } from 'primereact/calendar';  

import Back from '@spectrum-icons/workflow/BackAndroid'
import { PDFDocument } from 'pdf-lib'; 


const CreateInvoice = () =>{
  // const date = new Date()
    const [filename, setfilename] = useState('');
    const firebase = useContext(FirebaseContext);
    const [employeeName, setCurrentEmployeeName] = useState("");
    const [currentpartnerDetail, setCurrentPartnerDetail] = useState({});
    const [ netTerms, setNetTerms] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(new Date());
    
    const [isLoading,setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState([]);
  
  const [partnerDetails, setPartnerDetails] = useState([]);
  const [ invoiceCycle , setInvoiceCycle] = useState(''); 
  const [invoicedueDate , setInvoiceDueDate] = useState('');
  const [partnerAddress , setPartnerAddress] = useState('');
  const tenantId = useSelector((store) => store.auth.tenantId);
  const [blobFile, setBlobFile] = useState('');
  const [invoiceno, setInvoiceNo] = useState('');
  const [rowData , setrowData] = useState([{
    service : '',
    period : '',
    hours: '',
    rate: '',
    total_amount : '',
   key : 0
  }
    
  ]);

    const history = useHistory();
    const idToken = localStorage.getItem('idToken');

    useEffect(()=>{
           
  const extractOrganizationIdsFromEmpData = (empData) => {
    if ( empData.projects !== undefined){
      const ids = []
      empData.projects.map((projectData) => {
          projectData.projectItenerary.map((projectDetail)=>{
              console.log(projectDetail)
              ids.push({partnerid : projectDetail.organizationId , partnername : projectDetail.organizationName})
          })
      })
      return ids
    }
    
}

      const getemployeeData = () => {
        const employees_db_ref = `${firebase.tenantId}_employees`;
        firebase.db
          .ref(employees_db_ref)
          .once("value")
          .then((res) => {
            const employees = res.val();
            let emp = [];
            Object.keys(employees).map((empID) => {
                
          const ids =   extractOrganizationIdsFromEmpData(employees[empID])
              emp.push({
                name: `${employees[empID].firstName} ${employees[empID].lastName}`,
                empId: empID,
                empType : employees[empID].employeeType,
                empOrganizationIds : ids
              }); 
            });
            setEmployeeData(emp);
          });
      };
      const getpartnersName = () => {
        const partner_db_ref = `${firebase.tenantId}_Partners`;
        firebase.db
          .ref(partner_db_ref)
          .once("value")
          .then((res) => {
            const partner = res.val();
            let part = [];
            Object.keys(partner).map((partnerID) => {
              part.push({organizationName : partner[partnerID].OrganizationName,
                partnerId : partnerID,
                addressLine1 : partner[partnerID].AddressLine1,
                addressLine2 : partner[partnerID].AddressLine2,
                city : partner[partnerID].City,
                email : partner[partnerID].email
            });
              // setPartnerDetails(...partnerDetails,[`${partner[partnerID].OrganizationName}`])
            });
            setPartnerDetails(part);
          });
          setIsLoading(false);
      };
        // createInvoice();
        getemployeeData(); 
        getpartnersName();

    },[firebase.db, firebase.tenantId]);

   

    if (isLoading) {
      return <>
          <Flex alignItems="center" justifyContent="center" height="100%">
              <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
          </Flex>
      </>
  }

 

const stringLineFormatter = (string, maxCharLength) => {
  const charsNeeded = maxCharLength - string.length;
  return string + Array(Math.max(charsNeeded, 0)).fill("\xa0").join("");
};
 
  //get partner name from firebase

const createInvoice = () => {
  const currentInvoiceRef = `${firebase.tenantId}_Invoices`;
      firebase.db.ref(currentInvoiceRef).once("value", (CIRResp) => {
        const currentInvoices = CIRResp?.val() ?? {}; 
    const invoiceRef = `${firebase.tenantId}/documents/invoice/Invoice_Template.pdf`;
    let totalAmountToBePaid = '0';
    firebase.storage.ref(invoiceRef).getDownloadURL().then(async (url) => {
        const formPdfBytes = await fetch(url).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(formPdfBytes);
        const form = pdfDoc.getForm();
        const newInvoiceNumber = `${currentpartnerDetail.organizationName
          .substring(0, 3)
          .toUpperCase()}-${Object.keys(currentInvoices).length + 1}`;
        const INVOICE_NUMBER = form.getTextField('InvoiceNumber');
        const INVOICE_DATE = form.getTextField('InvoiceDate');
        const DUE_DATE = form.getTextField('DueDate');
        const NET_TERMS = form.getTextField('NetTerms');
        const ORGANIZATION_TO_BILL = form.getTextField('OrganizationToBill');
        const INVOICE_DETAILS = form.getTextField('InvoiceDetails');
        const INVOICE_TOTALS = form.getTextField('Total');

        INVOICE_NUMBER.setText(newInvoiceNumber)
        setInvoiceNo(newInvoiceNumber);
        INVOICE_DATE.setText(invoiceDate.toLocaleDateString())
        DUE_DATE.setText(invoicedueDate );
        NET_TERMS.setText('Net '+netTerms);

        ORGANIZATION_TO_BILL.setText(
           partnerAddress
        )
          INVOICE_DETAILS.setText(
          
            [
              
              rowData.map((val)=>{
                totalAmountToBePaid = String(parseInt(totalAmountToBePaid) + parseInt(val.total_amount))
              return (
                 `${stringLineFormatter(val.service, 33)}${stringLineFormatter(val.period, 50)}${stringLineFormatter(val.hours, 20)} $${stringLineFormatter(val.rate, 20)} ${val.total_amount} \n`)
              })
              ].join('').replace(",", "").replace(/,/g, "")
              
        
        ) 
        INVOICE_TOTALS.setText(totalAmountToBePaid)
        form.flatten();

        const pdfBytes = await pdfDoc.save()
        const bytes = new Uint8Array(pdfBytes);
        const blob = new Blob([bytes], { type: "application/pdf" });
          setBlobFile(blob)
        const docUrl = URL.createObjectURL(blob);
        setfilename(docUrl);
    })
  })
}

 //on changing employee name , employee type na dpartner field
 const onChangeType = (e) => {
    // console.log("e",e);
    // if (e.target.name === "employeeType") {
    //   setEmployeeType(e.target.value); 
    // } else
     if (e.target.name === "employeeName") {
      setCurrentEmployeeName(e.target.value); 
    } else  if (e.target.name === "netTerms") {
      setNetTerms(e.target.value);
      const date = invoiceDate.toString()
      const _InvoiceDueDate = new Date(date); 
        _InvoiceDueDate.setDate(_InvoiceDueDate.getDate() + parseInt(e.target.value))
        const month = _InvoiceDueDate.getMonth() + 1
      setInvoiceDueDate( month + "/" + _InvoiceDueDate.getDate()  + "/" +_InvoiceDueDate.getFullYear())
        }else if(e.target.name === "partner") {
          console.log(e.target.value)
      setCurrentPartnerDetail(e.target.value);
          setPartnerAddress(e.target.value.addressLine1 + '\n' + e.target.value.addressLine2 + '\n' + e.target.value.city)
    }else if (e.target.name === "invoiceDate"){
      setInvoiceDate(e.target.value)
      if (netTerms !== ''){
        const date = e.target.value.toString()
        const _InvoiceDueDate = new Date(date); 
          _InvoiceDueDate.setDate(_InvoiceDueDate.getDate() + parseInt(netTerms))
          const month = _InvoiceDueDate.getMonth() + 1
        setInvoiceDueDate(_InvoiceDueDate.getDate() + "/" + month  + "/" +_InvoiceDueDate.getFullYear())
      }
    }
  };

  const removeRows = (idx) => {
  
    const temp = [...rowData];

    // removing the element using splice
    // const key = idx.key-1
    temp.splice(idx , 1);

    // updating the list
    setrowData(temp);
    // rowData[rowData.length-1].key  =  rowData.length -1 
  }
  const addRows = () =>  {
 
    var obj = {
       service : '',
       period : '',
       hours: '',
       rate: '',
       total_amount : '',
      key :   rowData.length  === 0 ? 0 :  rowData[rowData.length-1].key + 1

    };
    
    setrowData([...rowData, obj])
 
  };

  const onChangeRowData = (e,key) => {
      switch (e.target.name){
        case  'service' : 
        rowData[key].service = e.target.value
        break;
        case 'period':
          rowData[key ].period = e.target.value
          break;
          case 'hours':
          rowData[key].hours = e.target.value
          rowData[key].total_amount = 
          (rowData[key].hours !== "" && rowData[key].rate !== "") ? (parseInt(rowData[key].rate)* parseInt(rowData[key].hours)) : ""
        break;
        case 'rate':
          rowData[key ].rate = e.target.value
          rowData[key].total_amount = 
          (rowData[key].hours !== "" && rowData[key].rate !== "") ? (parseInt(rowData[key].rate)* parseInt(rowData[key].hours)) : ""
           break;
        case 'total_amount' :
          rowData[key].total_amount = e.target.value
          break;
        default:
          break;
      }
      setrowData([...rowData])
  }


  const upload = ()=>{
      
    if (filename) {
         
        const uploadTask = firebase.storage.ref().child(`${tenantId}/${currentpartnerDetail.partnerId}/documents/attachments/${invoiceno}`);
        
        uploadTask.put(blobFile).then((snapshot)=>{
          sendEmailApi(currentpartnerDetail);
            // uploadTask.getDownloadUrl().then((url) =>{
            //     console.log("url==========",url);
            // })
        })
      
      }
    };

  const sendEmailApi = async (rowData) => {
    setIsLoading(true);
    let emailId = '';
console.log("started",rowData);
partnerDetails.map((val,index) => {
    console.log(val.id);
    if (val.partnerId === rowData.partnerId){
        emailId = val.email
    }
})
    const formData = new FormData();
    
    let fileRef = `${firebase.tenantId}/${rowData.partnerId}/documents/attachments/${invoiceno}`;
    console.log(fileRef);
    /////////////////////
    await firebase.storage.ref(fileRef).getDownloadURL().then(async (url) => {
        let blob = await fetch(url).then(r => r.blob());
        console.log("blob",blob);
        formData.append("upload", blob);
    })
    
    formData.append("toEmail", emailId);
    formData.append("subject", 'subject');
    formData.append("msg", 'body');
    formData.append('fromEmail','ummara@abcgenesis.com')
      const pdfData = {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${idToken}`
        }
      }
    // const pdfData = {
    //     method : 'GET'
    // }
    //   console.log(idToken);
      fetch('https://bugsy-crm.wl.r.appspot.com/automail',pdfData)//.pdfsata
        .then((res) => {
          setIsLoading(false);
          if (res.status === 200) {
            console.log("res", res);
            alert("email sent successfully");
            setIsLoading(false);
          } else if (res.status === 401) {
            setIsLoading(false);
            console.log(res);
            if (res.statusText === 'Unauthorized'){
                 alert('Please log in to account') 
            }else{
                alert("Your session has expired");
               
            }
          }
        })
        .catch((error) => {
          console.error(error); 
        });
    }


    return ( 
        <>
          <ActionButton onPress={() => history.push('/admin/invoicing')} isQuiet>
                <Back />
                <Text>Cancel</Text>
            </ActionButton>
        <div className="row" style={{ marginTop: "30px" }}><br/>
       
            <InputLabel
                      style={{
                        marginLeft: "25px",
                        marginRight: "15px",
                        marginBottom: "10px",
                      }} 
                    >
                      Partner
                    </InputLabel>
                    <Select
                      style={{ width: "120px" }}
                      labelId="employee-projects-prime-react-input"
                      // id="demo-controlled-open-select"
                      name="partner"
                      value={currentpartnerDetail.organizationName}
                      onChange={(e) => onChangeType(e)}
                    > 
                    {partnerDetails.map((val ) => {
                        return <MenuItem value={val}>{val.organizationName}</MenuItem>;
                      })}
                    </Select>
                    <InputLabel
                      style={{
                        marginLeft: "25px",
                        marginRight: "15px",
                        marginBottom: "10px",
                      }}
                      UNSAFE_className="onboarding-details-picker"
                    >
                      Employee Name
                    </InputLabel>
                    <Select
                      style={{ width: "120px" }}
                      labelId="employee-projects-prime-react-input"
                      // id="demo-controlled-open-select"
                      name="employeeName"
                      value={employeeName}
                      onChange={(e) => onChangeType(e)}
                    >
                      {employeeData.map((val, i) => {
                        return <MenuItem value={val.name}>{val.name}</MenuItem>;
                      })}
                    </Select>
                    <InputLabel
                      style={{
                        marginLeft:
                         "25px",
                        marginRight: "15px",
                        marginBottom: "10px",
                      }}
                    //   UNSAFE_className="onboarding-details-picker"
                    >
                      Net Terms
                    </InputLabel>
                    <Select
                      style={{ width: "80px" }}
                      labelId="employee-projects-prime-react-input"
                      // id="demo-controlled-open-select"
                      name="netTerms"
                      value={netTerms}
                      onChange={(e) => onChangeType(e)}
                    > 
                    <MenuItem value='15'>net 15</MenuItem>
                    <MenuItem value='30'>net 30</MenuItem>
                    <MenuItem value='45'>net 45</MenuItem>
                    <MenuItem value='60'>net 60</MenuItem>
                    <MenuItem value='90'>net 90</MenuItem>
                    </Select>
<br/><br/>
                    <Flex UNSAFE_className="employee-project-input-line">
                    <InputLabel
                      style={{
                        marginLeft:
                         "25px",
                        marginRight: "15px",
                        marginBottom: "10px",
                      }}
                    //   UNSAFE_className="onboarding-details-picker"
                    >
                     Invoice Date
                    </InputLabel>
                                    <Calendar 
                                         width = "80px"
                                        name="invoiceDate" 
                                        className="onboarding-calendar-input" 
                                        value={invoiceDate} 
                                        showIcon 
                                        onChange={(e) => onChangeType(e)} ></Calendar> 
                   </Flex>
                    <br/>
                   
        </div>
        <div className="row" style={{ marginTop: "30px" }}>
          
                   <br/>
                   <br/>
                   
                   <TextField  
                   style = {{width : '100px'}}
                   UNSAFE_className={'details-text-field'} name="invoiceDueDate" 
                   onChange={setInvoiceDueDate} label="Invoice Due Date" labelPosition="side"
                    value={invoicedueDate}  />

                   </div>
                   <button onClick = {()=>addRows()}>
                     Add Item
                  </button>
                  
                   <div className="row" style={{ marginTop: "30px" ,border: '2px solid black'}}>
                 
                     <table   className="table table-bordered table-hover"
                id="tab_logic">
                   <thead>
                       <tr>
                         <th className="text-center">Service</th>
                         <th className="text-center">Period</th>
                         <th className="text-center">Hours</th>
                         <th className="text-center">Rate</th>
                         <th className="text-center">Total Amount</th>
                       </tr>
                       </thead>
                       <tbody>
          {rowData.map((id,i) => (
             <tr>
      <td>
      {/* <TextField label="Email (Controlled)" value={id.service}   /> */}
        <input type="text" id={`select-type-${id.service}`} name = 'service'   defaultValue = {id.service} 
        
        onChange={event => onChangeRowData(event ,i)}/>
      </td>
      <td>
        <input type="text" id={`select-type-${id.period}`} name = 'period' defaultValue = {id.period} 
        onChange={event => onChangeRowData(event,i )}/>
      </td>
      <td>
        <input type="text"  id={`select-type-${id.hours}`} name = 'hours' defaultValue = {id.hours}
        onChange={event => onChangeRowData(event,i )}/>
      </td>
      <td>
        <input type="text" id={`select-type-${id}`}  name = 'rate' defaultValue = {id.rate}
        onChange={event => onChangeRowData(event ,i )}/>
      </td>
      <td>
        <input type="text" id={`select-type-${id}`} name = 'total_amount' value = {id.total_amount}
        onChange={event => onChangeRowData(event ,i )}/>
      </td>
      <td>
      <button onClick = {()=>removeRows(i)}>
                     Remove Item
                  </button>
      </td>
    </tr>
          ))}
        </tbody>
                     </table>

                     
                 
</div>
<br/><br/>
<div>
  
                       <button onClick ={()=> createInvoice()}>Create pDF</button>
                     </div>
                     <br/><br/>
                     {filename !== ''? <div>
                     <iframe style = {{width : '100%', height : '800px'}}
                      src={filename} title="Invoice Details"></iframe>
                      <br/>
   <div>

                     <button  onClick={() => upload()}>Send Invoice</button>
                     </div>
                     </div> : null}

                   

        </>
    )
}

export default CreateInvoice;