import * as BABYLON from "@babylonjs/core";
import {
    AdvancedDynamicTexture,
    Button,
    Control,
    TextBlock,
} from "@babylonjs/gui/2D";
import Scenes from "./Scenes";
/*
               ┌───────┐
               │ START │
               └──┬────┘
                  │
                  │
     ┌────────────▼───────────────────────────────┐
┌───►│            MAIN                            │
│    │            MENU                            │
│    └─┬────▲──────────────┬────▲───────┬──────▲──┘
│      │    │              │    │       │      │
│      │    │              │    │       │      │
│    ┌─▼────┴─────┐    ┌───▼────┴──┐   ┌▼──────┴──┐
│    │ SOLO       │    │MULTIPLAYER│   │ OPTIONS  │
│    │ MENU       │    │MENU       │   │          │
│    └────────┬───┘    └───┬───────┘   └──────────┘
│             │            │
│    ┌────────▼────────────▼───────┐
├────┤            GAME             │
│    └────────┬─────────────┬──────┘
│             │             │
│             │             │
│    ┌────────▼───┐     ┌───▼──────┐
│    │WIN         │     │LOSE      │
├────┤SCREEN      │     │SCREEN    │
│    └────────────┘     └───┬──────┘
│                           │
│                           │
└───────────────────────────┘
 */

var createScene0 = function (
    engine: BABYLON.Engine,
    canvas: HTMLCanvasElement,
    setActiveScene: (scene: Scenes) => void
) {
    // this is the default code from the playground:

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    ////
    // CAMERA
    ////
    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera(
        "camera1",
        new BABYLON.Vector3(0, 5, -10),
        scene
    );

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    ////
    // LIGHT
    ////
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    ////
    // OBJECTS
    ////

    //// SPHERE
    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere(
        "sphere",
        { diameter: 2, segments: 32 },
        scene
    );

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    //// GROUND
    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround(
        "ground",
        { width: 6, height: 6 },
        scene
    );

    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI(
        "UI",
        true,
        scene
    );

    var text1 = new TextBlock();
    text1.text = "Scene 0";
    text1.color = "white";
    text1.fontSize = 24;
    text1.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    text1.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    text1.left = 50;
    text1.top = 100;
    advancedTexture.addControl(text1);
    var button1 = Button.CreateSimpleButton("but1", "Go to scene 1");
    button1.width = "150px";
    button1.height = "40px";
    button1.color = "white";
    button1.fontFamily = "bongkar";
    button1.cornerRadius = 20;
    button1.background = "green";
    button1.onPointerUpObservable.add(function () {
        console.log("scene0 button clicked");
        setActiveScene(Scenes.SCENE1);
    });
    advancedTexture.addControl(button1);
    return scene;
};

export default createScene0;
