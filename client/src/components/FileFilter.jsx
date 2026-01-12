import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedFile, fetchFilesData } from '../store/filesSlice';

function FileFilter() {
  const dispatch = useDispatch();
  const { filesList, selectedFile, loading } = useSelector(
    (state) => state.files
  );

  function handleChange(e) {
    const fileName = e.target.value || null;
    dispatch(setSelectedFile(fileName));
    dispatch(fetchFilesData(fileName));
  }

  return (
    <Form.Group className='mb-3 col-12 col-md-4'>
      <Form.Label>Filter by file</Form.Label>
      <Form.Select
        disabled={loading}
        value={selectedFile || ''}
        onChange={handleChange}
      >
        <option value=''>All files</option>
        {filesList.map((file) => (
          <option key={file} value={file}>
            {file}
          </option>
        ))}
        <option value='Error file'>Error file</option>
      </Form.Select>
    </Form.Group>
  );
}

export default FileFilter;
