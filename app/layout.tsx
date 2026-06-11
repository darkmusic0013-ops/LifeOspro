import './globals.css';
import './modules.css';
import './layout-fix.css';
import './notion.css';
import './notion-final-order.css';
import './z-final.css';

export const metadata = { title: 'LifeOS Pro', description: 'Sistema operativo personal para productividad, dinero y metas', manifest: '/manifest.json', themeColor: '#f7f7f5' };

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang='es'><body>{children}</body></html>}