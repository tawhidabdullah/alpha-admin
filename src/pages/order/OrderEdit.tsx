import React, { useState, useEffect } from 'react';
import { Modal, Select, notification, Form, Empty, Button } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

// import components
import Input from '../../components/Field/Input';
import { useHandleFetch } from '../../hooks';
import OrderInvoice from "./OrderInvoice.jsx";
import SelectProducts from "./OrderProductIds";
import SelectedProductItems from "../productBundle/SelectedProductItems";
import TextArea from '../../components/Field/TextArea';

const { Option } = Select;


const validationSchema = Yup.object().shape({});




const openSuccessNotification = (message?: any) => {
    notification.success({
        message: message || 'Order Updated',
        description: '',
        icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
    });
};




const openErrorNotification = (message?: any) => {
    notification.error({
        message: message || 'Something Went Wrong',
        description: '',
        icon: <InfoCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
    });
};


const initialValues = {
    summary: '',
    note: ''
}

interface Props {
    customer: any;
    setTagEditVisible: any;
    tagEditVisible: any;
    setOrderNotes?:any; 
    orderNotes?:any; 
}

const QuickEdit = ({ customer, setTagEditVisible, tagEditVisible, setOrderNotes, orderNotes }: Props) => {
    const [updateOrderState, handleUpdateOrderFetch] = useHandleFetch({}, 'addOrderNote');

    const handleSubmit = async (values: any, actions: any) => {
        console.log('orderValues',values); 
        
        const addRegionRes = await handleUpdateOrderFetch({
            body: {
                note: values.note,
                summary: values.summary,
                order: customer.id,
            },
        });

        

        // @ts-ignore
        if (addRegionRes && addRegionRes.status === 'ok') {
            openSuccessNotification('Order Note added');
            // @ts-ignore
            setOrderNotes([{...addRegionRes},...orderNotes])
            setTagEditVisible(false)
        }
        else {
            openErrorNotification();
        }

        actions.setSubmitting(false);

    };


    const handleCancel = (e: any) => {
        setTagEditVisible(false);
    };

    return (
        <Formik
            onSubmit={(values, actions) => handleSubmit(values, actions)}
            validationSchema={validationSchema}
            validateOnBlur={false}
            enableReinitialize={true}
            initialValues={
                { ...initialValues }
            }
        >
            {({
                handleChange,
                values,
                handleSubmit,
                errors,
                isValid,
                isSubmitting,
                touched,
                handleBlur,
                setFieldTouched,
                handleReset,
            }) => (
                    <>
                        <Modal
                            title="Add Order Note"
                            visible={tagEditVisible}
                            onOk={(e: any) => handleSubmit(e)}
                            onCancel={handleCancel}
                            okText='Create'
                            okButtonProps={{
                                loading: isSubmitting,
                                htmlType: "submit",
                                // disabled: getisSubmitButtonDisabled(values, isValid)
                            }}
                            bodyStyle={{
                                margin: '0',
                                padding: '10px'
                            }}
                        >
                            <TextArea
                                rows={4}
								label='Note'
								value={values.note}
								name='note'
								isError={(touched.note && errors.note) ||
									(!isSubmitting && updateOrderState.error['error']['note'])}

								errorString={(touched.note && errors.note) ||
									(!isSubmitting && updateOrderState.error['error']['note'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('note');
								}}
							/>
                            <TextArea
                                rows={2}
								label='Summary'
								value={values.summary}
								name='summary'
								isError={(touched.summary && errors.summary) ||
									(!isSubmitting && updateOrderState.error['error']['summary'])}

								errorString={(touched.summary && errors.summary) ||
									(!isSubmitting && updateOrderState.error['error']['summary'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('summary');
								}}
							/>
                        </Modal>
                    </>
                )}
        </Formik>
    );
};


export default QuickEdit;
