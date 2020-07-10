import React from 'react';
import { Form, Input } from 'antd';

const { TextArea } = Input;



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
    addonBefore?:string;
}

const Demo = ({ addonBefore, label, type, defaultValue, value, onChange, disabled, isError, errorString,  name}: Props) => {
    return (
        <>
        {label && (
  <h3 className='inputFieldLabel'>
  {label}
</h3>
        )}
          
            <Form.Item
            validateStatus={isError ? "error" : ""}
            // hasFeedback validateStatus="success"
            help={errorString}
            // rules={[{ required: true }]}
                >

                     <Input
                     type={type}
                     addonBefore={addonBefore}
                     style={{
                         borderRadius:'0'
                     }}
                     allowClear 
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