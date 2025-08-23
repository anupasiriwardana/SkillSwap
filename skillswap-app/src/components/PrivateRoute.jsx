// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';

// export function PrivateRoute({ children }) {
//   const { isAuthenticated, loading } = useAuth();
  
//   if (loading) {
//     return <div>Loading...</div>; // Or your loading component
//   }
  
//   return isAuthenticated ? children : <Navigate to="/login" />;
// }