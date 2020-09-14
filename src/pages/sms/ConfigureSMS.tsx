import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useHandleFetch } from '../../hooks';
// import third party ui lib
import {
  Upload,
  message,
  Switch,
  Select,
  Button,
  notification,
  Modal,
  Tooltip,
  Checkbox,
} from 'antd';

import {
  FileOutlined,
  InboxOutlined,
  FileAddOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  FileImageFilled,
} from '@ant-design/icons';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import components
import Input from '../../components/Field/Input';
import InputSmall from '../../components/Field/InputSmall';
import TextArea from '../../components/Field/TextArea';
import MediaLibrary from '../../components/MediaLibrary';

const validationSchema = Yup.object().shape({});

const openSuccessNotification = (message?: any) => {
  notification.success({
    message: message || 'Tag Created',
    description: '',
    icon: <CheckCircleOutlined style={{ color: 'rgba(0, 128, 0, 0.493)' }} />,
  });
};

const openErrorNotification = (message?: any) => {
  notification.error({
    message: message || 'Something Went Wrong',
    description: '',
    icon: <CheckCircleOutlined style={{ color: 'rgb(241, 67, 67)' }} />,
  });
};

const initialValues = {
  url: '',
  protocol: '',
  method: '',
  parameters: '',
  recipientKey: '',
  separator: '',
  textKey: '',
  maskKey: '',
  maskValue: '',
  usernameKey: '',
  usernameValue: '',
  passwordKey: '',
  passwordValue: '',
  additionalMsgType: '',
};

const { Option } = Select;

interface Props {}

