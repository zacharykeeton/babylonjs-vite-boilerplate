import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig(({ command, mode }) => {
    return {
        resolve: {
            alias: {
                babylonjs:
                    mode === "development"
                        ? "babylonjs/babylon.max"
                        : "babylonjs",
            },
        },
        build: {
            rollupOptions: {
                input: {
                    main: resolve(__dirname, "index.html"),
                    game1: resolve(__dirname, "src/game1/index2.html"),
                    shapesDemo: resolve(__dirname, "src/shapesDemo/index.html"),
                    winterScene: resolve(
                        __dirname,
                        "src/winterScene/index.html"
                    ),
                },
            },
        },
    };
});
