import { Navigate } from 'react-router-dom'

const Landing = () => {
  return <Navigate to={"/auth/login"}/>
}

export default Landing