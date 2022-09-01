import React, { useState, useEffect, useContext, useRef } from "react";
import { useSelector } from "react-redux";
// import { Flex, , TextField, Checkbox, CheckboxGroup,  Button} from '@adobe/react-spectrum';
import {
  ActionButton,
  ProgressCircle, 
  Checkbox,
  CheckboxGroup,
  Flex, 
  Text,
  View, 
} from "@adobe/react-spectrum";

// import { Calendar } from 'primereact/calendar';
 
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DataGrid } from "@mui/x-data-grid";
import Checkmark from "@spectrum-icons/workflow/Checkmark";
import Delete from "@spectrum-icons/workflow/Delete";
import Close from "@spectrum-icons/workflow/Close";
import FirebaseContext from "../../firebase/Context";
import { Toast } from "primereact/toast";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import moment from "moment";
import { PDFDocument } from "pdf-lib";

// import download from 'downloadjs'

import "./Approvals.css";
// import { Button } from "@spectrum-icons/workflow/Button";

const addDays = (date, days) => {
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy;
};

const stringLineFormatter = (string, maxCharLength) => {
  const charsNeeded = maxCharLength - string.length;
  return string + Array(Math.max(charsNeeded, 0)).fill("\xa0").join("");
};

const Approvals = () => {
  const [timesheetApprovalViews, setTimesheetApprovalViews] = useState([
    "SUBMITTED",
  ]);
  const [timesheetApprovals, setTimesheetApprovals] = useState({});
  const firebase = useContext(FirebaseContext);
  const employeeId = useSelector((store) => store.auth.employeeId);
  const myToast = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setfileName] = useState([]);
  const [urlDownload, setUrlDownload] = useState([]);
  const [employeeType, setEmployeeType] = useState("");
  const [employeeData, setEmployeeData] = useState([]);
   
  const [partnerNames, setPartnerName] = useState([]);
  const [employeeName, setCurrentEmployeeName] = useState("");
  const [partnerName, setCurrentPartnerName] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setcurrentYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState( null);
  const [ endDate, setEndDate] = useState(null);
  const [isCustomPeriod , setCustomPeriod] = useState(false);
  const [partnerNameState, setpartnernameState] = useState({});

  
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let employeeTypes = [
    { key: "W2", name: "W2" },
    { key: "1099", name: "1099" },
    { key: "C2C", name: "C2C" },
  ];
  
  //call when component loads
  useEffect(() => {
    getTimesheetEvents();
    getemployeeData();
    getpartnersName();

    // getDocuments();
  }, [timesheetApprovalViews]);

