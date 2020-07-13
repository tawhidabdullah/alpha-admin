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
    ArrowUpOutlined
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





    const handleSubmit = async () => {


        const addThemeRes = await handleAddthemeFetch({

            body: {


            },
        });

        // @ts-ignore
        if (addThemeRes && addThemeRes.status === 'ok') {
            openSuccessNotification();

            setThemeList([...themeList, {
                id: addThemeRes['id'] || '',
                key: addThemeRes['id'] || '',
                name: addThemeRes['name'] || '',
                description: addThemeRes['description'] || '',
                // @ts-ignore
                ...addThemeRes
            }]);



            setAddNewCategoryVisible(false);
        }
        else {
            openErrorNotification();
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
            formData.append('images', file, file.name);
        });
        formData.append("name", "theme4");
        formData.append('type', selectedThemeTypeValue)
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
                message.success('upload successfully.');
            },
            error: () => {
                setuploading(false);
                message.error('upload failed.');
            },
        });
    };




    return (
        <>
            <Modal
                style={{
                    top: '40px'
                }}
                title="Add New Theme"
                visible={addNewCategoryVisible}
                onOk={handleUpload}
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

                <div className='addproductSection-left-header'>
                    <h3 className='inputFieldLabel'>Thumbnail Image</h3>
                    {/* <div  >
					<FileOutlined />
					<span>Media Center</span>
				</div> */}
                </div>
                <div className='aboutToUploadImagesContainer'>
                    {myThumbnailImage &&
                        // @ts-ignore
                        myThumbnailImage.length > 0 && myThumbnailImage.slice(0, 1).map(image => {
                            return (
                                <div className='aboutToUploadImagesContainer__item aboutToUploadImagesContainer__item-thumbnail'>
                                    <div
                                        onClick={() => handleThumbnailImageDelete(image.id)}
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
                            setisModalOpenForThumbnail(true);
                        }}
                        className='aboutToUploadImagesContainer__uploadItem aboutToUploadImagesContainer__uploadItem-thumbnail'>
                        <FileAddOutlined />
                        <h5>
                            {/* Select From Library */}
                        </h5>
                    </div>

                </div>

                <div style={{ marginTop: '15px' }}></div>

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

                <Dragger
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
