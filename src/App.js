import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Chat from "./Chat";
import Login from "./Login";
import Sidebar from "./Sidebar";
import { useStateValue } from "./StateProvider";

function App() {
  const [{ user, isMobile }, dispatch] = useStateValue();

  return (
    // BEM naming convention
    <div className="App grid bg-gray-400 h-screen place-items-center pt-8">
      {/* {!user ? (
        <Login />
      ) : ( */}
      <div className="app_body bg-gray-200 -mt-12 h-[90vh] w-[90vw] rounded-t-lg md:rounded-lg shadow-[-1px_4px_20px_-6px_rgba(0,0,0,0.3)]">
        <div
          className={`${!isMobile ? "flex" : ""} h-full w-full overflow-hidden`}
        >
          <Router>
            <Switch>
              <Route path="/rooms/:roomId">
                <Sidebar />
                {!isMobile && <Chat />}
              </Route>

              <Route path="/">
                <Sidebar />
                {!isMobile && <Chat />}
              </Route>
            </Switch>
          </Router>
        </div>
        <div className="h-8 w-full bg-slate-300 rounded-b-lg md:hidden flex justify-center items-center text-white text-lg">
          <div className="mx-8">Boards</div>
          <div className="mx-8">Bulletins</div>
        </div>
        {/* // )} */}
      </div>
    </div>
  );
}

export default App;

