import './globals.css';
import './modules.css';
import './layout-fix.css';
import './notion.css';
import './notion-sidebar-fix.css';

export const metadata = { title: 'LifeOS Pro', description: 'Sistema operativo personal para productividad, dinero y metas', manifest: '/manifest.json', themeColor: '#f7f7f5' };

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang='es'><body>{children}</body></html>}