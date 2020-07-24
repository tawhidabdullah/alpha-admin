import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { notification, Empty, Table, Badge, Menu, Dropdown, Space, Tag, Button, Input, Tooltip, Popconfirm } from 'antd';
import { CheckCircleOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EditFilled } from '@ant-design/icons';


/// import hooks
import { useFetch, useHandleFetch } from "../../hooks";

// import components
import { DataTableSkeleton } from "../../components/Placeholders";
import AddNewProduct from "./AddNewProduct";
import QuickEdit from "./QuickEdit";

const { Column, ColumnGroup } = Table;
const { Search } = Input;



const openSuccessNotification = () => {
  notification.success({
    message: 'Product Deleted',
    description: '',
    icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
  });
};



interface myTableProps {
  data: any;
  setProductList: any;
}


const MyTable = ({ data, setProductList }: myTableProps) => {
  const [visible, setvisible] = useState(false);
  const [activeCategoryForEdit, setactiveCategoryForEdit] = useState(false);
  const [deleteProductState, handleDeleteProductFetch] = useHandleFetch({}, 'deleteProduct');


  const handleDeleteProduct = async (id) => {
    const deleteProductRes = await handleDeleteProductFetch({
      urlOptions: {
        placeHolders: {
          id,
        }
      }
    });

    // @ts-ignore
    if (deleteProductRes && deleteProductRes.status === 'ok') {
      openSuccessNotification();
      const newProductList = data.filter(item => item.id !== id);
      setProductList(newProductList);
    }

    // console.log('deleteProductRes', deleteProductRes)
  }


  return (
    <>
      <Table
        style={{
          paddingTop: '10px',
          borderRadius: '5px !important',
          overflow: 'hidden',
          boxShadow: '0 0.125rem 0.625rem rgba(227, 231, 250, 0.3), 0 0.0625rem 0.125rem rgba(206, 220, 233, 0.4)'
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
        onHeaderRow={column => {
          return {
            style: {
              color: 'red !important'
            }

          };
        }}
      >
        <Column
          title=""
          dataIndex="cover"
          key="id"
          // width={'100px'}

          className='classnameofthecolumn'

          render={cover => (
            <>
              <img src={cover} alt='cover img' style={{
                height: '40px',
                width: '40px',
                objectFit: "contain",
                borderRadius: '3px'
              }} />
            </>
          )}
        />
        <Column
          title="Name"
          dataIndex="name"
          key="id"
          className='classnameofthecolumn'
          render={text => (
            <>
              <h4 style={{
                fontWeight: 400,
                color: '#666'
              }}>
                {text}
              </h4>
            </>
          )}
        />

        <Column
          title="Offer Price"
          dataIndex="offerPrice"
          key="id"
          className='classnameofthecolumn'

        />


        <Column
          title="Price"
          dataIndex="price"
          key="id"
          className='classnameofthecolumn'

        />

        <Column
          title="Unit"
          dataIndex="unit"
          key="id"
          className='classnameofthecolumn'

        />
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
        <Column

          className='classnameofthecolumn'
          title=""
          key="action"
          align='right'
          render={(text, record: any) => (
            <Space size="middle">
              <a href='##'>
                <Tooltip

                  placement="top" title='Quick Edit Product'>
                  <span className='iconSize' onClick={() => {
                    setvisible(true)
                    setactiveCategoryForEdit(record);
                  }}>
                    <EditOutlined />

                  </span>
                </Tooltip>
              </a>




              <Popconfirm

                onConfirm={() => handleDeleteProduct(record.id)}
                title="Are you sure？" okText="Yes" cancelText="No">
                <span
                  className='iconSize iconSize-danger'
                >
                  <DeleteOutlined />
                </span>

              </Popconfirm>




            </Space>
          )}
        />
      </Table>



      {activeCategoryForEdit && <QuickEdit
        productList={data}
        setProductList={setProductList}
        setvisible={setvisible}
        visible={visible}
        category={activeCategoryForEdit} />}


    </>
  )
}


interface Props {
  history: any;
}

const ProductList = ({ history }: Props) => {



  const [productList, setProductList] = useState([]);

  const [productState, handleProductListFetch] = useHandleFetch({}, 'productList');


  useEffect(() => {
    const setProducts = async () => {
      const products = await handleProductListFetch({});
      // @ts-ignore
      setProductList(products);
    }
    setProducts();
  }, [])


  const [addNewCategoryVisible, setAddNewCategoryVisible] = useState(false);


  // console.log('productState', productState)


  const handleSearch = (value) => {
    if (productState.data.length > 0) {
      const newProductList = productState.data.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
      setProductList(newProductList);
    }

  }


  return (
    <>
      {/* <h2 className='containerPageTitle'>
      Categories
    </h2> */}
      <div className='categoryListContainer'>
        <div className='categoryListContainer__header'>


          <div className='categoryListContainer__header-searchBar'>
            <h2 className='categoryListContainer__header-title'>
              Events
            </h2>


            <Search
              enterButton={false}
              className='searchbarClassName'
              placeholder="search events.."
              onSearch={value => handleSearch(value)}
            // style={{ width: 300 }}
            />
          </div>

          <Button
            // type="primary"
            className='btnPrimaryClassNameoutline'
            icon={<PlusOutlined />}
            onClick={() => setAddNewCategoryVisible(true)}
          >
            Add New
      </Button>


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
          {productState.done && productList.length > 0 && <MyTable
            setProductList={setProductList}
            data={productList} />}
          {productState.isLoading && <DataTableSkeleton />}
          {productState.done && !(productList.length > 0) && (
            <div style={{
              marginTop: '200px'
            }}>
              <Empty description='No Events found' image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          )}
        </div>
      </div>


      {productState.done &&
        <AddNewProduct
          addNewCategoryVisible={addNewCategoryVisible}
          setAddNewCategoryVisible={setAddNewCategoryVisible}
          productList={productState.data}
          setProductList={setProductList}


        />}




    </>
  );
};

export default withRouter(ProductList);
