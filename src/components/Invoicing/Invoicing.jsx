import { ActionButton, AlertDialog, Button, ButtonGroup, Content, Dialog, DialogContainer, Divider, Flex, Header, Heading, Item, Picker, ProgressCircle, Text, TextField } from '@adobe/react-spectrum';
import Delete from '@spectrum-icons/workflow/Delete';
import Preview from '@spectrum-icons/workflow/Preview';
import Send from '@spectrum-icons/workflow/Send';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useState } from 'react'
import FirebaseContext from '../../firebase/Context';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import { Menubar } from 'primereact/menubar';
import { useHistory} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';


const Invoicing = (props) => {

    const firebase = useContext(FirebaseContext);
    const [invoices, setInvoices] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isLoading,setIsLoading] = useState(true);

    const [ partners, setPartners] = useState([])
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    // const idToken = useSelector((store) => { return store.auth.authUser});

    const idToken = localStorage.getItem('idToken');

    let [isMarkAsPaidOpen, setMarkAsPaidOpen] = React.useState(null);
    let [isMarkAsUnpaidOpen, setMarkAsUnpaidOpen] = React.useState(null);
    let [isMarkAsPartiallyPaidOpen, setMarkAsPartiallyPaidOpen] = React.useState(null);
    const history  = useHistory();

    let [paymentStatus, setPaymentStatus] = useState(null);
    let paymentStatusOptions = [
        {id: 'PAID', name: 'PAID (IN FULL)'},
        {id: 'UNPAID', name: 'UNPAID'},
        {id: 'PARTIALLY PAID', name: 'PARTIALLY PAID'},
      ];

    const [columns] = useState([
        {field: 'invoiceNumber', header: 'INVOICE #'},
        {field: 'status', header: 'STATUS'},
        {field: 'paymentStatus', header: 'PAYMENT STATUS'},
        {field: 'invoiceDate', header: 'DATE CREATED'},
        {field: 'dueDate', header: 'DUE DATE'},
        {field: 'dueDays', header: 'DUE DAYS'},
        {field: 'employee', header: 'EMPLOYEE'},
        {field: 'organization', header: 'PARTNER'},
        {field: 'projectName', header: 'PROJECT'},
        {field: 'total', header: 'TOTAL DUE'},
        // {field: 'rate', header: 'RATE'}
    ]);

    const [selectedColumns, setSelectedColumns] = useState(columns);

    useEffect(() => {
        getInvoices();
        getPartners();
    }, []);

    const onColumnToggle = (event) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter(col => selectedColumns.some(sCol => sCol.field === col.field));
        setSelectedColumns(orderedSelectedColumns);
    }


    const getPartners = () => {
        let invoiceRef = `${firebase.tenantId}_Partners`;
        firebase.db.ref(invoiceRef).on('value', (res) => {
            const partnersObjs = res.val() ?? {};
            
            const partners = Object.keys(partnersObjs).map(partnersKey => {
                 const ids = partnersObjs[partnersKey].id

                console.log(ids);
                return {
                    id: partnersKey,
                   ids: ids,
                    ...partnersObjs[partnersKey]
                }
            });
            setPartners(partners)
        });

        setIsLoading(false);
    }

    const getInvoices = () => {
        let invoiceRef = `${firebase.tenantId}_Invoices`;
        firebase.db.ref(invoiceRef).on('value', (res) => {
            const invoiceObjs = res.val() ?? {};
            
            const invoices = Object.keys(invoiceObjs).map(invoiceKey => {
                
                const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                const firstDate = new Date();
                const secondDate = new Date(invoiceObjs[invoiceKey].dueDate);

                const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

                const organizationId = invoiceObjs[invoiceKey].organizationId

                console.log(organizationId);
                return {
                    id: invoiceKey,
                    dueDays: diffDays,
                    organizationId : organizationId,
                    ...invoiceObjs[invoiceKey]
                }
            });
            setInvoices(invoices)
        });

        setIsLoading(false);
    }

    const onDownloadPress = (rowData) => {
        console.log(rowData);
        let fileRef = `${firebase.tenantId}/documents/invoices/${rowData.fileName}`;
        firebase.storage.ref(fileRef).getDownloadURL().then(url => {
            window.open(url)
        })
    }

    const sendEmailApi = async (rowData) => {
        setIsLoading(true);
        let emailId = '';
    console.log("started",rowData);
    partners.map((val,index) => {
        console.log(val.id);
        if (val.id === rowData.organizationId){
            emailId = val.email
        }
    })
        const formData = new FormData();
        
        let fileRef = `${firebase.tenantId}/documents/invoices/${rowData.fileName}`;
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

    const invoiceActionButtons = (rowData) => {
        return <Flex direction="row">
            <ActionButton 
                onPress={() => onDownloadPress(rowData)}
                marginEnd="size-100" 
                UNSAFE_className={'bugsy-button'}>
                <Preview/>
                <Text>Download</Text>
            </ActionButton>

            <ActionButton
                 onPress={() => sendEmailApi(rowData)}
                UNSAFE_className={'bugsy-button'}>
                <Send/>
                <Text>Send</Text>
            </ActionButton>
            
        </Flex>
    }

    if (isLoading) {
        return <>
            <Flex alignItems="center" justifyContent="center" height="100%">
                <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
            </Flex>
        </>
    }

    // const onRowSelected = (rowData) => { setMarkAsPaidOpen(rowData) }


    const header = () => {

        let paidEnabled = false;
        let unpaidEnabled = false;
        let selectedInvoicesArr = selectedInvoice?.map(ele => { return ele.paymentStatus});
        
        if (selectedInvoicesArr?.length > 0 ) {
            paidEnabled = selectedInvoicesArr.every((el) => el === 'UNPAID');
            unpaidEnabled = selectedInvoicesArr.every((el) => el === 'PAID')
        }
        

        // console.log('paidDisabled', paidDisabled)
        // // console.log('here', selectedInvoice?.map(ele => {
        // //     return ele.paymentStatus
        // // }))

        return <div className="table-header" style={{display: 'flex',justifyContent: 'space-between', flexDirection: 'row', marginBottom: '10px'}}>
            <div style={{ textAlign:'left' }}>
                <MultiSelect placeholder="Select Employee Fields to Display" value={selectedColumns} options={columns} optionLabel="header" onChange={onColumnToggle} style={{width:'20em'}}/>
            </div>
            <div style={{display: 'flex'}}>
            <div style={{alignSelf: 'center', display:'flex'}}>
                <ActionButton variant="cta" UNSAFE_className="bugsy-action-button" isDisabled={!unpaidEnabled} onPress={() => setMarkAsUnpaidOpen(true)} marginEnd="size-250">Mark as Unpaid</ActionButton>
                <ActionButton variant="cta" UNSAFE_className="bugsy-action-button" isDisabled={!paidEnabled} onPress={() => setMarkAsPartiallyPaidOpen(true)} marginEnd="size-250">Mark as Partially Paid</ActionButton>
                <ActionButton variant="cta" UNSAFE_className="bugsy-action-button" isDisabled={!paidEnabled} onPress={() => setMarkAsPaidOpen(true)} marginEnd="size-250">Mark as Paid</ActionButton>
            </div>
              
                <TextField type="search" marginEnd="size-250" onChange={(value) => setGlobalFilter(value)} placeholder="Search..." />
                <Button variant="cta" UNSAFE_className="bugsy-action-button" onPress={() => history.push('/admin/invoicing/createinvoice')}>Create Invoice</Button>
            </div>
        </div>
    }

    return (<>
        
        <div className="row" style={{marginTop: '30px'}}>
                <>

                <DialogContainer onDismiss={() => setMarkAsPaidOpen(false)} {...props}>
                    {isMarkAsPaidOpen && (
                        <Dialog>
                            <Heading>Mark as Fully Paid</Heading>
                            {/* <Header>Connection status: Connected</Header> */}
                            <Divider />
                            <Content>
                                {/* <Text>Start speed test?</Text> */}
                                {
                                    selectedInvoice.map(ele => {
                                        console.log("valll",ele);
                                        return <div style={{display: 'flex', justifyContent: 'space-between', padding: '5px'}}>
                                                <div style={{display: 'flex'}}>
                                                    <div style={{alignSelf: 'center'}}> {ele.invoiceNumber} </div>
                                                    <div style={{alignSelf: 'center', marginLeft: '5px'}}> {ele.employee} </div>
                                                    <div style={{alignSelf: 'center', marginLeft: '5px'}}> ${ele.total} </div>
                                                </div>
                               
                                            <div style={{alignSelf: 'center'}}><FileUpload name="demo" mode="basic" chooseLabel="Upload Check Image"/></div>
                                        </div>
                                    })
                                }
                            </Content>
                            <ButtonGroup>
                                <Button variant="secondary" onPress={()=> { setMarkAsPaidOpen(false)}}>
                                Cancel
                                </Button>
                                <Button variant="cta" onPress={() => { alert('confirm')}}>
                                Save
                                </Button>
                            </ButtonGroup>
                        </Dialog>
                    )}
                </DialogContainer>

                <DialogContainer onDismiss={() => setMarkAsPartiallyPaidOpen(false)} {...props}>
                    {isMarkAsPartiallyPaidOpen && (
                        <Dialog>
                            <Heading>Mark as Partially Paid</Heading>
                            {/* <Header>Connection status: Connected</Header> */}
                            <Divider />
                            <Content>
                                {/* <Text>Start speed test?</Text> */}
                                {
                                    selectedInvoice.map(ele => {
                                        console.log("valll",ele);
                                        return <div style={{display: 'flex', justifyContent: 'space-between', padding: '5px'}}>
                                                <div style={{display: 'flex'}}>
                                                    <div style={{alignSelf: 'center'}}> {ele.invoiceNumber} </div>
                                                    <div style={{alignSelf: 'center', marginLeft: '5px'}}> {ele.employee} </div>
                                                    <div style={{alignSelf: 'center', marginLeft: '5px'}}> ${ele.total} </div>
                                                    <div style={{alignSelf: 'center', marginLeft: '10px'}}><TextField placeholder="Enter Amount"/></div>
                                                </div>
                               
                                            <div style={{alignSelf: 'center'}}><FileUpload name="demo" mode="basic" chooseLabel="Upload Check Image"/></div>
                                        </div>
                                    })
                                }
                            </Content>
                            <ButtonGroup>
                                <Button variant="secondary" onPress={()=> { setMarkAsPartiallyPaidOpen(false)}}>
                                Cancel
                                </Button>
                                <Button variant="cta" onPress={() => { alert('confirm')}}>
                                Save
                                </Button>
                            </ButtonGroup>
                        </Dialog>
                    )}
                </DialogContainer>

                <DialogContainer onDismiss={() => setMarkAsUnpaidOpen(false)} {...props}>
                    {isMarkAsUnpaidOpen && (
                        <Dialog>
                            <Heading>Mark as Unpaid</Heading>
                            {/* <Header>Connection status: Connected</Header> */}
                            <Divider />
                            <Content>
                                {/* <Text>Start speed test?</Text> */}
                                {
                                    selectedInvoice.map(ele => {
                                        
                                        console.log("valll",ele);
                                        return <div style={{display: 'flex', justifyContent: 'space-between', padding: '5px'}}>
                                                <div style={{display: 'flex'}}>
                                                    <div style={{alignSelf: 'center'}}> {ele.invoiceNumber} </div>
                                                    <div style={{alignSelf: 'center', marginLeft: '5px'}}> {ele.employee} </div>
                                                    <div style={{alignSelf: 'center', marginLeft: '5px'}}> ${ele.total} </div>
                                                </div>
                               
                                            {/* <div style={{alignSelf: 'center'}}><FileUpload name="demo" mode="basic" chooseLabel="Upload Check Image"/></div> */}
                                        </div>
                                    })
                                }
                            </Content>
                            <ButtonGroup>
                                <Button variant="secondary" onPress={()=> { setMarkAsUnpaidOpen(false)}}>
                                Cancel
                                </Button>
                                <Button variant="cta" onPress={() => { alert('confirm')}}>
                                Save
                                </Button>
                            </ButtonGroup>
                        </Dialog>
                    )}
                </DialogContainer>

                <div className="data-table">
                    {/* <Button>Generate</Button> */}
                    <DataTable 
                    // selectionMode="single" 
                    selection={selectedInvoice} onSelectionChange={e => setSelectedInvoice(e.value)}
                    value={invoices} 
                    header={header()}
                    paginator
                    // onRowClick={(rowData) => { onRowSelected(rowData.data)}}
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20,50]}
                    globalFilter={globalFilter}>
                        <Column selectionMode="multiple" headerStyle={{width: '3em'}}></Column>
                        {selectedColumns.map(col=> {
                            // if (col.field === 'paymentStatus') {
                            //     return <Column key={col.field} field={col.field} header={col.header} headerStyle={{width: '150px'}} sortable body={(rowData) => {
                            //         // console.log(rowData['paymentStatus'])
                            //         return <Picker
                            //         defaultSelectedKey={rowData['paymentStatus']}
                            //         items={paymentStatusOptions}
                            //         onSelectionChange={setPaymentStatus}
                            //         >
                            //         {(item) => <Item>{item.name}</Item>}
                            //         </Picker>
                            //     }}/>
                            // }
                            return <Column key={col.field} field={col.field} header={col.header} sortable/>;
                        })}
                        <Column style={{width: '250px'}} header="ACTIONS" body={invoiceActionButtons} />
                    </DataTable>

            </div>



                {/* <DialogContainer onDismiss={() => setMarkAsPaidOpen(false)} {...props}>
                    {console.log('isMarkAsPaidOpen.status', isMarkAsPaidOpen?.status)}
                    {isMarkAsPaidOpen && (
                    <AlertDialog
                    height="700px"
                        title={isMarkAsPaidOpen.invoiceNumber}
                        variant="information"
                        primaryActionLabel="Save"
                        secondaryActionLabel="Cancel">
                            <Flex direction="column">
                            <Picker
                            defaultSelectedKey={isMarkAsPaidOpen?.paymentStatus}
                            label="Payment Status"
                            items={paymentStatusOptions}
                            selectedKey={paymentStatus}
                            onSelectionChange={setPaymentStatus}
                            >
                            {(item) => <Item>{item.name}</Item>}
                            </Picker>
                            {paymentStatus !== null ? <TextField label="Payment Received" /> : null }

                            {['PAID', 'PARTIALLY PAID'].includes(paymentStatus) ? 
                                <>
                                <Flex direction="column">
                                    <label htmlFor="checkDate" style={{fontSize: '12px'}}>Check Date</label>
                                    
                                    <Calendar style={{width: '192px'}} id="checkDate" className="onboarding-calendar-input" value={new Date()} showIcon onChange={(e) => alert('not implemented')}  />
                          
                                </Flex>
                                
                                    <TextField label="Check Number" />
                                    <TextField label="Check Date" />
                                    
                                </>
                            : null}
                            
                            </Flex>

                    </AlertDialog>
                    )}
                </DialogContainer> */}
                </>

            
        </div>
    </>)
}

export default Invoicing
