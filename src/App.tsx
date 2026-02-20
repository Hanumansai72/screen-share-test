import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ScreenTest from './pages/ScreenTest';

function App() {
  return (
    <Router basename="/ScreenSharTest">
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <main className="w-full max-w-4xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/screen-test" element={<ScreenTest />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
