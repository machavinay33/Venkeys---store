import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import PublicLayout from '@/components/PublicLayout'
import ProtectedRoute from '@/components/ProtectedRoute'

import Home from '@/pages/Home'
import Shop from '@/pages/Shop'
import ProductDetail from '@/pages/ProductDetail'
import OurStory from '@/pages/OurStory'
import WhyVenkys from '@/pages/WhyVenkys'
import Recipes from '@/pages/Recipes'
import Contact from '@/pages/Contact'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'
import OrderSuccess from '@/pages/OrderSuccess'
import NotFound from '@/pages/NotFound'

import AdminLogin from '@/pages/admin/AdminLogin'
import AdminLayout from '@/pages/admin/AdminLayout'
import AdminOrders from '@/pages/admin/AdminOrders'
import AdminProducts from '@/pages/admin/AdminProducts'
import AdminProductForm from '@/pages/admin/AdminProductForm'
import AdminOffers from '@/pages/admin/AdminOffers'
import AdminSettings from '@/pages/admin/AdminSettings'

export default function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#2B1A13',
            color: '#F6EFE2',
            fontSize: '14px',
            borderRadius: '2px',
          },
        }}
      />
      <Routes>
        {/* Public storefront */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/why-venkys" element={<WhyVenkys />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id" element={<AdminProductForm />} />
          <Route path="offers" element={<AdminOffers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  )
}
