import logo from './logo.svg';
import './App.css';

import { Provider } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap';
import StockList from './stocks/StockList';
import WealthNavbar from './home/WealthNavbar';
import store from './store'

function App() {
  

  return (
    <Provider store={ store }>
      <Container className="my-2" fluid="xl">
        <Row className="mb-2">
          <Col><WealthNavbar /></Col>
        </Row>
        <Row>
          <Col><StockList /></Col>
        </Row>
      </Container>
    </Provider>
  );
}

export default App;
