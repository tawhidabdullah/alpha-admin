import React from 'react'
import { Empty } from 'antd';


interface Props {
    title?: string;
    height?: number
}

const EmptyComponent = ({
    title = 'No Data found',
    height = 300
}: Props) => {
    return (
        <div style={{
            height: height,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Empty description={title} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
    )
}

export default EmptyComponent
