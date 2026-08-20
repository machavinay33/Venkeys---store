import { Link } from 'react-router-dom'
import SEO from '@/components/SEO'

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found" description="This page could not be found." path="/404" />
      <div className="container-page py-28 sm:py-36 text-center">
        <p className="font-display text-7xl text-maroon/20 mb-4">404</p>
        <h1 className="text-2xl sm:text-3xl font-light mb-4">Page not found</h1>
        <p className="text-brown-900/60 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link to="/" className="btn-primary w-fit mx-auto">Back to Home</Link>
      </div>
    </>
  )
}
