import React, {useEffect} from 'react'


// import hooks
import { useHandleFetch,  } from "../../hooks";

import {Spin} from 'antd'; 
import moment from "moment";
import ReactHtmlParser from 'react-html-parser';


import {
    LeftOutlined
} from '@ant-design/icons';




interface Props {
    id?:any; 
    setSelectedEmailId?:any; 
}

const InboxEmailDetails = ({id,setSelectedEmailId}: Props) => {
    const [getEmailDetailState, handleGetEmailListFetch] = useHandleFetch({}, 'getEmailDetails');
 

    useEffect(() => {
      const getEmailConfiguration = async () => {
          const res = await handleGetEmailListFetch({
              urlOptions: {
                  placeHolders: {
                      id: id
                  }
              }
          });
          // @ts-ignore
      
      }; 
      getEmailConfiguration(); 
    }, []); 

    console.log('getEmailDetailState',getEmailDetailState)


    return (
        <>
              {getEmailDetailState.isLoading && (
                <>


        <div style={{
            width: '100%',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            margin:'150px 0'
        }}>
             <Spin size='large' />
        </div>

               
                </>
            )}


            {getEmailDetailState.done 
            && getEmailDetailState.data
             && Object.keys(getEmailDetailState.data).length > 0 && (
                 <>
                         <div className='inboxEmailDetails'>
            <div 
            onClick={() => setSelectedEmailId('')}
            className='inboxEmailDetails__backBtn'>
                    <LeftOutlined />
            </div>
            <div className='inboxEmailDetails__header'>
                <span>
                {getEmailDetailState['data']['subject']}
                </span>
                <h3>
                    {getEmailDetailState['data']['recipient']}
                </h3>
                <h4>
                {getEmailDetailState['data']['time'] && moment(getEmailDetailState['data']['time']).format('MMMM Do YYYY, h:mm:ss a')}
                </h4>
            </div>
            <div className='inboxEmailDetails__body'>
            {getEmailDetailState['data']['html'] && ReactHtmlParser(getEmailDetailState['data']['html'])}
            </div>
        </div>
                 </>
             )}

        </>

    )
}

export default InboxEmailDetails
