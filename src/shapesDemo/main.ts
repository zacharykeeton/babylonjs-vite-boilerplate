import App from "./App";
const canvas = document.querySelector("#renderCanvas") as HTMLCanvasElement;
const app = new App(canvas);
app.run();
