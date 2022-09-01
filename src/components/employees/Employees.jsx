import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch, useHistory} from 'react-router-dom';
import FirebaseContext from '../../firebase/Context';
// import EmployeeProfile from './employeeProfile/EmployeeProfile';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './Employees.css';
import { Flex, ProgressCircle, TextField, Checkbox, CheckboxGroup,  Button} from '@adobe/react-spectrum';
// import Switch from '@spectrum-icons/workflow/Switch';
// import { Button as PrimeButton } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import Moment from 'moment';


function Employees() {

    // const [employeeData, setEmployeeData] = useState([{id: 1, name: 'Rakesh'},{id: 2, name: 'JR'},{id: 3, name: 'Ravi'}]);
    const match = useRouteMatch();
    const history = useHistory();
    const firebase = useContext(FirebaseContext);
    const [employees, setEmployees] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isLoading,setIsLoading] = useState(true);

    const [selectedEmpType, setSelectedEmpType ] = useState([]);
    const [ selectedImmigration , setImmigration] = useState(['H1B']);

    const [columns] = useState([
       
        {field: 'employee', header: 'EMPLOYEE NAME'},
        {field: 'mobile', header: 'CONTACT NO'},
        {field: 'email', header: 'EMAIL ID'},
        {field: 'profileTitle', header: 'PROFILE TITLE'},
        {field: 'employeeType', header: 'EMPLOYEE TYPE'},
        {field: 'workAuthorization', header: 'IMMIGRATION STATUS'},
        {field: 'state', header: 'EMPLOYEE STATE'},
        {field: 'clients', header: 'CLIENTS'},
        {field: 'dob', header : 'DOB'},
        {field : 'startDate', header : 'START DATE'},

        //  {field: 'margin', header: 'MARGIN'},
        // {field: 'chargeRate', header: 'CHARGE RATE'},
        // {field: 'paymentRate', header: 'PAYMENT RATE'},

    ]);

    const [selectedColumns, setSelectedColumns] = useState([ {field: 'employee', header: 'EMPLOYEE NAME'},
    {field: 'mobile', header: 'CONTACT NO'},
    {field: 'email', header: 'EMAIL ID'},
    {field: 'profileTitle', header: 'PROFILE TITLE'},
    {field: 'employeeType', header: 'EMPLOYEE TYPE'},
    {field: 'workAuthorization', header: 'IMMIGRATION STATUS'},
    {field: 'state', header: 'EMPLOYEE STATE'}])

    useEffect(() => {
        // console.log('ComponentDidMount');
        getEmployees();
    }, [selectedEmpType]);

    
    const getEmployees = () => {
        let employeesList = [];
        console.log("emp type============",selectedEmpType);
        if (selectedEmpType.length === 0) { setSelectedEmpType(['W2']) }
        // selectedEmpType.forEach((type, index) => {//.orderByChild('employeeType').equalTo(type)
            firebase.employees().on("value", snapshot => {
                const employees =  snapshot.val();
                console.log(snapshot.val());
        
        
                   if (employees !== null){
                    Object.entries(employees).map(entry => {
                        const employee = entry[1];
                        const empId = entry[0];
            
                        console.log(empId);
            
                        const paymentRate = parseFloat(employee.rate === '' ? 0 : employee.rate);
                        const chargeRate = !employee.projects ? 0 : employee.projects.map(project => { 
                            return project.billingRate === '' ? 0 : project.billingRate}).reduce((acc, val) => { 
                            return acc + val },0);
                        const margin = chargeRate - paymentRate;
                        // console.log(chargeRate);
                        console.log(margin);
                        console.log(paymentRate);
                        console.log(chargeRate);
                       
                        // let today = employee.dob;
                        // let dob=today.getDate() + "-"+ parseInt(today.getMonth()+1) +"-"+today.getFullYear();
                        // console.log(dob)
            
                        // let startdate = employee.startDate;
                        // let start_date =  startdate.getDate() + "-"+ parseInt(startdate.getMonth()+1) +"-"+startdate.getFullYear();
                        // console.log("===========empType", selectedEmpType);
                       
                        employeesList.push({...employee,
                            employee: employee.firstName + ' ' + employee.lastName,
                            clients: !employee.projects ? '' : employee.projects.map(project =>  { return project.projectItenerary[0].organizationName + ', ' }),
                            // paymentRate: `$${paymentRate.toFixed(2)}`,
                            // chargeRate: `$${chargeRate.toFixed(2)}`,
                            // margin: `$${margin.toFixed(2)}`,
                           
                            immigrationStatus: employee.workAuthorization,
                            dob: Moment(employee.dob).format('YYYY-MM-DD'),
                            startDate : Moment(employee.startDate).format('YYYY-MM-DD'),
                            id: empId})
                        // setEmployees(employeesList)
                       
                        
                    })
                       
                   }
                 
                   setEmployees(employeesList);
                   setIsLoading(false);
                // employeesList = {...employeesList }
                // console.log(employeesList);
              
                });
               
        // })
       
    }

    const onColumnToggle = (event) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter(col => selectedColumns.some(sCol => sCol.field === col.field));
        setSelectedColumns(orderedSelectedColumns);
        // this.setState({ selectedColumns: orderedSelectedColumns });
    }

    const header = (
        <div className="table-header" style={{display: 'flex',justifyContent: 'space-between', flexDirection: 'row', marginBottom: '10px'}}>
            <div style={{ textAlign:'left' }}>
                <MultiSelect placeholder="Select Employee Fields to Display" value={selectedColumns} options={columns} optionLabel="header" onChange={onColumnToggle} style={{width:'20em'}}/>
            </div>
            <div>
            <TextField type="search" marginEnd="size-250" onChange={(value) => setGlobalFilter(value)} placeholder="Search..." />
            <Button variant="cta" UNSAFE_className="bugsy-action-button" onPress={() => 
                history.push(`/admin/employees/addemployee`)}>Add Employee</Button>
            </div>
        </div>
    );

    if (isLoading) {
        return <>
            <Flex alignItems="center" justifyContent="center" height="100%">
                <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
            </Flex>
        </>
    }

    const empTypeSelect = (e) => {
        setSelectedEmpType(e)
        console.log(e);
    }

    const immigrationSelect = (e) => {
        setImmigration(e)
    }

    const empDetails = (rowData) => {
        if (rowData.data !== undefined){
            history.push({pathname: `${match.url}/${rowData.data.id}`, state: rowData.data})
        }
    }

    return (<>
            
            <div className="row" style={{marginTop: '30px'}}>
            {/* <div style = {{float : 'left' , marginTop: '5px' , marginEnd : '5px'}}>  Employee Type </div>
            <div style = {{float : 'left',marginLeft : '10px' }}>  <CheckboxGroup style = {{ marginBottom: '5px' ,margin : '5px', marginLeft : '5px'}}
                    orientation="horizontal" 
                    defaultValue= {selectedEmpType}
                    onChange = {(e) => {empTypeSelect(e)}} >
                    <Checkbox value="W2" >W2</Checkbox>
                    <Checkbox value="1099">1099</Checkbox>
                    <Checkbox value="C2C">C2C</Checkbox>
                </CheckboxGroup></div>
                <div>
                    
                 <div style = {{float : 'left' , marginTop: '5px' , marginEnd : '5px'}}>  IMMIGRATION STATUS </div>
            <div style = {{float : 'left' ,marginLeft : '10px'}}>  <CheckboxGroup style = {{ marginBottom: '5px' }}
                    orientation="horizontal" 
                    defaultValue= {selectedImmigration}
                    onChange={(e) => {immigrationSelect(e)}} >
                    <Checkbox value="CITIZEN">US Citizen</Checkbox>
                    <Checkbox value="GREENCARD">Permanent Resident</Checkbox>
                    <Checkbox value="H1B">H-1B</Checkbox>
                    <Checkbox value="L1">L-1 </Checkbox>
                    <Checkbox value="O1">O-1</Checkbox>
                    <Checkbox value="TN">TN Visa</Checkbox>
                    <Checkbox value="E1">E-1</Checkbox>
                    <Checkbox value="E2">E-2</Checkbox>
                    <Checkbox value="E3">E-3 </Checkbox>
                </CheckboxGroup></div> 
                </div> */}
                
                <div className="data-table">
                 
                    <DataTable 
                    selectionMode="single" 
                    value={employees} 
                    header={header}
                    paginator
                    // onRowClick={(rowData) => history.push(`${match.url}/${rowData.data.id}`)}
                    onRowClick={(rowData) => { empDetails(rowData)}}

                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20,50]}
                    globalFilter={globalFilter}>
                        {/* <Column field="employee"  header="EMPLOYEE NAME"></Column>
                        <Column field="clients" header="CLIENTS"></Column>
                        <Column field="margin" header="MARGIN"></Column>
                        <Column field="chargeRate" header="CHARGE RATE"></Column>
                        <Column field="paymentRate" header="PAYMENT RATE"></Column>
                        <Column field="workAuthorization" header="IMMIGRATION STATUS"></Column>
                        <Column field="employeeType" header="EMPLOYEE TYPE"></Column> */}
                        {selectedColumns.map(col=> {
                            return <Column key={col.field} field={col.field} header={col.header} />;
                        })}
                    </DataTable>


                </div>
            </div>
    </>)
}

export default Employees
