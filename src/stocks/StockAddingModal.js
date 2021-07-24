import { useState, useRef, useCallback, useEffect } from 'react'
import { Modal, Form, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'

export default function StockAddingModal(props) {

    // for creating stock
    const { dispatch, show, setShow } = props;

    const getTodayDate = () => {
        const appendZeroIfOneDigit = (v) => {
            if (v.length == 1) {
                return "0" + v;
            }
            return v;
        };

        const todayDate = new Date();

        return todayDate.getFullYear() + "-" +
            appendZeroIfOneDigit((todayDate.getMonth()+1).toString()) + "-" +
            appendZeroIfOneDigit(todayDate.getDate().toString());
    }

    const initalState = {
        code: "", name: "", marketPlace: "SGX", currency: "SGD",
        marketValue: "", investedAmount: "",
        unitNumber: "", marketUnitPrice: "", investedUnitPrice: "", addedDate: getTodayDate()
    };

    // form
    const [formState, setFormState] = useState(initalState);    

    const [validated, setValidated] = useState(false);

    // the ref
    const formRef = useRef();

    // for the invested ref
    const investedAmountRef = useRef({value:undefined});
    const unitNumberRef = useRef({value:undefined});
    const investedUnitPriceRef = useRef({value:undefined});

    // for market value ref
    const marketValueRef = useRef({value:undefined});
    const marketUnitPriceRef = useRef({value:undefined});

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

        defaultingValues();
    }

    const defaultingValues = () => {
        const investedAmount = investedAmountRef.current;
        const unitNumber = unitNumberRef.current;

        const investedUnitPrice = investedUnitPriceRef.current;

        if (investedAmount && investedAmount.value && unitNumber && unitNumber.value) {
            investedUnitPrice.value = investedAmount.value / unitNumber.value;

            setFormState(prevState => ({...prevState, [investedUnitPrice.name]: investedUnitPrice.value}));
        }

        const marketValue = marketValueRef.current
        if (investedAmount && investedAmount.value && marketValue && !marketValue.value) {
            setTimeout(() => {
                marketValue.value = investedAmount.value
                setFormState(prevState => ({...prevState, [marketValue.name]: marketValue.value}));
            }, 1500)
        }

        const marketUnitPrice = marketUnitPriceRef.current
        if (investedUnitPrice && investedUnitPrice.value && marketUnitPrice && !marketUnitPrice.value) {
            setTimeout(() => {
                marketUnitPrice.value = investedUnitPrice.value
                setFormState(prevState => ({...prevState, [marketUnitPrice.name]: marketUnitPrice.value}));
            }, 1500)
        }
    };

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
                                    ref={ investedAmountRef } 
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
                                    ref={ unitNumberRef }
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
                                    ref={ investedUnitPriceRef }
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
                                    ref={ marketValueRef }
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
                                    ref={ marketUnitPriceRef }
                                    onChange={ handleChange }/>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs="4">
                            <Form.Group controlId="formAddedDate">
                                <Form.Label>Added Date (dd/MM/yyyy)</Form.Label>
                                <Form.Control type="date" 
                                    placeholder="Enter the date for this invested stock" 
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