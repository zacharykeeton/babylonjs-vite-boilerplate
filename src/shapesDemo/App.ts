import { Engine, Scene } from "@babylonjs/core";
import createShapeDemoScene from "./createShapeDemoScene";
import { Inspector } from "@babylonjs/inspector";

class App {
    private readonly _engine: Engine;
    private _activeScene: Scene;
    constructor(private readonly _canvas: HTMLCanvasElement) {
        // Setup engine
        this._engine = new Engine(_canvas);
        window.addEventListener("resize", () => this._engine.resize());

        // Create Scenes
        const shapeDemoScene = createShapeDemoScene(this._engine, this._canvas);

        // Set starting scene
        this._activeScene = shapeDemoScene;
        // Inspector.Show(this._activeScene, {});
    }
    run() {
        console.log("run!");
        this._engine.runRenderLoop(() => {
            this._activeScene.render();
        });
    }
}

export default App;
