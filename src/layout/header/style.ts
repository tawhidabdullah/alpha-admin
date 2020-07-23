import styled from 'styled-components';
import { Layout } from 'antd';
const { Header } = Layout;


const HeaderStyle = styled(Header)`
background: '#fff',
height: '60px',
display: 'flex',
justifyContent: 'space-between',
boxShadow: '0 0.46875rem 2.1875rem rgba(8,10,37,.03), 0 0.9375rem 1.40625rem rgba(8,10,37,.03), 0 0.25rem 0.53125rem rgba(8,10,37,.05), 0 0.125rem 0.1875rem rgba(8,10,37,.03)',
zIndex: 10,
transition: ' all .2s',
alignItems: 'center',
alignContent: 'center'
`

const Title = styled.h2`
color: '#0072EA', marginTop: '10px', marginLeft: '-20px'
`


export {
    HeaderStyle,
    Title
}