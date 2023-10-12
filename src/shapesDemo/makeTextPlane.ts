import {
    DynamicTexture,
    MeshBuilder,
    StandardMaterial,
    Color3,
    Scene,
} from "@babylonjs/core";

const makeTextPlane = function (
    text: string,
    color: string,
    font_size: number,
    scene: Scene
) {
    //Set font
    var font = "bold " + font_size + "px Arial";

    //Set height for plane
    var planeHeight = (font_size / 12) * 0.25; // if font is 12, height should be .25

    //Set height for dynamic texture
    var DTHeight = 1.5 * font_size; //or set as wished

    //Calcultae ratio
    var ratio = planeHeight / DTHeight;

    //Use a temporay dynamic texture to calculate the length of the text on the dynamic texture canvas
    var temp = new DynamicTexture("DynamicTexture", 64, scene);
    var tmpctx = temp.getContext();
    tmpctx.font = font;
    var DTWidth = tmpctx.measureText(text).width + 8;

    //Calculate width the plane has to be
    var planeWidth = DTWidth * ratio;

    //Create dynamic texture and write the text
    var dynamicTexture = new DynamicTexture(
        "DynamicTexture",
        { width: DTWidth, height: DTHeight },
        scene,
        false
    );
    dynamicTexture.hasAlpha = true;
    var mat = new StandardMaterial("mat", scene);
    mat.backFaceCulling = false;
    mat.specularColor = new Color3(0, 0, 0);
    mat.diffuseTexture = dynamicTexture;
    dynamicTexture.drawText(
        text,
        null,
        null,
        font,
        "white",
        "transparent",
        true
    );

    //Create plane and set dynamic texture as material
    var plane = MeshBuilder.CreatePlane(
        "plane",
        { width: planeWidth, height: planeHeight },
        scene
    );
    plane.material = mat;
    return plane;
};

export default makeTextPlane;
