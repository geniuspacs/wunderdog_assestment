import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainMenu from "./components/MainMenu";
import { Room } from "./components/Room";
import SelectRoom from "./components/SelectRoom";
import RoomProvider from "./providers/RoomProvider";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <RoomProvider>
        <Routes>
          <Route path="/" element={<MainMenu />}></Route>

          <Route
            path="/join-room"
            element={<SelectRoom create={false} />}
          ></Route>

          <Route
            path="/create-room"
            element={<SelectRoom create={true} />}
          ></Route>

          <Route path="/room" element={<Room />}></Route>

          <Route path="/*" element={<Navigate to="/" />}></Route>
        </Routes>
      </RoomProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
