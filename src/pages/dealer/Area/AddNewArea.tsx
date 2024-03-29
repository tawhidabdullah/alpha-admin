import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';


import { useHandleFetch } from '../../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal, Tooltip } from 'antd';

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
import Input from '../../../components/Field/Input';
import TextArea from '../../../components/Field/TextArea';
import MediaLibrary from "../../../components/MediaLibrary";
import MetaTags from "../../../pages/category/MetaTags";


const validationSchema = Yup.object().shape({
    name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});



const openSuccessNotification = (message?: any) => {
    notification.success({
        message: message || 'Area Created',
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
}



interface Props {
    addNewCategoryVisible?: any;
    setAddNewCategoryVisible?: any;
    tagList?: any;
    setTagList?: any;

}

const AddNewBrand = ({ addNewCategoryVisible, setAddNewCategoryVisible, tagList, setTagList }: Props) => {

    const [addTagState, handleAddTagFetch] = useHandleFetch({}, 'addDealerArea');
    const [myImages, setmyImages] = useState(false);
    const [visibleMedia, setvisibleMedia] = useState(false);

    const handleSubmit = async (values: any, actions: any) => {
        const addTagRes = await handleAddTagFetch({
            urlOptions: {
                placeHolders: {
                    id: values.id,
                }
            },
            body: {
                name: values.name.trim(),
            },
        });

        // @ts-ignore
        if (addTagRes && addTagRes.status === 'ok') {
            openSuccessNotification();

            setTagList([{
                id: addTagRes['_id'] || '',
                key: addTagRes['_id'] || '',
                name: addTagRes['name'] || '',
            },...tagList])
            actions.resetForm();
            setAddNewCategoryVisible(false);
        }
        else {
            openErrorNotification();
        }


        actions.setSubmitting(false);

    };


    const handleCancel = (e: any) => {
        setAddNewCategoryVisible(false);
    };


    const getisSubmitButtonDisabled = (values, isValid) => {
        if (!values.name || !isValid) {
            return true;
        }
        return false;
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
                            title="Add New Area"
                            visible={addNewCategoryVisible}
                            onOk={(e: any) => handleSubmit(e)}
                            onCancel={handleCancel}
                            okText='Create'
                            okButtonProps={{
                                loading: isSubmitting,
                                htmlType: "submit",
                                disabled: getisSubmitButtonDisabled(values, isValid)
                            }}
                        >
                  			<Input
								label='Name'
								value={values.name}
								name='name'
								isError={(touched.name && errors.name) ||
									(!isSubmitting && addTagState.error['error']['name'])}

								errorString={(touched.name && errors.name) ||
									(!isSubmitting && addTagState.error['error']['name'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('name');
								}}
							/>

                        </Modal>

                        <MediaLibrary
                            setvisible={setvisibleMedia}
                            visible={visibleMedia}
                            setmyImages={setmyImages}
                            myImages={myImages}
                            isModalOpenForImages={true}

                        />
                    </>
                )}
        </Formik>




    );
};

export default AddNewBrand;
