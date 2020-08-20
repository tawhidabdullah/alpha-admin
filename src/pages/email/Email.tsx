import React from 'react';


// import lib
import { Upload, message, Switch, Select, Button, notification, Modal, Tabs } from 'antd';

// import components 
import ConfigureSTMP from "./ConfigureSTMP";
import ConfigureAutoEmail from "./ConfigureAutoEmail";
import ComposeCustomEmail from "./ComposeCustomEmail";
import Inbox from "./Inbox";


import {
	DeleteOutlined,
	FileAddOutlined,
	CheckCircleOutlined,
	FileImageFilled,
	FileImageOutlined,
	FileImageTwoTone,
	PlusOutlined,
	PlusCircleOutlined,
	CloseOutlined,
	CheckOutlined,
    InfoCircleOutlined,
    InboxOutlined,
    SettingOutlined
} from '@ant-design/icons';



const { TabPane } = Tabs;



interface Props {

}

const Sms = (props: Props) => {
    return (
        <>
            <div className='siteInfoContainer'>

                <Tabs defaultActiveKey="1" >
                <TabPane 
                    tab={
                        <span>
                        <InboxOutlined />
                        Inbox
                        </span>
                    }
             key="1">
                        <Inbox />
                    </TabPane>

                    <TabPane 
                    
                    tab={
                        <span>
                        <PlusCircleOutlined />
                        Compose Email
                        </span>
                    } key="2">
                        <ComposeCustomEmail />
                    </TabPane>

                    <TabPane 
                     tab={
                        <span>
                        <SettingOutlined />
                        Configure STMP
                        </span>
                    }
                    
                   key="3">
                        <ConfigureSTMP />
                    </TabPane>

                    <TabPane
                    
                    tab={
                        <span>
                        <SettingOutlined />
                        Configure Auto Email     
                        </span>
                    }
                     key="4">
                        <ConfigureAutoEmail />
                    </TabPane>

                </Tabs>

            </div>

        </>
    )
}

export default Sms
