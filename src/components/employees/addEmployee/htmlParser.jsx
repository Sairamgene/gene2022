import ReactHtmlParser from 'react-html-parser';
import { Text } from '@react-pdf/renderer';
import React from 'react';

const htmlRec = (parsedHtml = []) => {
    let returnContentConst='';
    parsedHtml.forEach(element => {
        if(typeof element === 'object'){
            returnContentConst = returnContentConst + htmlRec(element.props.children)  ;
        }else{
            returnContentConst = returnContentConst + (<Text>{element}</Text>)  ;
        }
      })
      return (<Text>{returnContentConst}</Text>);
}

export const htmlParser = (taskDescription) => {
  if (taskDescription) {
    const parsedHtml = ReactHtmlParser(taskDescription);
    return htmlRec(parsedHtml);
  } else {
    return '';
  }
}