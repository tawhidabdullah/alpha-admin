import React, { useState, useEffect } from 'react';
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
    updateComponentByAddingItem?: any;
    componentId?: any

}

const AddNewBrand = ({ addNewCategoryVisible,
    setAddNewCategoryVisible, componentList,
    setComponentList,
    updateComponentByAddingItem, componentId }: Props) => {


    const [localComponentItem, setlocalComponentItem] = useState({
        title: '',
        target: '',
        text: '',
        image: [],
    })

    const [myImages, setmyImages] = useState([]);
    const [visibleMedia, setvisibleMedia] = useState(false);

    const handleComponentItemsChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setlocalComponentItem({
            ...localComponentItem,
            [name]: value
        });
    };


    const onSwitchChange = (checked: any) => {
        console.log(checked);
    };


    const handleCancel = (e: any) => {
        setAddNewCategoryVisible(false);
    };


    const getisSubmitButtonDisabled = (values, isValid) => {
        if (!values.groupName) {
            return true;
        }
        return false;
    }



    useEffect(() => {
        if (myImages.length > 0) {
            const newImages = myImages.map(item => item.id);
            setlocalComponentItem({
                ...localComponentItem,
                image: [...newImages]
            })
        }
        else {
            setlocalComponentItem({
                ...localComponentItem,
                image: []
            })
        }

    }, [myImages])






    const handleImagesDelete = (id) => {
        // @ts-ignore
        const newImages = myImages && myImages.filter(image => {
            return image.id !== id;
        })

        setmyImages(newImages);
    }


    const handleAddItem = (e) => {
        updateComponentByAddingItem(localComponentItem, componentId)
    }




    return (
        <>
            <Modal
                style={{
                    top: '40px'
                }}
                destroyOnClose={true}
                title="Add New Component Item"
                visible={addNewCategoryVisible}
                onOk={(e: any) => handleAddItem(e)}
                onCancel={handleCancel}
                okText='Add'
                okButtonProps={{
                    htmlType: "submit",
                }}
                width={'400px'}
                bodyStyle={{
                    margin: '0',
                    padding: '10px'
                }}
            >
                <Input
                    label='Title'
                    value={localComponentItem.title}
                    name='title'
                    onChange={handleComponentItemsChange}
                />
                <Input
                    label='Text'
                    value={localComponentItem.text}
                    name='text'
                    onChange={handleComponentItemsChange}
                />

                <Input
                    label='Target'
                    value={localComponentItem.target}
                    name='target'
                    onChange={handleComponentItemsChange}
                />


                <h3 className='inputFieldLabel-small'>Images</h3>
                <div className='aboutToUploadImagesContainer'>
                    {myImages &&
                        // @ts-ignore
                        myImages.length > 0 && myImages.map(image => {
                            return (
                                <div className='aboutToUploadImagesContainer__item'>
                                    <div
                                        onClick={() => handleImagesDelete(image.id)}
                                        className='aboutToUploadImagesContainer__item-overlay'>
                                        <DeleteOutlined />
                                    </div>
                                    <img src={image.cover} alt={image.alt} />
                                </div>
                            )
                        })}

                    <div
                        onClick={() => {
                            setvisibleMedia(true);
                        }}
                        className='aboutToUploadImagesContainer__uploadItem'>
                        <FileAddOutlined />
                    </div>
                </div>
                <MediaLibrary
                    setvisible={setvisibleMedia}
                    visible={visibleMedia}
                    myImages={myImages}
                    setmyImages={setmyImages}
                    isModalOpenForImages={true} />

            </Modal>
        </>


    );
};

export default AddNewBrand;
