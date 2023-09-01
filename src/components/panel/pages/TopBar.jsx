import React, { useContext, useEffect, useState } from "react";
import { Navbar, Nav, Button, Modal, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserAlt,
  faSignOutAlt,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons"; // Import the specific icons you need
import logo from "../../../assets/logo.png";
import { CartContext } from "../../../App";
import jwt_decode from "jwt-decode";
import fallback from "../../../assets/empty-cart.png";
import { useNavigate } from "react-router-dom";
function TopBar() {
  // Access cartArr from the context
  const { cartArr, setCartArr } = useContext(CartContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [user, setUser] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Example JWT token (replace with your token)
    const jwtToken = sessionStorage.getItem("user_token");

    try {
      // Decode the JWT token
      const decodedToken = jwt_decode(jwtToken);
      // Now, you can use the user information as needed
      setUser(decodedToken.user);
    } catch (error) {
      console.error("JWT Error:", error.message);
    }
  }, []);

  const logoutHandler = () => {
    sessionStorage.removeItem("user_token");
    navigate("/auth/login");
  };

  const navbarStyle = {
    backgroundColor: "#171717",
    // Add any other styles you need here
  };

  return (
    <div>
      <Navbar fixed="top" style={navbarStyle} expand="lg">
        <div className="container-fluid">
          <Navbar.Brand href="#0">
            <img style={{ width: "4em" }} src={logo} alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarSupportedContent" />
          <Navbar.Collapse id="navbarSupportedContent">
            <Nav className="me-auto mb-2 mb-lg-0">
              <Button onClick={handleShow} variant="outline-light">
                Cart <FontAwesomeIcon icon={faCartShopping} />
                &nbsp;{cartArr.length}
              </Button>
            </Nav>
            <Nav className="fw-bold text-white text-center me-3">
              <Nav.Item>
                Welcome,&nbsp;
                <FontAwesomeIcon icon={faUserAlt} />
                &nbsp; {user}
              </Nav.Item>
            </Nav>
            <Nav className="mt-2 mb-lg-0">
              <Button onClick={logoutHandler} variant="danger">
                <FontAwesomeIcon icon={faSignOutAlt} />
                &nbsp;Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>

      <Modal backdrop="static" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Your Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cartArr.length !== 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {cartArr.map((item) => (
                  <tr key={item.productId}>
                    <td>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: "50px", height: "50px" }}
                      />
                    </td>
                    <td>{item.title}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div>
              <img style={{ width: "100%" }} src={fallback} alt="fallback" />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TopBar;
