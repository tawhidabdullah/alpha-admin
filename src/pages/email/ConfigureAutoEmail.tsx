import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { useHandleFetch } from '../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal, Tooltip,Checkbox  } from 'antd';

import {
    FileOutlined,
    InboxOutlined,
    FileAddOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    CloseOutlined,
    CheckOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    FileImageFilled,
    EditOutlined
} from '@ant-design/icons';


import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from "../../components/MediaLibrary";
import NewCustomerTemplate from "./NewCustomerTemplate";
import OrderStatusTemplateAutoEmail from "./OrderStatusTemplateAutoEmail";
import OrderTemplateAutoEmail from "./OrderTemplateAutoEmail";


const validationSchema = Yup.object().shape({
    name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});



const openSuccessNotification = (message?: any) => {
    notification.success({
        message: message || 'Tag Created',
        description: '',
        icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
    });
};


const openErrorNotification = (message?: any) => {
    notification.error({
        message: message || 'Something Went Wrong',
        description: '',
        icon: <CheckCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
    });
};






interface Props {
}

const ConfigureAutoEmail = ({  }: Props) => {

    const [getAutoEmailConfigurationState, handleGetAutoEmailConfigurationFetch] = useHandleFetch({}, 'getAutoEmailConfiguration');
    const [configureAutoEmailConfigurationState, handleAutoEmailConfigurationFetch] = useHandleFetch({}, 'configureAutoEmail');
 
    const [isnewCustomerAdmin,setnewCustomerAdmin] = useState(true);
    const [isnewCustomerCustomer,setnewCustomerCustomer] = useState(true);
    const [isorderAdmin,setorderAdmin] = useState(true);
    const [isorderStatusAdmin,setorderStatusAdmin] = useState(true);
    const [isorderCustomer,setorderCustomer] = useState(true);
    const [isorderStatusCustomer,setIsorderStatusCustomer] = useState(true);

    const [newcustomermodal, setnewcustomermodal] = useState(false);
    const [ordermodal, setordermodal] = useState(false);
    const [orderStatusmodal, setorderStatusmodal] = useState(false);


    const handleUpdateAutoEmail = async () => {
        const updateAutoEmailRes = await handleAutoEmailConfigurationFetch({
            body: {
                "newCustomerAdmin": isnewCustomerAdmin,
                "newCustomerCustomer": isnewCustomerCustomer,
                "orderAdmin": isorderAdmin, 
                "orderCustomer": isorderStatusAdmin, 
                "orderStatusAdmin": isorderCustomer, 
                "orderStatusCustomer": isorderStatusCustomer
            },
        });

        // @ts-ignore
        if (addTagRes && addTagRes.status === 'ok') {
            openSuccessNotification('Auto email Configuration Updated!');
        }
        else {
            openErrorNotification("Something went wrong, Couldn't updated Auto email configuration");
        }

    };



    const getisSubmitButtonDisabled = (values, isValid) => {
        if (!values.name || !isValid) {
            return true;
        }
        return false;
    }


    return (
        <>
                                <div style={{
                                    display:'flex',
                                    flexDirection:'column'
                                }}>
                                <div style={{
                                }}>
                                    
                                    <div style={{
                                                    display:'flex',
                                                    alignItems:"center"
                                                }}>
                                                <div style={{
                                                    marginRight:'15px',
                                                    marginTop:"10px"
                                                }}>
                                                <h3 className='checkBoxFieldLabel'>
                                                New Customer
                                                 </h3>
                                                </div>
                                                 <Button
                                                 className='templateEditSmall'
                                                    onClick={() => setnewcustomermodal(true)}
                                                    type='link'
                                                    icon={<EditOutlined />}
                                                >
                                                    configure Template
                                                </Button>
                                                </div>
                                          <div style={{
                                                marginTop:"15px"
                                            }}></div>
                                        <div style={{
                                                display: 'flex',
                                                marginTop:'15px'
											}}>
												<div style={{
                                                        marginRight:'20px',

												}}>
                                                    
                                                   <Checkbox
                                                   checked={isnewCustomerAdmin}
                                                   defaultChecked={isnewCustomerAdmin}
                                                    onChange={(e) => setnewCustomerAdmin(e.target.checked)}
                                                    >
                                                    <span className='checkBoxSmallFieldLabel'>
                                                        Admin
                                                   </span>                            
                                                </Checkbox> 
                                               </div>
												<div style={{
												}}>

                                                <Checkbox 
                                                  checked={isnewCustomerCustomer}
                                                  defaultChecked={isnewCustomerCustomer}
                                                onChange={(e) => setnewCustomerCustomer(e.target.checked)}
                                                   >
                                                    <span className='checkBoxSmallFieldLabel'>
                                                    Customer
                                                    </span>                            
                                               </Checkbox> 
												</div>


											</div>

</div>

                                    <div>


                                    <div style={{
                                                    display:'flex',
                                                    alignItems:"center",
                                            marginTop:'30px'
                                                }}>
                                                <div style={{
                                                    marginRight:'15px',
                                                    marginTop:"10px"
                                                }}>
                                                <h3 className='checkBoxFieldLabel'>
                                                 Order
                                                 </h3>
                                                </div>
                                                 <Button
                                                 className='templateEditSmall'
                                                    onClick={() => setordermodal(true)}
                                                    type='link'
                                                    icon={<EditOutlined />}
                                                >
                                                    configure Template
                                                </Button>
                                                </div>


                                    <div style={{
                                                marginTop:"5px"
                                            }}></div>

                                        <div style={{
                                                display: 'flex',
                                                marginTop:'15px',
                                                
											}}>
												<div style={{
                                                        marginRight:'20px',

												}}>
                                                    
                                                   <Checkbox
                                                      checked={isorderAdmin}
                                                      defaultChecked={isorderAdmin}
                                                    onChange={(e) => setorderAdmin(e.target.checked)}
                                                    >
                                                    <span className='checkBoxSmallFieldLabel'>
                                                        Admin
                                                   </span>                            
                                                </Checkbox> 
                                               </div>
												<div style={{
												}}>

                                                <Checkbox 
                                                  checked={isorderCustomer}
                                                  defaultChecked={isorderCustomer}
                                                onChange={(e) => setorderCustomer(e.target.checked)}
                                                   >
                                                    <span className='checkBoxSmallFieldLabel'>
                                                    Customer
                                                    </span>                            
                                               </Checkbox> 
												</div>


                                                
											</div>
                                    </div>



                                                <div>
                                                <div style={{
                                                    display:'flex',
                                                    alignItems:"center",
                                                    marginTop:"30px"
                                                }}>
                                                <div style={{
                                                    marginRight:'15px',
                                                    marginTop:"10px"
                                                }}>
                                           <h3 className='checkBoxFieldLabel'>
                                                 Order status
                                                 </h3>
                                                </div>
                                                 <Button
                                                 className='templateEditSmall'
                                                    onClick={() => setorderStatusmodal(true)}
                                                    type='link'
                                                    icon={<EditOutlined />}
                                                >
                                                    configure Template
                                                </Button>
                                                </div>
                                            <div style={{
                                                marginTop:"15px"
                                            }}></div>
                                        <div style={{
                                                display: 'flex',
                                                marginTop:'15px'
											}}>
												<div style={{
                                                        marginRight:'20px',

												}}>
                                                    
                                                   <Checkbox
                                                    checked={isorderStatusAdmin}
                                                    defaultChecked={isorderStatusAdmin}
                                                    onChange={(e) => setorderStatusAdmin(e.target.checked)}
                                                    >
                                                    <span className='checkBoxSmallFieldLabel'>
                                                        Admin
                                                   </span>                            
                                                </Checkbox> 
                                               </div>
												<div style={{
												}}>

                                                <Checkbox 
                                                 checked={isorderStatusCustomer}
                                                 defaultChecked={isorderStatusCustomer}
                                                onChange={(e) => setIsorderStatusCustomer(e.target.checked)}
                                                   >
                                                    <span className='checkBoxSmallFieldLabel'>
                                                    Customer
                                                    </span>                            
                                               </Checkbox> 
												</div>


                                                <div style={{
												}}>
												</div>

                                              

											</div>
</div>
                                        


                                        

    </div>

    <div style={{
                                                marginTop:"25px"
                                            }}></div>

    <Button

                                            onClick={(e: any) => handleUpdateAutoEmail()}
                                            loading={configureAutoEmailConfigurationState.isLoading}
                                            className='btnPrimaryClassNameoutline'
                                            >
                                            Update Auto Email Configuration
                                            </Button>

                                            
                                            <div style={{
                                                marginTop:"5px"
                                            }}></div>

        

        <NewCustomerTemplate 
        visible={newcustomermodal}
        setVisible={setnewcustomermodal}
        />

<OrderStatusTemplateAutoEmail 
        visible={orderStatusmodal}
        setVisible={setorderStatusmodal}
        />


        <OrderTemplateAutoEmail 
        visible={ordermodal}
        setVisible={setordermodal}
        />
        
        </>
    );
};

export default ConfigureAutoEmail;
