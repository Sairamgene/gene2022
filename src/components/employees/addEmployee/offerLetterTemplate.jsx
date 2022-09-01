import React, { useState,useEffect } from 'react';
import { PDFDocument, StandardFonts, rgb, drawPage } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import {htmlToText} from 'html-to-text';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';



// Create styles
const styles = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
      fontFamily: 'Oswald'
    },
    author: {
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 40,
    },
    subtitle: {
      fontSize: 18,
      margin: 12,
      fontFamily: 'Oswald'
    },
    text: {
      margin: 12,
      fontSize: 14,
      textAlign: 'justify',
      fontFamily: 'Times-Roman'
    },
    image: {
      marginVertical: 15,
      marginHorizontal: 100,
    },
    header: {
      fontSize: 12,
      marginBottom: 20,
      textAlign: 'center',
      color: 'grey',
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey',
    },
  });
const OfferLetterTemplate = () => {
    const today = new Date().toLocaleDateString();
    const stringDate = today.toString()
const [employeeName, setEmployeename] = useState('mehak')
const [filename, setfilename] = useState('')
const [fileData, setFileData] = useState('');
const templateData =  `<div>  <h6>${today}</h6><address> 
        </address><br/><br/>
        Dear ${employeeName},<br/>
        Welcome to Covetit Inc., with reference to your discussions with us. We are pleased to offer you employment as an E2E<br/>

Testing Team Lead. We propose a start date of April 5 th , 2021.<br/>

<ul>
    <li>
<b>Responsibilities</b>: You will render all duties of the position including, but not limited to, the key job functions as set forth below:
<ul>
<li>Prepare and Publish E2E Release Scope</li>
<li>Keeps track of the project status right 
    from the project intake through Go Live</li>
<li>Participate in Agile Stand up and Sprint planning meetings</li>
<li>Manage all necessary coordination across different work 
streams to drive the project smoothly</li> 
<li>Liase with Business, Development, QA, Environment & 
    Operations team on day to day basis to track software 
    code deployments across platforms</li>
<li>Keep track of all IT Domain Test Milestones stay on
     Target and re-plan if necessary</li>
<li>Keep track of software code versions across test 
and staging environments all the way to production</li>
<li>Identify all Impacted Applications</li>
<li>Make sure all applications are planned in the test environments by the environment planning team
</li>
<li>Make sure code delivery is on track per the expected date
</li>
<li>Identify Test/Data Dependencies
</li>
<li>Publish Daily Test Status Report
</li>
<li>Responsible for Test Release Sign off
</li>
<li>Host daily status calls with stakeholders on the project status
</li>
<li>Actively monitor for Defect Resolution
</li>
<li>Identify Release Gating Defects in collaboration with Business team and prioritize them
</li>
<li>Publish Release Closure Summary post production deployment
</li>
</ul>
</li>
<li>
<b>Working Hours:</b> You shall be present in the office during normal working hours as per Client’s policies. You shall provide details regarding the utilization of your time by entering the same into COVETIT’s web-based electronic timesheets on a daily basis. In case you are attached to any project where the client may have requirement of recording specific time-efforts, you shall comply with such requirements in addition to COVETIT’s requirements.
</li>
<li>
<b>Compensation & Benefits:</b> You will be paid $60.28/hour.<br/><br/>

(You will be paid based solely on client-approved timesheets. If you fail to provide approved timesheets, Covetit Inc., will not be liable for any payment.)
<br/><br/>
Effective on the date of your joining, you will also be eligible for benefits from COVETIT's employee benefits package. At the present time, COVETIT benefits for which you will be eligible include:
</li>
<li>
<ul>
<li>
<b>Health Benefits:</b> Effective with your date of joining, you will be eligible to enroll in COVETIT’s Health insurance plan. This plan covers all standard benefits such as health, vision, dental and life Insurance.
</li>
<li>
<b>Vacation Time:</b> Based on Client’s Vacation Policies.</li>
<li>Savings and Retirement Plans: COVETIT offers a 401(k) plan,
 which is a convenient, flexible, Tax-efficient way to save for your retirement.</li>
<br/>

The above information only highlights the benefits that COVETIT currently provides its employees. Each of the Benefits official plan documents govern the plans and they may be modified, changed or eliminated, with or without notice, at any time, during your period of employment. If there is a difference between the highlights and the plan documents, the official plan documents will control.
</ul>
</li>
<li>
Status Reports: You will provide COVETIT with any reports that are deemed necessary, including time sheets, Periodic summaries of your work-related activities and professional accomplishments.
</li>
<li>
Confidentiality: You acknowledge that you have signed Confidentiality Agreement and have thereby agreed that confidential information, as defined therein, shall remain the sole and exclusive property of COVETIT, and that you shall not disclose COVETITs confidential information to any person not authorized to receive such information. You are expected to maintain the utmost secrecy in regard to the affairs of COVETIT and its clients and shall keep confidential any data, information, instruments, documents, methodologies, tools, structure, business or trade secrets, formulae etc., relating to COVETIT and/or its clients that may come to your knowledge as an employee of COVETIT, during the tenure of your employment with COVETIT and at any time thereafter. During the period of your employment, you will work honestly, faithfully, diligently and efficiently for the growth of COVETIT. You must return to COVETIT, upon request, and in any event, upon termination of your employment, all documents and tangible items which belong to COVETIT or which refer to any confidential information and which are in your possession or under your control. You must, if requested by COVETIT, delete all confidential information from any reusable material and destroy all other documents and tangible items in your possession and/or under your control which contain or refer to any confidential information.
</li>
<li>
Non-Solicitation: You acknowledge that you have signed Covenant Against Disclosure and Covenant Not to Compete/Non-Solicitation and have thereby agreed not to compete with COVETIT or interfere with its business relations, including but not limited to soliciting or providing services to any of COVETITs clients (except as directed by COVETIT), directly or indirectly, while employed by COVETIT and for a period of one year here after.
</li>
<li>
Exclusive Employment & Conflict of Interest: During your employment with COVETIT, you are not to take up any other employment, profession, vocation or calling either by yourself or through partnership or any other form of association, subject to the exceptions that such restrictions will not apply to your hobbies like contributing articles to technical and other publications, music, photography, sports and other similar activities. You are also restricted from prosecuting any activities that will create conflict of interests to your employment and/or work with COVETIT. However, this does not preclude your holding up to 5% of any class of securities in any company which is quoted on a recognized Stock Exchange. Membership in the board of directors or supervisory board of other enterprises shall be subject to the Company’s prior written consent.
</li>
<li>
Intellectual Property Rights: You agree to disclose and assign any invention, development, process, plan, Design, formula, specification, program or other matter of work whatsoever (collectively "the Inventions") Created, developed or discovered by you, either alone or in concert, in the course of your employment and the Same shall be the absolute property of the Company. As a condition of your employment with COVETIT. Any Intellectual Property Rights and rights to inventions which arise out of your activities hereunder, or if Ownership rights cannot be transferred under applicable law, any exploitation rights relating thereto, shall be transferred to the Company in accordance with applicable law. You shall, as and when requested by the Company (at Company’s cost and expense), assist the Company in perfecting the Intellectual Property Rights in any manner the Company deems fit.
</li>
<li>
Termination: COVETIT is an "at will" employer and nothing contained herein or in any other agreement shall alter the "at will" employment relationship that exists between you and COVETIT. Both you and COVETIT have the right to terminate your employment at will, with or without cause at any time. You shall provide a minimum of two weeks advance notice in writing of your intended separation. Likewise, COVETIT shall provide a minimum of two weeks advance notice, or two weeks of pay in lieu of notice, in all cases of termination without cause. COVETIT may terminate your employment for cause without any notice. "Cause" shall include but is not limited to, non-performance, misconduct, misbehavior, insubordination, theft, and violations of law, harassment and/or discrimination against any other employee, threats, violence and/or any violation of COVETITs or its client’s code of conduct. COVETIT reserves all of it rights as an "at will" employer, including the right, in its sole discretion, to change your position, responsibilities, compensation and the location of your employment. If you have any outstanding salary advances, the full balance is due at the time of termination, including the value of unreturned COVETIT property, any other advances and Company credit card dues. You understand and acknowledge that when the project/work to which you have been assigned has been completed, then COVETIT shall exercise its discretion to terminate your employment without cause in the event that COVETIT is unable to assign you to another project. This offer of employment is contingent upon satisfactory completion of any pending reference checks. If any of the information provided by you is found to be incorrect, your offer/services will be terminated, effective immediately.
</li>
<li>
Governing Law: This agreement shall be governed by and construed enforced in accordance with the laws of the California, USA. The parties hereto agree and stipulate that this Agreement shall be deemed to have been entered into in the California, USA. Any claim or cause of action arising out of or connected with this Agreement shall only be bought in the United States District Court for California (provided that a statutory basis for jurisdiction exits) or in either the Circuit Court or General District Court of Alameda County, California, and the parties hereto consent to submit to the personal jurisdiction of such courts, and waive all objections to such jurisdictions and venue.
</li>   
Other Requirements: In addition to this Agreement, and as a condition of your employment, you Acknowledge you have agreed to and have signed the following agreements, which are attached hereto as

Annexures/Copies and incorporated herein by reference:
Confidentiality Agreement.
Covenant against Disclosure and Covenant Not to Compete.
Assignment of Inventions Agreement.
In addition, to support your employment eligibility in the United States, you will be asked to show proof of such eligibility. On your first day of employment, please bring with you two types of supporting documentation:

A U.S. government issued photo ID (i.e., your U.S. Passport, Driver's License, State ID or USCIS Alien Registration Card); and Social Security Card or a government issued Birth Certificate).

Attorney’s Fees: In any action to enforce this Agreement, the prevailing party shall be entitled to recover, in addition to appropriate relief, all attorney’s fees, costs, and accrued interest incurred.


Indemnification: You shall indemnify, defend and hold COVETIT, its officers, directors, associates and agents, harmless from any and all claims, causes of action, damages, obligations or liabilities or any kind or nature arising out of or connected with any act or omission of yourself during the course of the employment with COVETIT and thereafter.

COVETIT Policies: You are required to comply with all the policies as communicated to the associates of COVETIT from time to time. These policies are available in COVETIT's intranet. You are requested to visit the site at frequent intervals to get all updates/changes. By signing a copy of this letter, you are consenting that you will visit the intranet site and become familiar with COVETITs policies and procedures. COVETIT reserves the right to interpret, change, suspend or terminate any of its benefits, policy plans, programs, or procedures in accordance with its needs from time to time.

Personal Indebtedness: COVETIT shall not be responsible for personal indebtedness or other liabilities Incurred by you, during employment with COVETIT. You understand and accept that you shall have no authority to pledge the credit of COVETIT to any person or entity without COVETITs prior written authorization.

Limitation: Any claim by you against COVETIT arising out of your employment with COVETIT shall be made in Writing and served upon COVETIT within six (6) months from the date of your termination. Any claim made by you beyond six months shall be waived by you and shall not affect or bind COVETIT with respect to such claim.

Miscellaneous: The waiver by either party of a breach of any provision of this Agreement by the other party shall not operate or be construed as a waiver of any subsequent breach.

If any provision of this Agreement shall be declared to be illegal or unenforceable for any reason, the remaining provisions of this Agreement shall remain in full force and effect.
This Agreement may be executed in counterpart originals, each of which shall be deemed an Original.
You shall not, without COVETITs prior written consent, accept or demand loans, gifts, other benefits, of promises thereof, from COVETITs clients or other persons with whom you have official or Business contacts in the context of your activities for COVETIT.
You shall not, without COVETITs prior written consent, accept an employment offer with COVETITs clients or other entities/persons with whom you have official or Business contacts in the context of your activities for COVETIT.

Acknowledgement & Acceptance: You represent and acknowledge that you are not subject to any contractual or legal restriction pursuant to an agreement with any prior employer which may prevent you from accepting this position as a COVETIT employee. This job offers and the Annexures incorporated herein by reference contain the entire agreement and understanding between you and COVETIT with respect to the terms and conditions of your employment. No other promises, agreements or understandings, written or oral, not stated herein shall be binding unless it is in writing and signed by you and an authorized representative of COVETIT INC. In the event that any term of this Agreement is held to be unenforceable, all other terms shall continue to be of full force and effect. As a condition to your acceptance of employment with COVETIT, we require you to execute all Annexures, copies of which are attached hereto and incorporated herein by reference. Please read the agreements and feel free to review it with counsel of your choice. If you are in agreement with the terms of this letter, please sign the duplicate copy of the letter as evidence of your acceptance and return it to us within ten (10) days of the date of this letter, failing which, the offer will be withdrawn. This offer is contingent upon satisfactory completion of any pending reference checks, the Form I-9 and our receipt of an executed copy of both this offer letter and the attached Annexures. Further, this offer is contingent on the position and project work for the client being available at the effective date, and in the event that the client rescinds the project need or position and there is no assignment for you, this offer may be withdrawn.

Please feel free to contact us should you have any questions about this offer of employment. We look forward to working with you and will do all we can to ensure that the transition is smooth, and that our relationship is mutually beneficial.
</ul><br/><br/>

Sincerely,<br/><br/>


Ummara Nasir, HR Manager, <br/>
COVETIT INC,<br/>
Ph: (571) 335-2592<br/>
Email:  ummara@covetitinc.com <br/>
E-Verify Number: 374628<br/>

Agreed and Accepted:
I have read and agree with the terms stated in this agreement, which supersedes and replaces all prior negotiations or agreements, whether written or oral. This agreement reflects the full and complete agreement between me and COVETIT on the subjects contained and referenced herein. My signature below constitutes a full and complete understanding of the terms and conditions contained in this agreement, including the Annexures incorporated herein by reference, and constitutes an acceptance of this offer of employment.



    
Vineet Kumar Pathak	Date  </div>`
const text = htmlToText(templateData, {
    wordwrap: null,
    limits : ''
});
  //console.log(text);

useEffect( () => {
    setFileData(text);
    createPdf();
  }, [fileData]);

    async function createPdf() {
      
        const pdfDoc = await PDFDocument.create()
        pdfDoc.registerFontkit(fontkit)
        const url = 'https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf';
const fontBytes = await fetch(url).then((res) => res.arrayBuffer());
        //const [timesRomanFont,fontObj] = await pdfDoc.embedFont(StandardFonts.TimesRoman)
        const fontRef = await pdfDoc.embedFont(fontBytes);
        const fontSize = 15;
        if(fileData){
            const chunksArr = fileData.match(/(.|[\r\n]){1,10000}/g);
            drawPage(pdfDoc,fontRef,fontSize,chunksArr[0]);
            // for(let i = 0;i < chunksArr.size ; i++) {
            //     drawPage(pdfDoc,fontRef,fontSize,chunksArr[i]);
            // }
        }
        
        const pdfBytes = await pdfDoc.save()
        var bytes = new Uint8Array(pdfBytes);
        var blob = new Blob([bytes], { type: "application/pdf" });
        const docUrl = URL.createObjectURL(blob);
        setfilename(docUrl);
    }    
    
const drawPage = (pdfDoc,fontRef,fontSize,data) => {
    const page = pdfDoc.addPage([800,1000])
    const { width, height } = page.getSize();
    page.drawText(`${data}`, {
      x: 10,
      y: height - 4 * fontSize,
      size: fontSize,
      font: fontRef,
    //   color: rgb(0, 0.53, 0.71),
    })
}

    return (
       
        <>
        <div>
        {/* <iframe style={{ width: '100%', height: 600 }} src={filename} >
      
      </iframe> */}
         <Document>
    <Page size="A4" style={styles.body}>
      <Text style={styles.text}>
       {fileData}
      </Text>
    </Page>
  </Document>
        </div>
        </>
    )

}

