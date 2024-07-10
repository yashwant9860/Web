import './App.css';
import Post from "./post"
import Header from "./header"
import { Route, Routes } from 'react-router-dom';
function App() {
  return (
    <Routes>
      <Route index element = {
        <main>
        <Header/>
        <Post/>
        <Post/>
        <Post/>
        
      </main>
      }></Route>
    </Routes>

    
  );
}

export default App;

