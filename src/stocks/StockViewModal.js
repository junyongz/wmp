import './StockViewModal.css';

import { useEffect, useState, useRef } from 'react'
import { Modal, Container, Row, Col, Button } from 'react-bootstrap'
import DividendAddingModal from './DividendAddingModal';
import StockHistoriesViewModal from './StockHistoriesViewModal';

export default function StockViewModal(props) {

    // for creating stock
    const { item, showView, setShowView } = props;

    const [dividendAmount, setDividendAmount] = useState(0.0);
    const [dividendCurrency, setDividendCurrency] = useState('');

    const [showDividendAdd, setShowDividendAdd] = useState(false);

    const [showStockHistoriesView, setShowStockHistoriesView] = useState(false);

    const modalRef = useRef();

    const reduceParentZIndex = () => {
        if (modalRef && modalRef.current) {
            modalRef.current._modal.dialog.classList.add('modal-over-modal')
        }
    }

    const restoreParentZIndex = () => {
        if (modalRef && modalRef.current) {
            modalRef.current._modal.dialog.classList.remove('modal-over-modal')
        }
    }

    const {
        code, name, marketPlace, currency,
        marketValue, investedAmount,
        unitNumber, marketUnitPrice, investedUnitPrice, addedDate
    } = item;

    // model events
    const handleClose = () => {
        setShowView(false);
    };

    const dividendAdded = (divd) => {
        setDividendAmount(dividendAmount + divd.amount);
        if (dividendCurrency === '') {
            setDividendCurrency(divd.currency);
        }
    }

    // fetch data
    useEffect(() => {
        if (item.id) {
            fetch('http://localhost:8080/stocks/' + item.id + '/dividends', {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(dividends => {
                let calcDividendCurrency = '';
                let calcDividendAmount = 0.0;
                dividends.forEach((div, i) => {
                    // should group by currency??
                    calcDividendCurrency = div.currency;
                    calcDividendAmount += div.amount;
                })
                setDividendCurrency(calcDividendCurrency);
                setDividendAmount(calcDividendAmount);
            })
        }
    }, [item])

    return (
        <Modal ref={ modalRef } show={ showView } onHide={ handleClose } animation={ false } size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{code} ({name})</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row><Col><DividendAddingModal 
                                    showDividendAdd={showDividendAdd} 
                                    setShowDividendAdd={setShowDividendAdd} 
                                    dividendAdded={dividendAdded} 
                                    reduceParentZIndex={reduceParentZIndex}
                                    restoreParentZIndex={restoreParentZIndex}
                                    stock={item}/></Col></Row>
                    <Row><Col><StockHistoriesViewModal 
                                    showStockHistoriesView={showStockHistoriesView} 
                                    setShowStockHistoriesView={setShowStockHistoriesView} 
                                    reduceParentZIndex={reduceParentZIndex}
                                    restoreParentZIndex={restoreParentZIndex}
                                    stock={item}/></Col></Row>
                    <Row className="shadow-sm">
                        <Col>
                            <p>Code</p>
                            <p class="font-weight-bold">{code}</p>
                        </Col>
                        <Col>
                            <p>Name</p>
                            <p class="font-weight-bold">{name}</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs="4">
                            <p>Currency</p>
                            <p class="font-weight-bold">{currency}</p>
                        </Col>
                        <Col>
                            <p>Market Place</p>
                            <p class="font-weight-bold">{marketPlace}</p>
                        </Col>
                    </Row>

                    <Row className="shadow-sm">
                        <Col>
                            <p>Invested Amount $</p>
                            <p class="font-weight-bold">{investedAmount}</p>
                        </Col>
                        <Col>
                            <p>Invested Unit</p>
                            <p class="font-weight-bold">{unitNumber}</p>
                        </Col>
                        <Col>
                            <p>Invested Unit Price $</p>
                            <p class="font-weight-bold">{investedUnitPrice}</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <p>Market Value $</p>
                            <p class="font-weight-bold">{marketValue}</p>
                        </Col>
                        <Col>
                            <p>Market Unit Price $</p>
                            <p class="font-weight-bold">{marketUnitPrice}</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <p>Added Since</p>
                            <p class="font-weight-bold">{new Date(addedDate).toDateString()}</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <p>Total Dividends $ ({ dividendCurrency })</p>
                            <p class="font-weight-bold">{ dividendAmount }</p>
                        </Col>
                    </Row>

                </Container>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={ () => setShowStockHistoriesView(true) }>
                View Histories
            </Button>
            <Button variant="primary" onClick={ () => setShowDividendAdd(true) }>
                Add Dividend
            </Button>
            <Button variant="link" onClick={ handleClose }>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
    )
}