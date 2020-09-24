import React, { useEffect, useState } from 'react';

// import hoooks
import { useHandleFetch } from '../../hooks';
import InboxEmailDetails from './InboxEmailDetails';
import { Spin, Empty } from 'antd';
import moment from 'moment';

import ReactHtmlParser from 'react-html-parser';

interface Props {
  emailList?: any;
  setEmailList?: any;
  getEmailListState?: any;
}

const Inbox = ({ emailList, setEmailList, getEmailListState }: Props) => {
  const [selectedEmailId, setSelectedEmailId] = useState('');

  console.log('getEmailListState', getEmailListState);

  return (
    <>
      {getEmailListState.isLoading && (
        <>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '150px 0',
            }}
          >
            <Spin size='large' />
          </div>
        </>
      )}

      {getEmailListState.done && emailList && !(emailList.length > 0) && (
        <>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '50px 0',
            }}
          >
            <Empty
              description='No SMS found'
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        </>
      )}

      {getEmailListState.done && emailList && emailList.length > 0 && (
        <>
          <div className='sentEmailListContainer'>
            {!selectedEmailId && (
              <>
                {getEmailListState.done && emailList && emailList.length > 0 && (
                  <>
                    {emailList.map((item) => {
                      return (
                        <div
                          onClick={() => setSelectedEmailId(item.id)}
                          className='sentEmailListContainer__item'
                        >
                          <div className='sentEmailListContainer__item-info'>
                            <h3>To: {` ${item.recipient}`}</h3>
                            <span>{`${item.event}`}</span>
                          </div>

                          <h4>
                            {item.text && item.text.substring(0, 125) + '.....'}
                          </h4>
                          <h3>
                            {item.time &&
                              moment(item.time).format('MMMM Do, h a')}
                          </h3>
                        </div>
                      );
                    })}
                  </>
                )}
              </>
            )}

            {selectedEmailId && (
              <>
                <InboxEmailDetails
                  setSelectedEmailId={setSelectedEmailId}
                  id={selectedEmailId}
                />
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Inbox;
