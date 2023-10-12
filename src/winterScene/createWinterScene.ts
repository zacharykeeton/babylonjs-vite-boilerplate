import * as BABYLON from "@babylonjs/core";
import createScene0 from "../game1/createScene0";

function createSnow(scene: BABYLON.Scene) {
    let particleSystem: BABYLON.ParticleSystem | BABYLON.GPUParticleSystem;

    if (BABYLON.GPUParticleSystem.IsSupported) {
        // Create a particle system
        particleSystem = new BABYLON.GPUParticleSystem(
            "particles",
            { capacity: 100_000 },
            scene
        );
    } else {
        particleSystem = new BABYLON.ParticleSystem(
            "particles",
            100_000,
            scene
        );
    }

    //Texture of each particle
    // Black background becomes transparent
    particleSystem.particleTexture = new BABYLON.Texture(
        "https://st.depositphotos.com/1400069/2216/i/450/depositphotos_22162671-stock-photo-snowflake-isolated-on-a-black.jpg",
        scene
    );

    // Position where the particles are emiited from
    // particleSystem.emitter = new BABYLON.Vector3(0, 0.5, 0);

    // set spawnable area
    particleSystem.minEmitBox = new BABYLON.Vector3(-100, 0, -100); // minimum box dimensions
    particleSystem.maxEmitBox = new BABYLON.Vector3(100, 0, 100); // maximum box dimensions

    // Snowflake size
    particleSystem.minSize = 0.0625;
    particleSystem.maxSize = 0.125;

    // Snowflake lifespan
    particleSystem.minLifeTime = 20;
    particleSystem.maxLifeTime = 20;

    // Snowflake speed
    particleSystem.minEmitPower = -2;
    particleSystem.maxEmitPower = -3;

    // Max snowflakes emitted per frame
    particleSystem.emitRate = 4000;

    // add noise
    var noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 256, scene);
    noiseTexture.animationSpeedFactor = 5;
    noiseTexture.persistence = 2;
    noiseTexture.brightness = 0.5;
    noiseTexture.octaves = 5;

    particleSystem.noiseTexture = noiseTexture;
    particleSystem.noiseStrength = new BABYLON.Vector3(1, 0.03, 1);

    particleSystem.start();
}

function createCamera(scene: BABYLON.Scene) {
    // const camera = new BABYLON.ArcRotateCamera(
    //     "arcCam",
    //     1,
    //     1,
    //     1,
    //     BABYLON.Vector3.Zero(),
    //     scene
    // );
    // camera.attachControl(true);

    // The Universal Camera is the one to choose for first
    // person shooter type games
    const camera = new BABYLON.UniversalCamera(
        "UniversalCamera",
        new BABYLON.Vector3(9, -20, -21), // position
        scene
    );

    // Targets the camera to a particular target position,
    // in this case the first house
    camera.setTarget(new BABYLON.Vector3(10, -20, -18.1));

    // Attach the camera to the canvas
    // Enables mouse and arrow key inputs
    camera.attachControl(true);

    ////// COLLISIONS STEP 2 of 3: define an ellipsoid
    // the shape of the ellipsoid around the camera used
    // for collision with other objects
    camera.ellipsoid = new BABYLON.Vector3(1.5, 1.6, 1.5);

    ////// COLLISIONS STEP 1 of 3 cont: apply gravity
    camera.applyGravity = true;

    ////// COLLISIONS STEP 3 of 3: Apply collision
    camera.checkCollisions = true;

    camera.speed = 1;

    // This helps giving a smooth feeling to the camera movement.
    camera.inertia = 0.85;

    return camera;
}

