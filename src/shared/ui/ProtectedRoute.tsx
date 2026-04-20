import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-abyss-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ocean-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/admin" replace />;

  return <>{children}</>;
};
