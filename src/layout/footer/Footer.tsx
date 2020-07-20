import React from 'react';

// import libraries
import { Layout } from 'antd';

const { Footer } = Layout;


interface Props {

}

const FooterComponent = (props: Props) => {
    return (
        <Footer style={{ textAlign: 'center', background: '#fafafa', color: '#1890ff' }}>
            © 2020 The Admin - Developed By Lotus Technology Development.
        </Footer>
    )
}

export default FooterComponent
