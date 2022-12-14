export interface File {
    url: string,
    filename?: string
}

export interface Option {
    v: string | number | null,
    t: string
}

export interface HierarchyNode {
    name: string,
    path: string,
    children: Array<HierarchyNode>
}
export interface ObserverData {
    ui: {
        active?: string
    },
    show: {
        stats: boolean,
        depth: boolean,
        grid: boolean,
        fov: number,
        postprocess: boolean
    },
    lighting: {
        direct: number,
        env: {
            value: string,
            options: null,
            default: null,
            skyboxMip: string,
            exposure: number,
            backgroundColor: {
                r: number,
                g: number,
                b: number
            },
            rotation: number
        },
        mainLight: {
            intencity: number,
            color_r : number,
            color_g : number,
            color_b : number,
            rotation_x : number,
            rotation_y : number,
            rotation_z : number,
            shadow: boolean,
            shadowResolution : number,
            shadowIntencity : number
        },
        subLight: {
            intencity: number,
            color_r : number,
            color_g : number,
            color_b : number,
            rotation_x : number,
            rotation_y : number,
            rotation_z : number
        },
        tonemapping: string
    },
    scene: {
        nodes: string,
        selectedNode: {
            path: string,
            name?: string,
            position: {
                0: number,
                1: number,
                2: number
            },
            rotation: {
                0: number,
                1: number,
                2: number,
                3: number
            },
            scale: {
                0: number,
                1: number,
                2: number
            }
        },
        meshCount?: number,
        vertexCount?: number,
        primitiveCount?: number,
        bounds?: any,
        variant: {
            selected: number
        },
        variants: {
            list: string
        },
        loadTime?: number,
        name?: string
    },
    scripts:{
        fxaa:
        {
            enabled: boolean,
        },
        brightnesscontrast:
        {
            enabled: boolean,
            brightness:number,
            contrast:number
        },
        huesaturation:
        {
            enabled: boolean,
            hue:number,
            saturation:number
        }
        bloom:{
            enabled: boolean,
            bloomIntensity: number,
            bloomThreshold: number,
            blurAmount: number,
        },
        bokeh:{
            enabled: boolean,
            maxBlur: number,
            aperture: number,
            focus: number,
        },
        ssao: {
            enabled: boolean,
            radius: number,
            samples: number,
            brightness: number,
            downscale: number
        },
        vignette:
        {
            enabled: boolean,
            offset: number,
            darkness: number,
        }
    },
    spinner: boolean,
    error?: string,
    glbUrl?: string
}

export type SetProperty = (path: string, value: any) => void;
