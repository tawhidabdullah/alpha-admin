import React, { useState, useEffect } from 'react';

// import hooks
import { useHandleFetch } from '../../hooks';

// import libraries
import { Modal, Upload, message, Button } from 'antd';
import reqwest from 'reqwest';

// import config 
import config from "../../config.json";


import {
    FileImageOutlined,
    ArrowUpOutlined
} from '@ant-design/icons';



import {
    openSuccessNotification,
    openErrorNotification,
} from '../../components/Notification';

const { Dragger } = Upload;



interface Props {
    isUploadCSVModalOpen: any;
    setIsUploadCSVModalOpen: any;
}

const UploadCSV = ({
    isUploadCSVModalOpen,
    setIsUploadCSVModalOpen
}: Props) => {
    const [fileList, setfileList] = useState([]);
    const [uploading, setuploading] = useState(false);


    const uploadProps = {
        //  listType: 'picture',
        multiple: true,
        onRemove: (file) => {
            setfileList((filelist) => {
                const index = fileList.indexOf(file);
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                return newFileList;
            });
        },
        beforeUpload: (file) => {
            setfileList((filelist) => {
                const xflelist = filelist;
                return [...xflelist, file];
            });
            return false;
        },
        fileList,
    };



    const handleUpload = async () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('csv', file, file.name);
        });

        setuploading(true);

        reqwest({
            url: `${config.baseURL}/admin/api/product/update/bulk/csv`,
            method: 'post',
            processData: false,
            data: formData,
            withCredentials: true,
            success: () => {
                message.success('Product CSV Uploaded!')
                setIsUploadCSVModalOpen(false);
                setuploading(false);
                setfileList([]);
            },
            error: (err) => {
                setuploading(false);
                if (err && err?.[0]) {
                    const errKeys = Object.keys(err);
                    for (let errkey of errKeys) {
                        message.error(errKeys[errkey])
                    }
                }
                message.error('upload failed.');
            },
        });
    };



    return (
        <Modal
            style={{
                top: '40px',
            }}
            bodyStyle={{
                margin: 0,
                padding: '20px',
            }}
            width={'40vw'}
            title='Upload CSV'
            visible={isUploadCSVModalOpen}
            onOk={(e: any) => null}
            onCancel={() => setIsUploadCSVModalOpen(false)}
            okText='Create'
            footer={false}
            okButtonProps={{
                loading: false,
                htmlType: 'submit',
            }}
        >
            <Dragger
                className='upload-list-inline'
                listType='picture'
                style={{
                    background: '#fff',
                    borderRadius: '8px',
                }}
                {...uploadProps}
            >
                <p className='ant-upload-drag-icon'>
                    <FileImageOutlined />
                </p>
                <p className='ant-upload-text'>
                    Click or drag .CSV file to this area to upload
                </p>
                <p className='ant-upload-hint'>
                    Support for a single upload.
               </p>
            </Dragger>


            <Button
                className='btnPrimaryClassNameoutline'
                type='primary'
                onClick={handleUpload}
                disabled={fileList.length === 0}
                loading={uploading}
                icon={<ArrowUpOutlined />}
                style={{
                    marginTop: '20px',
                    marginBottom: '10px',
                }}
            >
                Upload
            </Button>

        </Modal>
    );
};

export default UploadCSV;
