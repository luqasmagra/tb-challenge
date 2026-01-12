import { Navbar } from 'react-bootstrap';

function Header() {
  return (
    <Navbar style={{ backgroundColor: '#ff6b6b' }}>
      <Navbar.Brand className='text-white px-3'>React Test App</Navbar.Brand>
    </Navbar>
  );
}

export default Header;
