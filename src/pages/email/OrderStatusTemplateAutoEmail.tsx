import React, { useState,useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { useHandleFetch } from '../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal,Tabs } from 'antd';

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
    FileImageFilled
} from '@ant-design/icons';



import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from "../../components/MediaLibrary";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';



const validationSchema = Yup.object().shape({
    // name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});


const { TabPane } = Tabs;



const openSuccessNotification = (message?: any) => {
    notification.success({
        message: message || 'New Customer Template Updated',
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


const initialValues = {
    name: '',
    description: '',
}



interface Props {
   visible: boolean;
   setVisible: any;

}

const AddNewBrand = ({ visible, setVisible }: Props) => {

    const [autoEmailTemplate, handleAutoEmailTemplateFetch] = useHandleFetch({}, 'configureAutoEmailTemplate');

    const [customer, setcustomer] = useState({
        subject:'',
        body:'',
    }); 

    const [admin, setadmin] = useState({
        subject:'',
        body:'',
    }); 



    const handleSubmit = async () => {
        const getConfigurationAutoEmailTemplateRes = await handleAutoEmailTemplateFetch({
            body: {
                "event": "orderStatus",
                "customer":{
                    ...customer
                },
                "admin":{
                    ...admin
                }
            
            },
        });

        // @ts-ignore
        if (getConfigurationAutoEmailTemplateRes && getConfigurationAutoEmailTemplateRes.status === 'ok') {
            openSuccessNotification();
            setVisible(false);
        }
        else {
            openErrorNotification();
        }

    };

    useEffect(()=>{
        const getCustomerAutoEmail = async () => {
            const res = await handleAutoEmailTemplateFetch({
                urlOptions: {
                    placeHolders: {
                        eventName: 'orderStatus'
                    }
                }
            }); 

            // set auto email template to customer and admin
        }; 
        getCustomerAutoEmail(); 

    },[]);


    const handleCancel = (e: any) => {
        setVisible(false);
    };



    return (
        <Modal
        width={'70vw'}
        style={{
            top: '40px'
        }}
        title="Order Status Template"
        visible={visible}
        onOk={(e: any) => handleSubmit()}
        onCancel={handleCancel}
        okText='Submit'
        okButtonProps={{
            loading: autoEmailTemplate.isLoading,
            htmlType: "submit",
            // disabled: getisSubmitButtonDisabled(values, isValid)
        }}
        bodyStyle={{
            margin: '10px',
            padding: '10px'
        }}
        footer={false}
    >
     <Tabs defaultActiveKey="1" >
     <TabPane tab="Customer" key="1">
        
        <div style={{
            display:'flex',

        }}>
            <div style={{
                width:'70%'
            }}>
            <Input
            label='Subject'
            value={customer.subject}
            name='subject'
            onChange={(e:any) => {
                setcustomer({
                    ...customer,
                    subject: e.target.value
                })
            }}
        />

            <h3 className='inputFieldLabel'>
                Body
            </h3>


        <CKEditor
        editor={ClassicEditor}
        data={customer.body}
        onInit={editor => {
            // You can store the "editor" and use when it is needed.
            console.log('Editor is ready to use!', editor);
        }}
        onChange={(event, editor) => {
            const data = editor.getData();
            setcustomer({
                ...customer,
                body: data
            })
        }}
        onBlur={(event, editor) => {
            console.log('Blur.', editor);
        }}
        onFocus={(event, editor) => {
            console.log('Focus.', editor);
        }}
        />

        
                                    <div style={{
                                          display:'block',
                                          marginBottom:'20px',
                                          marginTop:'20px',
                                      }}>   
                                      <Button
                                        onClick={handleSubmit}
                                        loading={autoEmailTemplate.isLoading}
                                        className='btnPrimaryClassNameoutline'
                                        >
                                        Update Template
                                        </Button>      
                                    </div>

            </div>

            <div style={{
                width:'30%',
                overflowY:'auto',
                background:"#f7f7f7",
                marginLeft:'20px',
                padding:'10px',
                borderRadius:'8px'
            }}>
                <h4>Information Tags</h4>
                <p style={{
                    fontSize:'12px'
                }}>
                    Place the following tags to replace them with actual data while sending email
                </p>
                <ul style={{
                    padding:'15px'
                }}>
                    <li style={{
                        fontSize:'12px',
                        marginBottom:'10px',
                        lineHeight:1.7,
                        fontWeight:500
                    }}><b style={{
                        borderRadius:"15px",
                        backgroundColor:'#ddd',
                        padding:"1px 10px"
                    }}>&lt;?=order.added?&gt; :</b> Order time</li>
                    <li
                    style={{
                        fontSize:'12px',
                        lineHeight:2,
                        fontWeight:500
                    }}
                    ><b
                    style={{
                        borderRadius:"15px",
                        backgroundColor:'#ddd',
                        padding:"1px 10px"
                    }}
                    >&lt;?shippingAddress.firstName?&gt; :</b> Shipping first Name</li>
                </ul>

        </div>
        </div>

     </TabPane>

    <TabPane tab="Admin" key="2">

                    <div style={{
                        display: 'flex',
                
                    }}>

                        <div style={{
                            width: '70%'
                        }}>
   <Input
                            label='Subject'
                            value={admin.subject}
                            name='subject'
                            onChange={(e:any) => {
                                setadmin({
                                    ...admin,
                                    subject: e.target.value
                                })
                            }}
                        />

                        <h3 className='inputFieldLabel'>
                            Body
                        </h3>


                                <CKEditor
                                editor={ClassicEditor}
                                data={admin.body}
                                onInit={editor => {
                                    // You can store the "editor" and use when it is needed.
                                    console.log('Editor is ready to use!', editor);
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setadmin({
                                        ...admin,
                                        body: data
                                    })
                                }}
                                onBlur={(event, editor) => {
                                    console.log('Blur.', editor);
                                }}
                                onFocus={(event, editor) => {
                                    console.log('Focus.', editor);
                                }}
                                />


                                    <div style={{
                                          display:'block',
                                          marginBottom:'20px',
                                          marginTop:'20px',
                                      }}>   
                                      <Button
                                        onClick={handleSubmit}
                                        loading={autoEmailTemplate.isLoading}
                                        className='btnPrimaryClassNameoutline'
                                        >
                                        Update Template
                                        </Button>      
                                    </div>
                        </div>

                        <div style={{
                width:'30%',
                overflowY:'auto',
                background:"#f7f7f7",
                marginLeft:'20px',
                padding:'10px',
                borderRadius:'8px'
            }}>
                <h4>Information Tags</h4>
                <p style={{
                    fontSize:'12px'
                }}>
                    Place the following tags to replace them with actual data while sending email
                </p>
                <ul style={{
                    padding:'15px'
                }}>
                    <li style={{
                        fontSize:'12px',
                        marginBottom:'10px',
                        lineHeight:1.7,
                        fontWeight:500
                    }}><b style={{
                        borderRadius:"15px",
                        backgroundColor:'#ddd',
                        padding:"1px 10px"
                    }}>&lt;?=order.added?&gt; :</b> Order time</li>
                    <li
                    style={{
                        fontSize:'12px',
                        lineHeight:2,
                        fontWeight:500
                    }}
                    ><b
                    style={{
                        borderRadius:"15px",
                        backgroundColor:'#ddd',
                        padding:"1px 10px"
                    }}
                    >&lt;?shippingAddress.firstName?&gt; :</b> Shipping first Name</li>
                </ul>

        </div>


                    </div>

                 
                                    </TabPane>
                                    </Tabs>

                                    </Modal>
    );
};

export default AddNewBrand;
