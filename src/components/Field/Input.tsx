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
  addonBefore?: string;
  required?: boolean;
  placeHolder?: string;
  min?: any;
}

const Demo = ({
  required,
  addonBefore,
  label,
  type,
  defaultValue,
  value,
  onChange,
  disabled,
  isError,
  errorString,
  name,
  placeHolder,
  min,
}: Props) => {
  return (
    <>
      {label && <h3 className='inputFieldLabel'>{label}</h3>}

      <Form.Item
        // hasFeedback={true}
        validateStatus={isError ? 'error' : ''}
        // hasFeedback validateStatus="success"
        help={errorString}
        // rules={[{ required: true }]}
      >
        <Input
          onKeyDown={(event) => {
            if (type === 'number') {
              if (event.key === 'e' || event.key === '-') {
                event.preventDefault();
              }
            }
          }}
          min={min}
          required={required}
          type={type}
          addonBefore={addonBefore}
          style={{
            borderRadius: '0',
          }}
          name={name}
          disabled={disabled}
          value={value}
          onChange={onChange}
          className='inputclassName'
          placeholder={placeHolder}
        />
      </Form.Item>
    </>
  );
};

export default Demo;
