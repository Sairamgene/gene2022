import React, { useContext, useEffect, useState } from 'react';
import FirebaseContext from '../../firebase/Context';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { Stage, Layer, Image , } from "react-konva";
import useImage from "use-image";


const URLImage = ({ image }) => {
  const [img] = useImage(image.src);
  return (
    <Image
      image={img}
      x={image.x}
      y={image.y}
      // I will use offset to set origin to the center of the image
      offsetX={img ? img.width / 2 : 0}
      offsetY={img ? img.height / 2 : 0}
      draggable="true"
      onClick={() => {
        alert("hello");
      }}
    />
  );
};

const Documents = () => {

  const dragUrl = React.useRef();
  const stageRef = React.useRef();
  const [images, setImages] = React.useState([]);
  const [filename, setfilename] = useState('')

  const [fileContent , setFileContent] = useState('');

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const firebase = useContext(FirebaseContext);
  const getDocuments = () => {
    let ref = `${firebase.tenantId}/-covet0/documents/21c-4e51-b95/COVET-JobOfferLetter.pdf`///COVET/-covet0/documents/21c-4e51-b95///COVET/-covet0/documents/21c-4e51-b95
    console.log("ref", ref);
    firebase.storage.ref(ref).getDownloadURL().then(url => {
      // window.open(url)
      console.log(url);
      // setfilename(url);
      // const file = fileContent(url);
      // console.log("filecontent" , file);
      // readContent(url)
      
      // file = `${url}`
      fillForm(url)
      // setFf(url);
    })
  }
 
  const readContent = async (file) => {
    // setIsLoading(true);
 
    const formData = new FormData();
    
    
        let blob = await fetch(file).then(r => r.blob());
        console.log("blob",blob);
        formData.append("upload", blob);
   
      const pdfData = {
        method: 'POST',
        body: formData,
        // headers: {
        //     'Authorization': `Bearer ${idToken}`
        // }
      }
      // console.log(idToken);
      fetch('http://localhost:8081/readContents', pdfData)
        .then((res) => {
          if (res.status == 200) {
            res.text().then(function(text) {
              // myArticle.innerHTML = text;
              console.log(text);
              setFileContent(text);
              // createPdf()
            });
          } else if (res.status == 401) {
            console.log(res);
           
                alert("Oops! ");
            // }
          }
        })
        .then(data => console.log(data))
        .catch((error) => {
          console.error(error);
        });
    }
  useEffect(() => {
    getDocuments();
  }, []);

  async function createPdf() {
    const pdfDoc = await PDFDocument.create()
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  
    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()
    const fontSize = 30
    page.drawText({fileContent}, {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71),
    })
  
    const pdfBytes = await pdfDoc.save()
    var bytes = new Uint8Array(pdfBytes);
    var blob = new Blob([bytes], { type: "application/pdf" });
    const docUrl = URL.createObjectURL(blob);
    setfilename(docUrl);
  }

  async function fillForm(url) {
    // const url = url
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    // const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const form = pdfDoc.getForm();

    const sign = form.createTextField('Signature')
    const pages = pdfDoc.getPages()
                                                                                                                                
    const lastPage = pages[pages.length - 1]
    const { width, height } = lastPage.getSize()
    sign.addToPage(pages[pages.length - 1], { x: 60, y: (height - 680), height: 28, width: 350 })


    console.log("width, height", width, height);

    const pdfBytes = await pdfDoc.save() // uint8array i need to show it in pdf 
    var bytes = new Uint8Array(pdfBytes);
    var blob = new Blob([bytes], { type: "application/pdf" });
    const docUrl = URL.createObjectURL(blob);
    setfilename(docUrl);
    const existingPdf = await fetch(docUrl).then(res => res.arrayBuffer())
    const pdfDocs = await PDFDocument.load(existingPdf)
    // const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const forms = pdfDocs.getForm();
    const alliesField = forms.getTextField('Signature')
    console.log(alliesField);
    alliesField.setText("lhhh")

  }


  return (

    <div>
       
      <iframe style={{ width: '80%', height: 600 }} src={filename} >
      
                </iframe>
   
              
    </div>
  )
}

export default Documents;



/**
 * 
 * <div onDrop={(e) => {
            e.preventDefault();
            // register event position
            stageRef.current.setPointersPositions(e);
            // add image
            setImages(
              images.concat([
                {
                  ...stageRef.current.getPointerPosition(),
                  src: dragUrl.current
                }
              ])
            );
          }}

          onDragOver={(e) => e.preventDefault()}> 
          <pre>
            <Stage
              width={window.innerWidth}
              height={window.innerHeight}
              style={{ border: "1px solid grey" }}
              ref={stageRef}
            >
          
          <Layer>
          {fileContent}   
          {images.map((image) => {
            return  <URLImage image={image} />
         //    return (
         //      );
           })}
         </Layer>
       
         </Stage>
         </pre>
     </div>
     <div><img
       alt="lion"
       src="https://konvajs.org/assets/lion.png"
       draggable="true"
       onDragStart={(e) => {
         dragUrl.current = e.target.src;
       }}
     /></div>
 */





