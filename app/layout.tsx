import './globals.css';
import './modules.css';

export const metadata = {
  title: 'LifeOS Pro',
  description: 'Sistema operativo personal para productividad, dinero y metas',
  manifest: '/manifest.json',
  themeColor: '#050816',
  icons: [{ rel: 'icon', url: '/icon.svg' }, { rel: 'apple-touch-icon', url: '/icon.svg' }]
};

export default function RootLayout({children}:{children:React.ReactNode}){return (<html lang='es'><body>{children}</body></html>)}