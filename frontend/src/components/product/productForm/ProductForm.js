import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Card from "../../card/Card";

import "./ProductForm.scss";

const ProductForm = ({
  product,
  description,
  setDescription,
  handleInputChange,
  saveProduct,
}) => {
  return (
    <div className="add-product">
      <Card cardClass={"card"}>
        <form onSubmit={saveProduct}>
          <div className="form-group">
            <label>Product Name:</label>
            <input
              type="text"
              placeholder="Enter product name"
              name="name"
              value={product?.name || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Product Category:</label>
            <input
              type="text"
              placeholder="e.g., Electronics, Clothing"
              name="category"
              value={product?.category || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Product Price ($):</label>
            <input
              type="number"
              placeholder="0.00"
              name="price"
              min="0"
              step="0.01"
              value={product?.price || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Product Quantity:</label>
            <input
              type="number"
              placeholder="0"
              name="quantity"
              min="0"
              value={product?.quantity || ''}
              onChange={handleInputChange}
              required
            />
          </div>

<div className="form-group">
            <label>Product Description:</label>
            <div className="quill-wrapper">
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                modules={ProductForm.modules}
                formats={ProductForm.formats}
                placeholder="Enter detailed product description..."
              />
            </div>
          </div>

          <div className="form-group">
            <button type="submit" className="--btn --btn-primary --btn-block">
              Save Product
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

ProductForm.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
};

ProductForm.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "indent",
  "align",
];

export default ProductForm;
