import './styles/App.css';
import Board from './components/Board';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Board/>
      <ToastContainer autoClose={10000} theme="colored" />
    </div>
  );
}

export default App;
