
import {  UserContextProvider } from "./UserContext";
import Routes from "./Routes";
function App() {
  
  return (
    <UserContextProvider>

    <Routes></Routes>
    </UserContextProvider>
  );
}

export default App
