import './globals.css';
import { AuthProvider } from '../components/auth/AuthProvider';

export const metadata = { title: 'LifeOS Pro', description: 'Sistema operativo personal para productividad, dinero y metas', manifest: '/manifest.json', themeColor: '#FBFBFA' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body><AuthProvider>{children}</AuthProvider></body></html>;
}
