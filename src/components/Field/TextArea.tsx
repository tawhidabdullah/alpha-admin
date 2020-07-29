import React from 'react';
import { Form, Input } from 'antd';

const { TextArea } = Input;



interface Props {
    label?: string;
    type?: string;
    defaultValue?: string;
    value?: string;
    onChange?: any;
    disabled?: boolean;
    isError?: boolean;
    errorString?: string;
    name?: string;
    rows?: number
}

const Demo = ({ label, type, defaultValue, value, onChange, disabled, isError, errorString, name, rows = 4 }: Props) => {
    return (
        <>
            {label && (
                <h3 className='inputFieldLabel'>
                    {label}
                </h3>
            )}

            <Form.Item
                validateStatus={isError ? "error" : ""}
                help={errorString}
            // rules={[{ required: true }]}
            >
                <TextArea
                    disabled={disabled}
                    onChange={onChange}
                    value={value}
                    name={name}
                    className='inputclassName'
                    rows={rows} />

            </Form.Item>
        </>
    );
};

export default Demo; 