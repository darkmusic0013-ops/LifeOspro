import './globals.css';
import './modules.css';

export const metadata = { title: 'LifeOS Pro', description: 'Sistema operativo personal para productividad, dinero y metas' };

export default function RootLayout({children}:{children:React.ReactNode}){return (<html lang='es'><body>{children}</body></html>)}