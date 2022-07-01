import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Feedback from './pages/Feedback';
import ThankYouPage from './pages/ThankYouPage';


function App() {
  return (
    <div className="App unselectable">
      <BrowserRouter>
        <Routes>
          <Route path='/feedbacks/:id' element={<Feedback/>}/>
          <Route path='/thankyou' element={<ThankYouPage/>}/>
          <Route path='*' element={<h1 id='NotFound'>Sembra che tu ti sia perso...</h1>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
