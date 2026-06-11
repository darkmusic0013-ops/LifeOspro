import './globals.css';
import './modules.css';
import './layout-fix.css';
import './notion.css';
import './lifeos-pro.css';

export const metadata = { title: 'LifeOS Pro', description: 'Sistema operativo personal para productividad, dinero y metas', manifest: '/manifest.json', themeColor: '#0B0F19' };

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang='es'><body>{children}</body></html>}