const ConfigureSTMP = ({}: Props) => {
  const [
    getEmailConfigurationState,
    handleGetEmailConfigurationFetch,
  ] = useHandleFetch({}, 'getSMSConfiguration');
  const [
    emailConfigurationState,
    handleEmailConfigurationFetch,
  ] = useHandleFetch({}, 'configureSMS');

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isArraySupport, setIsArraySupport] = useState(false);
  const [configurationData, setConfigurationData] = useState({});
  const [method, setMethod] = useState('');
  const [protocol, setProtocol] = useState('');

  console.log('getEmailConfigurationState', getEmailConfigurationState);

  useEffect(() => {
    const getEmailConfiguration = async () => {
      const res = await handleGetEmailConfigurationFetch({});
      // @ts-ignore
      if (res) {
        // @ts-ignore
        setConfigurationData(res);
        setIsAuthenticated(res['authentication']);
        setMethod(res['method']);
        setProtocol(res['protocol']);
      }
    };
    getEmailConfiguration();
  }, []);

  console.log('getEmailConfigurationState', method);

  const handleSubmit = async (values: any, actions: any) => {
    const addTagRes = await handleEmailConfigurationFetch({
      body: {
        url: values.url,
        protocol: protocol,
        method: method,
        authentication: isAuthenticated,
        parameters: {
          recipient: {
            key: values.recipientKey,
            arraySupport: isArraySupport,
            separator: values.separator,
          },
          text: {
            key: values.textKey,
          },
          mask: {
            key: values.maskKey,
            value: values.maskValue,
          },
          authentication: {
            username: {
              key: values.usernameKey,
              value: values.usernameValue,
            },
            password: {
              key: values.passwordKey,
              value: values.passwordValue,
            },
          },
          additional: {
            MsgType: values.additionalMsgType,
          },
        },
      },
    });

    // @ts-ignore
    if (addTagRes && addTagRes.status === 'ok') {
    } else {
      // openErrorNotification("Something went wrong, Couldn't updated STMP configuration");
    }

    actions.setSubmitting(false);
  };

  const handleSelectChange = () => {};

  const getisSubmitButtonDisabled = (values, isValid) => {
    if (!values.name || !isValid) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!emailConfigurationState['isLoading']) {
      const error = emailConfigurationState['error'];
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
      !emailConfigurationState['isLoading'] &&
      Object.keys(emailConfigurationState.data).length > 0
    ) {
      if (emailConfigurationState['data']['status'] === 'ok') {
        openSuccessNotification('SMS Settings Updated!');
        // history.push({
        //   pathname: '/orderDetails',
        //   state: checkoutState['data']
        // })

        // clearCart();
        // setIsModalShown(true);
      }
    }
  }, [emailConfigurationState]);

  const handleAuthenticatedChange = (e) => {
    setIsAuthenticated(e.target.checked);
  };

  const prottocolOptions = [
    {
      name: 'HTTP',
      value: 'HTTP',
    },
    {
      name: 'HTTPS',
      value: 'HTTPS',
    },
  ];

  const methodOptions = [
    {
      name: 'GET',
      value: 'GET',
    },
    {
      name: 'POST',
      value: 'POST',
    },
  ];

  const handleMethodChange = (value) => {
    console.log('valueOfMethod', value);
    setMethod(value);
  };

  const handleProtocolChange = (value) => {
    setProtocol(value);
  };

  const initialValues = {
    url: '',
    protocol: '',
    method: '',
    parameters: '',
    recipientKey: '',
    separator: '',
    textKey: '',
    maskKey: '',
    maskValue: '',
    usernameKey: '',
    usernameValue: '',
    passwordKey: '',
    passwordValue: '',
    additionalMsgType: '',
  };

  return (
    <Formik
      onSubmit={(values, actions) => handleSubmit(values, actions)}
      validationSchema={validationSchema}
      validateOnBlur={false}
      enableReinitialize={true}
      initialValues={{
        ...initialValues,
        ...configurationData,
        ...(configurationData &&
          Object.keys(configurationData).length > 0 && {
            recipientKey:
              configurationData['parameters'] &&
              configurationData['parameters'].recipient &&
              configurationData['parameters'].recipient.key,
            separator:
              configurationData['parameters'] &&
              configurationData['parameters'].recipient &&
              configurationData['parameters'].recipient.separator,
            textKey:
              configurationData['parameters'] &&
              configurationData['parameters'].text &&
              configurationData['parameters'].text.key,
            maskKey:
              configurationData['parameters'] &&
              configurationData['parameters'].mask &&
              configurationData['parameters'].mask.key,
            maskValue:
              configurationData['parameters'] &&
              configurationData['parameters'].mask &&
              configurationData['parameters'].mask.value,
            usernameKey:
              configurationData['parameters'] &&
              configurationData['parameters'].authentication &&
              configurationData['parameters'].authentication.username &&
              configurationData['parameters'].authentication.username.key,
            usernameValue:
              configurationData['parameters'] &&
              configurationData['parameters'].authentication &&
              configurationData['parameters'].authentication.username &&
              configurationData['parameters'].authentication.username.value,
            passwordKey:
              configurationData['parameters'] &&
              configurationData['parameters'].authentication &&
              configurationData['parameters'].authentication.password &&
              configurationData['parameters'].authentication.password.key,
            passwordValue:
              configurationData['parameters'] &&
              configurationData['parameters'].authentication &&
              configurationData['parameters'].authentication.password &&
              configurationData['parameters'].authentication.password.value,
            additionalMsgType:
              configurationData['parameters'] &&
              configurationData['parameters'].additional &&
              configurationData['parameters'].additional.MsgType,
          }),
      }}
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                width: '49%',
              }}
            >
              <Input
                label='URL'
                value={values.url}
                name='url'
                isError={
                  (touched.url && errors.url) ||
                  (!isSubmitting &&
                    emailConfigurationState.error['error']['url'])
                }
                errorString={
                  (touched.url && errors.url) ||
                  (!isSubmitting &&
                    emailConfigurationState.error['error']['url'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('url');
                }}
              />
            </div>
            <div
              style={{
                width: '49%',
              }}
            >
              <h3 className='inputFieldLabel'>Protocol</h3>
              <Select
                showSearch
                style={{ width: '100%', borderRadius: '6px' }}
                placeholder='Select a protocol'
                defaultValue={protocol}
                value={protocol}
                onChange={handleProtocolChange}
              >
                {prottocolOptions.map((option) => {
                  return <Option value={option.value}>{option.name}</Option>;
                })}
              </Select>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                width: '49%',
              }}
            >
              <h3 className='inputFieldLabel'>Method</h3>

              <Select
                onChange={handleMethodChange}
                showSearch
                style={{ width: '100%', borderRadius: '6px' }}
                placeholder='Select a method'
                defaultValue={method}
                value={method}
              >
                {methodOptions.map((option) => {
                  return <Option value={option.value}>{option.name}</Option>;
                })}
              </Select>
            </div>
            <div
              style={{
                width: '49%',
              }}
            ></div>
          </div>

          <div
            style={{
              marginTop: '20px',
            }}
          ></div>
          <h3 style={{}} className='addOrderContainer-sectionTitle'>
            Parameters
          </h3>

          <h3 className='inputFieldLabel'>Recipient</h3>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '35%',
              }}
            >
              <InputSmall
                label='Key'
                value={values.recipientKey}
                name='recipientKey'
                isError={
                  (touched.recipientKey && errors.recipientKey) ||
                  (!isSubmitting &&
                    emailConfigurationState.error['error']['recipientKey'])
                }
                errorString={
                  (touched.recipientKey && errors.recipientKey) ||
                  (!isSubmitting &&
                    emailConfigurationState.error['error']['recipientKey'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('recipientKey');
                }}
              />
            </div>

            <div
              style={{
                width: '20%',
                marginLeft: '20px',
              }}
            >
              <Checkbox
                value={isArraySupport}
                onChange={(e) => setIsArraySupport(e.target.checked)}
              >
                <span className='checkBoxFieldLabel'>Array support</span>
              </Checkbox>
            </div>

            <div
              style={{
                width: '45%',
              }}
            >
              {isArraySupport && (
                <InputSmall
                  label='Separator'
                  value={values.separator}
                  name='separator'
                  isError={
                    (touched.separator && errors.separator) ||
                    (!isSubmitting &&
                      emailConfigurationState.error['error']['separator'])
                  }
                  errorString={
                    (touched.separator && errors.separator) ||
                    (!isSubmitting &&
                      emailConfigurationState.error['error']['separator'])
                  }
                  onChange={(e: any) => {
                    handleChange(e);
                    setFieldTouched('separator');
                  }}
                />
              )}
            </div>
          </div>

          <h3 className='inputFieldLabel'>Text</h3>
          <InputSmall
            label='Separator'
            value={values.textKey}
            name='textKey'
            isError={
              (touched.textKey && errors.textKey) ||
              (!isSubmitting &&
                emailConfigurationState.error['error']['textKey'])
            }
            errorString={
              (touched.textKey && errors.textKey) ||
              (!isSubmitting &&
                emailConfigurationState.error['error']['textKey'])
            }
            onChange={(e: any) => {
              handleChange(e);
              setFieldTouched('textKey');
            }}
          />

          <div
            style={{
              marginTop: '15px',
            }}
          ></div>

          <h3 className='inputFieldLabel'>Mask</h3>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '49%',
              }}
            >
              <InputSmall
                label='Key'
                value={values.maskKey}
                name='maskKey'
                isError={
                  (touched.maskKey && errors.maskKey) ||
                  (!isSubmitting &&
                    emailConfigurationState.error['error']['maskKey'])
                }
                errorString={
                  (touched.maskKey && errors.maskKey) ||
                  (!isSubmitting &&
                    emailConfigurationState.error['error']['maskKey'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('maskKey');
                }}
              />
            </div>
            <div
              style={{
                width: '49%',
              }}
            >
              <InputSmall
                label='Value'
                value={values.maskValue}
                name='maskValue'
                isError={
                  (touched.maskValue && errors.maskValue) ||
                  (!isSubmitting &&
                    emailConfigurationState.error['error']['maskValue'])
                }
                errorString={
                  (touched.maskValue && errors.maskValue) ||
                  (!isSubmitting &&
                    emailConfigurationState.error['error']['maskValue'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('maskValue');
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: '15px',
            }}
          ></div>

          <h3 className='inputFieldLabel'>Username</h3>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '49%',
              }}
            >
              <InputSmall
                label='Key'
                value={values.usernameKey}
                name='usernameKey'
                isError={
                  (touched.usernameKey && errors.usernameKey) ||
                  (!isSubmitting &&
                    emailConfigurationState.error['error']['usernameKey'])
                }
                errorString={
                  (touched.usernameKey && errors.usernameKey) ||
                  (!isSubmitting &&
                    emailConfigurationState.error['error']['usernameKey'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('usernameKey');
                }}
              />
            </div>
            <div
              style={{
                width: '49%',
              }}
            >
              <InputSmall
                label='Value'
                value={values.usernameValue}
                name='usernameValue'
                isError={
                  (touched.usernameValue && errors.usernameValue) ||
                  (!isSubmitting &&
                    emailConfigurationState.error['error']['usernameValue'])
                }
                errorString={
                  (touched.usernameValue && errors.usernameValue) ||
                  (!isSubmitting &&
                    emailConfigurationState.error['error']['usernameValue'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('usernameValue');
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: '15px',
            }}
          ></div>

          <h3 className='inputFieldLabel'>Password</h3>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '49%',
              }}
            >
              <InputSmall
                label='Key'
                value={values.passwordKey}
                name='passwordKey'
                isError={
                  (touched.passwordKey && errors.passwordKey) ||
                  (!isSubmitting &&
                    emailConfigurationState.error['error']['passwordKey'])
                }
                errorString={
                  (touched.passwordKey && errors.passwordKey) ||
                  (!isSubmitting &&
                    emailConfigurationState.error['error']['passwordKey'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('passwordKey');
                }}
              />
            </div>
            <div
              style={{
                width: '49%',
              }}
            >
              <InputSmall
                label='Value'
                value={values.passwordValue}
                name='passwordValue'
                isError={
                  (touched.passwordValue && errors.passwordValue) ||
                  (!isSubmitting &&
                    emailConfigurationState.error['error']['passwordValue'])
                }
                errorString={
                  (touched.passwordValue && errors.passwordValue) ||
                  (!isSubmitting &&
                    emailConfigurationState.error['error']['passwordValue'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('passwordValue');
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: '15px',
            }}
          ></div>

          <h3 className='inputFieldLabel'>Additional</h3>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '49%',
              }}
            >
              <InputSmall
                label='Msg Type'
                value={values.additionalMsgType}
                name='additionalMsgType'
                isError={
                  (touched.additionalMsgType && errors.additionalMsgType) ||
                  (!isSubmitting &&
                    emailConfigurationState.error['error']['additionalMsgType'])
                }
                errorString={
                  (touched.additionalMsgType && errors.additionalMsgType) ||
                  (!isSubmitting &&
                    emailConfigurationState.error['error']['additionalMsgType'])
                }
                onChange={(e: any) => {
                  handleChange(e);
                  setFieldTouched('additionalMsgType');
                }}
              />
            </div>
            <div
              style={{
                width: '49%',
              }}
            ></div>
          </div>

          <Checkbox
            value={isAuthenticated}
            onChange={handleAuthenticatedChange}
          >
            <span className='checkBoxFieldLabel'>Authentication</span>
          </Checkbox>

          <div
            style={{
              marginTop: '20px',
            }}
          ></div>
          <div
            style={{
              display: 'block',
              marginBottom: '20px',
              marginTop: '20px',
            }}
          >
            <Button
              onClick={(e: any) => handleSubmit(e)}
              loading={emailConfigurationState.isLoading}
              className='btnPrimaryClassNameoutline'
            >
              Update SMS Configuration
            </Button>
          </div>
        </>
      )}
    </Formik>
  );
};

export default ConfigureSTMP;
