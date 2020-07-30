import React from 'react';


// import lib
import { Upload, message, Switch, Select, Button, notification, Modal, Tabs } from 'antd';

// import components 
import SendCustomSMS from "./SendCustomSMS";
import SMSConfiguaration from "./SMSConfiguaration";


const { TabPane } = Tabs;



interface Props {

}

const Sms = (props: Props) => {
    return (
        <>
            <div className='siteInfoContainer'>

                <Tabs defaultActiveKey="1" >
                    <TabPane tab="Send custom SMS" key="1">
                        <SendCustomSMS />
                    </TabPane>

                    <TabPane tab="SMS configuaration" key="2">
                        <SMSConfiguaration />
                    </TabPane>

                </Tabs>

            </div>

        </>
    )
}

export default Sms
