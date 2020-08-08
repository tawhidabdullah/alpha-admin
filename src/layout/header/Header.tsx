import React, { useEffect } from 'react';


// import hooks 
import { useHandleFetch } from "../../hooks";

// import components
// import { openSuccessNotification, openErrorNotification } from "../../components/Notification";
import Empty from "../../components/Empty";

// import libraries 
import { useHistory } from "react-router";
import { LogoutOutlined, BellOutlined, OrderedListOutlined } from '@ant-design/icons';
import { Layout, Badge, Dropdown, Menu, Spin } from 'antd';
import Moment from 'react-moment';
import moment from 'moment';

const { Header } = Layout;

// import styles




interface Props {

}

const HeaderComponent = (props: Props) => {
    const history = useHistory();

    const [getAllNotificationState, handleGetAllNOticationFetch] = useHandleFetch({}, 'getAllNotification');


    const handleMenuClick = (e) => {
        if (e.key === '3') {
        }
    };


    useEffect(() => {
        const getAllNotification = async () => {
            await handleGetAllNOticationFetch({});
        }

        getAllNotification();
    }, [])


    const getNotificationCreationTime = (time: any) => {
        console.log(time);
        // return <Moment fromNow={true}></Moment>
        return time;
    }
    const menu = () => {

        if (getAllNotificationState.isLoading) return (
            <Menu>
                <div style={{
                    padding: '0 30px'
                }}>
                    <Spin />
                </div>

            </Menu>
        );



        if (getAllNotificationState.done && getAllNotificationState.data && !getAllNotificationState.data[0]) {
            return (
                <Menu>
                    <div style={{
                        padding: '0 30px'
                    }}>
                        <Empty title='No Notification found' />
                    </div>

                </Menu>
            )


        }
        return (
            <Menu
                style={{
                    maxHeight: '450px',
                    overflowY: 'scroll'
                }}


                onClick={handleMenuClick}>
                {getAllNotificationState.done && getAllNotificationState.data[0] && getAllNotificationState.data.map(item => {
                    return (
                        <Menu.Item
                            // style={{
                            //     padding: 0,
                            //     margin: 0
                            // }}
                            key="1">

                            <div className='notificationItem'>
                                <span className='notificationItem-icon'>
                                    <OrderedListOutlined />
                                </span>
                                <div className='notificationItem-info'>
                                    <h3>
                                        {item.heading}
                                    </h3>
                                    <h4>
                                        {item.text}
                                    </h4>
                                    <h2>

                                        {getNotificationCreationTime(item.added)}
                                    </h2>
                                </div>
                            </div>
                        </Menu.Item>
                    )
                })}

            </Menu>
        )

    }



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

                onClick={() => history.push('/admin')}
                style={{
                    color: '#0072EA', marginTop: '10px', marginLeft: '-20px',
                    cursor: 'pointer'

                }}
            >
                Express Ticket
            </h2>

            <div
                style={{
                    marginRight: '-28px'
                }}>


                <Dropdown
                    placement="bottomLeft"

                    overlay={menu}
                // visible={this.state.visible}
                >
                    <a
                        style={{
                            marginRight: '10px'
                        }}
                        href='###' className='notificationIconContainer'>

                        <Badge
                            overflowCount={100}
                            count={getAllNotificationState.done && getAllNotificationState.data && getAllNotificationState.data.length ? getAllNotificationState.data.length : 0}
                        >
                            <span style={{
                                marginLeft: '10px',
                                fontWeight: 600,
                                borderRadius: '25px',
                                color: '#1890ff',
                                padding: '2px 20px',
                                cursor: 'pointer',
                                marginRight: '-5px'
                            }}>
                                <BellOutlined />

                            </span>
                        </Badge>
                    </a>
                </Dropdown>




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
