import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import OrderDetails from './pages/OrderDetails';
import UserList from './pages/admin/UserList';
import UserEdit from './pages/admin/UserEdit';
import ProductList from './pages/admin/ProductList';
import ProductEdit from './pages/admin/ProductEdit';
import OrderList from './pages/admin/OrderList';
import VendorDashboard from './pages/vendor/VendorDashboard';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order/:id" element={<OrderDetails />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              {/* Vendor Routes */}
              <Route path="vendor/dashboard" element={<VendorDashboard />} />
              {/* Admin Routes */}
              <Route path="admin/userlist" element={<UserList />} />
              <Route path="admin/user/:id/edit" element={<UserEdit />} />
              <Route path="admin/productlist" element={<ProductList />} />
              <Route path="admin/product/:id/edit" element={<ProductEdit />} />
              <Route path="admin/orderlist" element={<OrderList />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
