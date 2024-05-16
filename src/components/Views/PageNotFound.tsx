import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div>
      <h1>404 - Página no encontrada</h1>
      <p>Lo sentimos, la página que estás buscando no se encuentra.</p>
      <Link to="/">Volver a la página de inicio</Link>
    </div>
  );
};

export default PageNotFound;
