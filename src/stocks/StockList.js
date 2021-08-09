import { useState, useEffect, useReducer } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { Container, Row, Col, Table, Button } from 'react-bootstrap'

import StockListItems from './StockListItems'
import StockAddingModal from './StockAddingModal'
import StockViewModal from './StockViewModal'
// import { add } from '../features/stockSlicer'

const stockReducer = (state, action) => {
    switch (action.type) {
        case 'add':
            return [ ...state.filter( stock => stock.id !== action.stock.id ), action.stock ];

        case 'all':
            return action.allStocks;
        
        default:
            throw new Error('no type provided: ' + action);
    }
}

/* sample data
const stocks = [
    {
        code: "G3B.SI", name: "STI ETF", marketPlace: "SGX", currency: "SGD",
        marketValue: "30000", investedAmount: "25000",
        investedUnit: "10000", marketUnitPrice: "3", investedUnitPrice: "2.5"
    },
    {
        code: "CLR.SI", name: "Lion Phillip S-REIT", marketPlace: "SGX", currency: "SGD",
        marketValue: "40000", investedAmount: "50000",
        investedUnit: "10000", marketUnitPrice: "4", investedUnitPrice: "5"
    }
]; */

export default function StockList() {

    useEffect(() => {
        fetch('http://localhost:8080/stocks/', {
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            })
            .then(res => res.json())
            .then(allStocks => {
                dispatch({ type: "all", allStocks: allStocks });
            })
            .catch(err => {
                console.error('failed to get all stocks', err);
                alert(err);
            });
    }, []);

    // stocks
    const [items, dispatch] = useReducer(stockReducer, []);

    const [viewItem, setViewItem] = useState({});

    // const items = useSelector((state) => state.stock.items);
    // const dispatch = useDispatch()

    // modal
    const [show, setShow] = useState(false);

    const [showView, setShowView] = useState(false);

    return (
        <Container fluid="xl">
            <Row>
                <Col>
                    <StockAddingModal show={show} setShow={setShow} items={items} dispatch={dispatch}/>
                </Col>
                <Col>
                    <StockViewModal showView={showView} setShowView={setShowView} item={viewItem}/>
                </Col>
            </Row>
            <Row className="mb-2 float-right">
                <Col>
                    <Button onClick={ () => setShow(true) } variant="primary">Invest</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Market Place</th>
                            <th>Currency</th>
                            <th>Market Value</th>
                            <th>Invested Amount</th>
                            <th>Invested Unit (?)</th>
                            <th>Market Unit Price (?)</th>
                            <th>Invested Unit Price (?)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <StockListItems items={ items } showView={showView} 
                                setShowView={setShowView} setViewItem={ setViewItem }/>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}