import { Engine, Scene } from "@babylonjs/core";
import createWinterScene from "./createWinterScene";
import { Inspector } from "@babylonjs/inspector";

class App {
    private readonly _engine: Engine;
    private _activeScene: Promise<Scene>;

    constructor(private readonly _canvas: HTMLCanvasElement) {
        // Setup engine
        this._engine = new Engine(this._canvas);
        window.addEventListener("resize", () => this._engine.resize());

        // Create Scene
        this._activeScene = createWinterScene(this._engine);
    }

    async run() {
        const scene = await this._activeScene;
        Inspector.Show(scene, {});
        this._engine.runRenderLoop(() => {
            scene.render();
        });
    }
}

export default App;
