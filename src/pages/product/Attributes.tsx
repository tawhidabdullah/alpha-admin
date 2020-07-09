import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'antd';


import { useFetch } from "../../hooks";
const options = [ { value: 'Burns Bay Road' }, { value: 'Downing Street' }, { value: 'Wall Street' } ];

const Complete: React.FC = () =>  {

    const [suggestedOptions,setsuggesteOptions] = useState([]); 
    const attributeList = useFetch([], [], 'attributeList', {});

    

    useEffect(()=>{
        if(attributeList.data && Object.keys(attributeList.data).length > 0){
            const options  = Object.keys(attributeList.data); 
            const manupulatedOptions = options.map(option => {
                return {
                    value: option
                }
            })
            setsuggesteOptions(manupulatedOptions); 
        }; 
    },[attributeList.data])
    
    
    console.log('suggestedOptions',suggestedOptions); 

    return (
        <>
        
    </>
    )
}

export default Complete;
