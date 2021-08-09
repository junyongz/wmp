import { useState, useRef, useEffect } from 'react'
import { Modal, Form, Row, Col, Button } from 'react-bootstrap'

import getTodayDate from '../features/todayDate'

export default function StockAddingModal(props) {

    // for creating stock
    const { dispatch, show, setShow } = props;

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

    const stockCodeRef = useRef({value:undefined});
    const stockNameRef = useRef({value:undefined});

    // for market
    const currencyRef = useRef({value:undefined});
    const marketPlaceRef = useRef({value:undefined});

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
    }

    let investedAmountValue = (investedAmountRef && investedAmountRef.current && investedAmountRef.current.value) || 0;
    let unitNumberValue = (unitNumberRef && unitNumberRef.current && unitNumberRef.current.value) || 0;
    let investedUnitPriceValue = (investedUnitPriceRef && investedUnitPriceRef.current && investedUnitPriceRef.current.value) || 0;
    useEffect(() => {
        let marketValueTimeout;
        const marketValue = marketValueRef.current
        if (investedAmountValue > 0 && marketValue && !marketValue.value) {
            marketValueTimeout = setTimeout(() => {
                marketValue.value = investedAmountValue
                setFormState(prevState => ({...prevState, [marketValue.name]: marketValue.value}));
            }, 1500)
        }

        let marketUnitPriceTimeout;
        const marketUnitPrice = marketUnitPriceRef.current
        if (investedUnitPriceValue > 0 && marketUnitPrice && !marketUnitPrice.value) {
            marketUnitPriceTimeout =  setTimeout(() => {
                marketUnitPrice.value = investedUnitPriceValue
                setFormState(prevState => ({...prevState, [marketUnitPrice.name]: marketUnitPrice.value}));
            }, 1500);
        }

        return (() => {
            clearTimeout(marketValueTimeout);
            clearTimeout(marketUnitPriceTimeout);
        })

    }, [investedAmountValue, investedUnitPriceValue])

    useEffect(() => {
        let investedUnitPriceTimeout;

        const investedUnitPrice = investedUnitPriceRef.current
        if (investedAmountValue > 0 && unitNumberValue > 0 && investedUnitPrice) {
            investedUnitPriceTimeout =  setTimeout(() => {
                investedUnitPrice.value = (investedAmountValue / unitNumberValue).toFixed(3);
                setFormState(prevState => ({...prevState, [investedUnitPrice.name]: investedUnitPrice.value}));
            }, 800);
        }

        return (() => {
            clearTimeout(investedUnitPriceTimeout);
        })

    }, [investedAmountValue, unitNumberValue])

    let stockCodeValue = (stockCodeRef && stockCodeRef.current && stockCodeRef.current.value) || 0;
    useEffect(() => {
        const marketPlaceValue = (marketPlaceRef && marketPlaceRef.current && marketPlaceRef.current.value) || 'SGX';

        const searchStockTimeout = setTimeout(() => {
            fetch('http://localhost:8080/stocks?search=by-code&code=' + stockCodeValue
                    + "&marketPlace=" + marketPlaceValue, {
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            })
            .then(res => res.json())
            .then(stock => {
                const stockName = stockNameRef.current;
                stockName.value = stock.name;
                setFormState(prevState => ({...prevState, [stockName.name]: stockName.value}))

                stockNameRef.current.disabled = true;
                currencyRef.current.disabled = true;
                marketPlaceRef.current.disabled = true;
            })
            .catch(err => {
                console.error('failed to find ', err)
            })
        }, 800);

        return () => {
            clearTimeout(searchStockTimeout);
        }
    }, [stockCodeValue]);

    // main saving event
    const saveChangeAndClose = () => {
        var form = formRef.current;
        if (form.checkValidity() === true) {
            // call API then call dispatch to update UI
            fetch('http://localhost:8080/stocks/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...formState}),
                mode: 'cors'
            })
            .then(res => res.json())
            .then(stock => {
                dispatch({ type: "add", stock: stock });
            })
            .catch(err => {
                console.error('failed to create stock', err);
                alert(err);
            })
            .finally(() => {
                setFormState({...initalState});
                handleClose();  
            })
        }
        else {
            setValidated(true);
        }
    }

    return (    
        <Modal show={ show } onHide={ handleClose } animation={ false } size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Invest Stock</Modal.Title>
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
                                ref= { stockCodeRef }
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
                                ref={ stockNameRef }
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
                                    ref={ currencyRef }
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
                                    ref={ marketPlaceRef }
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