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
import Weather from "./pages/Weather";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="app">
      <TopBar onNavigate={setPage} />

      <div className="content">
        <SideBar page={page} setPage={setPage} />

        {page === "home" && <Home onNavigate={setPage} />}
        {page === "calendar" && <Calendar />}
        {page === "chores" && <Chores />}
        {page === "grocery" && <Grocery />}
        {page === "cameras" && <Cameras />}
        {page === "settings" && <Settings />}
        {page === "weather" && ( <Weather onNavigate={setPage} /> )}
      </div>
    </div>
  );
}

export default App;
