import React from 'react';
import { Form, Input } from 'antd';

const { TextArea } = Input;



interface Props {
    label: string;
    type?: string;
    defaultValue?:string;
    value?: string; 
    onChange?: any; 
    disabled?: boolean; 
    isError?: boolean; 
    errorString?: string; 
    name?:string;
}

const Demo = ({ label, type, defaultValue, value, onChange, disabled, isError, errorString,  name}: Props) => {
    return (
        <>
            <h3 className='inputFieldLabel'>
                {label}
            </h3>
            <Form.Item
            validateStatus={isError ? "error" : ""}
            help={errorString}
            // rules={[{ required: true }]}
                >
                     <Input
                    name={name}
                    disabled={disabled}
                    value={value}
                    onChange={onChange}
                    className='inputclassName' />
               
            </Form.Item>
        </>
    );
};

export default Demo; 