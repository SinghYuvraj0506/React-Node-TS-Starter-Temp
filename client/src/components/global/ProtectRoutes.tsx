import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";

type Props = {
  navigateTo: string
  allowed: boolean;
  loading?: boolean
};

const ProtectRoutes = ({ navigateTo, allowed, loading = false }: Props) => {
  return loading ? <Loader/> : (allowed ? <Outlet/> : <Navigate to={navigateTo} />);;
};

export default ProtectRoutes;
