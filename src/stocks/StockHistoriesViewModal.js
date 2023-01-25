import { useState, useEffect } from 'react'

import { Modal, Container, Row, Col, Table } from 'react-bootstrap'

export default function StockHistoriesViewModal(props) {

    const { stock, reduceParentZIndex, restoreParentZIndex, showStockHistoriesView, setShowStockHistoriesView } = props;

    const [stockHistories, setStockHistories] = useState([]);

    const handleClose = () => {
        setShowStockHistoriesView(false);
        restoreParentZIndex();
    }

    useEffect(() => {
        fetch('http://localhost:8080/stocks/'+ stock.id +'/histories', {
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            })
            .then(res => res.json())
            .then(theStockHistories => {
                setStockHistories(theStockHistories);
            })
            .catch(err => {
                console.error('failed to get all stock histories', err);
                alert(err);
            });
    }, [stock.id]);

    return (
        <Modal show={ showStockHistoriesView } onShow={ reduceParentZIndex } onHide={ handleClose } animation={ false } size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Investment Histories</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid="xl">
                    <Row>
                        <Col>
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                    <th>#</th>
                                    <th>Date Added</th>
                                    <th>Market Value</th>
                                    <th>Invested Amount</th>
                                    <th>Invested Unit (?)</th>
                                    <th>Market Unit Price (?)</th>
                                    <th>Invested Unit Price (?)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stockHistories.map((v, i) => (
                                        <tr>
                                            <td>{i+1}</td>
                                            <td>{v.addedDate}</td>
                                            <td>{v.marketValue}</td>
                                            <td>{v.investedAmount}</td>
                                            <td>{v.unitNumber}</td>
                                            <td>{v.marketUnitPrice}</td>
                                            <td>{v.investedUnitPrice}</td>
                                        </tr>
                                    ))} 
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    )
}