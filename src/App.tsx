import "./App.css";
import { useState } from "react";

import Calendar from "./pages/Calendar";
import Cameras from "./pages/Cameras";
import Chores from "./pages/Chores";
import Grocery from "./pages/Grocery";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="app">
      <TopBar />

      <div className="content">
        <SideBar page={page} setPage={setPage} />

        {page === "home" && <Home />}
        {page === "calendar" && <Calendar />}
        {page === "chores" && <Chores />}
        {page === "grocery" && <Grocery />}
        {page === "cameras" && <Cameras />}
        {page === "settings" && <Settings />}
      </div>
    </div>
  );
}

export default App;
