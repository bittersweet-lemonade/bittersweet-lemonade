import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="site-wrapper">
      <TopBar />
      <Header />
      <main className="site-main">{children}</main>
      <Footer />
    </div>
  );
}
