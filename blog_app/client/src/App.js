import './App.css';
import Post from "./post"
import Header from "./header"
import { Route, Routes } from 'react-router-dom';
import Layout from './layout';
import IndexPage from './pages/Indexpage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import CreatePost from './pages/CreatePost';

function App() {
  return (
    
    <UserContextProvider>
    <Routes>
      <Route path = "/" element={<Layout></Layout>}>
      <Route index element = {<IndexPage/>}></Route>
      <Route path="/login" element={<LoginPage/>} ></Route>
      <Route path="/register" element={<RegisterPage/>} ></Route>
      <Route path="/create" element={<CreatePost/>}></Route>
      </Route>
    </Routes>
    </UserContextProvider>
    
  );
}

export default App;

