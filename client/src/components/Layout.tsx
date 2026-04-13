import { ReactNode } from 'react';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="site-wrapper">
      <TopBar />
      <Header />
      <main className="site-main">{children}</main>
      <Footer />
    </div>
  );
}