async function createScene(engine: BABYLON.Engine) {
    // Load the scene from remote file
    // Looks like they created the 'map' in blender
    // then they exported it to a babylon file.
    const scene = await BABYLON.SceneLoader.LoadAsync(
        "",
        "https://raw.githubusercontent.com/geonom/blender_exporter_test/main/Lake.babylon",
        engine
    );

    // the color of 'empty space'
    // changes the 'background' color
    // This color and property is not used in any calculations
    // for the final colors of mesh, materials, textures, or
    // anything else. It is simply the background color of the
    // scene
    // see: https://doc.babylonjs.com/features/featuresDeepDive/environment/environment_introduction
    // Make the background of the scene white. This makes the
    // 'sky' white.
    scene.clearColor = BABYLON.Color4.FromColor3(BABYLON.Color3.White(), 1);

    // Conversely, the ambientColor property on the scene
    // object is a very powerful and influential environment property/adjustment
    // changes the color used in several effects, including ambient lighting
    // ambientColor is used in quite a few calculations toward determining the
    // final colors of scene items.  Mainly, it is used in conjunction with a
    // mesh's StandardMaterial.ambientColor to determine a FINAL ambientColor
    // for the mesh material
    // see: https://doc.babylonjs.com/features/featuresDeepDive/environment/environment_introduction
    scene.ambientColor = BABYLON.Color3.White();

    ////// COLLISIONS STEP 1 of 3: define and apply gravity
    // Set Gravity
    const assumedFramesPerSecond = 60;
    const earthGravity = -9.81;
    scene.gravity = new BABYLON.Vector3(
        0,
        earthGravity / assumedFramesPerSecond,
        0
    );

    ////// COLLISIONS STEP 3 of 3: Apply collision
    // Enable collisions in scene
    scene.collisionsEnabled = true;

    /****** SETUP COLLISIONS ******/
    // set collision for ground, all houses, trees and christmas objects
    for (let i = 0; i < scene.meshes.length; i++) {
        let mesh = scene.meshes[i];
        if (
            mesh.name.includes("Tree") ||
            mesh.name.includes("House") ||
            mesh.name.includes("Christmas") ||
            mesh.name.includes("Ground")
        ) {
            mesh.checkCollisions = true;
        }
    }

    return scene;
}

