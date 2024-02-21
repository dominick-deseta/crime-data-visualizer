import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Add from "./pages/Add";
import SignIn from "./pages/SignIn"
import Users from "./pages/Users";
import Update from "./pages/Update"
import Crimes from "./pages/Crimes"
import AdvQ1 from "./pages/AdvQ1";
import AdvQ2 from "./pages/AdvQ2";
import Report from "./pages/Report";
import "./style.css"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn/>}/>
          <Route path="/users" element={<Users/>}/>
          <Route path="/add" element={<Add/>}/>
          <Route path="/update/:userName" element={<Update/>}/>
          <Route path="/crimes" element={<Crimes/>}/>
          <Route path="/advQ1" element={<AdvQ1/>}/>
          <Route path="/advQ2" element={<AdvQ2/>}/>
          <Route path="/report" element={<Report/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
