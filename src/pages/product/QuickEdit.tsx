import React, { useState } from 'react';
import { Modal, notification } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import { useHandleFetch } from '../../hooks';
import { CheckCircleOutlined } from '@ant-design/icons';


const validationSchema = Yup.object().shape({
	name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
});


const openSuccessNotification = () => {
	notification.success({
		message: 'Product Updated',
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



interface Props {
	category: any;
	setvisible: any;
	visible: any;
	setProductList?: any;
	productList?: any;
}

const QuickEdit = ({ category, setvisible, visible, setProductList, productList }: Props) => {
	const [updateProductState, handleUpdateProductFetch] = useHandleFetch({}, 'updateProduct');

	const handleSubmit = async (values: any, actions: any) => {
		const updateProductRes = await handleUpdateProductFetch({
			urlOptions: {
				placeHolders: {
					id: values.id,
				}
			},
			body: {
				name: values.name,
				description: values.description,
				category: category.category,
				pricing: category.pricing
			},
		});

		// @ts-ignore
		if (updateProductRes && updateProductRes.status === 'ok') {
			openSuccessNotification();

			const positionInAttribute = () => {
				return productList.map(item => item.id).indexOf(category.id);
			}

			const index = positionInAttribute();

			// @ts-ignore
			const updatedItem = Object.assign({}, productList[index], { ...updateProductRes });
			const updateProductList = [...productList.slice(0, index), updatedItem, ...productList.slice(index + 1)];
			setProductList(updateProductList);

		}
		else {
			openErrorNotification();
		}

		actions.setSubmitting(false);
		setvisible(false)
	};


	const handleCancel = (e: any) => {
		setvisible(false);
	};


	const getisSubmitButtonDisabled = (values, isValid) => {
		if (!values.name || !isValid) {
			return true;
		}
		return false;
	}

	return (
		<Formik
			onSubmit={(values, actions) => handleSubmit(values, actions)}
			validationSchema={validationSchema}
			validateOnBlur={false}
			enableReinitialize={true}
			initialValues={
				{ ...category }
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
						<Modal
							title="Quick Edit"
							visible={visible}
							onOk={(e: any) => handleSubmit(e)}
							onCancel={handleCancel}
							okText='Update'
							okButtonProps={{
								loading: isSubmitting,
								htmlType: "submit",
								disabled: getisSubmitButtonDisabled(values, isValid)
							}}
						>
							<Input
								label='Title'
								value={values.name}
								name='name'
								isError={(touched.name && errors.name) ||
									(!isSubmitting && updateProductState.error['error']['name'])}

								errorString={(touched.name && errors.name) ||
									(!isSubmitting && updateProductState.error['error']['name'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('name');
								}}
							/>


							<TextArea
								label='Description'
								value={values.description}
								name='description'
								isError={(touched.description && errors.description) ||
									(!isSubmitting && updateProductState.error['error']['description'])}

								errorString={(touched.description && errors.description) ||
									(!isSubmitting && updateProductState.error['error']['description'])}
								onChange={(e: any) => {
									handleChange(e);
									setFieldTouched('description');
								}}
							/>
						</Modal>
					</>
				)}
		</Formik>
	);
};


export default QuickEdit;
