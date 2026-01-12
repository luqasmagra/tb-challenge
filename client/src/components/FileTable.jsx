import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function FileTable({ data }) {
  const { selectedFile } = useSelector((state) => state.files);

  if (!data || data.length === 0) {
    return <p className='text-muted'>No data available</p>;
  }

  const rows = data.flatMap((file) =>
    file.lines.map((line, index) => ({
      id: `${file.file}-${index}`,
      fileName: file.file,
      ...line,
    }))
  );

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          {!selectedFile && <th>File Name</th>}
          <th>Text</th>
          <th>Number</th>
          <th>Hex</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {!selectedFile && <td>{row.fileName}</td>}
            <td>{row.text}</td>
            <td>{row.number}</td>
            <td>{row.hex}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default FileTable;
