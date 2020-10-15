import React from 'react'
// import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';

// import {
//     DownloadOutlined,
//   } from '@ant-design/icons';

// const ExportExcel = ({csvData, fileName}) => {

//     const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
//     const fileExtension = '.xlsx';

//     const exportToExcel = (csvData, fileName) => {
//         const ws = XLSX.utils.json_to_sheet(csvData);
//         const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
//         const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//         const data = new Blob([excelBuffer], {type: fileType});
//         FileSaver.saveAs(data, fileName + fileExtension);
//     }; 

    

//     return (
//         <div
//         onClick={(e) => exportToExcel(csvData,fileName)}
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           marginRight: '25px',
//         }}
//       >
//        Export as Excel
//         <span
//           style={{
//             color: '#1890ff',
//             marginLeft: '10px',
//           }}
//         >
//           <DownloadOutlined />
//         </span>
//       </div>
//     )
// }

const ExportExcel = () => {
  return <> </>;
} 
export default ExportExcel; 