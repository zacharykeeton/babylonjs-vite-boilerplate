import App from "./App";

// Grab canvas
const canvas = document.querySelector("#babylonCanvas") as HTMLCanvasElement;
const app = new App(canvas);
app.run();
