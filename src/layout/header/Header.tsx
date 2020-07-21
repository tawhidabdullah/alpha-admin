import React from 'react';


// import hooks 
// import { useHandleFetch } from "../../hooks";

// import components
// import { openSuccessNotification, openErrorNotification } from "../../components/Notification";

// import libraries 
import { LogoutOutlined } from '@ant-design/icons';


// import styles
import { HeaderStyle as Header, Title } from "./style";




interface Props {

}

const HeaderComponent = (props: Props) => {

    return (
        <Header

        >
            <Title>
                Admin
            </Title>


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
