import Navbar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import ElectronicsDisplay from './components/electronics/ElectronicsDisplay';
import content from './data/content.json'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <ElectronicsDisplay />
      </main>
      <Footer content={content?.footer}/>
    </div>
  );
}

export default App;