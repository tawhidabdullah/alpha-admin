import React, { useState, useEffect } from 'react';
import { Modal, notification } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

// import components
import Input from '../../components/Field/Input';
import TextArea from '../../components/Field/TextArea';
import { useHandleFetch } from '../../hooks';
import {
  CheckCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EditFilled,
  InfoCircleOutlined,
} from '@ant-design/icons';
import AccessCheckbox from './AccessCheckbox';

// import state
import { glboalOperations } from '../../state/ducks/globalState';
import { credentialsOperations } from '../../state/ducks/credentials';
import { connect } from 'react-redux';
import { isAccess } from '../../utils';
import { credentials } from '../../state/ducks';

const validationSchema = Yup.object().shape({
  // 	name: Yup.string().label('Name').required('Name is required').min(3, 'Name must have at least 3 characters'),
  //     phone: Yup.string()
  //     .required('Please tell us your mobile number.')
  //     .max(13, 'Please enter a valid mobile number.'),
  //    password: Yup.string()
  //     .label('Password')
  //     .required()
  //     .min(6, 'Password must have at least 6 characters'),
  //   passwordConfirmation: Yup.string()
  //     .label('Confirm password')
  //     .required()
  //     .min(6, 'Confirm password must have at least 6 characters')
  //     .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Admin Updated',
    description: '',
    icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
  });
};

const openErrorNotification = (message?: any) => {
  notification.success({
    message: message || 'Something Went Wrong',
    description: '',
    icon: <InfoCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
  });
};

const plainOptions = [
  'getCatalogue',
  'postCatalogue',
  'getDelivery',
  'postDelivery',
  'getOrder',
  'postOrder',
  'getBlog',
  'postBlog',
  'getPage',
  'postPage',
  'analytics',
  'accounts',
  'getDealer',
  'postDealer',
];

interface Props {
  category: any;
  setvisible: any;
  visible: any;
  tagList: any;
  setTagList: any;
  saveRoles?: any;
  roles;
  credentials;
  saveCredentials;
}

