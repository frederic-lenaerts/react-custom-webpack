import React from "react";
import ReactDom from "react-dom";
import { App } from "components/App";

import "./index.css";

ReactDom.render(<App />, document.getElementById("root"));

if (process.env.NODE_ENV !== "development") {
  // service worker is generated during the production build -- see webpack.prod
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(registration => {
          console.log("SW registered: ", registration);
        })
        .catch(registrationError => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }
}
