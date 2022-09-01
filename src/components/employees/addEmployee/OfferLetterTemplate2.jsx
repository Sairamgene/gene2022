//Main component of offer letter

//IMPORT STATEMENTS
import React, { useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
  Font,
} from "@react-pdf/renderer";
import dateFormat from "dateformat";
import { ActionButton } from "@adobe/react-spectrum";
import Logo from "../../../assets/jpeg/covetitLogo.jpeg";
import SignaturePad from "react-signature-pad-wrapper";
import  {signature} from "../../helpers/offerLetterConstants";

//FUNCTIONAL COMPONENT
export const OfferLetterTemplate2 = (props) => {
  //REGISTERING FONTS FOR PDF
  Font.register({
    family: "Open Sans",
    fonts: [
      {
        src:
          "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
      },
      {
        src:
          "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
        fontWeight: 700,
      },
    ],
  });

  
  //CREATING STYLES FOR PDF
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "white",
      // paddingTop: 35,
      paddingBottom: 35,
      // paddingHorizontal: 35
    },
    section: {
      textAlign: "left",
      marginLeft: "50px",
      marginRight: "50px",
      fontSize: 10,
      fontFamily: "Open Sans",
      top: 5,
      marginBottom: "100px",
    },
    text: {
      fontWeight: "bold",
      fontFamily: "Open Sans",
    },
    responsibilities: {
      paddingLeft: "150px",
    },

    image: {
      width: "250px",
      height: "60px",
      marginTop: "25px",
    },

    line: {
      border: "0.5px solid #cb2026",
      marginLeft: "50px",
      marginRight: "50px",
    },
    footerline: {
      border: "0.5px solid #cb2026",
    },
    topline: {
      border: "2px solid #cb2026",
    },
    bottomline: {
      border: "2px solid #cb2026",
      bottom: 0,
      left: 0,
      right: 0,
    },
    bottomView: {
      bottom: 0,
      left: 0,
      right: 0,
    },
    footer: {
      position: "absolute",
      fontSize: 8,
      bottom: 15,
      left: 0,
      right: 0,
      textAlign: "left",
      marginLeft: "50px",
      marginRight: "50px",
      color: "#cb2026",
    },
    subHeader: {
      marginLeft: 200,
    },
  });

  //VARIABLE FOR SIGNATURE PAD
  let signaturePadRef = {};
  //TO GET TODAY DATE
  const today = new Date().toLocaleDateString();
  const startDate = dateFormat(
    props.employeeDetails.startDate,
    "mmmm dS, yyyy"
  );

