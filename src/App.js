import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// mainscreen
import ButtonsPage from "./components/Buttons/Index";
// modal 1 & 2
import Modal1 from "./components/Modals/Modal1";
import Modal2 from "./components/Modals/Modal2";
// if page not found 
import NoPage from "./components/Nopage";

export default function App() {

  // routers to change the url of modals   
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ButtonsPage />} />
        <Route path="/allcontacts" element={<Modal1 />} />
        <Route path="/uscontacts" element={<Modal2 />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = document.getElementById('root');
ReactDOM.render(<App />, root);
