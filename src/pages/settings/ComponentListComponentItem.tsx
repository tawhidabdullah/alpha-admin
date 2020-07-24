import React, { useState, useEffect } from 'react';
import { AutoComplete, Button, Tooltip } from 'antd';

// import configs
import config from "../../config.json";

import InputSmall from '../../components/Field/InputSmall';
import MediaLibrary from '../../components/MediaLibrary';

import { useFetch } from "../../hooks";
import {
    DeleteOutlined,
    FileAddOutlined, 
    SaveOutlined,
    FileImageFilled,
    PlusOutlined,
    CheckCircleOutlined,
    CloseOutlined,
    CheckOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';



const Complete = ({ setComponentList, componentList, item, component,componentUpdate }) => {

    const [localComponentItem, setlocalComponentItem] = useState({
        title: item.title,
        target: item.target,
        text: item.text,
        image: item.image,
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






    useEffect(() => {
        if (myImages.length > 0) {
            setlocalComponentItem({
                ...localComponentItem,
                // @ts-ignore
                image: [...new Set([...localComponentItem.image, ...myImages])]
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
        const newImages = localComponentItem.image && localComponentItem.image.length > 0 && localComponentItem.image.filter(image => {
            return image.id !== id;
        })

        setlocalComponentItem({
            ...localComponentItem,
            image: [...newImages]
        })

        setmyImages(newImages);
    }


    const handleComponentItemUpdate = () => {
        componentUpdate(item,component,localComponentItem); 
    }






    return (
        <>
            <div
                style={{
                    width: '100%',
                    boxShadow: "none"
                }}
                className='componentItemsContainer__item'>
                <InputSmall
                    label='Title'
                    value={localComponentItem.title}
                    name='title'
                    onChange={handleComponentItemsChange}
                />
                <InputSmall
                    label='Text'
                    value={localComponentItem.text}
                    name='text'
                    onChange={handleComponentItemsChange}
                />

                <InputSmall
                    label='Target'
                    value={localComponentItem.target}
                    name='target'
                    onChange={handleComponentItemsChange}
                />


                <h3 className='inputFieldLabel-small'>Images</h3>
                <div style={{
                    marginBottom: "-1px"
                }}></div>


                <div className='aboutToUploadImagesContainer'>
                    {localComponentItem.image &&
                        // @ts-ignore
                        localComponentItem.image.length > 0 && localComponentItem.image.map((image, index) => {
                            return (
                                <div className='aboutToUploadImagesContainer__item aboutToUploadImagesContainer__item-small'>
                                    <div
                                        className='aboutToUploadImagesContainer__item-imgContainer'
                                    >
                                        <img src={image.cover} alt={image.alt} />
                                    </div>

                                    <span
                                        onClick={() => handleImagesDelete(image.id)}
                                        className='aboutToUploadImagesContainer__item-remove'>
                                        <CloseOutlined />
                                    </span>
                                </div>
                            )
                        })}


                    <Tooltip
                        title={'Attach images'}>

                        <div
                            onClick={() => {
                                setvisibleMedia(true);
                            }}
                            className='aboutToUploadImagesContainer__uploadItem aboutToUploadImagesContainer__uploadItem-small'>
                            {/* <FileAddOutlined />
													<FileImageTwoTone />
													<FileImageOutlined /> */}
                            <FileImageFilled />
                            {/* <h5>
												     Select From Library
											<     /h5> */}
                            <span className='aboutToUploadImagesContainer__uploadItem-plus'>
                                <PlusOutlined />
                            </span>
                        </div>
                    </Tooltip>

                </div>
                <Button
                style={{
                    marginTop: '15px'
                }}
                    icon={<SaveOutlined />}
          className='btnPrimaryClassNameoutline'
          onClick={() => handleComponentItemUpdate()}
        >
        Save
            
            </Button>
            </div>
            <MediaLibrary
                setvisible={setvisibleMedia}
                visible={visibleMedia}
                myImages={myImages}
                setmyImages={setmyImages}
                isModalOpenForImages={true}

            />

        </>
    )
}

export default Complete;
