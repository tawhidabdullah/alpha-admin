import React from 'react';
import { Form, Input } from 'antd';

interface Props {
    label: string;
}

const Demo = ({ label }: Props) => {
    return (
        <>
            <h3 className='inputFieldLabel'>
                {label}
            </h3>
            <Form.Item
                rules={[{ required: true }]}>
                <Input />
            </Form.Item>
        </>
    );
};

export default Demo; 