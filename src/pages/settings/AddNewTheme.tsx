import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import reqwest from 'reqwest';

import { useHandleFetch } from '../../hooks';
// import third party ui lib
import { Upload, message, Switch, Select, Button, notification, Modal, Form } from 'antd';

import {
    FileOutlined,
    InboxOutlined,
    FileAddOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    ArrowUpOutlined,
    LoadingOutlined,
    PlusOutlined
} from '@ant-design/icons';


import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from "../../components/MediaLibrary";


const { Option } = Select;
const { Dragger } = Upload;


const validationSchema = Yup.object().shape({
    name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});



const openSuccessNotification = (message?: any) => {
    notification.success({
        message: message || 'Brand Created',
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
    description: '',
    image: [],
    url: '',
    cover: ''
}



interface Props {
    addNewCategoryVisible?: any;
    setAddNewCategoryVisible?: any;
    themeList?: any;
    setThemeList?: any;

}

const AddNewBrand = ({ addNewCategoryVisible, setAddNewCategoryVisible, themeList, setThemeList }: Props) => {

    const [addThemeState, handleAddthemeFetch] = useHandleFetch({}, 'addTheme');
    const [visible, setvisible] = useState(false);
    const [myImages, setmyImages] = useState(false);
    const [visibleMedia, setvisibleMedia] = useState(false);
    const [myThumbnailImage, setmyThumbnailImage] = useState([]);
    const [isModalOpenForThumbnail, setisModalOpenForThumbnail] = useState(false);
    const [selectedThemeTypeValue, setselectedThemeTypeValue] = useState('');
    const [fileList, setfileList] = useState([]);
    const [uploading, setuploading] = useState(false);
    const [loadingThumnail, setLoadingThumbnail] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [name, setname] = useState('')





    const handleSubmit = async () => {

        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('folder', file, file.name);
        });
        formData.append("name", name);
        formData.append('type', selectedThemeTypeValue)
        formData.append('thumbnail', imageUrl)







        const addThemeRes = await handleAddthemeFetch({

            body: formData,
        });

        // @ts-ignore
        if (addThemeRes && addThemeRes.status === 'ok') {

            setThemeList([...themeList, {
                id: addThemeRes['id'] || '',
                key: addThemeRes['id'] || '',
                name: addThemeRes['name'] || '',
                thumbnail: addThemeRes['thumbnail'] || '',
                path: addThemeRes['path'] || '',
                added: addThemeRes['added'] || '',
                // @ts-ignore
                ...addThemeRes
            }]);

            setfileList([]);
            setuploading(false);
            openSuccessNotification('Theme Uploaded!')
            setAddNewCategoryVisible(false);
            setname('');
            setselectedThemeTypeValue('');




            setAddNewCategoryVisible(false);
        }
        else {
            openErrorNotification('Theme upload failed, Something went wrong');
        }

    };



    const onSwitchChange = (checked: any) => {
        console.log(checked);
    };


    const handleCancel = (e: any) => {
        setAddNewCategoryVisible(false);
    };


    const getisSubmitButtonDisabled = () => {
        if (addThemeState.isLoading) {
            return true;
        }
        return false;
    }




    const handleImagesDelete = (id) => {
        // @ts-ignore
        const newImages = myImages && myImages.filter(image => {
            return image.id !== id;
        })

        setmyImages(newImages);
    }



    const handleThumbnailImageDelete = (id) => {
        // @ts-ignore
        const newImages = myThumbnailImage && myThumbnailImage.filter(image => {
            return image.id !== id;
        })

        if (newImages.length > 0) {
            setmyThumbnailImage(newImages);

        }
        // @ts-ignore
        else setmyThumbnailImage([]);
    }


    const onChangeThemeType = (value) => {
        setselectedThemeTypeValue(value);
    }



    const uploadProps = {
        //  listType: 'picture',
        onRemove: file => {
            setfileList(filelist => {
                const index = fileList.indexOf(file);
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                return newFileList;
            })

        },
        beforeUpload: file => {
            console.log('file', file)
            setfileList(filelist => {
                return [...fileList, file]
            })
            return false;
        },
        fileList,
    };

    const handleUpload = async () => {
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('folder', file, file.name);
        });
        formData.append("name", name);
        formData.append('type', selectedThemeTypeValue)
        formData.append('thumbnail', imageUrl)

        setuploading(true);

        //  const addImageToLibraryRes = awAddait handleMediaLibraryFetch({
        // 	body: formData
        //   });

        //   console.log('addImageToLibraryRes',addImageToLibraryRes)







        // You can use any AJAX library you like
        reqwest({
            url: 'http://localhost:5000/admin/theme/add',
            method: 'post',
            processData: false,
            data: formData,
            withCredentials: true,
            success: () => {
                setfileList([]);
                setuploading(false);
                openSuccessNotification('Theme Uploaded!')
                setAddNewCategoryVisible(false);
                setname('');
                setselectedThemeTypeValue('');
                setThemeList([...themeList, {

                }])
                // setThemeList([...themeList, {
                //     id: addCategoryRes['id'] || '',
                //     key: addCategoryRes['id'] || '',
                //     name: addCategoryRes['name'] || '',
                //     description: addCategoryRes['description'] || '',
                //     // @ts-ignore
                //     ...addCategoryRes
                // }])
            },
            error: () => {
                setuploading(false);
                openErrorNotification('Theme Upload failed!')
                message.error('upload failed.');
            },
        });
    };


    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    function beforeUpload(file) {
        console.log('beforeUpload', file)
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }


        getBase64(file, imageUrl => {
            setImageUrl(imageUrl)
            setLoadingThumbnail(false)
        })

        return false;
    }









    console.log('imageUrl', imageUrl)



    const uploadButton = (
        <div>
            {loadingThumnail ? <LoadingOutlined /> : <PlusOutlined />}
            <div className="ant-upload-text">Upload</div>
        </div>
    );


    console.log('addThemeState', addThemeState)

    return (
        <>
            <Modal
                style={{
                    top: '40px'
                }}
                title="Add New Theme"
                visible={addNewCategoryVisible}
                onOk={handleSubmit}
                onCancel={handleCancel}
                okText='Upload Theme'
                okButtonProps={{
                    loading: uploading,
                    htmlType: "submit",
                    disabled: getisSubmitButtonDisabled()
                }}

                bodyStyle={{
                    margin: '0',
                    padding: '10px'
                }}
            >

                <Input
                    label='Name'
                    value={name}
                    name='name'
                    onChange={(e: any) => setname(e.target.value)}
                />


                <h3 className='inputFieldLabel'>Thumbnail Image</h3>
                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    multiple={false}
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>

                {/* <div style={{ marginTop: '15px' }}></div> */}

                <h3 className='inputFieldLabel'>
                    Theme Type
									</h3>


                <Form.Item
                    validateStatus={(addThemeState.error['error']['type']) ? "error" : ""}
                    help={addThemeState.error['error']['type']}
                // noStyle={true}
                >
                    <Select
                        style={{ width: '100%' }}
                        placeholder='Select a Theme type'
                        optionFilterProp='children'
                        onChange={onChangeThemeType}
                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        <Option value={'spa'}> API Based Template (React/Angular/Vue) </Option>
                        <Option value={'template'}> Alpha Template </Option>
                    </Select>

                </Form.Item>



                <div style={{
                    marginTop: '20px'
                }}></div>
                <h3 className='inputFieldLabel'>
                    Theme Folder (.zip)
									</h3>


                <Dragger
                    multiple={false}
                    className='upload-list-inline'
                    listType='picture'
                    style={{
                        background: '#fff'
                    }}
                    {...uploadProps}
                >
                    <p className='ant-upload-drag-icon'>
                        <InboxOutlined />
                    </p>
                    <p className='ant-upload-text'>Click or drag file to this area to upload</p>
                    <p className='ant-upload-hint'>
                        Support for a single or bulk upload. Strictly prohibit from uploading company data or
                        other band files
							</p>
                </Dragger>

                {addThemeState.error['error']['folder'] && (
                    <p style={{
                        color: 'rgba(255, 0, 0, 0.507)'
                    }}>{addThemeState.error['error']['folder']}</p>
                )}





            </Modal>

            <MediaLibrary
                setvisible={setvisibleMedia}
                visible={visibleMedia}
                setmyImages={setmyImages}
                isModalOpenForImages={false}
                setmyThumbnailImage={setmyThumbnailImage}
                isModalOpenForThumbnail={isModalOpenForThumbnail}
                myThumbnailImage={myThumbnailImage}
            />
        </>
    );
};

export default AddNewBrand;






