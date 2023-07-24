import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import LoginForm from './pages/login'

function App() {


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm/>} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App
