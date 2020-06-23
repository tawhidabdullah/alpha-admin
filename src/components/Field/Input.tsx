import React from 'react';
import { Form, Input } from 'antd';

const { TextArea } = Input;



interface Props {
    label: string;
    type?: string;
}

const Demo = ({ label, type}: Props) => {
    return (
        <>
            <h3 className='inputFieldLabel'>
                {label}
            </h3>
            <Form.Item
                rules={[{ required: true }]}>
                    {type === 'textarea' ? <TextArea rows={4} /> :  <Input />}
               
            </Form.Item>
        </>
    );
};

export default Demo; 