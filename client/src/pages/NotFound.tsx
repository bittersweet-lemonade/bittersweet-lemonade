import { Link } from 'react-router-dom';
import Meta from '../components/Meta';

export default function NotFound() {
  return (
    <>
      <Meta title="Page Not Found" path="/404" />
      <div className="not-found">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    </>
  );
}
