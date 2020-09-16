import React from "react";
import logo from "./logo.svg";
import "./App.css";
import NewsPage from "./Container/News";

function App() {
  return (
    <div className="App">
      <header className="App-header">Today's headlines</header>
      <NewsPage></NewsPage>
    </div>
  );
}

export default App;
