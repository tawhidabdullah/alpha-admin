import React, { useState,useEffect } from 'react';
import { Modal, notification } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

// import components
import Input from '../../../components/Field/Input';
import TextArea from '../../../components/Field/TextArea';
import { useHandleFetch } from '../../../hooks';
import { CheckCircleOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EditFilled } from '@ant-design/icons';
import MetaTags from "../../../pages/category/MetaTags";


const validationSchema = Yup.object().shape({
    name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});



const openSuccessNotification = (message?: any) => {
    notification.success({
        message: message || 'Area Updated',
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
    name: '',
}


interface Props {
    tagEditVisible?: any;
    setTagEditVisible?: any;
    tagDetailData?: any;
    setTagDetailData?:any; 
}

const QuickEdit = ({ tagEditVisible, setTagEditVisible, tagDetailData,setTagDetailData }: Props) => {
    const [updateTagState, handleUpdateCategoryFetch] = useHandleFetch({}, 'updateDealerArea');
 
    

    const handleSubmit = async (values: any, actions: any) => {
        const updateTagRes = await handleUpdateCategoryFetch({
            urlOptions: {
                placeHolders: {
                    id: values.id,
                }
            },
            body: {
                name: values.name,
            
            },
        });

        // @ts-ignore
        if (updateTagRes && updateTagRes.status === 'ok') {
            setTagDetailData({
                id:values.id,
                key:values.id,
                name: values.name,
            })
            console.log('categoryupdateTagRes',updateTagRes);
            openSuccessNotification();

            // const positionInTag = () => {
            //     return tagList.map(item => item.id).indexOf(category.id);
            // }

            // const index = positionInTag();

            // const updatedItem = Object.assign({}, tagList[index], { ...updateTagRes });
            // const updateTagList = [...tagList.slice(0, index), updatedItem, ...tagList.slice(index + 1)];
            // setTagList(updateTagList);

        }
        else {
            openErrorNotification();
        }

        actions.setSubmitting(false);
        setTagEditVisible(false)
    };


    const handleCancel = (e: any) => {
        setTagEditVisible(false);
    };


    const getisSubmitButtonDisabled = (values, isValid) => {
        if (!values.name || !isValid) {
            return true;
        }
        return false;
    }; 


    // useEffect(()=>{

    //     if(tagDetailData && Object.keys(tagDetailData).length > 0){
    //         const metaTags = tagDetailData.metaTags.split(','); 

    //         console.log('localMetaTags',metaTags);
           
    //         const bnMetaTags = tagDetailData.bn['metaTags'].split(','); 

    //         setTags(metaTags)
    //         setBnTags(bnMetaTags)
    //     }

    // },[]); 


    console.log('tagDetailData',tagDetailData);


 

    return (
        <Formik
            onSubmit={(values, actions) => handleSubmit(values, actions)}
            validationSchema={validationSchema}
            validateOnBlur={false}
            enableReinitialize={true}
            initialValues={{
                ...initialValues, 
                ...tagDetailData,
                ...( tagDetailData && Object.keys(tagDetailData).length > 0 && {
                    bnMetaTitle: tagDetailData['bn']
                    && tagDetailData['bn'].metaTitle
                    && tagDetailData['bn'].metaTitle,
                    bnMetaDescription: tagDetailData['bn'] &&  tagDetailData['bn'].metaDescription && tagDetailData['bn'].metaDescription,
                    bnName: tagDetailData['bn'] && tagDetailData['bn'].name && tagDetailData['bn'].name,
                    bnDescription: tagDetailData['bn'] && tagDetailData['bn'].description && tagDetailData['bn'].description,
                  })
            }}
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
								top: '40px',

							}}
                            title="Area Edit"
                            visible={tagEditVisible}
                            onOk={(e: any) => handleSubmit(e)}
                            onCancel={handleCancel}
                            okText='Update'
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
									(!isSubmitting && updateTagState.error['error']['name'])}

								errorString={(touched.name && errors.name) ||
									(!isSubmitting && updateTagState.error['error']['name'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('name');
								}}
							/>
                        </Modal>

                    </>
                )}
        </Formik>
    );
};


export default QuickEdit;
