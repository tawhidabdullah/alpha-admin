import React, {useState} from 'react';

// import third party ui lib
import { Upload, message, Switch, Select, Button, notification,Table, Space, Input as CoolInput,Tooltip, Modal,

} from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';



import {
	FileOutlined,
	InboxOutlined,
	RadiusUpleftOutlined,
	RadiusUprightOutlined,
	RadiusBottomleftOutlined,
	RadiusBottomrightOutlined,
	PlusOutlined,
	DeleteOutlined,
	EditOutlined
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';



/// import hooks
import { useFetch, useHandleFetch } from "../../hooks";


// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import { DataTableSkeleton } from "../../components/Placeholders";
import QuickEdit from "./QuickEdit"
import AddAttributeValues from "./AddAttributeValues"



const validationSchema = Yup.object().shape({
	name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
	description: Yup.string().label('Description').required('Description is required')
});


const initialValues = {
	name: '',
	description: ''
}


const { Column, ColumnGroup } = Table;
const { Search } = CoolInput;



const MyTable = ({data}) => {
    const [visible,setvisible] = useState(false);   
	const [activeCategoryForEdit,setactiveCategoryForEdit] = useState(false); 
    const [deleteTagState, handleDeleteTagFetch] = useHandleFetch({}, 'deleteTag');


	const handleDeleteCategory = async (id) => {
        const deleteTagRes = await handleDeleteTagFetch({
          urlOptions: {
            placeHolders: {
              id,
            }
            }
          });
      }


    const handleOk = (e: any) => {
        setvisible(false);
      
      };
    
      const handleCancel = (e: any) => {
        setvisible(false);
      };

      

    return (
        <>
         <Table 
        // expandable={{
        //     expandedRowRender: record => <p style={{ margin: 0 }}>{record.name}</p>,
        //     rowExpandable: record => record.name !== 'Not Expandable',
        //   }}
        // bordered={true}
        size='small'
        // pagination={false}
        dataSource={data}
        >

          <Column
           title="Name" 
           dataIndex="name" 
           key="id" 
           className='classnameofthecolumn'
         
            />

<Column
           title="Description" 
           dataIndex="description" 
           key="id" 
           className='classnameofthecolumn'
         
            />
        <Column
        
        className='classnameofthecolumn'
          title=""
          key="action"
          align='right'
          render={(text, record : any) => (
            <Space size="middle">
            
               <Tooltip placement="top" title='Quick Edit Tag'>
              <span className='iconSize' onClick={() => {
                setvisible(true)
                setactiveCategoryForEdit(record); 
              }}> 
              <EditOutlined />
            
              </span>
               </Tooltip>


             
              <Tooltip placement="top" title='Delete Tag'>
            

             <span 
             className='iconSize iconSize-danger'
             onClick={() => handleDeleteCategory(record.id)}
             > 
             <DeleteOutlined/>
            </span>
            
          </Tooltip>
             
            </Space>
          )}
        />
      </Table>



     

		{activeCategoryForEdit &&   <QuickEdit 
    setvisible={setvisible}
    visible={visible}
    category={activeCategoryForEdit}/>}
    </>
    )
}





const props = {
	name: 'file',
	multiple: true,
	action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
	onChange(info: any) {
		const { status } = info.file;
		if (status !== 'uploading') {
			console.log(info.file, info.fileList);
		}
		if (status === 'done') {
			message.success(`${info.file.name} file uploaded successfully.`);
		} else if (status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
	}
};

interface Props {}

const AttributeList = ({  }: Props) => {
	const tagState = useFetch([], [], 'brandList', {
		urlOptions: {
		  params: {
			isSubCategory: true,
		  },
		},
	  });

	  const [updateCategoryState, handleUpdateCategoryFetch] = useHandleFetch({}, 'updateCategory');
	  const [addNewCategoryVisible,setAddNewCategoryVisible] = useState(false);   



	  const handleSubmit = async (values : any, actions : any) => {
		  console.log('ourDamnValues',values)
		const updateCategoryRes = await handleUpdateCategoryFetch({
		  urlOptions: {
			  placeHolders: {
				id: values.id,
			  }
			},
		  body: {
			  name: values.name,
			  description: values.description,
		  },
		});
	  
		actions.setSubmitting(false);
	  };
	  
 
  
  
  
		const getisSubmitButtonDisabled = (values,isValid) => {
		  if(!values.name || !values.description || !isValid){
			  return true; 
		  }
		  return false; 
		}




  const handleOkAddNewCategory = (e: any) => {
    setAddNewCategoryVisible(false);
  
  };

  const handleCancelAddNewCategory = (e: any) => {
    setAddNewCategoryVisible(false);
  };

	return (
		<div className='site-layout-background' style={{ padding: '30px 20px 30px 20px', minHeight: 360 }}>
			<div className='addproductSectionTitleContainer'>
				<h2 className='addprouctSectionTitle'>Add Attribute</h2>
			</div>
			<div className='addproductSectionContainer addproductSectionContainer-tags'>
				<div className='addproductSection addproductSection-left'>
				<Formik
		onSubmit={(values, actions) => handleSubmit(values, actions)}
		validationSchema={validationSchema}
		validateOnBlur={false}
		enableReinitialize={true}
		initialValues={
		  {...initialValues}
		}
	  >
		{({
		  handleChange,
		  values,
		  handleSubmit,
		  errors,
		  isValid,
		  isSubmitting,
		  touched,
		  handleBlur,
		  setFieldTouched,
		  handleReset,
		}) => (
			<>
  <Input 
			   label='Title'
			   value={values.name}
			   name='name'
			   isError={(touched.name && errors.name) ||
				  (!isSubmitting && updateCategoryState.error['error']['name'])}
			  
				  errorString={(touched.name && errors.name) ||
					  (!isSubmitting && updateCategoryState.error['error']['name'])}
			   onChange={(e : any) => {
				  handleChange(e);
				  setFieldTouched('name');
				}}
			   />

			   <div style={{
				   marginTop: '0px'
			   }}></div>
			  

			  <h3 className='inputFieldLabel'> Values</h3>
				
				<AddAttributeValues />
					  <Button 
					  style={{
						  display: 'block',
						  marginTop: '20px'
					  }}
							type='primary'
							onClick={(e: any) => handleSubmit(e)}
							disabled={getisSubmitButtonDisabled(values,isValid)}
							loading={isSubmitting}
							
							 >
						Create
					</Button>
			</>
		  )}
	  </Formik>


				</div>
                <div className='addproductSection addproductSection-right'> 

				<div className='categoryListContainer'>
            <div className='categoryListContainer__header'>
           

          <div className='categoryListContainer__header-searchBar-tag'>
          {/* <h2 className='categoryListContainer__header-title'>
            Brand
            </h2> */}


          <Search
            enterButton={false}
            className='searchbarClassName'
          placeholder="search categories.."
          onSearch={value => console.log(value)}
          // style={{ width: 300 }}
        />
          </div>
            {/* <Button
          // type="primary"
          className='btnPrimaryClassNameoutline'
          icon={<PlusOutlined />}
          onClick={() => setAddNewCategoryVisible(true)}
        >
        Add New
            
            </Button> */}
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
				{tagState.done && tagState.data.length > 0 && <MyTable data={tagState.data} />}
				{tagState.isLoading && <DataTableSkeleton />}
			</div>
		</div>

                </div>
			</div>
		</div>
	);
};

export default AttributeList;
