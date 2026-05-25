import NotFound from '../views/NotFound.jsx';

export const metadata = {
  title: 'Página no encontrada · Page Not Found',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundPage() {
  return <NotFound />;
}