export default OfferLetterTemplate;



              
{/* ⦁	Health Benefits: Effective with your date of joining, you will be eligible to
enroll in COVETIT’s Health insurance plan. This plan covers all standard benefits such
as health, vision, dental and life Insurance.{'\n'}{'\n'}
⦁	Vacation Time: Based on Client’s Vacation Policies.{'\n'}{'\n'}
⦁	Savings and Retirement Plans: COVETIT offers a 401(k) plan, which is a convenient,
 flexible, Tax-efficient way to save for your retirement.{'\n'}{'\n'}
The above information only highlights the benefits that COVETIT currently provides its
employees. Each of the Benefits official plan documents govern the plans and they may be
modified, changed or eliminated, with or without notice, at any time, during your period
of employment. If there is a difference between the highlights and the plan documents,
the official plan documents will control.{'\n'}

⦁	Status Reports: You will provide COVETIT with any reports that are deemed necessary,
 including time sheets, Periodic summaries of your work-related activities and professional
 accomplishments.{'\n'}{'\n'}

⦁	Confidentiality: You acknowledge that you have signed Confidentiality Agreement and
have thereby agreed that confidential information, as defined therein, shall remain the
sole and exclusive property of COVETIT, and that you shall not disclose COVETITs
confidential information to any person not authorized to receive such information.
 You are expected to maintain the utmost secrecy in regard to the affairs of COVETIT
 and its clients and shall keep confidential any data, information, instruments,
 documents, methodologies, tools, structure, business or trade secrets, formulae etc.,
 relating to COVETIT and/or its clients that may come to your knowledge as an employee
  of COVETIT, during the tenure of your employment with COVETIT and at any time thereafter. During the period of your employment, you will work honestly, faithfully, diligently and efficiently for the growth of COVETIT. You must return to COVETIT, upon request, and in any event, upon termination of your employment, all documents and tangible items which belong to COVETIT or which refer to any confidential information and which are in your possession or under your control. You must, if requested by COVETIT, delete all confidential information from any reusable material and destroy all other documents and tangible items in your possession and/or under your control which contain or refer to any confidential information.{'\n'}{'\n'}

⦁	Non-Solicitation: You acknowledge that you have signed Covenant Against Disclosure and Covenant Not to Compete/Non-Solicitation and have thereby agreed not to compete with COVETIT or interfere with its business relations, including but not limited to soliciting or providing services to any of COVETITs clients (except as directed by COVETIT), directly or indirectly, while employed by COVETIT and for a period of one year here after.{'\n'}{'\n'}

⦁	Exclusive Employment & Conflict of Interest: During your employment with COVETIT, you are not to take up any other employment, profession, vocation or calling either by yourself or through partnership or any other form of association, subject to the exceptions that such restrictions will not apply to your hobbies like contributing articles to technical and other publications, music, photography, sports and other similar activities. You are also restricted from prosecuting any activities that will create conflict of interests to your employment and/or work with COVETIT. However, this does not preclude your holding up to 5% of any class of securities in any company which is quoted on a recognized Stock Exchange. Membership in the board of directors or supervisory board of other enterprises shall be subject to the Company’s prior written consent.{'\n'}{'\n'}

⦁	Intellectual Property Rights: You agree to disclose and assign any invention, development, process, plan, Design, formula, specification, program or other matter of work whatsoever (collectively "the Inventions") Created, developed or discovered by you, either alone or in concert, in the course of your employment and the Same shall be the absolute property of the Company. As a condition of your employment with COVETIT. Any Intellectual Property Rights and rights to inventions which arise out of your activities hereunder, or if Ownership rights cannot be transferred under applicable law, any exploitation rights relating thereto, shall be transferred to the Company in accordance with applicable law. You shall, as and when requested by the Company (at Company’s cost and expense), assist the Company in perfecting the Intellectual Property Rights in any manner the Company deems fit.{'\n'}{'\n'}

⦁	Termination: COVETIT is an "at will" employer and nothing contained herein or in any other agreement shall alter the "at will" employment relationship that exists between you and COVETIT. Both you and COVETIT have the right to terminate your employment at will, with or without cause at any time. You shall provide a minimum of two weeks advance notice in writing of your intended separation. Likewise, COVETIT shall provide a minimum of two weeks advance notice, or two weeks of pay in lieu of notice, in all cases of termination without cause. COVETIT may terminate your employment for cause without any notice. "Cause" shall include but is not limited to, non-performance, misconduct, misbehavior, insubordination, theft, and violations of law, harassment and/or discrimination against any other employee, threats, violence and/or any violation of COVETITs or its client’s code of conduct. COVETIT reserves all of it rights as an "at will" employer, including the right, in its sole discretion, to change your position, responsibilities, compensation and the location of your employment. If you have any outstanding salary advances, the full balance is due at the time of termination, including the value of unreturned COVETIT property, any other advances and Company credit card dues. You understand and acknowledge that when the project/work to which you have been assigned has been completed, then COVETIT shall exercise its discretion to terminate your employment without cause in the event that COVETIT is unable to assign you to another project. This offer of employment is contingent upon satisfactory completion of any pending reference checks. If any of the information provided by you is found to be incorrect, your offer/services will be terminated, effective immediately.{'\n'}{'\n'}

⦁	Governing Law: This agreement shall be governed by and construed enforced in accordance with the laws of the California, USA. The parties hereto agree and stipulate that this Agreement shall be deemed to have been entered into in the California, USA. Any claim or cause of action arising out of or connected with this Agreement shall only be bought in the United States District Court for California (provided that a statutory basis for jurisdiction exits) or in either the Circuit Court or General District Court of Alameda County, California, and the parties hereto consent to submit to the personal jurisdiction of such courts, and waive all objections to such jurisdictions and venue.{'\n'}{'\n'}

⦁	Other Requirements: In addition to this Agreement, and as a condition of your employment, you Acknowledge you have agreed to and have signed the following agreements, which are attached hereto as{'\n'}{'\n'}

                    {'\t'}{'\t'}{'\t'}{'\t'}
⦁	Annexures/Copies and incorporated herein by reference:{'\n'}
⦁	Confidentiality Agreement.{'\n'}
⦁	Covenant against Disclosure and Covenant Not to Compete.{'\n'}
⦁	Assignment of Inventions Agreement.{'\n'}
In addition, to support your employment eligibility in the United States, you will be asked to show proof of such eligibility. On your first day of employment, please bring with you two types of supporting documentation:{'\n'}{'\n'}

⦁	A U.S. government issued photo ID (i.e., your U.S. Passport, Driver's License, State ID or USCIS Alien Registration Card); and Social Security Card or a government issued Birth Certificate).{'\n'}{'\n'}

⦁	Attorney’s Fees: In any action to enforce this Agreement, the prevailing party shall be entitled to recover, in addition to appropriate relief, all attorney’s fees, costs, and accrued interest incurred.{'\n'}{'\n'}


⦁	Indemnification: You shall indemnify, defend and hold COVETIT, its officers, directors, associates and agents, harmless from any and all claims, causes of action, damages, obligations or liabilities or any kind or nature arising out of or connected with any act or omission of yourself during the course of the employment with COVETIT and thereafter.{'\n'}{'\n'}

⦁	COVETIT Policies: You are required to comply with all the policies as communicated to the associates of COVETIT from time to time. These policies are available in COVETIT's intranet. You are requested to visit the site at frequent intervals to get all updates/changes. By signing a copy of this letter, you are consenting that you will visit the intranet site and become familiar with COVETITs policies and procedures. COVETIT reserves the right to interpret, change, suspend or terminate any of its benefits, policy plans, programs, or procedures in accordance with its needs from time to time.{'\n'}{'\n'}

⦁	Personal Indebtedness: COVETIT shall not be responsible for personal indebtedness or other liabilities Incurred by you, during employment with COVETIT. You understand and accept that you shall have no authority to pledge the credit of COVETIT to any person or entity without COVETITs prior written authorization.{'\n'}{'\n'}

⦁	Limitation: Any claim by you against COVETIT arising out of your employment with COVETIT shall be made in Writing and served upon COVETIT within six (6) months from the date of your termination. Any claim made by you beyond six months shall be waived by you and shall not affect or bind COVETIT with respect to such claim.{'\n'}{'\n'}

⦁	Miscellaneous: The waiver by either party of a breach of any provision of this Agreement by the other party shall not operate or be construed as a waiver of any subsequent breach.{'\n'}{'\n'}
                    {'\t'}{'\t'}{'\t'}{'\t'}

	If any provision of this Agreement shall be declared to be illegal or unenforceable for any reason, the remaining provisions of this Agreement shall remain in full force and effect.{'\n'}
⦁	This Agreement may be executed in counterpart originals, each of which shall be deemed an Original.{'\n'}
⦁	You shall not, without COVETITs prior written consent, accept or demand loans, gifts, other benefits, of promises thereof, from COVETITs clients or other persons with whom you have official or Business contacts in the context of your activities for COVETIT.{'\n'}
⦁	You shall not, without COVETITs prior written consent, accept an employment offer with COVETITs clients or other entities/persons with whom you have official or Business contacts in the context of your activities for COVETIT.{'\n'}

⦁	Acknowledgement & Acceptance: You represent and acknowledge that you are not subject to any contractual or legal restriction pursuant to an agreement with any prior employer which may prevent you from accepting this position as a COVETIT employee. This job offers and the Annexures incorporated herein by reference contain the entire agreement and understanding between you and COVETIT with respect to the terms and conditions of your employment. No other promises, agreements or understandings, written or oral, not stated herein shall be binding unless it is in writing and signed by you and an authorized representative of COVETIT INC. In the event that any term of this Agreement is held to be unenforceable, all other terms shall continue to be of full force and effect. As a condition to your acceptance of employment with COVETIT, we require you to execute all Annexures, copies of which are attached hereto and incorporated herein by reference. Please read the agreements and feel free to review it with counsel of your choice. If you are in agreement with the terms of this letter, please sign the duplicate copy of the letter as evidence of your acceptance and return it to us within ten (10) days of the date of this letter, failing which, the offer will be withdrawn. This offer is contingent upon satisfactory completion of any pending reference checks, the Form I-9 and our receipt of an executed copy of both this offer letter and the attached Annexures. Further, this offer is contingent on the position and project work for the client being available at the effective date, and in the event that the client rescinds the project need or position and there is no assignment for you, this offer may be withdrawn.{'\n'}{'\n'}

Please feel free to contact us should you have any questions about this offer of employment. We look forward to working with you and will do all we can to ensure that the transition is smooth, and that our relationship is mutually beneficial.{'\n'}{'\n'}

Sincerely,{'\n'}{'\n'}


Ummara Nasir, HR Manager, {'\n'}
COVETIT INC,{'\n'}
Ph: (571) 335-2592{'\n'}
Email:  ummara@covetitinc.com {'\n'}
E-Verify Number: 374628{'\n'}

Agreed and Accepted:{'\n'}
I have read and agree with the terms stated in this agreement, which supersedes and replaces all prior negotiations or agreements, whether written or oral. This agreement reflects the full and complete agreement between me and COVETIT on the subjects contained and referenced herein. My signature below constitutes a full and complete understanding of the terms and conditions contained in this agreement, including the Annexures incorporated herein by reference, and constitutes an acceptance of this offer of employment.{'\n'}{'\n'}




Vineet Kumar Pathak	Date */}



