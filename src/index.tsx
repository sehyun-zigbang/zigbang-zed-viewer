import * as pc from 'playcanvas';
import { Observer } from '@playcanvas/observer';

import { getAssetPath } from './helpers';
import { Option, ObserverData } from './types';
import { initMaterials } from './material';
import initializeUI from './ui';
import Viewer from './viewer';
import './style.scss';

// Permit some additional properties to be set on the window
declare global {
    interface Window {
        pc: any;
        viewer: Viewer;
    }
}

interface Skybox {
    url: string,
    label: string
}

const observerData: ObserverData = {
    ui: {
        active: null
    },
    show: {
        stats: false,
        depth: false,
        grid: true,
        fov: 35,
        postprocess: true,
    },
    lighting: {
        direct: 0.6,
        env: {
            value: getAssetPath('./skybox/photo_studio_broadway_hall_2k.hdr'),
            options: null,
            default: null,
            skyboxMip: '0',
            exposure: -1,
            backgroundColor: { r: 0.4, g: 0.45, b: 0.5 },
            rotation: 0
        },
        mainLight: {
            intencity: 1,
            color_r: 255,
            color_g: 255,
            color_b: 255,
            rotation_x: 50,
            rotation_y: 15,
            rotation_z: 0,
            shadow: true,
            shadowResolution: 4096,
            shadowIntencity: 1
        },
        subLight: {
            intencity: 0.45,
            color_r: 100,
            color_g: 255,
            color_b: 255,
            rotation_x: -50,
            rotation_y: -150,
            rotation_z: 0,
        },
        tonemapping: 'ACES'
    },
    scene: {
        nodes: '[]',
        selectedNode: {
            path: '',
            name: null,
            position: {
                0: 0,
                1: 0,
                2: 0
            },
            rotation: {
                0: 0,
                1: 0,
                2: 0,
                3: 0
            },
            scale: {
                0: 0,
                1: 0,
                2: 0
            }
        },
        meshCount: null,
        vertexCount: null,
        primitiveCount: null,
        bounds: null,
        variant: {
            selected: 0
        },
        variants: {
            list: '[]'
        },
        loadTime: null,
        name: null
    },
    scripts:{
        fxaa:
        {
            enabled: true,
        },
        brightnesscontrast:
        {
            enabled: true,
            brightness:-0.1,
            contrast:0.05,
        },
        huesaturation:
        {
            enabled: true,
            hue:0,
            saturation:0.2
        },
        bloom: {
            enabled: true,
            bloomIntensity: 0.5,
            bloomThreshold: 0.7,
            blurAmount: 15
        },
        bokeh:{
            enabled: false,
            maxBlur: 0.003,
            aperture: 0.1,
            focus: 1,
        },
        ssao: {
            enabled: false,
            radius: 5,
            samples: 16,
            brightness: 0.2,
            downscale: 1
        },
        vignette:
        {
            enabled: true,
            offset: 0.8,
            darkness: 1,
        }
    },
    spinner: false,
    error: null,
    glbUrl: null
};

// initialize the apps state
const observer: Observer = new Observer(observerData);

const saveOptions = (name: string) => {
    const options = observer.json();
    window.localStorage.setItem(`model-viewer-${name}`, JSON.stringify({
        render: options.render,
        show: options.show,
        lighting: options.lighting
    }));
};

const loadOptions = (name: string) => {
    const loadRec = (path: string, value:any) => {
        const filter = ['lighting.env.options'];
        if (filter.indexOf(path) !== -1) {
            return;
        }
        if (typeof value === 'object') {
            Object.keys(value).forEach((k) => {
                loadRec(path ? `${path}.${k}` : k, value[k]);
            });
        } else {
            if (observer.has(path)) {
                observer.set(path, value);
            }
        }
    };

    const options = window.localStorage.getItem(`model-viewer-${name}`);
    if (options) {
        try {
            loadRec('', JSON.parse(options));
        } catch { }
    }
};

initMaterials();
initializeUI(observer);

window.pc = pc;

pc.basisInitialize({
    glueUrl: getAssetPath('lib/basis/basis.wasm.js'),
    wasmUrl: getAssetPath('lib/basis/basis.wasm.wasm'),
    fallbackUrl: getAssetPath('lib/basis/basis.js'),
    lazyInit: true
});

// @ts-ignore
pc.WasmModule.setConfig('DracoDecoderModule', {
    glueUrl: getAssetPath('lib/draco/draco.wasm.js'),
    wasmUrl: getAssetPath('lib/draco/draco.wasm.wasm'),
    fallbackUrl: getAssetPath('lib/draco/draco.js')
});

// hide / show spinner when loading files
observer.on('spinner:set', (value: boolean) => {
    const spinner = document.getElementById('spinner');
    if (value) {
        spinner.classList.remove('pcui-hidden');
    } else {
        spinner.classList.add('pcui-hidden');
    }
});

const url = getAssetPath("asset_manifest.json");
new pc.Http().get(url, {
    cache: true,
    responseType: "text",
    retry: false
}, function (err: string, result: { skyboxes: Array<Skybox>, defaultSkybox: string }) {
    if (err) {
        console.warn(err);
    } else {
        const skyboxes = result.skyboxes;
        const skyboxOptions: Array<Option> = [{
            v: 'None', t: 'None'
        }];
        skyboxes.forEach((skybox: Skybox) => {
            skyboxOptions.push({ v: getAssetPath(skybox.url), t: skybox.label });
        });
        const skyboxData = observer.get('lighting.env');
        skyboxData.options = JSON.stringify(skyboxOptions);
        skyboxData.default = getAssetPath(result.defaultSkybox);
        observer.set('lighting.env', skyboxData);
        // loadOptions('uistate');

        // observer.on('*:set', () => {
        //     saveOptions('uistate');
        // });

        const canvas = document.getElementById("application-canvas") as HTMLCanvasElement;
        window.viewer = new Viewer(canvas, observer);
        window.viewer.handleUrlParams();
    }
}
);