//get events from firebase
  const getTimesheetEvents = () => {
    let timesheet_db_ref_admin = `${firebase.tenantId}_Timesheet_Submission/admin`;
    let timesheetSubmissions = {};

    if (timesheetApprovalViews.length === 0) {
      setTimesheetApprovals({});
    }
    timesheetApprovalViews.forEach((type, index) => {
      firebase.db
        .ref(timesheet_db_ref_admin)
        .orderByChild("status")
        .equalTo(type)
        .on("value", (response) => {
          timesheetSubmissions = { ...timesheetSubmissions, ...response.val() };
          if (index === timesheetApprovalViews.length - 1) {
            setTimesheetApprovals(timesheetSubmissions);
          }
        });
    });
  };

  //get employee name and id from firebase
  const getemployeeData = async () => {
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

  //get partner name from firebase
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
            partnerId : partnerID
        });
          // setPartnerName(...partnerNames,[`${partner[partnerID].OrganizationName}`])
        });
        setPartnerName(part);
      });
  };

  //timesheet approvals column
  const timeSheetColumns = [
    { field: "submissionId", header: "ID" },
    { field: "employeeName", header: "EMPLOYEE" },
    { field: "projectName", header: "PROJECT" },
    { field: "status", header: "STATUS" },
    { field: "totalHours", header: "HOURS" },
    { field: "attachment", header: "ATTACHMENT" },
  ];

  const [expandedRows, setExpandedRows] = useState(null);

  const showToast = (severityValue, summaryValue, detailValue) => {
    myToast.current.show({
      severity: severityValue,
      summary: summaryValue,
      detail: detailValue,
    });
  };

  //timesheet approval function
  const approveTimesheet = async (rowData) => {
    setIsLoading(true);
    const {
      employeeId,
      employeeName,
      projectId,
      totalHours,
      submission_events,
    } = rowData;

    const dateRange = Object.keys(submission_events).map((eventKey) => {
      return new Date(submission_events[eventKey].date);
    });
    var maxDate = new Date(Math.max.apply(null, dateRange));
    var minDate = new Date(Math.min.apply(null, dateRange));

    const dateRangeString = `${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`;
    let _ID = String(employeeId);
    // _ID = _ID.replace(/\\|\//g,'');
    let removeSignFromId = "";

    if (_ID.includes("-")) {
      removeSignFromId = _ID.substring(1);
    } else {
      removeSignFromId = _ID;
    }
    // https://bugsy-crm.firebaseio.com/COVET_employees/-covet0/projects
    const projectRef = `${firebase.tenantId}_employees/${removeSignFromId}/projects`;

    firebase.db.ref(projectRef).once("value", (res) => {
      const currentInvoiceRef = `${firebase.tenantId}_Invoices`;
      firebase.db.ref(currentInvoiceRef).once("value", (CIRResp) => {
        const currentInvoices = CIRResp?.val() ?? {};

        const project = res.val()?.filter((proj) => {
          return proj.projectId ===projectId;
        });

        const netTermsLookup = {
          NET15: { label: "Net 15", value: 15 },
          Net30: { label: "Net 30", value: 30 },
          Net45: { label: "Net 45", value: 45 },
          Net60: { label: "Net 60", value: 60 },
          Net90: { label: "Net 90", value: 90 },
          "Due on Receipt": { label: "Due on Receipt", value: 0 },
        };

        const { billingRate, projectItenerary, projectName } = project?.[0];
        const { organizationName, location, netTerms, organizationId } =
          projectItenerary[0];
        console.log("organizationName", organizationName);
        const totalString = `$${billingRate * totalHours}`;
        const newInvoiceNumber = `${organizationName
          .substring(0, 3)
          .toUpperCase()}-${Object.keys(currentInvoices).length + 1}`;
        const invoiceNumber = newInvoiceNumber;
        const invoiceDate = new Date();
        const dueDate = addDays(
          invoiceDate,
          netTermsLookup[netTerms]?.value ?? 0
        );
        const netTermsFormatted =
          netTermsLookup[netTerms]?.label ?? "Due On Receipt";

        const fileName = `${invoiceNumber}_Invoice`;

        const invoiceRef = `${firebase.tenantId}/documents/invoice/Invoice_Template.pdf`;

        firebase.storage
          .ref(invoiceRef)
          .getDownloadURL()
          .then(async (url) => {
            const formPdfBytes = await fetch(url).then((res) =>
              res.arrayBuffer()
            );
            const pdfDoc = await PDFDocument.load(formPdfBytes);
            const form = pdfDoc.getForm();

            const INVOICE_NUMBER = form.getTextField("InvoiceNumber");
            const INVOICE_DATE = form.getTextField("InvoiceDate");
            const DUE_DATE = form.getTextField("DueDate");
            const NET_TERMS = form.getTextField("NetTerms");
            const ORGANIZATION_TO_BILL =
              form.getTextField("OrganizationToBill");
            const INVOICE_DETAILS = form.getTextField("InvoiceDetails");
            const INVOICE_TOTALS = form.getTextField("Total");

            INVOICE_NUMBER.setText(invoiceNumber);
            INVOICE_DATE.setText(invoiceDate.toLocaleDateString());
            DUE_DATE.setText(dueDate.toLocaleDateString());
            NET_TERMS.setText(netTermsFormatted);
            ORGANIZATION_TO_BILL.setText(
              [`${organizationName}`, `${location}`].join("\n")
            );
            INVOICE_DETAILS.setText(
              [
                `${stringLineFormatter(employeeName, 33)}${stringLineFormatter(
                  dateRangeString,
                  50
                )}${stringLineFormatter(
                  `${totalHours}`,
                  20
                )} $${stringLineFormatter(
                  `${billingRate}`,
                  20
                )} ${totalString}`,
              ].join("\n")
            );
            INVOICE_TOTALS.setText(totalString);
            form.flatten();

            const pdfBytes = await pdfDoc.save();

            let newInvoice = {
              invoiceNumber: invoiceNumber,
              invoiceDate: invoiceDate.toLocaleDateString(),
              dueDate: dueDate.toLocaleDateString(),
              terms: netTermsFormatted,
              employee: employeeName,
              employeeId: employeeId,
              total: totalHours * billingRate,
              activity: dateRangeString,
              organization: organizationName,
              organizationId: organizationId,
              totalHours: totalHours,
              rate: billingRate,
              fileName: fileName,
              projectName: projectName,
              projectId: projectId,
              status: "CREATED",
              paymentStatus: "UNPAID",
              paymentMode: "",
              uploadDate: firebase.serverValue.TIMESTAMP,
            };

            console.log(newInvoice);

            // Save The PDF into storage
            const fileRef = `${firebase.tenantId}/documents/invoices/${fileName}`;
            firebase.storage
              .ref(fileRef)
              .put(pdfBytes)
              .then((snapshot) => {
                // // Save PDF record into companies invoice table
                const companyInvoiceTableRef = `${firebase.tenantId}_Invoices/${invoiceNumber}`;
                firebase.db
                  .ref(companyInvoiceTableRef)
                  .set(newInvoice)
                  .then((resp) => {
                    console.log(resp);
                    setIsLoading(false);
                    showToast(
                      "success",
                      "Invoice Generated and Entry Generated",
                      `${rowData.submissionId}`
                    );
                  })
                  .catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                  });
              })
              .catch((err) => {
                console.log(err);
              });
            const submissionIdRef = `${firebase.tenantId}_Timesheet_Submission/admin/${rowData.submissionId}/status`;
            firebase.db
              .ref(submissionIdRef)
              .set("APPROVED")
              .then((res) => {
                showToast(
                  "success",
                  "Timesheet Approved",
                  `${rowData.submissionId}`
                );
                getTimesheetEvents();
              })
              .catch(() => {
                showToast(
                  "error",
                  "Failed to Approve Timesheet",
                  `${rowData.submissionId}`
                );
              });

           
          });
      });

    });

   
  };

  //timesheet reject function
  const rejectTimesheet = (rowData) => {
    // setIsLoading(true);
    let calendarBaseRef = `${firebase.tenantId}_calendar/${rowData.employeeId}`;

    for (let eventKey in rowData.submission_events) {
      let [YEAR, MONTH, DAY] = rowData.submission_events[eventKey].date
        .split("-")
        .map((datePart) => parseInt(datePart));
      let calendarRef = `${calendarBaseRef}/YEAR${YEAR}/MONTH${MONTH}/DAY${DAY}/${eventKey}/status`;
      firebase.db.ref(calendarRef).set("REJECTED");
    }

    const submissionIdRef = `${firebase.tenantId}_Timesheet_Submission/admin/${rowData.submissionId}/status`;
    firebase.db
      .ref(submissionIdRef)
      .set("REJECTED")
      .then((res) => {
        setIsLoading(false);
        showToast("success", "Timesheet Rejected", `${rowData.submissionId}`);
        getTimesheetEvents();
      })
      .catch(() => {
        setIsLoading(false);
        showToast(
          "error",
          "Failed to Reject Timesheet",
          `${rowData.submissionId}`
        );
      });
  };

  //timesheet delete function
  const deleteTimesheet = (rowData) => {
    setIsLoading(true);
    let calendarBaseRef = `${firebase.tenantId}_calendar/${rowData.employeeId}`;

    for (let eventKey in rowData.submission_events) {
      let [YEAR, MONTH, DAY] = rowData.submission_events[eventKey].date
        .split("-")
        .map((datePart) => parseInt(datePart));
      let calendarRef = `${calendarBaseRef}/YEAR${YEAR}/MONTH${MONTH}/DAY${DAY}/${eventKey}/status`;
      firebase.db.ref(calendarRef).set("DELETED");
    }

    const submissionIdRef = `${firebase.tenantId}_Timesheet_Submission/admin/${rowData.submissionId}/status`;
    firebase.db
      .ref(submissionIdRef)
      .set("DELETED")
      .then((res) => {
        showToast("success", "Timesheet Deleted", `${rowData.submissionId}`);
        getTimesheetEvents();
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        showToast(
          "error",
          "Failed to Delete Timesheet",
          `${rowData.submissionId}`
        );
      });
  };

  //timesheet approvals button 
  const timesheetActionButtons = (rowData) => {
    // console.log(rowData.status);
    if (rowData.status === "SUBMITTED") {
      return (
        <Flex direction="column">
          <ActionButton
            isDisabled={["APPROVED", "REJECTED"].includes(rowData.status)}
            onPress={() => approveTimesheet(rowData)}
            marginBottom="size-100"
            UNSAFE_className={"bugsy-approve-button"}
          >
            <Checkmark />
            <Text>Approve</Text>
          </ActionButton>
          <ActionButton
            isDisabled={["APPROVED", "REJECTED"].includes(rowData.status)}
            onPress={() => rejectTimesheet(rowData)}
            marginBottom="size-100"
            UNSAFE_className={"bugsy-reject-button"}
          >
            <Close />
            <Text>Reject</Text>
          </ActionButton>
          <ActionButton
            isDisabled={["APPROVED", "REJECTED"].includes(rowData.status)}
            onPress={() => deleteTimesheet(rowData)}
            UNSAFE_className={"bugsy-delete-button"}
          >
            <Delete />
            <Text>Delete</Text>
          </ActionButton>
        </Flex>
      );
    }
  };

  
  const extractUrl = (data) => {
    console.log("data=================");
    for (let i = 0; i < fileName.length; i++) {
      if (data.attachment !== undefined) {
        if (String(data.attachment) === String(fileName[i])) {
          console.log("url down", urlDownload[i]);

          return (window.location.href = `${urlDownload[i]}`);
        } else {
          console.log("eoorrrrr", fileName[i]);
        }
      }
    }
  };

