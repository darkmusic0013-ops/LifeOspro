import './globals.css';
import './modules.css';
import './layout-fix.css';
import './notion.css';

export const metadata = { title: 'LifeOS Pro', description: 'Sistema operativo personal para productividad, dinero y metas', manifest: '/manifest.json', themeColor: '#f7f7f5', icons: [{ rel: 'icon', url: '/icon.svg' }, { rel: 'apple-touch-icon', url: '/icon.svg' }] };

export default function RootLayout({children}:{children:React.ReactNode}){return (<html lang='es'><body><a className='authFloating' href='/auth'>Cuenta</a><a className='syncFloating' href='/sync'>Sync</a>{children}</body></html>)}