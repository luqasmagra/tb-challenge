import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Spinner } from 'react-bootstrap';
import Header from './components/Header';
import FileFilter from './components/FileFilter';
import FileTable from './components/FileTable';
import { fetchFilesData, fetchFilesList } from './store/filesSlice';

function App() {
  console.log('App rendered');

  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.files);

  useEffect(() => {
    dispatch(fetchFilesList());
    dispatch(fetchFilesData());
  }, [dispatch]);

  return (
    <div>
      <Header />
      <Container fluid className='mt-4 px-3 px-md-5'>
        <FileFilter />
        {loading && <Spinner animation='border' role='status'></Spinner>}
        {error && <p className='text-danger'>{error}</p>}
        {!loading && !error && <FileTable data={data} />}
      </Container>
    </div>
  );
}

export default App;
