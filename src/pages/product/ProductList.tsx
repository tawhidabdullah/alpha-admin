import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import {
  notification,
  Empty,
  Table,
  Badge,
  Menu,
  Dropdown,
  Space,
  Tag,
  Button,
  Input,
  Tooltip,
  Popconfirm,
} from 'antd';
import {
  CheckCircleOutlined,
  DownOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
} from '@ant-design/icons';

/// import hooks
import { useHandleFetch } from '../../hooks';

// import components
import { DataTableSkeleton } from '../../components/Placeholders';
import AddNewProduct from './AddNewProduct';
import ProductQuickEdit from './ProductQuickEdit';
// import QuickEdit from './QuickEdit';

// import state
import { isAccess } from "../../utils";
import { connect } from "react-redux";



const { Column, ColumnGroup } = Table;
const { Search } = Input;

const openSuccessNotification = (msg?: any) => {
  notification.success({
    message: msg || 'Product Deleted',
    description: '',
    icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
  });
};

interface myTableProps {
  data: any;
  setProductList: any;
  roles: any 
}

const MyTable = ({ data, setProductList, roles }: myTableProps) => {
  const [visible, setvisible] = useState(false);
  const [activeCategoryForEdit, setactiveCategoryForEdit] = useState(false);
  const [deleteProductState, handleDeleteProductFetch] = useHandleFetch(
    {},
    'deleteProduct'
  );
  const [productDetailVisible, setproductDetailVisible] = useState(false);
  const [updateOrderStatusState, handleUpdateOrderStatusFetch] = useHandleFetch(
    {},
    'updateStock'
  );

  const history = useHistory();

  const handleDeleteProduct = async (id) => {
    const deleteProductRes = await handleDeleteProductFetch({
      urlOptions: {
        placeHolders: {
          id,
        },
      },
    });

    // @ts-ignore
    if (deleteProductRes && deleteProductRes.status === 'ok') {
      openSuccessNotification();
      const newProductList = data.filter((item) => item.id !== id);
      setProductList(newProductList);
    }

    // console.log('deleteProductRes', deleteProductRes)
  };

  const handleUpdateOrderStatus = async (record, id, newStatus) => {
    const updateOrderStatusRes = await handleUpdateOrderStatusFetch({
      urlOptions: {
        params: {
          inStock: newStatus,
        },
        placeHolders: {
          id,
        },
      },
    });

    // @ts-ignore
    if (updateOrderStatusRes && updateOrderStatusRes.status === 'ok') {
      openSuccessNotification('Updated Stock');

      const positionInTag = () => {
        return data.map((item) => item.id).indexOf(id);
      };

      const index = positionInTag();
      console.log('recordis', record, index);

      // @ts-ignore
      const updatedItem = Object.assign({}, data[index], {
        inStock: newStatus,
      });
      const updateOrderList = [
        ...data.slice(0, index),
        updatedItem,
        ...data.slice(index + 1),
      ];
      console.log('updateOrderList', updateOrderList, '-----', setProductList);
      setProductList(updateOrderList);
    }
  };

  const StatusItemMenu = (record, id) => {
    return (
      <Menu>
        <Menu.Item
          onClick={() => handleUpdateOrderStatus(record, id, true)}
          key='1'
          icon={<CheckOutlined />}
        >
          In stock
        </Menu.Item>

        <Menu.Item
          onClick={() => handleUpdateOrderStatus(record, id, false)}
          key='1'
          icon={<CheckOutlined />}
        >
          Out of stock
        </Menu.Item>

        {/* <Menu.Item
                      onClick={() => handleUpdateOrderStatus(record,id,'deliver')}
                      key="1" icon={<CheckOutlined />}>
                      Delivered
                    </Menu.Item>
              */}
      </Menu>
    );
  };

  return (
    <>
      <Table
        style={{
          paddingTop: '10px',
          borderRadius: '5px !important',
          overflow: 'hidden',
          boxShadow:
            '0 0.125rem 0.625rem rgba(227, 231, 250, 0.3), 0 0.0625rem 0.125rem rgba(206, 220, 233, 0.4)',
        }}
        // expandable={{
        //     expandedRowRender: record => <p style={{ margin: 0 }}>{record.name}</p>,
        //     rowExpandable: record => record.name !== 'Not Expandable',
        //   }}
        // bordered={true}
        size='small'
        // pagination={false}
        dataSource={data}
        tableLayout={'auto'}
        onHeaderRow={(column) => {
          return {
            style: {
              color: 'red !important',
            },
          };
        }}
      >
        <Column
          title=''
          dataIndex='cover'
          key='id'
          width={'80px'}
          className='classnameofthecolumn'
          render={(cover, record: any) => (
            <>
              <img
                onClick={() => {
                  history.push(`/admin/product/${record.id}`);
                  setactiveCategoryForEdit(record);
                }}
                src={cover}
                alt='cover img'
                style={{
                  height: '40px',
                  width: '40px',
                  objectFit: 'contain',
                  borderRadius: '3px',
                  cursor: 'pointer',
                }}
              />
            </>
          )}
        />

        <Column
          title='Name'
          dataIndex='name'
          key='id'
          className='classnameofthecolumn'
          render={(text, record: any) => (
            <>
              <h4
                onClick={() => {
                  history.push(`/admin/product/${record.id}`);
                  setactiveCategoryForEdit(record);
                }}
                style={{
                  fontWeight: 400,
                  color: '#555',
                  cursor: 'pointer',
                }}
              >
                {text}
              </h4>
            </>
          )}
        />

        <Column
          title='Offer Price'
          dataIndex='offerPrice'
          key='id'
          className='classnameofthecolumn'
        />

        <Column
          title='Price'
          dataIndex='price'
          key='id'
          className='classnameofthecolumn'
        />

        <Column
          title='Available'
          dataIndex='available'
          key='id'
          className='classnameofthecolumn'
        />



        <Column
          align='right'
          title='Stock'
          dataIndex='inStock'
          key='id'
          className='classnameofthecolumn'
          render={(text, record: any) => (
            <>

            {isAccess('postCatalogue',roles) ? (
                 <Dropdown
                 overlay={() => StatusItemMenu(record, record.id)}
                 placement='bottomRight'
               >
                 <a href='##'>
                   <span
                     // className={'product-attributeTag'}
                     style={{
                       fontSize: '12px',
                     }}
                   >
                     {text ? 'In Stock' : 'Out of stock'}
                     <span
                       style={{
                         marginLeft: '5px',
                         fontSize: '10px',
                       }}
                     >
                    <DownOutlined />
                     </span>
                   </span>
                 </a>
               </Dropdown>
            ) : (
              <a href='##'>
              <span
                // className={'product-attributeTag'}
                style={{
                  fontSize: '12px',
                }}
              >
                {text ? 'In Stock' : 'Out of stock'}
                <span
                  style={{
                    marginLeft: '5px',
                    fontSize: '10px',
                  }}
                >
             
                </span>
              </span>
            </a>
            )}
           
            </>
          )}
        />

        {/* <Column
          title="Unit"
          dataIndex="unit"
          key="id"
          className='classnameofthecolumn'

        /> */}
        {/* <Column 
          
          className='classnameofthecolumn'

          title="Product" dataIndex="product" key="product" /> */}

        {/* <Column 
          
          className='classnameofthecolumn'

          title="Sub Category" dataIndex="subCategory" key="subCategory" /> */}

        {/* <Column
          title="Tags"
          dataIndex="tags"
          key="tags"
          render={tags => (
            <>
              {tags.map((tag : any) => (
                <Tag color="blue" key={tag}>
                  {tag}
                </Tag>
              ))}
            </>
          )}
        /> */}

        {isAccess('postCatalogue','roles') && (
        <Column
        className='classnameofthecolumn'
        title=''
        key='action'
        align='right'
        render={(text, record: any) => (
          <Space size='middle'>
            <a href='##'>
              <Tooltip placement='top' title='Edit Product'>
                <span
                  className='iconSize'
                  onClick={() => {
                    setvisible(true);
                    setactiveCategoryForEdit(record);
                  }}
                >
               <EditOutlined />
             </span>
           </Tooltip>
         </a>

         <Popconfirm
           onConfirm={() => handleDeleteProduct(record.id)}
           title='Are you sure？'
           okText='Yes'
           cancelText='No'
         >
           <span className='iconSize iconSize-danger'>
             <DeleteOutlined />
           </span>
         </Popconfirm>
       </Space>
     )}
   />
        )}
   
      </Table>

      {activeCategoryForEdit && (
        <ProductQuickEdit
          productList={data}
          setProductList={setProductList}
          setProductEditVisible={setvisible}
          productEditVisible={visible}
          productDetailData={activeCategoryForEdit}
        />
      )}
    </>
  );
};

