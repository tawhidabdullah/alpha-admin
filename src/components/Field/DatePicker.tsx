import React from 'react'
import { DatePicker } from 'antd';
import moment from 'moment';



interface Props {
    onChange: any;
    label?: string;
    withTime?: boolean;
    placeholder?: string;
    date?: string;
    time?: string;
}


const DatePickerComponent = ({ onChange, label, withTime, placeholder, date, time }: Props) => {
    function disabledDate(current) {
        // Can not select days before today and today
        return current && current < moment(date) && current > moment(date);
    }


    return (
        <>
            <h3 className='inputFieldLabel'>{label}</h3>

            {withTime ? <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                className='inputclassName'
                placeholder={placeholder}
                style={{
                    width: "100%",
                    borderColor: "#eee"
                }}


                onChange={onChange}
                {...(time && {
                    defaultValue: moment(time),
                })}
            />
                : (
                    <DatePicker

                        placeholder={placeholder}
                        className='inputclassName'
                        style={{
                            width: "100%",
                            borderColor: "#eee"
                        }}
                        onChange={onChange}
                        {...(date && {
                            defaultValue: moment(date),
                        })}
                    />
                )}


        </>
    )
}

export default DatePickerComponent




const { RangePicker } = DatePicker;

function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}

// function disabledDate(current) {
//   // Can not select days before today and today
//   return current && current < moment().endOf('day');
// }

