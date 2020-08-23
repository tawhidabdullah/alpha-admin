import React from 'react';
import { notification } from 'antd';

import {
    CheckCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';


const openSuccessNotification = (message?: any) => {
    notification.success({
        message: message || 'Succeed',
        description: '',
        icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
    });
};


const openErrorNotification = (message?: any) => {
    notification.error({
        message: message || 'Something Went Wrong',
        description: '',
        icon: <ExclamationCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
    });
};


export {
    openSuccessNotification,
    openErrorNotification
}