const QuickEdit = ({
  category,
  setvisible,
  visible,
  tagList,
  setTagList,
  saveRoles,
  roles,
  saveCredentials,
}: Props) => {
  const [updateTagState, handleUpdateCategoryFetch] = useHandleFetch(
    {},
    'updateAdminRole'
  );
  const [checkAll, setCheckAll] = useState(false);

  const [accesscheckedList, setAccessCheckedList] = useState([]);

  useEffect(() => {
    if (category.role && category.role.length > 0) {
      if (category.role.includes('superAdmin')) {
        setCheckAll(true);
        setAccessCheckedList([...plainOptions]);
      } else {
        setAccessCheckedList([...category.role]);
      }
    }
  }, [category]);

  const handleSubmit = async (values: any, actions: any) => {
    console.log('adminValues', values);

    let roles = [...accesscheckedList];
    if (checkAll) {
      roles = ['superAdmin'];
    }

    const updateTagRes = await handleUpdateCategoryFetch({
      urlOptions: {
        placeHolders: {
          id: category._id,
        },
      },
      body: {
        name: values.name,
        access: roles,
        phone: values.phone,
        password: values.password,
        password2: values.passwordConfirmation,
      },
    });

    // @ts-ignore
    if (updateTagRes && updateTagRes.status === 'ok') {
      openSuccessNotification();
      setvisible(false);

      const positionInTag = () => {
        return tagList.map((item) => item._id).indexOf(category._id);
      };

      console.log('updateTagRes', updateTagRes);

      // if(updateTagRes['role']){
      // 	if(updateTagRes['_id'] === credentials['_id']){
      // 		saveRoles(updateTagRes['role'])
      // 	}
      // }

      const index = positionInTag();

      // @ts-ignore
      const updatedItem = Object.assign({}, tagList[index], {
        // @ts-ignore
        ...updateTagRes,
        _id: category._id,
      });
      const updateTagList = [
        ...tagList.slice(0, index),
        updatedItem,
        ...tagList.slice(index + 1),
      ];
      console.log('updateTagList', updateTagList);
      setTagList(updateTagList);

      actions.resetForm();
    } else {
      openErrorNotification();
    }

    actions.setSubmitting(false);
  };

  const handleCancel = (e: any) => {
    setvisible(false);
  };

  useEffect(() => {
    if (!updateTagState['isLoading']) {
      const error = updateTagState['error'];
      if (error['isError'] && Object.keys(error['error']).length > 0) {
        if (error['error']['registerError']) {
          // setServerErrors(error['error']['registerError']);
        } else if (error['error']['checkoutError']) {
          // setServerErrors(error['error']['checkoutError']);
        } else {
          // setServerErrors(error['error']);
        }

        const errors =
          Object.values(error['error']).length > 0
            ? Object.values(error['error'])
            : [];
        errors.forEach((err, i) => {
          if (typeof err === 'string') {
            openErrorNotification(err);
          } else if (typeof err === 'object') {
            if (err && Object.keys(err).length > 0) {
              const errs = Object.values(err);
              errs.forEach((err) => {
                openErrorNotification(err);
              });
            }
          }
        });
      }
    }

    if (
      !updateTagState['isLoading'] &&
      Object.keys(updateTagState.data).length > 0
    ) {
      if (updateTagState['data']['status'] === 'ok') {
        // openSuccessNotification('Order Created Successfully');
        // history.push({
        //   pathname: '/orderDetails',
        //   state: checkoutState['data']
        // })
        // clearCart();
        // setIsModalShown(true);
      }
    }
  }, [updateTagState]);

  return (
    <Formik
      onSubmit={(values, actions) => handleSubmit(values, actions)}
      validationSchema={validationSchema}
      validateOnBlur={false}
      enableReinitialize={true}
      initialValues={{ ...category }}
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
          {console.log('errors', errors)}
          <Modal
            title='Edit Admin'
            visible={visible}
            onOk={(e: any) => handleSubmit(e)}
            onCancel={handleCancel}
            okText='Update'
            okButtonProps={{
              loading: isSubmitting,
              htmlType: 'submit',
            }}
          >
            <Input
              label='Title'
              value={values.name}
              name='name'
              isError={
                (touched.name && errors.name) ||
                (!isSubmitting && updateTagState.error['error']['name'])
              }
              errorString={
                (touched.name && errors.name) ||
                (!isSubmitting && updateTagState.error['error']['name'])
              }
              onChange={(e: any) => {
                handleChange(e);
                setFieldTouched('name');
              }}
            />

            <h3 className='inputFieldLabel'>Select Admin Access</h3>

            <AccessCheckbox
              defaultValue={category.role}
              checkAll={checkAll}
              setCheckAll={setCheckAll}
              plainOptions={plainOptions}
              checkedList={accesscheckedList}
              setCheckedList={setAccessCheckedList}
            />

            <div
              style={{
                marginTop: '20px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  borderBottom: '1px solid #eee',
                  marginBottom: '15px',
                  marginTop: '15px',
                }}
              >
                <h3 className='inputFieldLabel'>
                  Phone and password is required to update admin *
                </h3>
              </div>

              <Input
                label='Phone'
                value={values.phone}
                name='phone'
                isError={
                  (touched.phone && errors.phone) ||
                  (!isSubmitting && updateTagState.error['error']['phone'])
                }
                errorString={
                  (touched.phone && errors.phone) ||
                  (!isSubmitting && updateTagState.error['error']['phone'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('phone');
                }}
              />

              <Input
                label='Password'
                value={values.password}
                name='password'
                type='password'
                isError={
                  (touched.password && errors.password) ||
                  (!isSubmitting && updateTagState.error['error']['password'])
                }
                errorString={
                  (touched.password && errors.password) ||
                  (!isSubmitting && updateTagState.error['error']['password'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('password');
                }}
              />

              <Input
                label='Confirm Password'
                value={values.passwordConfirmation}
                name='passwordConfirmation'
                type='password'
                isError={
                  (touched.passwordConfirmation &&
                    errors.passwordConfirmation) ||
                  (!isSubmitting && updateTagState.error['error']['password2'])
                }
                errorString={
                  (touched.passwordConfirmation &&
                    errors.passwordConfirmation) ||
                  (!isSubmitting && updateTagState.error['error']['password2'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('passwordConfirmation');
                }}
              />
            </div>
          </Modal>
        </>
      )}
    </Formik>
  );
};

const mapDispathToProps = {
  saveRoles: glboalOperations.saveRoles,
  saveCredentials: credentialsOperations.saveCredentials,
};

const mapStateToProps = (state) => ({
  roles: state.globalState,
  credentials: state.credentials,
});

// @ts-ignore
export default connect(mapStateToProps, mapDispathToProps)(QuickEdit);