function createLight(scene: BABYLON.Scene) {
    // HemisphericLight to illuminate the snowy day
    // The HemisphericLight simulates the ambient environment
    // light, so the passed direction is the light reflection
    // direction, not the incoming direction
    const light = new BABYLON.HemisphericLight(
        "hemiLight",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    // The main color of the light
    light.diffuse = new BABYLON.Color3(0.4, 0.76, 0.97);

    // The reflected color (see the lake color)
    light.groundColor = new BABYLON.Color3(0.5, 0.5, 0.5);
}

function setupEnvironment(scene: BABYLON.Scene) {
    // fog, glow, snow, background music

    // FOG
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogColor = BABYLON.Color3.White();
    scene.fogStart = 50.0;
    scene.fogEnd = 120.0;
    // GLOW
    // Add glow to objects with emission materials
    // make all the emissive parts of a scene glow
    // i.e. the windows of the houses were set with an
    // emissive color
    var gl = new BABYLON.GlowLayer("glow", scene);
    gl.intensity = 0.7;

    // SNOW
    createSnow(scene);

    // BACKGROUND MUSIC
    // this one is the background music, therefore autoplay and loop are true
    const sound = new BABYLON.Sound(
        "Background music",
        "https://raw.githubusercontent.com/geonom/blender_exporter_test/main/Track1.mp3",
        scene,
        null,
        {
            loop: true,
            autoplay: true,
        }
    );
}

function setupHouse1(scene: BABYLON.Scene) {
    // CHRISTMAS TREE
    // lower the visibility of the christmas objects until the house was clicked
    const meshChristmasTree = scene.getMeshByName("Christmas Tree")!;
    meshChristmasTree.visibility = 0;

    // the other sounds should only be played once triggered, therefore autoplay is false
    // they are not supposed to loop, therefore loop is false
    // WINTER by Shakespeare
    const sound1 = new BABYLON.Sound(
        "1",
        "https://raw.githubusercontent.com/geonom/blender_exporter_test/main/Track2.mp3",
        scene,
        null,
        {
            loop: false,
            autoplay: false,
        }
    );

    // Actions are a simple way to add interactions in your scenes.
    // An action is launched when its trigger is fired
    const house1 = scene.getMeshByName("House 1")!;

    // To use actions, you have to attach an BABYLON.ActionManager
    // to a mesh or to your scene
    house1.actionManager = new BABYLON.ActionManager(scene);

    // Once the ActionManager is created, you can start registering actions:

    // The executeCodeAction allows to execute multiple functions easily
    // upon OnPickTrigger. A good catch-all event handler
    // house1.actionManager
    //     .registerAction(
    //         new BABYLON.ExecuteCodeAction(
    //             BABYLON.ActionManager.OnPickTrigger,
    //             function () {
    //                 sound1.play();
    //                 meshChristmasTree.visibility = 1;
    //             }
    //         )
    //     )
    //     ?.then(
    //         new BABYLON.ExecuteCodeAction(
    //             // NothingTrigger
    //             // Never raised. Used for sub-actions with action.then function.
    //             BABYLON.ActionManager.NothingTrigger,
    //             function () {
    //                 sound1.stop();
    //                 meshChristmasTree.visibility = 0;
    //             }
    //         )
    //     );

    // With combine actions
    house1.actionManager
        .registerAction(
            new BABYLON.CombineAction(BABYLON.ActionManager.OnPickTrigger, [
                new BABYLON.PlaySoundAction(
                    BABYLON.ActionManager.NothingTrigger,
                    sound1
                ),
                new BABYLON.SetValueAction(
                    BABYLON.ActionManager.NothingTrigger,
                    meshChristmasTree,
                    "visibility",
                    1
                ),
            ])
        )
        ?.then(
            new BABYLON.CombineAction(BABYLON.ActionManager.OnPickTrigger, [
                new BABYLON.StopSoundAction(
                    BABYLON.ActionManager.NothingTrigger,
                    sound1
                ),
                new BABYLON.SetValueAction(
                    BABYLON.ActionManager.NothingTrigger,
                    meshChristmasTree,
                    "visibility",
                    0
                ),
            ])
        );
}

function setupHouse2(scene: BABYLON.Scene) {
    // CHRISTMAS LAMPS
    const meshChristmasLamps = scene.getMeshByName("Christmas Lamps")!;
    meshChristmasLamps.visibility = 0.0;

    // GREEK SONG
    const sound2 = new BABYLON.Sound(
        "2",
        "https://raw.githubusercontent.com/geonom/blender_exporter_test/main/Track3.mp3",
        scene,
        null,
        {
            loop: false,
            autoplay: false,
        }
    );
    const house2 = scene.getMeshByName("House 2")!;
    house2.actionManager = new BABYLON.ActionManager(scene);

    // EXECUTE CODE ACTION
    // appears: less verbose and more type-safe
    // than CombineAction
    // Will default to ExecuteCodeAction until
    // forced/convinced to use something else

    house2.actionManager
        .registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => {
                    sound2.play();
                    meshChristmasLamps.visibility = 1;
                }
            )
        )
        ?.then(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.NothingTrigger,
                () => {
                    sound2.stop();
                    meshChristmasLamps.visibility = 0;
                }
            )
        );
}

function setupHouse1_1(scene: BABYLON.Scene) {
    // CHRISTMAS WREATH
    const meshChristmasWreath = scene.getMeshByName("Christmas Wreath")!;
    meshChristmasWreath.visibility = 0.0;

    // GERMAN story?
    const sound3 = new BABYLON.Sound(
        "3",
        "https://raw.githubusercontent.com/geonom/blender_exporter_test/main/Track4.mp3",
        scene,
        null,
        {
            loop: false,
            autoplay: false,
        }
    );

    const house1_1 = scene.getMeshByName("House 1.1")!;
    house1_1.actionManager = new BABYLON.ActionManager(scene);
    house1_1.actionManager
        .registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => {
                    sound3.play();
                    meshChristmasWreath.visibility = 1;
                }
            )
        )
        ?.then(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.NothingTrigger,
                () => {
                    sound3.stop();
                    meshChristmasWreath.visibility = 0;
                }
            )
        );
}

