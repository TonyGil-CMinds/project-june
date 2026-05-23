import NotFound from '../views/NotFound.jsx';

export const metadata = {
  title: 'Pagina no encontrada',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundPage() {
  return <NotFound />;
}
