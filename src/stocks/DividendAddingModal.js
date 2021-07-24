import { useState, useRef } from 'react'
import { Modal, Form, Row, Col, Button } from 'react-bootstrap'

import getTodayDate from '../features/todayDate'

export default function DividendAddingModal(props) {

    // for creating dividend
    const { showDividendAdd, setShowDividendAdd, dividendAdded, stock } = props;

    const initalState = {
        stockId: stock.id, currency: "SGD", amount: "", addedDate: getTodayDate()
    };

    // form
    const [formState, setFormState] = useState(initalState);    

    const [validated, setValidated] = useState(false);

    const formRef = useRef(null);

    // model events
    const handleClose = () => {
        setValidated(false);
        setShowDividendAdd(false);
    };

    const handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setFormState(prevState => ({...prevState, [name]: value}));
    }

    // main saving event
    const saveChangeAndClose = () => {
        var form = formRef.current;
        if (form.checkValidity() === true) {
            fetch('http://localhost:8080/stocks/' + stock.id + "/dividends", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...formState}),
                mode: 'cors'
            })
            .then(res => res.json())
            .then(divd => {
                if (divd.id) {
                    // ok
                    dividendAdded(divd);
                }
                handleClose();
            })
            .catch(err => {
                console.error('failed to create dividend', err);
                alert(err);
            })
        }
        else {
            setValidated(true);
        }
    }

    return (
        <Modal show={ showDividendAdd } onHide={ handleClose } animation={ false } size="sm">
            <Modal.Header closeButton>
                <Modal.Title>Add Dividend</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form ref={ formRef } id="dividendForm" noValidate validated={ validated }>
                    <Row>
                        <Col>
                            <Form.Group controlId="formCurrency">
                            <Form.Label>Currency</Form.Label>
                                <Form.Control as="select" required
                                    placeholder="Enter Currency" 
                                    name="currency"
                                    defaultValue="SGD" 
                                    onChange={ handleChange }>
                                    <option>SGD</option>
                                    <option>USD</option>
                                    <option>MYR</option>
                                    <option>HKD</option>
                                    <option>CNY</option>
                                </Form.Control>   
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group controlId="formAmount">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="text" required
                                    placeholder="Enter dividend amount" 
                                    name="amount"
                                    value={formState.dividendAmount} 
                                    onChange={ handleChange }/>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group controlId="formAddedDate">
                                <Form.Label>Added Date (dd/MM/yyyy)</Form.Label>
                                <Form.Control type="date" 
                                    placeholder="Enter the date for this dividend" 
                                    name="addedDate"
                                    value={formState.addedDate} 
                                    onChange={ handleChange }/>
                            </Form.Group>
                        </Col>
                    </Row>

                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={ handleClose }>
                Close
            </Button>
            <Button variant="primary" onClick={ saveChangeAndClose }>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
    )
}