function setupHouse1_2(scene: BABYLON.Scene) {
    // CHRISTMAS STARS
    const meshChristmasStar = scene.getMeshByName("Christmas Star")!;
    const meshChristmasStar1 = scene.getMeshByName("Christmas Star 1")!;
    const meshChristmasStar2 = scene.getMeshByName("Christmas Star 2")!;

    meshChristmasStar.visibility = 0.0;
    meshChristmasStar1.visibility = 0.0;
    meshChristmasStar2.visibility = 0.0;

    // THE SNOWBIRD
    const sound4 = new BABYLON.Sound(
        "4",
        "https://raw.githubusercontent.com/geonom/blender_exporter_test/main/Track5.mp3",
        scene,
        null,
        {
            loop: false,
            autoplay: false,
        }
    );

    const house1_2 = scene.getMeshByName("House 1.2")!;
    house1_2.actionManager = new BABYLON.ActionManager(scene);
    house1_2.actionManager
        .registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => {
                    sound4.play();
                    meshChristmasStar.visibility = 1.0;
                    meshChristmasStar1.visibility = 1.0;
                    meshChristmasStar2.visibility = 1.0;
                    scene.beginAnimation(
                        scene.getMeshByName("Train"),
                        0,
                        2400,
                        true
                    );
                }
            )
        )
        ?.then(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.NothingTrigger,
                () => {
                    sound4.stop();
                    meshChristmasStar.visibility = 0;
                    meshChristmasStar1.visibility = 0;
                    meshChristmasStar2.visibility = 0;
                    scene.stopAnimation(scene.getMeshByName("Train"));
                }
            )
        );
}

function setupChristmasSledge(scene: BABYLON.Scene) {
    // CHRISTMAS SLEDGE TEXT
    const meshChristmasSledgeText = scene.getMeshByName("Text Sledge")!;
    meshChristmasSledgeText.visibility = 0.0;

    const christmasSledge = scene.getMeshByName("Christmas Sledge")!;
    christmasSledge.actionManager = new BABYLON.ActionManager(scene);
    christmasSledge.actionManager
        .registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => {
                    meshChristmasSledgeText.visibility = 1;
                }
            )
        )
        ?.then(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.NothingTrigger,
                () => {
                    meshChristmasSledgeText.visibility = 0;
                }
            )
        );
}

function setupMovementBoundary(scene: BABYLON.Scene) {
    // set the collision for the movement bounds mesh
    // and set its visibility to zero
    const bounds = scene.getNodeByName("Bounds") as BABYLON.Mesh;
    bounds.visibility = 0.0;

    // set collisions for movement bounds mesh
    bounds.checkCollisions = true;

    // MOVEMENT BOUNDING MESH
    // Set pickable to false, so that actionable objects inside the bounds
    // can be activated by clicking (if true [default], the clicks would be consumed
    // by the bounds and not be delivered to clickable objects like houses inside the bounds)
    bounds.isPickable = false;
}

async function createWinterScene(
    engine: BABYLON.Engine
    // canvas: HTMLCanvasElement
) {
    const scene = await createScene(engine);
    createCamera(scene);
    createLight(scene);

    setupEnvironment(scene);
    setupMovementBoundary(scene);
    setupChristmasSledge(scene);

    // HOUSES
    setupHouse1(scene);
    setupHouse2(scene);
    setupHouse1_1(scene);
    setupHouse1_2(scene);

    // SSAO stuff was commented out already
    // // Create SSAO and configure all properties (for the example)
    // var ssaoRatio = {
    //     ssaoRatio: 0.5, // Ratio of the SSAO post-process, in a lower resolution
    //     combineRatio: 1.0 // Ratio of the combine post-process (combines the SSAO and the scene)
    // };

    // var ssao = new BABYLON.SSAORenderingPipeline("ssao", scene, ssaoRatio);
    // ssao.fallOff = 0.00001;
    // ssao.area = 0.3;
    // ssao.radius = 0.00001;
    // ssao.totalStrength = .7;
    // ssao.base = 0.5;

    return scene;
}
export default createWinterScene;
