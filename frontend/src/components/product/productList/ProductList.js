import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaSearch, FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import styles from "./productList.module.scss";
import {
  FILTER_PRODUCTS,
  selectFilteredPoducts,
} from "../../../redux/features/product/filterSlice";
import {
  deleteProduct,
  getProducts,
} from "../../../redux/features/product/productSlice";

const ProductList = ({ products = [], isLoading = false }) => {
  const [search, setSearch] = useState("");
  const filteredProducts = useSelector(selectFilteredPoducts);

  const dispatch = useDispatch();

  const shortenText = (text, n) => {
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat("...");
      return shortenedText;
    }
    return text;
  };

  const delProduct = async (id) => {
    console.log(id);
    await dispatch(deleteProduct(id));
    await dispatch(getProducts());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete Product",
      message: "Are you sure you want to delete this product.",
      buttons: [
        {
          label: "Delete",
          onClick: () => delProduct(id),
        },
        {
          label: "Cancel",
          // onClick: () => alert('Click No')
        },
      ],
    });
  };

  //   Begin Pagination
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    setCurrentItems(filteredProducts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredProducts.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, filteredProducts]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);
  };


  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search }));
  }, [products, search, dispatch]);

  return (
    <div className={styles['product-list-container']}>
      <div className={styles['product-list-header']}>
        <h3>Inventory Items</h3>
        <div className={styles['search-box']}>
          <FaSearch className={styles['search-icon']} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles['search-input']}
          />
        </div>
      </div>

      {isLoading ? (
        <div className={styles['loading-state']}>
          <div className={styles.spinner}></div>
        </div>
      ) : products.length === 0 ? (
        <div className={styles['empty-state']}>
          <p>No products found. Add your first product to get started.</p>
        </div>
      ) : (
        <div className={styles['product-list']}>
          <div className={styles['table-header']}>
            <div className={styles.row}>
              <div className={styles.cell}>Name</div>
              <div className={styles.cell}>Category</div>
              <div className={styles.cell}>Price</div>
              <div className={styles.cell}>Quantity</div>
              <div className={styles.cell}>Value</div>
              <div className={`${styles.cell} ${styles.actions}`}>Actions</div>
            </div>
          </div>
          
          <div className={styles['table-body']}>
            {currentItems.map((product) => {
              const { _id, name, category, price, quantity, image } = product;
              const productValue = (price * quantity).toFixed(2);
              
              return (
                <div className={styles['table-row']} key={_id} data-id={_id}>
                  <div className={styles.cell} data-label="Name">
                    <div className={styles['product-info']}>
                      {image?.url ? (
                        <img 
                          src={image.url} 
                          alt={name} 
                          className={styles['product-image']}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/40';
                          }}
                        />
                      ) : (
                        <div className={styles['product-image-placeholder']}>
                          {name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className={styles['product-name']}>{name}</span>
                    </div>
                  </div>
                  <div className={styles.cell} data-label="Category">
                    <span className={styles['category-badge']}>{category}</span>
                  </div>
                  <div className={styles.cell} data-label="Price">
                    ${parseFloat(price).toFixed(2)}
                  </div>
                  <div className={`${styles.cell} ${quantity <= 10 ? styles['low-stock'] : ''}`} data-label="Quantity">
                    {quantity} {quantity <= 10 && <span className={styles['stock-warning']}>Low</span>}
                  </div>
                  <div className={styles.cell} data-label="Value">
                    ${productValue}
                  </div>
                  <div className={`${styles.cell} ${styles.actions}`} data-label="Actions">
                    <div className={styles['action-buttons']}>
                      <Link 
                        to={`/product-detail/${_id}`} 
                        className={`${styles['action-btn']} ${styles.view}`}
                        title="View details"
                      >
                        <FaEye />
                      </Link>
                      <Link 
                        to={`/edit-product/${_id}`} 
                        className={`${styles['action-btn']} ${styles.edit}`}
                        title="Edit product"
                      >
                        <FaEdit />
                      </Link>
                      <button 
                        onClick={() => confirmDelete(_id)}
                        className={`${styles['action-btn']} ${styles.delete}`}
                        title="Delete product"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {pageCount > 1 && (
            <div className={styles['pagination-container']}>
              <button 
                onClick={() => handlePageClick({ selected: Math.max(0, (itemOffset / itemsPerPage) - 1) })}
                disabled={itemOffset === 0}
                className={`${styles['pagination-button']} ${styles.prev}`}
              >
                Previous
              </button>
              
              <div className={styles['page-numbers']}>
                {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                  const page = Math.max(0, Math.min(pageCount - 5, Math.floor(itemOffset / itemsPerPage) - 2)) + i;
                  if (page < 0 || page >= pageCount) return null;
                  
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageClick({ selected: page })}
                      className={`${styles['page-number']} ${itemOffset === page * itemsPerPage ? styles.active : ''}`}
                    >
                      {page + 1}
                    </button>
                  );
                })}
                
                {pageCount > 5 && (
                  <span className={styles['page-ellipsis']}>...</span>
                )}
              </div>
              
              <button 
                onClick={() => handlePageClick({ selected: (itemOffset / itemsPerPage) + 1 })}
                disabled={itemOffset + itemsPerPage >= filteredProducts.length}
                className={`${styles['pagination-button']} ${styles.next}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
