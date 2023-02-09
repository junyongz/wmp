import { useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { Container, Row, Col, Table, Button } from 'react-bootstrap'

import StockListItems from './StockListItems'
import StockAddingModal from './StockAddingModal'
import StockViewModal from './StockViewModal'
import useStockFetcher from './useStockFetcher';
// import { add } from '../features/stockSlicer'

export default function StockList() {
    const {items, dispatch } = useStockFetcher();

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
                    <StockAddingModal { ...{ show, setShow, items, dispatch } } />
                </Col>
                <Col>
                    <StockViewModal { ...{ showView, setShowView, item: viewItem } } />
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
                            <StockListItems { ...{ items, showView, setShowView, setViewItem } }/>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}