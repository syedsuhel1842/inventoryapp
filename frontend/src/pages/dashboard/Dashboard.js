import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaBox, FaBoxes, FaDollarSign, FaExclamationTriangle } from "react-icons/fa";
import ProductList from "../../components/product/productList/ProductList";
import ProductSummary from "../../components/product/productSummary/ProductSummary";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { selectIsLoggedIn } from "../../redux/features/auth/authSlice";
import { getProducts } from "../../redux/features/product/productSlice";
import "./Dashboard.scss";

const Dashboard = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { products, isLoading, isError, message } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (isLoggedIn === true) {
      dispatch(getProducts());
    }

    if (isError) {
      console.log(message);
    }
  }, [isLoggedIn, isError, message, dispatch]);

  // Calculate summary values
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const lowStockItems = products.filter(product => product.quantity <= 10).length;
  const outOfStockItems = products.filter(product => product.quantity === 0).length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your inventory today.</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2><FaBox /> Total Products</h2>
          <div className="card-value">{totalProducts}</div>
          <div className="card-label">Items in your inventory</div>
        </div>
        
        <div className="dashboard-card">
          <h2><FaDollarSign /> Total Value</h2>
          <div className="card-value">${totalValue.toLocaleString()}</div>
          <div className="card-label">Total inventory value</div>
        </div>
        
        <div className="dashboard-card">
          <h2><FaExclamationTriangle /> Low Stock</h2>
          <div className="card-value" style={{ color: lowStockItems > 0 ? '#e67e22' : 'inherit' }}>
            {lowStockItems}
          </div>
          <div className="card-label">Items need restocking</div>
        </div>
        
        <div className="dashboard-card">
          <h2><FaBoxes /> Out of Stock</h2>
          <div className="card-value" style={{ color: outOfStockItems > 0 ? '#e74c3c' : 'inherit' }}>
            {outOfStockItems}
          </div>
          <div className="card-label">Items to reorder</div>
        </div>
      </div>
      
      <div className="dashboard-table">
        <div className="table-header">
          <h2>Recent Products</h2>
        </div>
        
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <h3>No Products Found</h3>
            <p>Get started by adding your first product to the inventory.</p>
          </div>
        ) : (
          <ProductList products={products} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
