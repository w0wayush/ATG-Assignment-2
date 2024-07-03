import { Navigate } from "react-router-dom";

function OpenRoute({ children }: any) {
  const token = location.pathname.split("/").at(-1);

  if (token === null) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
}

export default OpenRoute;
        