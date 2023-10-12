import { Engine, Scene } from "@babylonjs/core";
import createScene0 from "./createScene0";
import createScene1 from "./createScene1";
import createScene2 from "./createScene2";
import Scenes from "./Scenes";
import { Inspector } from "@babylonjs/inspector";

export class AppOne {
    private readonly _engine: Engine;
    private _activeScene!: Scene;
    private _state: Scenes = Scenes.START;
    private readonly _scene0: Scene;
    private readonly _scene1: Scene;
    private readonly _scene2: Scene;

    constructor(private readonly _canvas: HTMLCanvasElement) {
        // Setup Engine
        this._engine = new Engine(_canvas, true); // true: enable antialiasing
        window.addEventListener("resize", () => {
            this._engine.resize();
        });

        // Create Scenes
        this._scene0 = createScene0(
            this._engine,
            this._canvas,
            this.setActiveScene.bind(this)
        );
        this._scene1 = createScene1(
            this._engine,
            this._canvas,
            this.setActiveScene.bind(this)
        );
        this._scene2 = createScene2(
            this._engine,
            this._canvas,
            this.setActiveScene.bind(this)
        );

        // Set starting scene
        this.setActiveScene(Scenes.SCENE0);
    }

    debug(debugOn: boolean = true) {
        // if (debugOn) {
        //     this._activeScene.debugLayer.show({ overlay: true });
        // } else {
        //     this._activeScene.debugLayer.hide();
        // }
    }

    setActiveScene(scene: Scenes) {
        // Turn off event handlers
        this._activeScene?.detachControl();

        // Switch scene
        switch (scene) {
            case Scenes.SCENE0:
                this._activeScene = this._scene0;
                break;
            case Scenes.SCENE1:
                this._activeScene = this._scene1;
                break;
            case Scenes.SCENE2:
                this._activeScene = this._scene2;
                break;
            default:
                this._activeScene = this._scene0;
                break;
        }

        // Turn on event handlers (for new scene)
        this._activeScene.attachControl();
        Inspector.Show(this._activeScene, {});
    }

    run() {
        this.debug(true);
        this._engine.runRenderLoop(() => {
            this._activeScene.render();
        });
    }
}
