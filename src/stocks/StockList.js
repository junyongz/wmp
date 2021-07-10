import { useState, useEffect, useReducer } from 'react'
import axios from 'axios'

import { useSelector, useDispatch } from 'react-redux'
import { Container, Row, Col, Table, Button } from 'react-bootstrap'

import StockListItems from './StockListItems'
import StockAddingModal from './StockAddingModal'
// import { add } from '../features/stockSlicer'

const stockReducer = (state, action) => {
    switch (action.type) {
        case 'add':
            return [ ...state, action.stock ];

        case 'all':
            return action.allStocks;
        
        default:
            throw new Error('no type provide: ' + action);
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
        axios.get("http://localhost:8080/stocks", {headers: {"content-type": "application/json"}})
            .then(res => {
                const allStocks = res.data;
                dispatch({ type:'all', allStocks: allStocks});
            })
            .catch((err) => {
                console.error("failed to get all stocks", err);
            })
    }, []);

    // stocks
    const [items, dispatch] = useReducer(stockReducer, []);

    // const items = useSelector((state) => state.stock.items);
    // const dispatch = useDispatch()

    // modal
    const [show, setShow] = useState(false);

    return (
        <Container fluid="xl">
            <Row>
                <Col>
                    <StockAddingModal show={show} setShow={setShow} items={items} dispatch={dispatch}/>
                </Col>
            </Row>
            <Row className="mb-2 float-right">
                <Col>
                    <Button onClick={ () => setShow(true) } variant="dark">Invest</Button>
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
                            <StockListItems items={ items }/>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}