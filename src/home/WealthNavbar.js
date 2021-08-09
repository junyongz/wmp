import { Nav, Navbar, Form, FormControl } from 'react-bootstrap';

export default function WealthNavbar() {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand href="#home">Wealth Management Pool</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#home">Exchange Rate</Nav.Link>
                    <Nav.Link href="#link">Show Chart</Nav.Link>
                </Nav>
                <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                </Form>
            </Navbar.Collapse>
        </Navbar>
    )
};