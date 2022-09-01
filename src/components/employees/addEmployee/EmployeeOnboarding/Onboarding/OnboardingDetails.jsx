import React, { useState } from 'react';
import { TextField, Form, ActionButton, Picker, Item, Flex ,TextArea,Button} from '@adobe/react-spectrum'

  
const OnboardingDetails = (props) => {
    // const [inputList, setInputList] = useState([{ heading: "", description: "" }]);
    // const [headerPoints, setHeaderPoints] = useState([]);

  const [clauses, setclauses] = useState([
    {
      heading: "Responsibilities",
      description: `You will render all duties of the position including, but not limited to, the key job functions as set forth below:`,
      nestedObj: [{
        nestedDesc: `Prepare and Publish E2E Release Scope.
Keeps track of the project status right from the project intake through Go Live.
Participate in Agile Stand up and Sprint planning meetings.
Manage all necessary coordination across different work streams to drive the project smoothly.
Liase with Business, Development, QA, Environment & Operations team on day to day basis to track software code deployments across platforms.
Keep track of all IT Domain Test Milestones stay on Target and re-plan if necessary.
Keep track of software code versions across test and staging environments all the way to production
Identify all Impacted Applications
Make sure all applications are planned in the test environments by the environment planning team
Make sure code delivery is on track per the expected date
Identify Test/Data Dependencies
Publish Daily Test Status Report
Responsible for Test Release Sign off
Host daily status calls with stakeholders on the project status
Actively monitor for Defect Resolution
Identify Release Gating Defects in collaboration with Business team and prioritize them
Publish Release Closure Summary post production deployment.
`
      }
      ],
      otherDetails : ""
    }, {
      heading: "Working Hours",
      description: " You shall be present in the office during normal working hours as per Client’s policies. You shall provide details regarding the utilization of your time by entering the same into COVETIT’s web-based electronic timesheets on a daily basis. In case you are attached to any project where the client may have requirement of recording specific time-efforts, you shall comply with such requirements in addition to COVETIT’s requirements.",
      nestedObj: [],
      otherDetails : ""
    }, {
      heading: "Compensation & Benefits",
      description: " You will be paid $60.28/hour.",
      nestedObj: [
        {
          nestedDesc: `(You will be paid based solely on client-approved timesheets. If you fail to provide approved timesheets, Covetit Inc., will not be liable for any payment.)`
        }, {
          nestedDesc: `Effective on the date of your joining, you will also be eligible for benefits from COVETIT's employee benefits package. At the present time, COVETIT benefits for which you will be eligible include:`
        }, {
          nestedDesc: `Health Benefits: Effective with your date of joining, you will be eligible to enroll in COVETIT’s Health insurance plan. This plan covers all standard benefits such as health, vision, dental and life Insurance.
          `
        }, {
          nestedDesc: `Vacation Time: Based on Client’s Vacation Policies.
          `
        }, {
          nestedDesc: `Savings and Retirement Plans: COVETIT offers a 401(k) plan, which is a convenient, flexible, Tax-efficient way to save for your retirement.
          `
        }
      ],
      otherDetails : "The above information only highlights the benefits that COVETIT currently provides its employees. Each of the Benefits official plan documents govern the plans and they may be modified, changed or eliminated, with or without notice, at any time, during your period of employment. If there is a difference between the highlights and the plan documents, the official plan documents will control."
    }, 
    {
      heading: "Status Reports:",
      description: "You will provide COVETIT with any reports that are deemed necessary, including time sheets, Periodic summaries of your work-related activities and professional accomplishments.",
      nestedObj: [],
      otherDetails : ""
    }, {
      heading: "Confidentiality",
      description: "You acknowledge that you have signed Confidentiality Agreement and have thereby agreed that confidential information, as defined therein, shall remain the sole and exclusive property of COVETIT, and that you shall not disclose COVETITs confidential information to any person not authorized to receive such information. You are expected to maintain the utmost secrecy in regard to the affairs of COVETIT and its clients and shall keep confidential any data, information, instruments, documents, methodologies, tools, structure, business or trade secrets, formulae etc., relating to COVETIT and/or its clients that may come to your knowledge as an employee of COVETIT, during the tenure of your employment with COVETIT and at any time thereafter. During the period of your employment, you will work honestly, faithfully, diligently and efficiently for the growth of COVETIT. You must return to COVETIT, upon request, and in any event, upon termination of your employment, all documents and tangible items which belong to COVETIT or which refer to any confidential information and which are in your possession or under your control. You must, if requested by COVETIT, delete all confidential information from any reusable material and destroy all other documents and tangible items in your possession and/or under your control which contain or refer to any confidential information.",
      nestedObj: [],
      otherDetails : ""
    },  {
      heading: "Non-Solicitation",
      description: "You acknowledge that you have signed Covenant Against Disclosure and Covenant Not to Compete/Non-Solicitation and have thereby agreed not to compete with COVETIT or interfere with its business relations, including but not limited to soliciting or providing services to any of COVETITs clients (except as directed by COVETIT), directly or indirectly, while employed by COVETIT and for a period of one year here after.",
      nestedObj: [],
      otherDetails : ""
    }, {
      heading: "Exclusive Employment & Conflict of Interest",
      description: " During your employment with COVETIT, you are not to take up any other employment, profession, vocation or calling either by yourself or through partnership or any other form of association, subject to the exceptions that such restrictions will not apply to your hobbies like contributing articles to technical and other publications, music, photography, sports and other similar activities. You are also restricted from prosecuting any activities that will create conflict of interests to your employment and/or work with COVETIT. However, this does not preclude your holding up to 5% of any class of securities in any company which is quoted on a recognized Stock Exchange. Membership in the board of directors or supervisory board of other enterprises shall be subject to the Company’s prior written consent.      ",
      nestedObj: [],
      otherDetails : ""
    } , {
      heading: "Intellectual Property Rights",
      description: " You agree to disclose and assign any invention, development, process, plan, Design, formula, specification, program or other matter of work whatsoever (collectively \"the Inventions\") Created, developed or discovered by you, either alone or in concert, in the course of your employment and the Same shall be the absolute property of the Company. As a condition of your employment with COVETIT. Any Intellectual Property Rights and rights to inventions which arise out of your activities hereunder, or if Ownership rights cannot be transferred under applicable law, any exploitation rights relating thereto, shall be transferred to the Company in accordance with applicable law. You shall, as and when requested by the Company (at Company’s cost and expense), assist the Company in perfecting the Intellectual Property Rights in any manner the Company deems fit",
      nestedObj: [],
      otherDetails : ""
    },{
      heading: "Termination",
      description: `COVETIT is an \"at will\" employer and nothing contained herein or in any other agreement shall alter the \"at will\" employment relationship that exists between you and COVETIT. Both you and COVETIT have the right to terminate your employment at will, with or without cause at any time. You shall provide a minimum of two weeks advance notice in writing of your intended separation. Likewise, COVETIT shall provide a minimum of two weeks advance notice, or two weeks of pay in lieu of notice, in all cases of termination without cause. COVETIT may terminate your employment for cause without any notice. \"Cause\" shall include but is not limited to, non-performance, misconduct, misbehavior, insubordination, theft, and violations of law, harassment and/or discrimination against any other employee, threats, violence and/or any violation of COVETITs or its client’s code of conduct. COVETIT reserves all of it rights as an "at will" employer, including the right, in its sole discretion, to change your position, responsibilities, compensation and the location of your employment. If you have any outstanding salary advances, the full balance is due at the time of termination, including the value of unreturned COVETIT property, any other advances and Company credit card dues. You understand and acknowledge that when the project/work to which you have been assigned has been completed, then COVETIT shall exercise its discretion to terminate your employment without cause in the event that COVETIT is unable to assign you to another project. This offer of employment is contingent upon satisfactory completion of any pending reference checks. If any of the information provided by you is found to be incorrect, your offer/services will be terminated, effective immediately.`,
      nestedObj: [],
      otherDetails : ""
    },{
      heading: "Governing Law",
      description: `This agreement shall be governed by and construed enforced in accordance with the laws of the California, USA. The parties hereto agree and stipulate that this Agreement shall be deemed to have been entered into in the California, USA. Any claim or cause of action arising out of or connected with this Agreement shall only be bought in the United States District Court for California (provided that a statutory basis for jurisdiction exits) or in either the Circuit Court or General District Court of Alameda County, California, and the parties hereto consent to submit to the personal jurisdiction of such courts, and waive all objections to such jurisdictions and venue.      `,
      nestedObj: [],
      otherDetails : ""
    },{
      heading: "Other Requirements",
      description: " In addition to this Agreement, and as a condition of your employment, you Acknowledge you have agreed to and have signed the following agreements, which are attached hereto as      ",
      nestedObj: [
        {
          nestedDesc: `Annexures/Copies and incorporated herein by reference:`
        }, {
          nestedDesc: `Confidentiality Agreement.`
        }, {
          nestedDesc: `Covenant against Disclosure and Covenant Not to Compete. `
        }, {
          nestedDesc: `Assignment of Inventions Agreement.
          `
        }
      ],
      otherDetails : `In addition, to support your employment eligibility in the United States, you will be asked to show proof of such eligibility. On your first day of employment, please bring with you two types of supporting documentation:

      A U.S. government issued photo ID (i.e., your U.S. Passport, Driver's License, State ID or USCIS Alien Registration Card); and Social Security Card or a government issued Birth Certificate).
      `
    }, {
      heading: "Attorney’s Fees",
      description: ` In any action to enforce this Agreement, the prevailing party shall be entitled to recover, in addition to appropriate relief, all attorney’s fees, costs, and accrued interest incurred.      `,
      nestedObj: [],
      otherDetails : ""
    },  {
      heading: "Indemnification",
      description: ` You shall indemnify, defend and hold COVETIT, its officers, directors, associates and agents, harmless from any and all claims, causes of action, damages, obligations or liabilities or any kind or nature arising out of or connected with any act or omission of yourself during the course of the employment with COVETIT and thereafter.      `,
      nestedObj: [],
      otherDetails : ""
    },  {
      heading: "COVETIT Policies",
      description: `You are required to comply with all the policies as communicated to the associates of COVETIT from time to time. These policies are available in COVETIT's intranet. You are requested to visit the site at frequent intervals to get all updates/changes. By signing a copy of this letter, you are consenting that you will visit the intranet site and become familiar with COVETITs policies and procedures. COVETIT reserves the right to interpret, change, suspend or terminate any of its benefits, policy plans, programs, or procedures in accordance with its needs from time to time.`,
      nestedObj: [],
      otherDetails : ""
    },  {
      heading: "Personal Indebtedness",
      description: `COVETIT shall not be responsible for personal indebtedness or other liabilities Incurred by you, during employment with COVETIT. You understand and accept that you shall have no authority to pledge the credit of COVETIT to any person or entity without COVETITs prior written authorization.`,
      nestedObj: [],
      otherDetails : ""
    },  {
      heading: "Limitation",
      description: ` Any claim by you against COVETIT arising out of your employment with COVETIT shall be made in Writing and served upon COVETIT within six (6) months from the date of your termination. Any claim made by you beyond six months shall be waived by you and shall not affect or bind COVETIT with respect to such claim.      `,
      nestedObj: [],
      otherDetails : ""
    },  {
      heading: "Miscellaneous",
      description: `The waiver by either party of a breach of any provision of this Agreement by the other party shall not operate or be construed as a waiver of any subsequent breach.    `,
      nestedObj: [
        {
          nestedDesc: `If any provision of this Agreement shall be declared to be illegal or unenforceable for any reason, the remaining provisions of this Agreement shall remain in full force and effect.`
        }, {
          nestedDesc: `This Agreement may be executed in counterpart originals, each of which shall be deemed an Original.`
        }, {
          nestedDesc: `You shall not, without COVETITs prior written consent, accept or demand loans, gifts, other benefits, of promises thereof, from COVETITs clients or other persons with whom you have official or Business contacts in the context of your activities for COVETIT.`
        }, {
          nestedDesc: `You shall not, without COVETITs prior written consent, accept an employment offer with COVETITs clients or other entities/persons with whom you have official or Business contacts in the context of your activities for COVETIT.`
        }
      ],
      otherDetails : ""
    },  {
      heading: "Acknowledgement & Acceptance",
      description: `You represent and acknowledge that you are not subject to any contractual or legal restriction pursuant to an agreement with any prior employer which may prevent you from accepting this position as a COVETIT employee. This job offers and the Annexures incorporated herein by reference contain the entire agreement and understanding between you and COVETIT with respect to the terms and conditions of your employment. No other promises, agreements or understandings, written or oral, not stated herein shall be binding unless it is in writing and signed by you and an authorized representative of COVETIT INC. In the event that any term of this Agreement is held to be unenforceable, all other terms shall continue to be of full force and effect. As a condition to your acceptance of employment with COVETIT, we require you to execute all Annexures, copies of which are attached hereto and incorporated herein by reference. Please read the agreements and feel free to review it with counsel of your choice. If you are in agreement with the terms of this letter, please sign the duplicate copy of the letter as evidence of your acceptance and return it to us within ten (10) days of the date of this letter, failing which, the offer will be withdrawn. This offer is contingent upon satisfactory completion of any pending reference checks, the Form I-9 and our receipt of an executed copy of both this offer letter and the attached Annexures. Further, this offer is contingent on the position and project work for the client being available at the effective date, and in the event that the client rescinds the project need or position and there is no assignment for you, this offer may be withdrawn.`,
      nestedObj: [],
      otherDetails : "Please feel free to contact us should you have any questions about this offer of employment. We look forward to working with you and will do all we can to ensure that the transition is smooth, and that our relationship is mutually beneficial."
    }
  
  ])
    
    const handleInputChange = (e, index,placeholder) => {
        
        const list = [...clauses];
        list[index][placeholder] = e;
        setclauses(list);
        console.log(list);
      };
     
     
      const handleNestedInputChange = (e, mainIndex,index,placeholder) => {
        const list = [...clauses];
        list[mainIndex].nestedObj[index][placeholder] = e;
        setclauses(list);
        console.log(list);
     };

      const handleAddClick = () => {
        setclauses([...clauses,{ heading: "", description: "", nestedObj : [] } ])
        // setInputList([...inputList, { heading: "", description: "" }]);
      };

      const handleAddnestedVal = (i) => {
          console.log('clicked');
          const list = [...clauses];
          list[i].nestedObj.push({  nestedDesc : ""})
          setclauses(list);
        console.log(list);
      }

       // handle click event of the Remove button
       const handleRemoveClick = (e,index) => {
          e.preventDefault();
         console.log('ghghhghghg');
        const list = [...clauses];
        list.splice(index, 1);
        setclauses(list);
      
      };

      const handlenestedRemoveClick = (e,mainI,index) => {
        e.preventDefault();
        let list = [...clauses];
       console.log(list[mainI].nestedObj[index]);
       const nestlist = list[mainI].nestedObj
       nestlist.splice(index,1)
      //  list[mainI] = nestlist
       setclauses(list);
        // setHeaderPoints(list);
      };



    const buttonDisabled = () => {
    }

  
    return (<>
    {/* // onPress={()=> handleAddnestedVal(i)} */}
  {    console.log(clauses)}
        <div className="row">
            <div >
                <Form isQuiet marginTop="20px" direction="column" width="100%">
                <Button width = '10px' onPress={handleAddClick}>Add
                </Button>
              {clauses.map((val,i)=>{
                console.log(val);
                return (
                  <div>
                     <TextField 
                        placeholder="Enter Heading"
                        value={val.heading} 
                        
                        onChange={e => handleInputChange(e, i,'heading')}
                      />
                      {/* <Button width = '10px' marginEnd="20px" >✓
                      </Button> */}
                      <button style={{border : 'none',backgroundColor : 'white',color : 'red', fontWeight: 'bold'}}  
                      width = '5px' 
                      onClick={(e)=> handleRemoveClick(e,i)}>—
                      </button>
                      <br/>
                      <TextArea
                          width = '550px' marginBottom="12px"
                          placeholder="Enter Description"
                          value ={val.description}
                          onChange={e => handleInputChange(e, i,'description')}
                       />
                     
                     {val.nestedObj.length !== 0 ? val.nestedObj.map((nestVal,nestI)=>{
                       console.log("=========" + nestI);
                       return (<div>
                          {/* <TextField  marginEnd="20px"  placeholder="Enter Heading"
                                  defaultValue={nestVal.nestedHeading}
                                  onChange={e => handleNestedInputChange(e, i,nestI,'nestedHeading')}
                                  /> */}
                                    
                          <TextArea marginStart='40px' marginEnd = '2px' width = '600px'  placeholder="Enter Description"
                            value ={nestVal.nestedDesc}
                            onChange={e => handleNestedInputChange(e, i,nestI,'nestedDesc')}></TextArea>
                          
                             <button style={{border: 'none',backgroundColor : 'white',color : 'red', fontWeight: 'bold'}}  width = '10px' 
                             onClick={(e)=> handlenestedRemoveClick(e,i,nestI)}>—
                      </button>
                       </div>)
                                  
                     }): <div></div>}
                     <br/>
                      <TextArea
                          width = '550px' marginBottom="12px" marginTop = '12px'
                          placeholder="Other details"
                          value ={val.otherDetails}
                          onChange={e => handleInputChange(e, i,'otherDetails')}
                       />
                  </div>
                )
                                          
              })}

                </Form>
            </div>
           
        </div>

        <div className="row">
            <div className="col-md-12">
                <div style={{width: '100%', height: '100px', background: 'transparent', display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{alignSelf: 'center', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <ActionButton UNSAFE_className="global-action-btn" isDisabled={props.activeStep === 2} onPress={() => props.handleBack()}>Back</ActionButton>
                        <div>
                            <ActionButton UNSAFE_className="global-action-btn" isDisabled={buttonDisabled()} onPress={()=> props.handleNext({...{
                              clauses
                                }})}>Save</ActionButton>
                            <ActionButton UNSAFE_className="global-action-btn" isDisabled={buttonDisabled()} onPress={()=> props.handleNext({...{
                               clauses
                            }})} marginStart="size-250">Save & Next</ActionButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
    
}

export default OnboardingDetails;

// {inputList.map((val, i) => {
//   //  headerPoints.map((nestedVal,nestedi) =>{
//       return (
//           // renderProperties(val,i, true)
//           <div style={{ marginLeft: '2.25rem' }}> 
//           {/* {inputList.length - 1 === i &&} */}
//           <TextField  marginEnd="20px" name="heading"
//                   placeholder="Enter Heading"
//                              defaultValue={val.heading}
//                              onChange={e => handleInputChange(e, i,'heading')} />
                          
//                            <TextArea
//                             name="description" width = '200px'
//                             placeholder="Enter Description"
//                                        defaultValue ={val.description}
//                                        onChange={e => handleInputChange(e, i,'description')}
                       
//                      />
//                      <Button width = '170px' marginEnd="20px"  onPress={() => handleAddnestedVal(i)}
//                    >Add Heading Points</Button>
//                   {/* {inputList.length !== 1 && } */}
//                   <Button width = '100px' marginEnd="20px"  
//                       onPress={() => handleRemoveClick(i)}>Remove</Button>
                    
//                   <div> {headerPoints.map((val1,i1)=>{
//                        return  i1 === i ? <div> <TextField  marginEnd="20px" name="heading"
//                        placeholder="Enter Heading"
//                                   defaultValue={val1.header}
//                                   onChange={e => handleNestedInputChange(e, i1,'header')} />
                               
//                                 <TextArea
//                                  name="description" width = '200px'
//                                  placeholder="Enter Description"
//                                             defaultValue ={val1.nestedDesc}
//                                             onChange={e => handleNestedInputChange(e, i1,'nestedDesc')}
                            
//                           />
//                            {headerPoints.length !== 1 && <Button width = '100px' marginEnd="20px"  
//                       onPress={() => handlenestedRemoveClick(i1)}>Remove</Button>}
//                     {/* {headerPoints.length - 1 === i && } */}
//                     <Button width = '150px' onPress={() => handleAddnestedVal(i1)}>Add More points
//                     </Button>
//                           </div> : <div></div>
//                     })}</div>
                   