interface Props {
  roles?:any;
}

const ProductList = ({ roles  }: Props) => {
  const [productList, setProductList] = useState([]);

  const [productState, handleProductListFetch] = useHandleFetch(
    {},
    'productList'
  );

  useEffect(() => {
    const setProducts = async () => {
      const products = await handleProductListFetch({
        urlOptions: {
          params: {
            sortItem: 'added',
            sortOrderValue: '-1',
            productType: 'product',
          },
        },
      });
      // @ts-ignore
      setProductList(products);
    };
    setProducts();
  }, []);

  console.log('myFuckingProductList', productList);

  const [addNewCategoryVisible, setAddNewCategoryVisible] = useState(false);

  // console.log('productState', productState)

  const handleSearch = (value) => {
    if (productState.data.length > 0) {
      const newProductList = productState.data.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setProductList(newProductList);
    }
  };




  return (
    <>
      {/* <h2 className='containerPageTitle'>
      Categories
    </h2> */}
      <div className='categoryListContainer'>
        <div className='categoryListContainer__header'>
          <div className='categoryListContainer__header-searchBar'>
            <h2 className='categoryListContainer__header-title'>Products</h2>

            <Search
              enterButton={false}
              className='searchbarClassName'
              placeholder='search products..'
              onChange={(e) => handleSearch(e.target.value)}
              // style={{ width: 300 }}
            />
          </div>


          {isAccess('postCatalogue',roles) && (
            <Button
            // type="primary"
            className='btnPrimaryClassNameoutline'
            icon={<PlusOutlined />}
            onClick={() => setAddNewCategoryVisible(true)}
          >
            Add New
          </Button>
          )}

          
        </div>

        <div className='categoryListContainer__afterHeader'>
          {/* <Search
      placeholder="search categories.."
      size="large"
      onSearch={value => console.log(value)}
      style={{ width: 300 }}
    /> */}
        </div>

        <div className='categoryListContainer__categoryList'>
          {productState.done && productList.length > 0 && (
            <MyTable 
            roles={roles}
            setProductList={setProductList} data={productList} />
          )}
          {productState.isLoading && <DataTableSkeleton />}
          {productState.done && !(productList.length > 0) && (
            <div
              style={{
                marginTop: '200px',
              }}
            >
              <Empty
                description='No Products found'
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}
        </div>
      </div>

      {productState.done && (
        <AddNewProduct
          addNewCategoryVisible={addNewCategoryVisible}
          setAddNewCategoryVisible={setAddNewCategoryVisible}
          productList={productState.data}
          setProductList={setProductList}
        />
      )}
    </>
  );
};


const mapStateToProps = state => ({
  roles: state.globalState,
})

// @ts-ignore
export default connect(mapStateToProps, null)(ProductList);



