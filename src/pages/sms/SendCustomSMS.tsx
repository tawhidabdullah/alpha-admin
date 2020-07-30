import React, { useEffect, useState } from 'react'


// import components 
import TextArea from "../../components/Field/TextArea";

// import lib 
import { Select, Button, notification } from 'antd';

import {
    SendOutlined,
    CheckCircleOutlined,
    InfoCircleFilled
} from '@ant-design/icons';



const openSuccessNotification = (message?: any) => {
    notification.success({
        message: message || 'SMS sent successfully',
        description: '',
        icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
    });
};


const openErrorNotification = (message?: any) => {
    notification.error({
        message: message || 'Something Went Wrong',
        description: '',
        icon: <InfoCircleFilled style={{ color: 'rgb(241, 67, 67)' }} />,
    });
};





interface Props {

}

const SendCustomSMS = (props: Props) => {
    const [text, setText] = useState('');
    const [recipient, setrecipient] = useState([]);


    function handleChange(value) {
        const recipient = `${value}`.split(',');
        setrecipient(recipient)
    }


    const handleMsgSend = () => {

    }


    const getMsgSendIsDisabled = () => {
        return !text || !recipient[0]
    }

    return (
        <>
            <div style={{
                width: '450px'
            }}>
                <h3 className='inputFieldLabel'>
                    Recipient
                </h3>

                <Select
                    style={{
                        height: '30px',
                        borderRadius: '3px',
                        borderColor: '#eee !important',
                        width: '100%'
                    }}
                    mode="tags" onChange={handleChange} tokenSeparators={[',']}>
                </Select>

                <div style={{
                    marginTop: "15px"
                }}></div>
                <TextArea
                    label='Text'
                    value={text}
                    name='text'
                    onChange={(e: any) => {
                        setText(e.target.value);
                    }}
                />

                <Button

                    style={{
                        marginTop: '10px'
                    }}
                    onClick={handleMsgSend}
                    disabled={getMsgSendIsDisabled()}

                    className='btnAddToPrice'
                >
                    Send <span style={{
                        marginLeft: '10px'
                    }}> <SendOutlined /></span>
                </Button>
            </div>

        </>
    )
}

export default SendCustomSMS