//FUNCTIONS FOR CREATING AND UPLOADING SIGNATURE
  function dataURLToBlob(dataURL) {
    // Code taken from https://github.com/ebidel/filer.js
    var parts = dataURL.split(';base64,');
    var contentType = parts[0].split(":")[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
  
    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
  
    return new Blob([uInt8Array], { type: contentType });
  }

  function download(dataURL, filename) {
    var blob = dataURLToBlob(dataURL);
    var url = window.URL.createObjectURL(blob);
  
    var a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = filename;
  
    document.body.appendChild(a);
    a.click();
  
    window.URL.revokeObjectURL(url);
  }

  const clear = () => {
    signaturePadRef.clear();
  };

  const saveSignature = () => {
 var dataURL = signaturePadRef.toDataURL("image/jpeg");
    download(dataURL, "signature.jpg");
  };

  const signaturePadChange = (base64DataUrl) => {
    console.log();
    console.log("Got new signature: " + base64DataUrl);
  };

  

//TO RENDER COMPONENT
  return (
    <>
    

      <div>

               {/* 
               TO SHOW CONTENT IN DIV
               <div style = {{border : '1px solid black' }}>
          <h5 style = {{marginLeft : '50px'}}>{startDate}</h5>
          <pre style = {{marginLeft : '50px' ,marginRight : '25px'}}>COVETIT, INC<br/>
46921 Warm Springs Blvd, Suite #201A<br/>
Fremont, CA 94539<br/>
Direct: (510) 900 5095<br/>
Fax: (510) 500 0540
Dear{" "}
                  {props.employeeDetails.middleInitial === ""
                    ? `${props.employeeDetails.firstName} ${props.employeeDetails.lastName}`
                    : `${props.employeeDetails.firstName} ${props.employeeDetails.middleInitial} ${props.employeeDetails.lastName}`}
                  ,<br/><br/>

                  Welcome to Covetit Inc., with reference to your discussions
                  with us. We are pleased to offer you employment as
                  {props.employeeDetails.profileTitle}. We propose a start date
                  of {startDate}.<br/><br/></pre>

                  <ol  style = {{marginLeft : '50px'}}>
                  {props.employeeOnboardingDetails.clauses.map((x, i) => (
                    
                      <li  ><b>{x.heading} :</b>
                  
                  {x.description}<br/>
                  {x.nestedObj.length !== 0
                    ? x.nestedObj.map((val, i) => {
                        console.log(val);
                   
                        if (x.heading === "Responsibilities") {
                          let des = []
                          des = val.nestedDesc.split("\n");
                       return <ul style = {{marginLeft : '50px'}}>
                         {des.map((nestedval)=>{
                           return (nestedval !== "") ? (
                            <li>{nestedval} </li>
                           ) : (
                            ""
                          );
                         })}
                          </ul>
                        } else {
                         
                          return (
                           <ul style = {{marginLeft : '50px'}}>  <li>  {val.nestedDesc}</li> </ul>
                          );
                        }
                        
                      })
                    
                    : ""}
  <br/>
  {x.otherDetails === "" ? (
                        <br/>
                      ) : (
                        <ul> <li>{x.otherDetails}</li>
                        <br/><br/></ul>
                     
                      )}
                  </li>
                  ))}
                  
                   </ol>
                   <div style={{ height: "100px", width: "200px",marginLeft : '50px' }}>
          <SignaturePad
            options={{ penColor: "rgb(66, 133, 244)" }}
            ref={(ref) => {
              signaturePadRef = ref;
            }}
            onChange={() => signaturePadChange}
          />
        </div>
        <br />
        <button style = {{marginLeft : '50px'}} onClick={() => clear()}>Clear</button>
        <button  style = {{marginLeft : '10px'}}onClick={() => saveSignature()}>Save</button><br/><br/>
               <pre  style = {{marginLeft : '50px'}}>
               Sincerely,
                 <br/><br/>
                  Ummara Nasir, HR Manager, <br/>
                  COVETIT INC,<br/>
                  Ph: (571) 335-2592<br/>
                  Email: ummara@covetitinc.com <br/>
                  E-Verify Number: 374628<br/><br/>
                 </pre>   
        </div><br/><br/> */}

{/**TO SHOW CONTENT IN PDF */}
        <PDFViewer width="100%" height="800in">
          <Document>
            <Page size="A4" style={styles.page} wrap={false}>
              <View fixed>
                <hr style={styles.topline} />
                <Image style={styles.image} src={Logo} />
                <hr style={styles.line} />
              </View>
              <View style={styles.section}>
                <Text>
                  {"\n"}
                  {today} {"\n"}
                  {"\n"}
                  {signature}
                  {"\n"}
                  Dear{" "}
                  {props.employeeDetails.middleInitial === ""
                    ? `${props.employeeDetails.firstName} ${props.employeeDetails.lastName}`
                    : `${props.employeeDetails.firstName} ${props.employeeDetails.middleInitial} ${props.employeeDetails.lastName}`}
                  ,{"\n"}
                  {"\n"}
                  Welcome to Covetit Inc., with reference to your discussions
                  with us. We are pleased to offer you employment as
                  {props.employeeDetails.profileTitle}. We propose a start date
                  of {startDate}.{"\n"}
                  {"\n"}
                </Text>
                <View>
                  {props.employeeOnboardingDetails.clauses.map((x, i) => (
                    <View>
                      <Text>
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontFamily: "Open Sans",
                          }}
                        >
                          {i + 1}. {x.heading} :
                        </Text>{" "}
                        {x.description}
                        {"\n"}{" "}
                      </Text>

                      <Text style={{ paddingLeft: "50px" }}>
                        {x.nestedObj.length !== 0
                          ? x.nestedObj.map((val, i) => {
                              console.log(val);
                              if (x.heading === "Responsibilities") {
                                let des = []
                                des = val.nestedDesc.split("\n");
                                return des.map((nestedval, i) => {
                                  return nestedval !== "" ? (
                                    <Text>
                                      ⦁ {nestedval} {"\n"}
                                    </Text>
                                  ) : (
                                    ""
                                  );
                                });
                              } else {
                                return (
                                  <Text>
                                    {" "}
                                    {val.nestedDesc}
                                    {"\n"}
                                  </Text>
                                );
                              }
                            })
                          : ""}
                        {x.otherDetails === "" ? (
                          "\n"
                        ) : (
                          <Text>
                            {" "}
                            {x.otherDetails}
                            {"\n"}
                            {"\n"}
                          </Text>
                        )}
                      </Text>
                    
                    </View>
                  ))}
                </View>
               

                <Text>
                  Sincerely,
                  {"\n"}
                  {"\n"}
                  Ummara Nasir, HR Manager, {"\n"}
                  COVETIT INC,{"\n"}
                  Ph: (571) 335-2592{"\n"}
                  Email: ummara@covetitinc.com {"\n"}
                  E-Verify Number: 374628{"\n"}
                  {"\n"}
                  <Text style={styles.text}>Agreed and Accepted:</Text>
                  {"\n"}I have read and agree with the terms stated in this
                  agreement, which supersedes and replaces all prior
                  negotiations or agreements, whether written or oral. This
                  agreement reflects the full and complete agreement between me
                  and COVETIT on the subjects contained and referenced herein.
                  My signature below constitutes a full and complete
                  understanding of the terms and conditions contained in this
                  agreement, including the Annexures incorporated herein by
                  reference, and constitutes an acceptance of this offer of
                  employment.
                </Text>
              </View>
              <View style={styles.footer} fixed>
                <hr style={styles.footerline} />
                <Text>
                 46921 Warm Springs blvd, suite #201A, Fremont CA </Text>
                 <Text style = {{marginLeft : '250px', marginTop : '-9px'}}> http://www.covetinc.com</Text>
                 <Text style = {{marginLeft : '435px',marginTop : '-9px'}}>ph:510-900-5095</Text>
                
              </View>
            </Page>
          </Document>
        </PDFViewer>
        <div style={{ height: "100px", width: "200px" }}>
          <SignaturePad
            options={{ penColor: "rgb(66, 133, 244)" }}
            ref={(ref) => {
              signaturePadRef = ref;
            }}
            onChange={() => signaturePadChange}
          />
        </div>
        <br />
        <button onClick={() => clear()}>Clear</button>
        <button onClick={() => saveSignature()}>Save</button>
      </div>
      <div className="row">
                <div className="col-md-12">
                    <div style={{ width: '100%', height: '100px', background: 'transparent', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ alignSelf: 'center', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <ActionButton UNSAFE_className="global-action-btn" isDisabled={props.activeStep === 2} onPress={() => props.handleBack()}>Back</ActionButton>
                            <div>
                                <ActionButton UNSAFE_className="global-action-btn" onPress={() => props.handleNext({
                                    ...{

                                    }
                                })}>Save</ActionButton>
                                <ActionButton UNSAFE_className="global-action-btn" onPress={() => props.handleNext({
                                    ...{

                                    }
                                })} marginStart="size-250">Save & Next</ActionButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </>
  );
};
export default OfferLetterTemplate2;
