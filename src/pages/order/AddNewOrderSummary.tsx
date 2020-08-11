import React from 'react'


// import components
import AddNewOrderProductItem from "./AddNewOrderProductItem";
import Empty from "../../components/Empty";

import {
    ShopOutlined
} from '@ant-design/icons';



interface Props {
    productList?: any;
    setProductList?: any;
}

const AddNewOrderSummary = ({
    setProductList,
    productList
}: Props) => {
    return (
        <div className='addOrderContainer__container-orderSummary'>
            <h3 className='addOrderContainer-sectionTitle'>
                <span>
                    <ShopOutlined />
                </span>
                Added Events
            </h3>
            <div className='addOrderContainer__container-productItemContainer'>
                {productList.length > 0 && productList.map(item => {
                    return <AddNewOrderProductItem
                        setProductList={setProductList}
                        productList={productList}
                        productId={item._id}
                        quantity={item.quantity}
                        item={item}
                        variation={item.variation}
                    />;
                })}

                {!(productList.length > 0) && (
                    <div style={{
                        marginLeft: '32px'
                    }}>
                        <Empty title='No Product Added' height={150} />
                    </div>
                )}

            </div>
        </div>
    )
}

export default AddNewOrderSummary
