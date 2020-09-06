import React from 'react';
import { Form, Input } from 'antd';


interface Props {
    label?: string;
    type?: string;
    defaultValue?:string;
    value?: string; 
    onChange?: any; 
    disabled?: boolean; 
    isError?: boolean; 
    errorString?: string; 
    name?:string;
    size?: any; 
}

const Demo = ({ label, type, defaultValue, value, onChange, disabled, isError, errorString,  name, size='middle'}: Props) => {
    return (
        <>
        {label && <h3 className='inputFieldLabel-small'>
                {label}
            </h3>}
           
            <Form.Item
            validateStatus={isError ? "error" : ""}
            // hasFeedback validateStatus="success"
            help={errorString}
            // rules={[{ required: true }]}
                >
                     <Input
                    type={type}
                    size={size}
                    allowClear 
                    name={name}
                    disabled={disabled}
                    value={value}
                    onChange={onChange}
                    className='inputclassName-small' />
               
            </Form.Item>
        </>
    );
};

export default Demo; 