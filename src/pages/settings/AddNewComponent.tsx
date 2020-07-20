import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { useHandleFetch } from '../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal } from 'antd';

import {
    FileOutlined,
    InboxOutlined,
    FileAddOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    PlusOutlined
} from '@ant-design/icons';


import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from "../../components/MediaLibrary";
import ComponentItem from "./ComponentItem";

const validationSchema = Yup.object().shape({
    groupName: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});



const openSuccessNotification = (message?: any) => {
    notification.success({
        message: message || 'Component Created',
        description: '',
        icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
    });
};


const openErrorNotification = (message?: any) => {
    notification.success({
        message: message || 'Something Went Wrong',
        description: '',
        icon: <CheckCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
    });
};


const initialValues = {
    groupName: '',
    items: [],
}



interface Props {
    addNewCategoryVisible?: any;
    setAddNewCategoryVisible?: any;
    componentList?: any;
    setComponentList?: any;

}

const AddNewBrand = ({ addNewCategoryVisible, setAddNewCategoryVisible, componentList, setComponentList }: Props) => {

    const [addComponentState, handleAddComponentFetch] = useHandleFetch({}, 'addComponent');
    const [myImages, setmyImages] = useState(false);
    const [itemsList, setItemsList] = useState([])


    const handleSubmit = async (values: any, actions: any) => {


        const addComponentRes = await handleAddComponentFetch({
            body: {
                groupName: values.groupName,
                items: itemsList
            },
        });

        // @ts-ignore
        if (addComponentRes && addComponentRes.status === 'ok') {
            openSuccessNotification();
            setComponentList([...componentList, {
                id: addComponentRes['id'] || '',
                key: addComponentRes['id'] || '',
                groupName: addComponentRes['groupName'] || '',
                // @ts-ignore
                ...addComponentRes
            }])
            actions.resetForm();
            setAddNewCategoryVisible(false);
        }
        else {
            openErrorNotification();
        }




        actions.setSubmitting(false);

    };

    useEffect(() => {
        if (!addComponentState['isLoading']) {
            const error = addComponentState['error'];
            if (error['isError'] && Object.keys(error['error']).length > 0) {


                const errors =
                    Object.values(error['error']).length > 0
                        ? Object.values(error['error'])
                        : [];
                errors.forEach((err, i) => {
                    if (typeof err === 'string') {
                        openErrorNotification(err)
                    }
                    else if (typeof err === 'object') {
                        if (err && Object.keys(err).length > 0) {
                            const errs = Object.values(err);
                            errs.forEach(err => {
                                openErrorNotification(err)
                            })

                        }
                    }
                });
            }
        }
    }, [addComponentState])






    const handleCancel = (e: any) => {
        setAddNewCategoryVisible(false);
    };


    const getisSubmitButtonDisabled = (values, isValid) => {
        if (!values.groupName) {
            return true;
        }
        return false;
    }






    const handleAddComponentItem = () => {
        setItemsList([...itemsList, {
            title: '',
            target: '',
            text: '',
            image: [],
            id: `${itemsList.length}`
        }])
    }




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
                            style={{
                                top: '40px'
                            }}
                            title="Add New Component"
                            visible={addNewCategoryVisible}
                            onOk={(e: any) => handleSubmit(e)}
                            onCancel={handleCancel}
                            okText='Create'
                            okButtonProps={{
                                loading: isSubmitting,
                                htmlType: "submit",
                                disabled: getisSubmitButtonDisabled(values, isValid)
                            }}
                            width={'50vw'}
                            bodyStyle={{
                                margin: '0',
                                padding: '10px'
                            }}
                        >
                            <Input
                                label='Group Component Name'
                                value={values.groupName}
                                name='groupName'
                                isError={(touched.groupName && errors.groupName) ||
                                    (!isSubmitting && addComponentState.error['error']['name'])}

                                errorString={(touched.groupName && errors.groupName) ||
                                    (!isSubmitting && addComponentState.error['error']['name'])}
                                onChange={(e: any) => {
                                    handleChange(e);
                                    setFieldTouched('groupName');
                                }}
                            />
                            <div style={{
                                marginTop: '15px',
                            }}></div>
                            <h3 className='inputFieldLabel'>Children</h3>

                            <div className='componentItemsContainer'>
                                {itemsList.map(itemComponent => {
                                    return <ComponentItem
                                        componentItem={itemComponent}
                                        itemsList={itemsList} setItemsList={setItemsList} />
                                })}

                                <Button size='small'
                                    onClick={handleAddComponentItem}
                                    style={{
                                        width: '290px',
                                        minHeight: '145px',
                                        marginTop: '0px'
                                    }} type="dashed" icon={<PlusOutlined />}>Add Childrens</Button>
                            </div>

                            <div
                                style={{
                                    marginTop: '20px'
                                }}
                            />







                        </Modal>


                    </>
                )}
        </Formik>




    );
};

export default AddNewBrand;
