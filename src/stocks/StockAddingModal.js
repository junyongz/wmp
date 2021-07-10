import { useState, useRef } from 'react'
import { Modal, Form, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'

export default function StockAddingModal(props) {

    // for creating stock
    const { dispatch, show, setShow } = props;

    const initalState = {
        code: "", name: "", marketPlace: "SGX", currency: "SGD",
        marketValue: "", investedAmount: "",
        unitNumber: "", marketUnitPrice: "", investedUnitPrice: "", addedDate: "2021-07-07"
    };

    // form
    const [formState, setFormState] = useState(initalState);    

    const [validated, setValidated] = useState(false);

    const formRef = useRef(null);

    // model events
    const handleClose = () => {
        setValidated(false);
        setShow(false);
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
            // call API then call dispatch to update UI
            axios.post('http://localhost:8080/stocks', {...formState}, {headers: {'content-type': 'application/json'}})
                .then(res => {
                    dispatch({ type: "add", stock: res.data });
                })
                .catch((err) => {
                    console.error("failed to save a stock", err);
                })
            
            setFormState({...initalState});
            handleClose();
        }
        else {
            setValidated(true);
        }
    }

    return (
        <Modal show={ show } onHide={ handleClose } animation={ false } size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Add New Stock</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form ref={ formRef } id="stockForm" noValidate validated={ validated }>
                    <Row>
                        <Col>
                            <Form.Group controlId="formCode">
                            <Form.Label>Code</Form.Label>
                            <Form.Control type="text" required
                                placeholder="Enter stock code" 
                                name="code"
                                value={formState.code} 
                                onChange={ handleChange }/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" required
                                placeholder="Enter stock name" 
                                name="name"
                                value={formState.name} 
                                onChange={ handleChange }/>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs="4">
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
                        <Col>
                            <Form.Group controlId="formMarketPlace">
                                <Form.Label>Market Place</Form.Label>
                                <Form.Control as="select" required
                                    placeholder="Enter market place" 
                                    name="marketPlace"
                                    defaultValue="SGX" 
                                    onChange={ handleChange }>
                                    <option value="SGX">Singapore Exchange</option>
                                    <option value="NYSE">New York Stock Exchange</option>
                                    <option value="NASD">Nasdaq Stock Exchange</option>
                                    <option value="SEHK">Hong Kong Stock Exchange</option>
                                    <option value="KLSE">Bursa Malaysia</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group controlId="formInvestedAmount">
                                <Form.Label>Invested Amount $</Form.Label>
                                <Form.Control type="text" required
                                    placeholder="Enter invested amount" 
                                    name="investedAmount"
                                    value={formState.investedAmount} 
                                    onChange={ handleChange }/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formInvestedUnit">
                                <Form.Label>Invested Unit</Form.Label>
                                <Form.Control type="text" 
                                    placeholder="Enter invested unit number" 
                                    name="unitNumber"
                                    value={formState.unitNumber} 
                                    onChange={ handleChange }/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formInvestedPrice">
                                <Form.Label>Invested Unit Price $</Form.Label>
                                <Form.Control type="text" 
                                    placeholder="Enter invested unit price" 
                                    name="investedUnitPrice"
                                    value={formState.investedUnitPrice} 
                                    onChange={ handleChange }/>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group controlId="formMarketValue">
                                <Form.Label>Market Value $</Form.Label>
                                <Form.Control type="text" 
                                    placeholder="Enter market value (can be empty if unit number provided)" 
                                    name="marketValue"
                                    value={formState.marketValue} 
                                    onChange={ handleChange }/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formMarketUnitProce">
                                <Form.Label>Market Unit Price $</Form.Label>
                                <Form.Control type="text" 
                                    placeholder="Enter market unit price" 
                                    name="marketUnitPrice"
                                    value={formState.marketUnitPrice} 
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