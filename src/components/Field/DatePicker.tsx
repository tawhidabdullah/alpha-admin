import React from 'react'
import { DatePicker } from 'antd';



interface Props {
    onChange: any;
    label?: string;
}

const DatePickerComponent = ({ onChange, label }: Props) => {
    return (
        <>
            <h3 className='inputFieldLabel'>{label}</h3>

            <DatePicker
                className='inputclassName'
                style={{
                    width: "100%",
                    borderColor: "#eee"
                }}
                onChange={onChange} />

        </>
    )
}

export default DatePickerComponent
