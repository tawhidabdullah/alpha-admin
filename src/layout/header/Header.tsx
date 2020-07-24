import React from 'react';


// import hooks 
// import { useHandleFetch } from "../../hooks";

// import components
// import { openSuccessNotification, openErrorNotification } from "../../components/Notification";

// import libraries 
import { LogoutOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
const { Header } = Layout;

// import styles




interface Props {

}

const HeaderComponent = (props: Props) => {

    return (
        <Header
            style={{
                background: '#fff',
                height: '60px',
                display: 'flex',
                justifyContent: 'space-between',
                boxShadow: '0 0.46875rem 2.1875rem rgba(8,10,37,.01), 0 0.9375rem 1.40625rem rgba(8,10,37,.01), 0 0.25rem 0.53125rem rgba(8,10,37,.02), 0 0.125rem 0.1875rem rgba(8,10,37,.01)',
                zIndex: 10,
                transition: ' all .2s',
                alignItems: 'center',
                alignContent: 'center'
            }}
        >
            <h2
                style={{
                    color: '#0072EA', marginTop: '10px', marginLeft: '-20px'

                }}
            >
                Express Ticket
            </h2>


            <div
                style={{
                    marginRight: '-28px'
                }}>

                <a href='/admin/auth/logout'>
                    <span style={{
                        marginLeft: '10px',
                        fontWeight: 600,
                        borderRadius: '25px',
                        color: '#1890ff',
                        padding: '2px 20px',
                        cursor: 'pointer'
                    }}>
                        <LogoutOutlined />
                        <span style={{
                            marginLeft: '10px',

                        }}>
                            logout
                    </span>
                    </span>
                </a>

            </div>
        </Header>
    )
}

export default HeaderComponent; 
