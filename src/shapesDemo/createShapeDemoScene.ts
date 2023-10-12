import {
    ArcRotateCamera,
    Engine,
    HemisphericLight,
    MeshBuilder,
    Scene,
    Vector3,
    StandardMaterial,
    Texture,
    Vector4,
    Mesh,
    Color4,
} from "@babylonjs/core";
import makeTextPlane from "./makeTextPlane";

function createShapeDemoScene(engine: Engine, canvas: HTMLCanvasElement) {
    const scene = new Scene(engine);

    // CAMERA (required)
    const camera = new ArcRotateCamera(
        "camera",
        -1.5,
        1.5,
        10.5,
        Vector3.Zero(),
        scene
    );

    camera.attachControl();

    // LIGHT
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // OBJECTS

    // BOXES TEXT
    const boxesText = makeTextPlane("BOXES", "white", 36, scene);
    boxesText.position = new Vector3(0, 6, 0);
    boxesText.rotation.z = Math.PI / 2;

    // BOX
    const box = MeshBuilder.CreateBox("box", {}, scene);
    box.position.x = 2;
    box.position.y = boxesText.position.y;
    const boxText = makeTextPlane("box", "white", 12, scene);
    boxText.position = box.position.add(new Vector3(0, -0.75, 0));

    // CUBOID
    const cuboid = MeshBuilder.CreateBox(
        "box",
        { height: 1, width: 0.75, depth: 0.25 },
        scene
    );
    cuboid.position.x = 4;
    cuboid.position.y = boxesText.position.y;
    const cuboidText = makeTextPlane("cuboid", "white", 12, scene);
    cuboidText.position = cuboid.position.add(new Vector3(0, -0.75, 0));

    // NUMBERED BOX
    const boxWithNumbersMat = new StandardMaterial("mat");
    const boxWithNumbersTexture = new Texture(
        "https://assets.babylonjs.com/environments/numbers.jpg"
    );
    boxWithNumbersMat.diffuseTexture = boxWithNumbersTexture;

    var columns = 6;
    var rows = 1;

    const faceUV = new Array(6);

    for (let i = 0; i < 6; i++) {
        // bottom left (x,y), top-right (x,y)
        // rear, front, right, left, top, bottom
        faceUV[i] = new Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);
    }

    const options = {
        faceUV: faceUV,
        wrap: true,
    };

    const boxWithNumbers = MeshBuilder.CreateBox("boxWithNumbers", options);
    boxWithNumbers.material = boxWithNumbersMat;
    boxWithNumbers.position.x = 6;
    boxWithNumbers.position.y = boxesText.position.y;
    cuboid;
    const boxWithNumbersText = makeTextPlane(
        "Numbered Box",
        "white",
        12,
        scene
    );
    boxWithNumbersText.position = boxWithNumbers.position.add(
        new Vector3(0, -0.75, 0)
    );

    // TILED BOX
    var tiledBoxMat = new StandardMaterial("bricks");
    tiledBoxMat.diffuseTexture = new Texture(
        "https://assets.babylonjs.com/environments/bricktile.jpg"
    );

    const tiledBoxOptions = {
        // sideOrientation: Mesh.DOUBLESIDE,
        pattern: Mesh.FLIP_TILE,
        alignVertical: Mesh.TOP,
        alignHorizontal: Mesh.LEFT,
        width: 1,
        height: 1,
        depth: 1,
        // tileSize: 1,
        tileWidth: 0.5,
        tileHeight: 0.2,
    };

    const tiledBox = MeshBuilder.CreateTiledBox("tiledBox", tiledBoxOptions);
    tiledBox.material = tiledBoxMat;
    tiledBox.position.x = 8;
    tiledBox.position.y = boxesText.position.y;

    const tiledBoxText = makeTextPlane("Tiled Box", "white", 12, scene);
    tiledBoxText.position = tiledBox.position.add(new Vector3(0, -0.75, 0));

    /******************** SPHERES ******************************/
    // SPHERES TEXT
    const spheresText = makeTextPlane("SPHERES", "white", 36, scene);
    spheresText.position = new Vector3(0, 9, 0);
    spheresText.rotation.z = Math.PI / 2;

    // SPHERE
    const sphere = MeshBuilder.CreateSphere("sphere", {}, scene);
    sphere.position = new Vector3(2, spheresText.position.y, 0);
    const sphereText = makeTextPlane("sphere", "white", 12, scene);
    sphereText.position = sphere.position.add(new Vector3(0, -0.75, 0));

    // ELLIPSOID
    const ellipsoid = MeshBuilder.CreateSphere("sphere", {
        diameterX: 1,
        diameterY: 0.25,
        diameterZ: 0.5,
    });
    ellipsoid.position = new Vector3(4, spheresText.position.y, 0);
    const ellipsoidText = makeTextPlane("ellipsoid", "white", 12, scene);
    ellipsoidText.position = ellipsoid.position.add(new Vector3(0, -0.75, 0));

    // ARC
    const arc = MeshBuilder.CreateSphere("arc", {
        arc: 0.15,
        sideOrientation: Mesh.DOUBLESIDE, // like backface culling = false
    });
    arc.position = new Vector3(6, spheresText.position.y, 0);
    const arcText = makeTextPlane("arc", "white", 12, scene);
    arcText.position = arc.position.add(new Vector3(0, -0.75, 0));

    // SLICE
    const slice = MeshBuilder.CreateSphere("slice", {
        slice: 0.6,
        sideOrientation: Mesh.DOUBLESIDE,
    });
    slice.position = new Vector3(8, spheresText.position.y, 0);
    const sliceText = makeTextPlane("slice", "white", 12, scene);
    sliceText.position = slice.position.add(new Vector3(0, -0.75, 0));

    /******************** CYLINDERS ******************************/

    // CYLINDERS TEXT
    const cylindersText = makeTextPlane("CYLINDERS", "white", 36, scene);
    cylindersText.position = new Vector3(0, 12, 0);
    cylindersText.rotation.z = Math.PI / 2;

    // CYLINDER
    const cylinder = MeshBuilder.CreateCylinder(
        "cylinder",
        { height: 1 },
        scene
    );
    cylinder.position.x = 2;
    cylinder.position.y = cylindersText.position.y;
    const cylinderText = makeTextPlane("cylinder", "white", 12, scene);
    cylinderText.position = cylinder.position.add(new Vector3(0, -0.75, 0));

    // CONE
    const cone = MeshBuilder.CreateCylinder(
        "cone",
        { height: 1, diameterTop: 0 },
        scene
    );
    cone.position.x = 4;
    cone.position.y = cylindersText.position.y;
    const coneText = makeTextPlane("cone", "white", 12, scene);
    coneText.position = cone.position.add(new Vector3(0, -0.75, 0));

    // PRISM
    const prism = MeshBuilder.CreateCylinder(
        "prism",
        { height: 1, tessellation: 3 },
        scene
    );
    prism.position.x = 6;
    prism.position.y = cylindersText.position.y;
    const prismText = makeTextPlane("prism", "white", 12, scene);
    prismText.position = prism.position.add(new Vector3(0, -0.75, 0));

    // PYRAMID
    const pyramid = MeshBuilder.CreateCylinder(
        "pyramid",
        { height: 1, tessellation: 4, diameterTop: 0 },
        scene
    );
    pyramid.position.x = 8;
    pyramid.position.y = cylindersText.position.y;
    const pyramidText = makeTextPlane("pyramid", "white", 12, scene);
    pyramidText.position = pyramid.position.add(new Vector3(0, -0.75, 0));

    // CYLINDER ARC
    const cylinderArc = MeshBuilder.CreateCylinder(
        "cylinderArc",
        { height: 1, arc: 0.7, sideOrientation: Mesh.DOUBLESIDE },
        scene
    );
    cylinderArc.position.x = 10;
    cylinderArc.position.y = cylindersText.position.y;
    const cylinderArcText = makeTextPlane("arc", "white", 12, scene);
    cylinderArcText.position = cylinderArc.position.add(
        new Vector3(0, -0.75, 0)
    );

    // CAKE SLICE
    const cakeSlice = MeshBuilder.CreateCylinder(
        "cakeSlice",
        { height: 1, arc: 0.1, enclose: true },
        scene
    );
    cakeSlice.position.x = 12;
    cakeSlice.position.y = cylindersText.position.y;
    const cakeSliceText = makeTextPlane("cake slice", "white", 12, scene);
    cakeSliceText.position = cakeSlice.position.add(new Vector3(0, -0.75, 0));

    // CAN
    const canMaterial = new StandardMaterial("material", scene);
    canMaterial.diffuseTexture = new Texture(
        "https://assets.babylonjs.com/environments/logo_label.jpg"
    );

    const canFaceUV = [];
    canFaceUV[0] = new Vector4(0, 0, 0, 0);
    canFaceUV[1] = new Vector4(1, 0, 0.25, 1); // x, z swapped to flip image
    canFaceUV[2] = new Vector4(0, 0, 0.24, 1);

    const canFaceColors = [];
    canFaceColors[0] = new Color4(0.5, 0.5, 0.5, 1);

    const can = MeshBuilder.CreateCylinder("can", {
        height: 1,
        faceUV: canFaceUV,
        faceColors: canFaceColors,
    });
    can.material = canMaterial;
    can.position.x = 14;
    can.position.y = cylindersText.position.y;
    const canText = makeTextPlane("can (faceUVs)", "white", 12, scene);
    canText.position = can.position.add(new Vector3(0, -0.75, 0));

    // CAPSULE
    const capsule = MeshBuilder.CreateCapsule("capsule", {}, scene);
    capsule.position.x = -2;
    const capsuleText = makeTextPlane("capsule", "white", 12, scene);
    capsuleText.position = capsule.position.add(new Vector3(0, -0.75, 0));

    // DISC
    const disc = MeshBuilder.CreateDisc("disc", {}, scene);
    disc.position.y = 2;
    const discText = makeTextPlane("disc", "white", 12, scene);
    discText.position = disc.position.add(new Vector3(0, -0.75, 0));
    const discMaterial = new StandardMaterial("mat", scene);
    disc.material = discMaterial;
    disc.material.backFaceCulling = false;

    // GEODESIC
    const geodesic = MeshBuilder.CreateGeodesic(
        "geodesic",
        { size: 0.5 },
        scene
    );
    geodesic.position.x = -2;
    geodesic.position.y = 2;
    const geodesicText = makeTextPlane("geodesic", "white", 12, scene);
    geodesicText.position = geodesic.position.add(new Vector3(0, -0.75, 0));

    // GOLDBERG
    const goldberg = MeshBuilder.CreateGoldberg(
        "goldberg",
        { size: 0.5 },
        scene
    );
    goldberg.position.x = -2;
    goldberg.position.y = -2;
    const goldbergText = makeTextPlane("goldberg", "white", 12, scene);
    goldbergText.position = goldberg.position.add(new Vector3(0, -0.75, 0));

    // TORUS
    const torus = MeshBuilder.CreateTorus("torus", {}, scene);
    // torus.position.x = -4;
    torus.position.y = -2;
    const torusText = makeTextPlane("torus", "white", 12, scene);
    torusText.position = torus.position.add(new Vector3(0, -0.75, 0));

    // TORUS KNOT
    const torusKnot = MeshBuilder.CreateTorusKnot(
        "torus_knot",
        { radius: 0.25, tube: 0.075 },
        scene
    );
    torusKnot.position.x = 2;
    torusKnot.position.y = -2;
    const torusKnotText = makeTextPlane("torusKnot", "white", 12, scene);
    torusKnotText.position = torusKnot.position.add(new Vector3(0, -0.75, 0));

    // Ground
    // const ground = MeshBuilder.CreateGround(
    //     "ground",
    //     { width: 1, height: 1 },
    //     scene
    // );

    // scene.onBeforeRenderObservable.add(() => {
    //     tiledBox.rotation.y += 0.0025;
    //     tiledBox.rotation.x += 0.0025;

    //     box.rotation.y += 0.0025;
    //     box.rotation.x += 0.0025;

    //     cuboid.rotation.y += 0.0025;
    //     cuboid.rotation.x += 0.0025;

    //     boxWithNumbers.rotation.y += 0.0025;
    //     boxWithNumbers.rotation.x += 0.0025;

    //     // for (let m = 0; m < mesh.length; m++) {
    //     // 	mesh[m].addRotation(0, 0, 0.01).addRotation(0, 0.02, 0).addRotation(0.03, 0, 0);
    //     // }
    // });

    // scene.onBeforeRenderObservable.add(() => {
    //     torus.rotation.y += 0.0025;
    //     torus.rotation.x += 0.0025;
    //     // for (let m = 0; m < mesh.length; m++) {
    //     // 	mesh[m].addRotation(0, 0, 0.01).addRotation(0, 0.02, 0).addRotation(0.03, 0, 0);
    //     // }
    // });

    return scene;
}

export default createShapeDemoScene;
