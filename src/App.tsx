import Home from "./pages/Home";
import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";
function App() {
  return (
    <div className="app">
     <TopBar />

      <div className="content">
       <SideBar />

        <Home />
      </div>
    </div>
  );
}

export default App;