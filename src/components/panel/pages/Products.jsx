import React, { useContext, useEffect, useState } from "react";
import callApi from "../../../core/ApiMethods";
import { Alert, Badge, Button, Container, Spinner } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faPenToSquare,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { CartContext } from "../../../App";
import fallbackImg from "../../../assets/no-result.png";

function Products() {
  // make a state for holding products
  const [products, setProducts] = useState([]);
  // make a state that holds all products categories data that comes from an api
  const [categories, setCategories] = useState([]);
  // state for check which operation is going to happen "CREATE OR EDIT"
  const [modalHeading, setModalHeading] = useState("Create");
  // state for holdin product id's so that helpful in api call
  const [productId, setProductId] = useState({
    productApiId: null,
    productLocalId: null,
  });
  // state object that holds form input data
  const [formData, setFormData] = useState({
    productName: "",
    productImage: "",
    productDescription: "",
    selectedCategory: "",
  });
  // state for open and close modals
  const [modal, setModal] = useState({
    addModal: false,
    deleteModal: false,
  });
  // make a state for store error and display them
  const [error, setError] = useState({
    display: false,
    message: "",
  });
  // state for loader
  const [loader, setLoader] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState({});
  // state for cart. that will help in api call
  const [cart, setCart] = useState({ products: [] });
  // Access cartArr from the context
  const { cartArr, setCartArr } = useContext(CartContext);

  const { productDescription, productImage, productName, selectedCategory } =
    formData;
  const { display, message } = error;
  const { productApiId, productLocalId } = productId;
  const { addModal, deleteModal } = modal;

  useEffect(() => {
    // call products categories api and store into state
    callApi("GET", "products/categories").then((res) => {
      if (res.length !== 0) {
        setCategories(res);
      }
    });
  }, []);
  /**
   * make a method that stores form input value into state
   * @param {*} evnet input evnet
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // check basic validation
    if (
      productDescription === "" ||
      productImage === "" ||
      productName === "" ||
      selectedCategory === ""
    ) {
      setError({
        display: true,
        message: "Please fill all the fields.",
      });
    } else {
      setError({
        display: false,
        message: "",
      });
      // make a payload
      let payload = {
        title: productName,
        description: productDescription,
        image: productImage,
        category: selectedCategory,
      };
      if (modalHeading === "Create") {
        setLoader(true);
        callApi("POST", "products", payload).then((res) => {
          const { id, title, description, image, category } = res;
          let ResObj = {
            id,
            title,
            description,
            image,
            category,
            randomId: Math.floor(Math.random() * 91919191),
          };
          setProducts([...products, ResObj]);
          setLoader(false);
        });
      } else {
        setLoader(true);
        callApi("PUT", `products/${productApiId}`, payload)
          .then((res) => {
            const { id, title, description, image, category } = res;
            const updatedProduct = {
              id,
              title,
              description,
              image,
              category,
              randomId: productLocalId, // Use the same randomId as the productLocalId
            };

            const updatedProducts = products.map((product) =>
              product.randomId === productLocalId ? updatedProduct : product
            );
            setProducts(updatedProducts);
            setLoader(false);
          })
          .catch((error) => {
            console.error("Error editing product: ", error);
          });
      }

      setFormData({
        productDescription: "",
        productImage: "",
        productName: "",
        selectedCategory: "",
      });
      handleClose();
    }
  };
  /**
   * Add to cart Handler
   * @param {*} item which product is clicked
   */
  const addToCartHandler = (item) => {
    const productId = item.randomId;

    // Check if the product already exists in the cart
    const existingProduct = cart.products.find(
      (product) => product.productId === productId
    );

    if (existingProduct) {
      // If the product already exists, update its quantity
      existingProduct.quantity += 1;
      // Update cartArr with the updated quantity
      const updatedCartArr = cartArr.map((productForDisplay) => {
        if (productForDisplay.productId === productId) {
          return {
            ...productForDisplay,
            quantity: existingProduct.quantity,
          };
        }
        return productForDisplay;
      });
      setCartArr(updatedCartArr);
    } else {
      // If it's a new product, add it to the cart
      const newProduct = {
        productId,
        quantity: 1,
      };
      cart.products.push(newProduct);

      // Add the new product to cartArr with title, image, and quantity
      const newProductForDisplay = {
        productId,
        title: item.title,
        image: item.image,
        quantity: 1,
      };
      setCartArr((prevCartArr) => [...prevCartArr, newProductForDisplay]);
    }

    // Define the payload for the API call
    const apiPayload = {
      userId: 5, // Replace with the actual user ID
      date: new Date().toISOString(),
      products: cart.products,
    };

    // Make the API call to add/update the item in the cart
    callApi("POST", "carts", apiPayload)
      .then((res) => {
        // Update the cart in state if the API call was successful
        setCart((prevCart) => ({
          ...prevCart,
          products: cart.products,
        }));
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  /**
   * Edit cart Handler
   * @param {*} val which product is clicked
   */
  const editProductHandler = (val) => {
    const { id, title, description, image, category, randomId } = val;
    setModalHeading("Edit");
    setProductId({
      productApiId: id,
      productLocalId: randomId,
    });
    handleShow();
    setFormData({
      productDescription: description,
      productImage: image,
      productName: title,
      selectedCategory: category,
    });
  };
  /**
   * Delete Product
   */
  const deleteProductHandler = () => {
    setLoader(true);
    callApi("DELETE", `products/${deleteProduct.id}`)
      .then((res) => {
        const updatedProducts = products.filter(
          (val) => val.randomId !== deleteProduct.randomId
        );
        setProducts(updatedProducts);
        setModal({ ...modal, deleteModal: false });
        setDeleteProduct({});
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error deleting product: ", error);
      });
  };
  // for closing modal
  const handleClose = () =>
    setModal({
      ...modal,
      addModal: false,
    });
  // for showing modal
  const handleShow = () => {
    setModal({
      ...modal,
      addModal: true,
    });
    setError({
      display: false,
      message: "",
    });
  };
  return (
    <div className="product-wrapper">
      <div
        style={{
          width: "20%",
          position: "fixed",
          left: 0,
          height: "100%",
          backgroundColor: "#2E2E2E",
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Center the content vertically
          justifyContent: "center", // Center the content horizontally
        }}
      >
        <Button
          onClick={() => {
            setModalHeading("Create");
            handleShow();
          }}
          size="lg"
          variant="outline-light"
        >
          Create Product <FontAwesomeIcon icon={faPlus} />
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginLeft: "20%",
        }}
        className="products-display"
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {products.length !== 0 && loader === false ? (
            products.map((val, index) => (
              <div
                key={index}
                className="card"
                style={{
                  width: "18rem",
                  display: "inline-block",
                  margin: "1em",
                }}
              >
                <Badge bg="primary">{val.category}</Badge>

                <img
                  style={{ height: "250px" }}
                  src={val.image}
                  className="card-img-top"
                  alt="..."
                />

                <div className="card-body">
                  <h5
                    style={{
                      maxHeight: "60px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    className="card-title"
                  >
                    {val.title}
                  </h5>
                  <p
                    style={{
                      height: "50px",
                      overflow: "hidden",
                      textAlign: "justify",
                      color: "gray",
                    }}
                    className="card-text"
                  >
                    {val.description}
                  </p>
                </div>
                <div className="card-footer">
                  <div className="d-flex justify-content-between">
                    <button
                      onClick={() => editProductHandler(val)}
                      className="btn btn-warning"
                      type="button"
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button
                      onClick={() => addToCartHandler(val)}
                      className="btn btn-primary"
                      type="button"
                    >
                      Add To Cart <FontAwesomeIcon icon={faCartShopping} />
                    </button>
                    <button
                      onClick={() => {
                        setModal({ ...modal, deleteModal: true });
                        setDeleteProduct(val);
                      }}
                      className="btn btn-danger"
                      type="button"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : loader === true ? (
            <div className="mt-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <img
              style={{ width: "100%" }}
              className="mt-5"
              src={fallbackImg}
              alt="Fallback"
            />
          )}
        </div>
      </div>

      {/* ---Modal--- */}
      <Modal backdrop={"static"} show={addModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalHeading} Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="productName"
                placeholder="Enter product name"
                value={formData.productName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="text"
                name="productImage"
                placeholder="Enter product image url"
                value={formData.productImage}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                as="textarea"
                name="productDescription"
                aria-label="With textarea"
                placeholder="Enter product description"
                value={formData.productDescription}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Product Categories</Form.Label>
              <Form.Select
                aria-label="Default select example"
                name="selectedCategory"
                value={formData.selectedCategory}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select Product Categories
                </option>
                {categories.map((val, index) => (
                  <option key={index} value={val}>
                    {val}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
          {/* <Form>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Product Name</Form.Label>
              <Form.Control type="text" placeholder="Enter product name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Product Image</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                as="textarea"
                aria-label="With textarea"
                placeholder="Enter product description"
              />
            </Form.Group>
            <Form.Select aria-label="Default select example">
              <option selected disabled>
                Select Product Categories
              </option>
              {categories.map((val) => (
                <option value={val}>{val}</option>
              ))}
            </Form.Select>
          </Form> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
        <div>
          {display && (
            <Alert style={{ margin: "1em" }} variant="warning">
              {message}
            </Alert>
          )}
        </div>
      </Modal>
      {/* Delete Modal */}
      <Modal
        backdrop="static"
        show={deleteModal}
        onHide={() => {
          setModal({ ...modal, deleteModal: false });
          setDeleteProduct({});
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this{" "}
          <span className="fw-bold">{deleteProduct.title}</span> product ?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setModal({ ...modal, deleteModal: false });
              setDeleteProduct({});
            }}
          >
            Close
          </Button>
          <Button variant="danger" onClick={deleteProductHandler}>
            Delete <FontAwesomeIcon icon={faTrash} />
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Products;
