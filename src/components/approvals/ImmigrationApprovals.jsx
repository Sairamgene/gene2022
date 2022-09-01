import React, { useState, useEffect, useContext, useRef } from 'react'
import { useSelector } from 'react-redux'
import { ActionButton, ActionGroup, Checkbox, CheckboxGroup, Flex, Item, Text, View} from '@adobe/react-spectrum';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Checkmark from '@spectrum-icons/workflow/Checkmark';
import Delete from '@spectrum-icons/workflow/Delete';
import Close from '@spectrum-icons/workflow/Close';
import FirebaseContext from '../../firebase/Context'
import { Toast } from 'primereact/toast';
import './Approvals.css'

const Approvals = () => {

    const [timesheetApprovalViews, setTimesheetApprovalViews] = useState(['SUBMITTED']);
    const [timesheetApprovals, setTimesheetApprovals] = useState({});
    const firebase = useContext(FirebaseContext);
    const employeeId = useSelector((store) => store.auth.employeeId);
    const myToast = useRef(null);

    useEffect(()=>{

        getTimesheetEvents();

    },[timesheetApprovalViews]);

    const getTimesheetEvents = () => {
        let timesheet_db_ref_admin=`${firebase.tenantId}_Timesheet_Submission/admin`;
        let timesheetSubmissions = {};
      
        if (timesheetApprovalViews.length === 0) { setTimesheetApprovals({}) }
        timesheetApprovalViews.forEach((type, index) => {
            firebase.db.ref(timesheet_db_ref_admin).orderByChild('status').equalTo(type).on('value', response => {
                timesheetSubmissions = {...timesheetSubmissions, ...response.val()}
               if (index === timesheetApprovalViews.length - 1) {
                   setTimesheetApprovals(timesheetSubmissions)
               }
            });
        })
    }

    const timeSheetColumns = [
        {field: 'submissionId', header: 'ID'},
        {field: 'employeeName', header: 'EMPLOYEE'},
        {field: 'projectName', header: 'PROJECT'},
        {field: 'status', header: 'STATUS'},
        {field: 'totalHours', header: 'HOURS'}
    ];
    
    const [expandedRows, setExpandedRows] = useState(null);

    const showToast = (severityValue, summaryValue, detailValue) => {  
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }

    const approveTimesheet = (rowData) => {

        let calendarBaseRef = `${firebase.tenantId}_calendar/${rowData.employeeId}`;
    
        for (let eventKey in rowData.submission_events) {
            let [YEAR, MONTH, DAY] = rowData.submission_events[eventKey].date.split('-').map(datePart => parseInt(datePart));
            let calendarRef = `${calendarBaseRef}/YEAR${YEAR}/MONTH${MONTH}/DAY${DAY}/${eventKey}/status`;
            firebase.db.ref(calendarRef).set('APPROVED');
        }

        const submissionIdRef=`${firebase.tenantId}_Timesheet_Submission/admin/${rowData.submissionId}/status`;
        firebase.db.ref(submissionIdRef).set('APPROVED').then(res => {
             showToast('success', 
                    'Timesheet Approved', 
                    `${rowData.submissionId}`);
                    getTimesheetEvents();
        }).catch(() => {
            showToast('error', 
                'Failed to Approve Timesheet', 
                `${rowData.submissionId}`);
        });
    }

    const rejectTimesheet = (rowData) => {
        let calendarBaseRef = `${firebase.tenantId}_calendar/${rowData.employeeId}`;
    
        for (let eventKey in rowData.submission_events) {
            let [YEAR, MONTH, DAY] = rowData.submission_events[eventKey].date.split('-').map(datePart => parseInt(datePart));
            let calendarRef = `${calendarBaseRef}/YEAR${YEAR}/MONTH${MONTH}/DAY${DAY}/${eventKey}/status`;
            firebase.db.ref(calendarRef).set('REJECTED');
        }

        const submissionIdRef=`${firebase.tenantId}_Timesheet_Submission/admin/${rowData.submissionId}/status`;
        firebase.db.ref(submissionIdRef).set('REJECTED').then(res => {
             showToast('success', 
                    'Timesheet Rejected', 
                    `${rowData.submissionId}`);
                    getTimesheetEvents();
        }).catch(() => {
            showToast('error', 
                'Failed to Approve Timesheet', 
                `${rowData.submissionId}`);
        });
    }

    const deleteTimesheet = (rowData) => {

    }
    
    const timesheetActionButtons = (rowData) => {
        // console.log(rowData.status);
        return <Flex direction="column">
            <ActionButton 
                isDisabled={['APPROVED', 'REJECTED'].includes(rowData.status)}
                onPress={() => approveTimesheet(rowData)}
                marginBottom="size-100" 
                UNSAFE_className={'bugsy-approve-button'}>
                <Checkmark/>
                <Text>Approve</Text>
            </ActionButton>
            <ActionButton
                isDisabled={['APPROVED', 'REJECTED'].includes(rowData.status)}
                 onPress={() => rejectTimesheet(rowData)}
                marginBottom="size-100" 
                UNSAFE_className={'bugsy-reject-button'}>
                <Close/>
                <Text>Reject</Text>
            </ActionButton>
            <ActionButton 
                    isDisabled={['APPROVED', 'REJECTED'].includes(rowData.status)}
                onPress={() => deleteTimesheet(rowData)}
                UNSAFE_className={'bugsy-delete-button'}>
                <Delete/>
                <Text>Delete</Text>
            </ActionButton>
        </Flex>
    }


    return (
        <div className="row" style={{marginTop: '30px'}}>
            
            <Toast ref={myToast} />

            <View width="100%">
            <Accordion multiple activeIndex={[0]}>
          
                <AccordionTab header="Immigration Approvals">
                    Work In Progress!
                </AccordionTab>
            </Accordion>
            </View>
        </div>
    )
}

export default Approvals