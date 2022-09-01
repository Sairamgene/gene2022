import React from 'react';
import { Document, Page, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import  OfferLetterTemplate2  from './OfferLetterTemplate2';
import { TextArea } from '@react-spectrum/textfield';

export const OfferLetter2 = (props) => {
    // Create styles
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#E4E4E4'
        },
       
    });

    return (
        // <PDFViewer width="80%" height="500in">
        //     <Document>
        //         <Page size="A4" style={styles.page}>
                  
        //         </Page>
        //     </Document>
        // </PDFViewer>
        <div>
            <TextArea>  <OfferLetterTemplate2 
                    employeeDetails = {props.employeeDetails}
                    employeeOnboardingDetails = {props.employeeOnboardingDetails}
                    activeStep={props.step}
                    handleBack={() => props.handleBack()}
                    handleNext={(data)=>props.handleNext(data, props.employeeOnboardingData, props.step)} /></TextArea>
        </div>
    );
}