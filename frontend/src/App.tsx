import { BrowserRouter, Routes, Route } from "react-router-dom";
import Room from "./page/Room";
import Landing from "./page/Landing";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/room/:id" element={<Room />} />
    </Routes>
  </BrowserRouter>
);

export default App;