//get pdf url from firebase 
  const getDocuments = (id) => {
    let ref = `${firebase.tenantId}/${id}/documents/attchments`; ///COVET/-covet0/documents/21c-4e51-b95///COVET/-covet0/documents/21c-4e51-b95

    // Create a reference under which you want to list
    var listRef = firebase.storage.ref().child(ref);

    listRef
      .listAll()
      .then(function (res) {
        // Store the list in the state, just in case we need it somewhere

        console.log("res", res);
        var file = [];
        var urld = [];
        res.items.forEach(function (itemRef) {
          // console.log("itemRef =", itemRef.name);

          console.log("file====", file);
          // setfileName([...fileName, itemRef.name])
          itemRef
            .getDownloadURL()
            .then((url) => {
              file.push(itemRef.name);
              urld.push(url);
              console.log("url=====", urld);

              console.log("url link ", urlDownload);
              if (file.length === urld.length) {
                setUrlDownload(urld);
                setfileName(file);
              }

              //    setUrlDownload([...urlDownload,url])
            })
            .catch((error) => {
              // Handle any errors
              console.log("erpoor", error);
            });
        });
      })
      .catch(function (error) {
        // Uh-oh, an error occurred!
        console.log("erpoor", error);
      });
  };

  //display file name from url
  const fileNameDisplay = (data) => {
    if (data.attachment !== undefined || data.attachment !== "") {
      getDocuments(data.employeeId);
    }
    return (
      <div>
        {" "}
        {data.attachment !== undefined || data.attachment !== "" ? (
          <button onClick={() => extractUrl(data)}>{data.attachment}</button>
        ) : (
          ""
        )}
      </div>
    );
  };
 

  //on changing employee name , employee type na dpartner field
  const onChangeType = (e) => {
    // console.log("e",e);
    if (e.target.name === "employeeType") {
      setEmployeeType(e.target.value); 
    } else if (e.target.name === "employeeName") {
      setCurrentEmployeeName(e.target.value); 
    } else {
      setCurrentPartnerName(e.target.value);
    }
  };
 
  //get dates in current month
  function getDaysInMonth(month, year) {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }
 //get date in particular formate 
  function convert(str) {
    var mnths = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12",
      },
      date = str.split(" ");

    return [date[3], mnths[date[1]], date[2], date[0]].join("-");
  }
  //get dates between dates
  const getDatesBetweenDates = (startDate, endDate) => {
    let dates = []
    //to avoid modifying the original date
    const theDate = new Date(startDate)
    while (theDate <= endDate) {
      dates = [...dates, new Date(theDate)]
      theDate.setDate(theDate.getDate() + 1)
    }
    return dates
  }

  //covert date according to header name
  const getDateAndDayField = (date) => {
    const dateformat = convert(String(date));
    const _datearr = dateformat.split("-");
    let date_index = parseInt(_datearr[2], 10);
    if (date_index < 10) {
      date_index = "0" + String(date_index);
    }
    const day = _datearr[3];
    const dateField = dateformat.slice(0, 10);
    return ({ field: dateField,
        headerName: `${date_index}  
            ${day}`,
        width: 100,})
   
  }
  const handlepartnerChange = (e,empid) => {
           console.log(e.target.empid)
           const data = {}
           data[empid] = e.target.value
           setpartnernameState(  data)
  }

  //get column header names
  const getColumnsData = () => {
    const columnObj = [
      { field: "id", hide: true },
      { field: "name", headerName: "Employee Name", width: 150 },
      {field: "partner",  renderCell: (cellValues) => {
        if(cellValues.row.partner !== undefined){
          if(cellValues.row.partner.length === 1){

            return cellValues.row.partner.map((val) => {
              return <InputLabel> {val.partnername}</InputLabel>
            })
            // return cellValues.row.partner.partnername
          }else{
            return (
             <Select
                labelId="demo-simple-select-label"
                value={partnerNameState[partnerName]}
                displayEmpty = {false}
                // defaultValue = {cellValues.row.partner[0].partnername}
                onChange={(e) => handlepartnerChange(e,cellValues.row.id)}
              >  
                {cellValues.row.partner.map((val) => {
                  return <MenuItem value={val.partnername}>{val.partnername}</MenuItem>;
                })}
              </Select>
            );
          }
          
        }else{
          return null
        }
      
      }},
      { field: "totalhours", headerName: "Total Hour", width: 130 },
    ];

    const dates = getDaysInMonth(currentMonth, currentYear);
    if (startDate === null && endDate === null){
        dates.map((date)=>{
            const getobjField = getDateAndDayField(date);
            columnObj.push(getobjField) 
          });
    }else{
        const getdatesarray = getDatesBetweenDates(startDate,endDate);
        console.log(getdatesarray)
        getdatesarray.map((date)=> {
            const getobjField = getDateAndDayField(date);
            columnObj.push(getobjField)
        })
    }
    
    return columnObj;
  };

  //get row fields data
  const getRowsData = () => {
    const rowdata = [];
    if (employeeData.length !== 0) {
      employeeData.filter(({name }) =>  {
         if(name === employeeName){
                    return true
                }else if (!employeeName){
                    return true
                }  
      }).filter(({empType})=> {
        if (empType === employeeType){
            return true
        }else if (employeeType === ""){
            return true
        }else{
            return false
        }
      }).filter(({empOrganizationIds})=>{
          if (partnerName.partnerId === undefined){
            return true
        }else{
            if (empOrganizationIds !== undefined){
                if (empOrganizationIds.includes(partnerName.partnerId)){
                    return true
                } 
              }else{
                  return true
              }
        } 
      }).map((val) => {
        let id = val.empId;
        if (!val.empId.includes("-")) {
          id = "-" + val.empId;
        }
        let totalhours = 0
        let obj = {}
        // if ( employeeType === val.employeeType){
        //       obj = { id: val.empId, name: val.name };
        // }else if (employeeType === ""){
            obj = { id: val.empId, name: val.name,partner : val.empOrganizationIds };
        // }
        let firebase_ref_caleder = `${
          firebase.tenantId
        }_calendar/${id}/YEAR${currentYear}/MONTH${currentMonth + 1}`;
        firebase.db
          .ref(firebase_ref_caleder)
          .once("value")
          .then((res) => {
            const cal = res.val(); 
          
            if (cal !== null) {
              Object.keys(cal).map((value) => {
                Object.keys(cal[value]).map((days) => {
                //   console.log(days.start);
                  const dateformat = moment(cal[value][days].start).format(
                    "YYYY-MM-DD"
                  );
                  obj[dateformat] = cal[value][days].hours;
                  totalhours = totalhours + cal[value][days].hours
                });
                obj['totalhours'] = totalhours
              });
            }
          });
        rowdata.push(obj);
      });
    }

    return rowdata;
  };

  //get perious month
  const previousMonth = () => {
      setStartDate(null)
      setEndDate(null)
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setcurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  //get next month
  const nextMonth = () => {
    setStartDate(null)
    setEndDate(null)
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setcurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  //when clicked on custom period button
  const customPeriodClicked = () => {
      setCustomPeriod(!isCustomPeriod)
  }
  
  //render component
  return (
    <div className="row" style={{ marginTop: "30px" }}>
      {isLoading ? (
        <>
          <Flex alignItems="center" justifyContent="center" height="80%">
            <ProgressCircle size="M" aria-label="Loading…" isIndeterminate />
          </Flex>
        </>
      ) : (
        <>
          <Toast ref={myToast} />

          <View width="100%">
            <Accordion multiple activeIndex={[0]}>
              {/* <AccordionTab header="Timesheet Dashboard">
                <div>
                  <div style={{ display: "flex" }}>
                    <InputLabel
                      style={{ marginRight: "15px", marginBottom: "10px" }}
                      UNSAFE_className="onboarding-details-picker"
                    >
                      Employee Type
                    </InputLabel>
                    <Select
                      style={{ width: "120px" }}
                      labelId="employee-projects-prime-react-input"
                      // id="demo-controlled-open-select"
                      name="employeeType"
                      value={employeeType}
                      onChange={(e) => onChangeType(e)}
                    >
                      {employeeTypes.map((val, i) => {
                        return <MenuItem value={val.name}>{val.name}</MenuItem>;
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
                        marginLeft: "25px",
                        marginRight: "15px",
                        marginBottom: "10px",
                      }}
                      UNSAFE_className="onboarding-details-picker"
                    >
                      Partner
                    </InputLabel>
                    <Select
                      style={{ width: "120px" }}
                      labelId="employee-projects-prime-react-input"
                      // id="demo-controlled-open-select"
                      name="partner"
                      value={partnerName.organizationName}
                      onChange={(e) => onChangeType(e)}
                    >
                      {partnerNames.map((val ) => {
                        return <MenuItem value={val}>{val.organizationName}</MenuItem>;
                      })}
                    </Select>
                    {/* <button style={{
                        marginLeft: "25px",
                        marginRight: "15px",
                        
                      }}>Search</button> 
                  </div>
                  <br />
                  <br />
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <h2 style={{ marginRight: "20px" }}>Period</h2>
                    <button
                      style={{
                        marginRight: "5px",
                        height: "28px",
                        marginTop: "18px",
                      }}
                      onClick={() => previousMonth()}
                    >
                      {"<"}
                    </button>
                    <h3 style={{ marginRight: "5px", marginTop: "18px" }}>
                      {months[currentMonth]} - {currentYear}
                    </h3>
                    <button
                      style={{
                        marginRight: "5px",
                        height: "28px",
                        marginTop: "18px",
                      }}
                      onClick={() => nextMonth()}
                    >
                      {">"}
                    </button>
                    <button
                      style={{
                        marginRight: "5px",
                        height: "28px",
                        marginTop: "18px",
                      }}
                      onClick ={() => customPeriodClicked()}
                    >
                      Custom Period
                    </button>
                    
                                        
                  </div>
                      {isCustomPeriod ? <div style = {{justifyContent : 'center'}} >
                        <Flex UNSAFE_className="employee-project-input-line">
                                    <Text 
                                        
                                        UNSAFE_className="employee-project-labels">
                                        Start Date: 
                                    </Text>
                                    <DatePicker placeholderText = 'mm/dd/yyyy' selected={startDate} 
                        onChange={(date) => setStartDate(date)} /> 
                                </Flex>
                                <Flex UNSAFE_className="employee-project-input-line">
                                    <Text 
                                        
                                        UNSAFE_className="employee-project-labels">
                                        End Date :
                                    </Text>
                                    <DatePicker placeholderText = 'mm/dd/yyyy' selected={endDate}
                                     onChange={(date) => setEndDate(date)} /> 
                                </Flex>
                      
                      
                     
                      </div> : null}
                      
                   
                      
                  <br />
                  <br />
                  <div style={{ height: 700, width: "100%" }}>
                    <DataGrid rows={getRowsData()} columns={getColumnsData()} />
                  </div>
                      </div>
              </AccordionTab> */}
              <AccordionTab header="Timesheet Approvals">
                <Flex justifyContent="end">
                  <CheckboxGroup
                    orientation="horizontal"
                    defaultValue={timesheetApprovalViews}
                    onChange={(value) => setTimesheetApprovalViews(value)}
                  >
                    <Checkbox value="SUBMITTED">Submitted</Checkbox>
                    <Checkbox value="APPROVED">Approved</Checkbox>
                    <Checkbox value="REJECTED">Rejected</Checkbox>
                  </CheckboxGroup>
                </Flex>
                <DataTable
                  selectionMode="single"
                  expandedRows={expandedRows}
                  onRowToggle={(e) => setExpandedRows(e.data)}
                  value={Object.keys(timesheetApprovals)
                    .reverse()
                    .map((key) => {
                      return {
                        submissionId: key,
                        ...timesheetApprovals[key],
                      };
                    })}
                  paginator
                  rowExpansionTemplate={(data) => {
                    const columns = [
                      { field: "date", header: "DATE" },
                      { field: "hours", header: "HOURS" },
                    ];
                    return (
                      <DataTable
                        value={Object.keys(data.submission_events)
                          .reverse()
                          .map((key) => {
                            return {
                              key: key,
                              hours: data.submission_events[key].hours,
                              date: data.submission_events[key].date,
                            };
                          })}
                      >
                        {columns.map((col) => {
                          return (
                            <Column
                              key={col.field}
                              field={col.field}
                              header={col.header}
                            />
                          );
                        })}
                      </DataTable>
                    );
                  }}
                  paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                  rows={10}
                  rowsPerPageOptions={[10, 20, 50]}
                >
                  <Column expander style={{ width: "3em" }} />
                  {timeSheetColumns.map((col, index) => {
                    console.log(col);
                    if (col.field === "status") {
                      return (
                        <Column
                          key={col.field}
                          field={col.field}
                          header={col.header}
                          body={(rowData) => {
                            return (
                              <div className={`${rowData.status}-bg-color`}>
                                {rowData.status}
                              </div>
                            );
                          }}
                        />
                      );
                    } else if (col.field === "attachment") {
                      return (
                        <Column
                          key={col.field}
                          field={col.field}
                          header={col.header}
                          body={fileNameDisplay}
                        />
                      );
                    } else {
                      return (
                        <Column
                          key={col.field}
                          field={col.field}
                          header={col.header}
                        />
                      );
                    }
                  })}
                  <Column
                    style={{ width: "150px" }}
                    header="ACTIONS"
                    body={timesheetActionButtons}
                  />
                </DataTable>
              </AccordionTab>
              {/* <AccordionTab header="Immigration Approvals">
                Work In Progress!
              </AccordionTab> */}
            </Accordion>
          </View>
        </>
      )}
    </div>
  );
};

export default Approvals;
