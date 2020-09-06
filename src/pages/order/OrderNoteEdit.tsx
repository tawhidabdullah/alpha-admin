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
        message: message || 'Order Note Updated',
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
    activeNote?:any; 
}

const QuickEdit = ({ customer, setTagEditVisible, tagEditVisible, setOrderNotes, orderNotes,activeNote }: Props) => {
    const [updateOrderState, handleUpdateOrderFetch] = useHandleFetch({}, 'updateOrderNote');

    const handleSubmit = async (values: any, actions: any) => {
        console.log('orderValues',values); 
        
        const addRegionRes = await handleUpdateOrderFetch({
            urlOptions: {
                placeHolders: {
                    id: activeNote._id
                }
            }, 
            body: {
                note: values.note,
                summary: values.summary,
                order: customer.id,
            },
        });

        

        // @ts-ignore
        if (addRegionRes && addRegionRes.status === 'ok') {
            openSuccessNotification();
            const positionInTag = () => {
				return orderNotes.map(item => item._id).indexOf(activeNote._id);
			}

			const index = positionInTag();

			// @ts-ignore
			const updatedItem = Object.assign({}, orderNotes[index], { ...addRegionRes, _id: activeNote._id });
			const updateTagList = [...orderNotes.slice(0, index), updatedItem, ...orderNotes.slice(index + 1)];
			setOrderNotes(updateTagList);
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
                { ...initialValues, ...activeNote }
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
                            title="Update Order Note"
                            visible={tagEditVisible}
                            onOk={(e: any) => handleSubmit(e)}
                            onCancel={handleCancel}
                            okText='Update'
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
