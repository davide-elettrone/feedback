import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Feedback from './pages/Feedback';
import ThankYouPage from './pages/ThankYouPage';

const HOME_PAGE = '/feedbacks/:id';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to={HOME_PAGE}/>}/>
          <Route path='/feedbacks/:id' element={<Feedback/>}/>
          <Route path='/thankyou' element={<ThankYouPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
