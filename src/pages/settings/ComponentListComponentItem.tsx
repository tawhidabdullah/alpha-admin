import React, { useState, useEffect } from 'react';
import { AutoComplete, Button } from 'antd';

import InputSmall from '../../components/Field/InputSmall';
import MediaLibrary from '../../components/MediaLibrary';

import { useFetch } from "../../hooks";
import {
    DeleteOutlined,
    FileAddOutlined, 
    SaveOutlined
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
                        {/* <h5>
												Select From Library
											</h5> */}
                    </div>

        

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
