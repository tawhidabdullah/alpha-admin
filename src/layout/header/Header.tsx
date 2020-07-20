import React from 'react';


// import hooks 
import { useHandleFetch } from "../../hooks";

// import components
import { openSuccessNotification, openErrorNotification } from "../../components/Notification";

// import libraries 
import { Layout } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';



const { Header } = Layout;



interface Props {

}

const HeaderComponent = (props: Props) => {

    const [logoutState, handleLogoutFetch] = useHandleFetch({}, 'logout');


    const handleLogout = async () => {
        const logoutRes = await handleLogoutFetch({});

        //@ts-ignore
        if (logoutRes && logoutRes.status === 'ok') {
            openSuccessNotification('Loged out successfully');

        }
        else {
            openErrorNotification("Couldn't logout, Something went wrong");
        }

    };


    return (
        <Header
            style={{
                background: '#fff',
                height: '60px',
                display: 'flex',
                justifyContent: 'space-between',
                boxShadow: '0 0.46875rem 2.1875rem rgba(8,10,37,.03), 0 0.9375rem 1.40625rem rgba(8,10,37,.03), 0 0.25rem 0.53125rem rgba(8,10,37,.05), 0 0.125rem 0.1875rem rgba(8,10,37,.03)',
                zIndex: 10,
                transition: ' all .2s',
                alignItems: 'center',
                alignContent: 'center'
            }}
        >
            <h2
                style={{ color: '#0072EA', marginTop: '10px', marginLeft: '-20px' }}
            >
                Admin
             </h2>


            <div
                // onClick={() => handleLogout()}
                style={{
                    marginRight: '-28px'
                }}>

                <a href='/admin/auth/logout'>
                    <span style={{
                        marginLeft: '10px',
                        fontWeight: 600,
                        // backgroundColor: 'rgba(28, 39, 152, 0.1)',
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