// class OfferLetterTemplate2 extends React.Component{
   
//     constructor(props) {
       
//         super(props);
//      
//       }
//       handleChange = evt => {
//         this.setState({ html: evt.target.value });
//       };
    
//       sanitizeConf = {
//         allowedTags: ["b", "i", "em", "strong", "a", "p", "h1"],
//         allowedAttributes: { a: ["href"] }
//       };
    
//       sanitize = () => {
//         this.setState({ html: sanitizeHtml(this.state.html, this.sanitizeConf) });
//       };
//       render = () => {
//         return (
//           <div>
//            <div className="row" style = {{border : '1px solid black'}}>
//            <ContentEditable style = {{display: 'flex', justifyContent: 'center'}}
//               className="editable"
//               tagName="pre"
//               html={this.state.html} // innerHTML of the editable div
//               disabled= {false} // use true to disable edition
//               onChange={this.handleChange} // handle innerHTML change
//               onBlur={this.sanitize}
//             />
           

//            </div>
           
//             <h3>actions</h3>
//             <EditButton cmd="italic" />
//             <EditButton cmd="bold" />
//             <EditButton cmd="formatBlock" arg="h1" name="heading" />
//             {/* <div className="row">
//                         <div className="col-md-12">
//                           <div style={{width: '100%', height: '100px', background: 'transparent', display: 'flex', justifyContent: 'space-between'}}>
//                                <div style={{alignSelf: 'center', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
//                                     <ActionButton UNSAFE_className="global-action-btn" isDisabled={props.activeStep === 2} onPress={() => props.handleBack()}>Back</ActionButton>
//                                    <div>
//                                        <ActionButton UNSAFE_className="global-action-btn"  onPress={()=> props.handleNext({...{
                                         
//                                            }})}>Save</ActionButton>
//                                        <ActionButton UNSAFE_className="global-action-btn" onPress={()=> props.handleNext({...{
                                           
//                                        }})} marginStart="size-250">Save & Next</ActionButton>
//                                    </div>
//                                </div>
//                            </div>
//                        </div>
//                    </div> */}

//                    <PDFViewer width="80%" height="500in">
//                        <Document>
//                            <Page size="A4" style={styles.page} wrap>
//                            <View fixed>
//                          <Image style={styles.image} src={Logo} />
//                          <hr style = {styles.line}/>
//                      </View>
//                     <View style={styles.section}>   
//                                              <Text style={styles.text} >
//                              {this.state.html}

//                          </Text>

//                      </View>
//                            </Page>
//                        </Document>

//                    </PDFViewer>
           
//           </div>
          
//         );
//       };
//     }
    
//     function EditButton(props) {
//       return (
//         <button
//           key={props.cmd}
//           onMouseDown={evt => {
//             evt.preventDefault(); // Avoids loosing focus from the editable area
//             document.execCommand(props.cmd, false, props.arg); // Send the command to the browser
//           }}
//         >
//           {props.name || props.cmd}
//         </button>
//       );
// }