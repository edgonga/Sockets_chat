import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import LoginForm from './pages/login'
import Chat from "./pages/Chat"; 

function App() {


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm/>} />
          <Route path="/home" element={<Chat/>} />
        </Routes>
      </div>
    </Router>
  );
}


export default App
