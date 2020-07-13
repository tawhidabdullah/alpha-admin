import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'antd';

import InputSmall from '../../components/Field/InputSmall';
import MediaLibrary from '../../components/MediaLibrary';

import { useFetch } from "../../hooks";
import {
    DeleteOutlined,
    FileAddOutlined
} from '@ant-design/icons';



const Complete = ({ setItemsList, itemsList, componentItem }) => {


    const [localComponentItem, setlocalComponentItem] = useState({
        title: componentItem.title,
        target: componentItem.target,
        text: componentItem.text,
        image: componentItem.image,
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

    useEffect(() => {
        const positionInAttribute = () => {
            return itemsList.map(item => item.id).indexOf(componentItem.id);
        }

        const index = positionInAttribute();

        const updatedItem = Object.assign({}, itemsList[index], { ...localComponentItem });
        const updateComponentList = [...itemsList.slice(0, index), updatedItem, ...itemsList.slice(index + 1)];
        setItemsList(updateComponentList);

    }, [localComponentItem])


    const handleAttributeDelete = () => {

        const updateComponentList = itemsList.filter(item => item.id !== componentItem.id);
        setItemsList(updateComponentList);
    }


    const handleImagesDelete = (id) => {
        // @ts-ignore
        const newImages = myImages && myImages.filter(image => {
            return image.id !== id;
        })

        setmyImages(newImages);
    }





    return (
        <>


            <div className='componentItemsContainer__item'>
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
