import React, {useEffect, useState} from 'react'


// import hoooks
import { useHandleFetch } from "../../hooks";
import InboxEmailDetails from "./InboxEmailDetails";
import  {Spin} from 'antd'
import moment from 'moment'; 

import ReactHtmlParser from 'react-html-parser';

interface Props {
    
}

const Inbox = (props: Props) => {
    const [getEmailListState, handleGetEmailListFetch] = useHandleFetch({}, 'getSetEmailList');
    const [selectedEmailId,setSelectedEmailId] = useState(''); 


    useEffect(() => {
      const getEmailConfiguration = async () => {
          const res = await handleGetEmailListFetch({});
          // @ts-ignore
      
      }; 
      getEmailConfiguration(); 
    }, [])


    console.log('getEmailListState',getEmailListState)

    return (
        <>
            {getEmailListState.isLoading && (
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


{getEmailListState.done && getEmailListState.data && getEmailListState.data.length > 0 && (
    <>
    
    <div className='sentEmailListContainer'>
        
            {!selectedEmailId && (
                <>
                     {getEmailListState.done && getEmailListState.data && getEmailListState.data.length > 0 && (
            <>
            {getEmailListState.data.map(item => {
                return (
                    <div 
                    onClick={() => setSelectedEmailId(item.id)}
                    className="sentEmailListContainer__item">
                    <div className='sentEmailListContainer__item-info'>
                        <h3>
                        To: {` ${item.recipient}`}
                      </h3>
                      <span>
                      {`${item.subject}`}
                      </span>
                    </div>
                    
                    <h4>
                    {ReactHtmlParser(item.html.substring(0, 125) + '.....')}
                    </h4>
                    <h3>
                    {item.time && moment(item.time).format('MMMM Do, h a')}
                    </h3>
                </div>
                )
            })}
            </>
        )}
                </>
            )}


            {selectedEmailId && (
                <>
                <InboxEmailDetails 
                setSelectedEmailId={setSelectedEmailId}
                id={selectedEmailId} />
                </>
            )}

    </div>
    </>
)}
        </>


    )
}

export default Inbox
