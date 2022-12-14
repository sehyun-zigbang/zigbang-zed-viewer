import React from 'react';
import { Panel, Container } from '@playcanvas/pcui/react/unstyled';
import { SetProperty, ObserverData } from '../../types';

import { Vector, Detail, Select, Slider, Toggle } from '../components';

const toggleCollapsed = () => {
    const leftPanel = document.getElementById('panel-left');
    if (leftPanel) {
        leftPanel.classList.toggle('collapsed');
    }
};

let leftPanel: any;
const openPanel = () => {
    if (!leftPanel) {
        leftPanel = document.getElementById('panel-left');
    }
    if (leftPanel && leftPanel.classList.contains('collapsed')) {
        leftPanel.classList.remove('collapsed');
    }
};

class ScenePanel extends React.Component <{ sceneData: ObserverData['scene'], setProperty: SetProperty }> {
    shouldComponentUpdate(nextProps: Readonly<{ sceneData: ObserverData['scene']; setProperty: SetProperty; }>): boolean {
        return (
            nextProps.sceneData.loadTime !== this.props.sceneData.loadTime ||
            nextProps.sceneData.meshCount !== this.props.sceneData.meshCount ||
            nextProps.sceneData.vertexCount !== this.props.sceneData.vertexCount ||
            nextProps.sceneData.primitiveCount !== this.props.sceneData.primitiveCount ||
            nextProps.sceneData.bounds !== this.props.sceneData.bounds ||
            nextProps.sceneData.variant.selected !== this.props.sceneData.variant.selected ||
            nextProps.sceneData.variants.list !== this.props.sceneData.variants.list
        );
    }

    render() {
        const scene = this.props.sceneData;
        const variantListOptions: Array<{ v:string, t:string }> = JSON.parse(scene.variants.list).map((variant: string) => ({ v: variant, t: variant }));
        return (
            <Panel headerText='SCENE' id='scene-panel' flexShrink={0} flexGrow={0} collapsible={true} >
                <Detail label='NAME' value={scene.name} />
                <Detail label='Load time' value={scene.loadTime} />
                <Detail label='Meshes' value={scene.meshCount} />
                <Detail label='Verts' value={scene.vertexCount} />
                <Detail label='Primitives' value={scene.primitiveCount} />
                <Vector label='Bounds' dimensions={3} value={scene.bounds} enabled={false}/>
                <Select label='Variant' type='string' options={variantListOptions} value={scene.variant.selected}
                    setProperty={(value: string) => {
                        this.props.setProperty('scene.variant.selected', value);
                    }}
                    enabled={ variantListOptions.length > 0 }
                />
            </Panel>
        );
    }
}
class CameraPanel extends React.Component <{ observerData: ObserverData, setProperty: SetProperty }> {
    shouldComponentUpdate(nextProps: Readonly<{ observerData: ObserverData; setProperty: SetProperty; }>): boolean {
        return JSON.stringify(nextProps.observerData) !== JSON.stringify(this.props.observerData);
    }

    render() {
        const props = this.props;
        return (
            <Panel headerText='CAMERA' id='scene-panel' flexShrink={0} flexGrow={0} collapsible={true} collapsed={true}>
                <Slider label='Fov' precision={0} min={20} max={70} value={props.observerData.show.fov} setProperty={(value: number) => props.setProperty('show.fov', value)} />
                <Select label='Tonemap' type='string' options={['Linear', 'Filmic', 'Hejl', 'ACES'].map(v => ({ v, t: v }))} value={props.observerData.lighting.tonemapping} setProperty={(value: number) => props.setProperty('lighting.tonemapping', value)} />
                <Toggle label='FXAA' value={props.observerData.scripts.fxaa.enabled} setProperty={(value: boolean) => props.setProperty('scripts.fxaa.enabled', value)} />
                <Toggle label='Post Process' value={props.observerData.show.postprocess} setProperty={(value: boolean) => props.setProperty('show.postprocess', value)} />
            </Panel>
        );
    }
}
class EnvironmentPanel extends React.Component <{ lightingData: ObserverData['lighting'], uiData: ObserverData['ui'], setProperty: SetProperty }> {
    shouldComponentUpdate(nextProps: Readonly<{ lightingData: ObserverData['lighting']; uiData: ObserverData['ui']; setProperty: SetProperty; }>): boolean {
        return JSON.stringify(nextProps.lightingData) !== JSON.stringify(this.props.lightingData) || JSON.stringify(nextProps.uiData) !== JSON.stringify(this.props.uiData);
    }

    render() {
        const props = this.props;
        return (
            <Panel headerText='ENVIRONMENT' id='scene-panel' flexShrink={0} flexGrow={0} collapsible={true} collapsed={true}>
                    <Select label='Environment' type='string' options={JSON.parse(props.lightingData.env.options)} value={props.lightingData.env.value} setProperty={(value: string) => props.setProperty('lighting.env.value', value)} />
                    <Select label='Skybox Level' type='number' options={[0, 1, 2, 3, 4, 5, 6].map(v => ({ v: v, t: v === 0 ? 'Disable' : Number(v - 1).toString() }))} value={props.lightingData.env.skyboxMip} setProperty={(value: number) => props.setProperty('lighting.env.skyboxMip', value)} />
                    <Slider label='Exposure' precision={2} min={-6} max={6} value={props.lightingData.env.exposure} setProperty={(value: number) => props.setProperty('lighting.env.exposure', value)} />
                    <Slider label='Rotation' precision={0} min={-180} max={180} value={props.lightingData.env.rotation} setProperty={(value: number) => props.setProperty('lighting.env.rotation', value)} />
            </Panel>
        );
    }
}
class LightingPanel extends React.Component <{ lightingData: ObserverData['lighting'], uiData: ObserverData['ui'], setProperty: SetProperty }> {
    shouldComponentUpdate(nextProps: Readonly<{ lightingData: ObserverData['lighting']; uiData: ObserverData['ui']; setProperty: SetProperty; }>): boolean {
        return JSON.stringify(nextProps.lightingData) !== JSON.stringify(this.props.lightingData) || JSON.stringify(nextProps.uiData) !== JSON.stringify(this.props.uiData);
    }

    render() {
        const props = this.props;
        return (
            <Panel headerText='LIGHTING' id='scene-panel' flexShrink={0} flexGrow={0} collapsible={true} collapsed={true}>
                    <Slider label='Intencity' precision={2} min={0} max={6} value={props.lightingData.mainLight.intencity} setProperty={(value: number) => props.setProperty('lighting.mainLight.intencity', value)} />
                    <Slider label='Color_R' precision={0} min={0} max={255} value={props.lightingData.mainLight.color_r} setProperty={(value: number) => props.setProperty('lighting.mainLight.color_r', value)} />
                    <Slider label='Color_G' precision={0} min={0} max={255} value={props.lightingData.mainLight.color_g} setProperty={(value: number) => props.setProperty('lighting.mainLight.color_g', value)} />
                    <Slider label='Color_B' precision={0} min={0} max={255} value={props.lightingData.mainLight.color_b} setProperty={(value: number) => props.setProperty('lighting.mainLight.color_b', value)} />
                    <Slider label='Rotation_x' precision={0} min={-180} max={180} value={props.lightingData.mainLight.rotation_x} setProperty={(value: number) => props.setProperty('lighting.mainLight.rotation_x', value)} />
                    <Slider label='Rotation_y' precision={0} min={-180} max={180} value={props.lightingData.mainLight.rotation_y} setProperty={(value: number) => props.setProperty('lighting.mainLight.rotation_y', value)} />
                    <Slider label='Rotation_z' precision={0} min={-180} max={180} value={props.lightingData.mainLight.rotation_z} setProperty={(value: number) => props.setProperty('lighting.mainLight.rotation_z', value)} />
                    <Toggle label='Shadow' value={props.lightingData.mainLight.shadow} setProperty={(value: boolean) => props.setProperty('lighting.mainLight.shadow', value)} />
                    <Select label='Shadow Resolution' value={props.lightingData.mainLight.shadowResolution} type='number' options={[512, 1024, 2048, 4096].map(v => ({ v: v, t: Number(v).toString() }))} setProperty={(value: number) => props.setProperty('lighting.mainLight.shadowResolution', value)} />
                    <Slider label='Shadow Intencity' precision={2} min={0} max={5} value={props.lightingData.mainLight.shadowIntencity} setProperty={(value: number) => props.setProperty('lighting.mainLight.shadowIntencity', value)} />
            </Panel>
        );
    }
}
class SubLightingPanel extends React.Component <{ lightingData: ObserverData['lighting'], uiData: ObserverData['ui'], setProperty: SetProperty }> {
    shouldComponentUpdate(nextProps: Readonly<{ lightingData: ObserverData['lighting']; uiData: ObserverData['ui']; setProperty: SetProperty; }>): boolean {
        return JSON.stringify(nextProps.lightingData) !== JSON.stringify(this.props.lightingData) || JSON.stringify(nextProps.uiData) !== JSON.stringify(this.props.uiData);
    }

    render() {
        const props = this.props;
        return (
            <Panel headerText='SUB LIGHTING' id='scene-panel' flexShrink={0} flexGrow={0} collapsible={true} collapsed={true}>
                    <Slider label='Intencity' precision={2} min={0} max={6} value={props.lightingData.subLight.intencity} setProperty={(value: number) => props.setProperty('lighting.subLight.intencity', value)} />
                    <Slider label='Color_R' precision={0} min={0} max={255} value={props.lightingData.subLight.color_r} setProperty={(value: number) => props.setProperty('lighting.subLight.color_r', value)} />
                    <Slider label='Color_G' precision={0} min={0} max={255} value={props.lightingData.subLight.color_g} setProperty={(value: number) => props.setProperty('lighting.subLight.color_g', value)} />
                    <Slider label='Color_B' precision={0} min={0} max={255} value={props.lightingData.subLight.color_b} setProperty={(value: number) => props.setProperty('lighting.subLight.color_b', value)} />
                    <Slider label='Rotation_x' precision={0} min={-180} max={180} value={props.lightingData.subLight.rotation_x} setProperty={(value: number) => props.setProperty('lighting.subLight.rotation_x', value)} />
                    <Slider label='Rotation_y' precision={0} min={-180} max={180} value={props.lightingData.subLight.rotation_y} setProperty={(value: number) => props.setProperty('lighting.subLight.rotation_y', value)} />
                    <Slider label='Rotation_z' precision={0} min={-180} max={180} value={props.lightingData.subLight.rotation_z} setProperty={(value: number) => props.setProperty('lighting.subLight.rotation_z', value)} />
            </Panel>
        );
    }
}
class SSAOPanel extends React.Component <{ scripts: ObserverData['scripts'], setProperty: SetProperty }> {
    shouldComponentUpdate(nextProps: Readonly<{ scripts: ObserverData['scripts']; setProperty: SetProperty; }>): boolean {
        return JSON.stringify(nextProps.scripts) !== JSON.stringify(this.props.scripts);
    }

    render() {
        const props = this.props;
        return (
            <Panel headerText='SSAO' id='scene-panel' flexShrink={0} flexGrow={0} collapsible={true} collapsed={true}>
                <Toggle label='Enable' value={props.scripts.ssao.enabled} setProperty={(value: boolean) => props.setProperty('scripts.ssao.enabled', value)} />
                <Slider label='Radius' precision={2} min={0} max={10} value={props.scripts.ssao.radius} setProperty={(value: number) => props.setProperty('scripts.ssao.radius', value)} />
                <Slider label='Samples' precision={2} min={0} max={32} value={props.scripts.ssao.samples} setProperty={(value: number) => props.setProperty('scripts.ssao.samples', value)} />
                <Slider label='Brightness' precision={2} min={0} max={1} value={props.scripts.ssao.brightness} setProperty={(value: number) => props.setProperty('scripts.ssao.brightness', value)} />
                <Select label='Downscale' value={props.scripts.ssao.downscale} type='number' options={[{ v: 1, t: 'None' }, { v: 2, t: '50%' }, { v: '4', t: '25%' }]} setProperty={(value: number) => props.setProperty('scripts.ssao.downscale', value)} />
            </Panel>
        );
    }
}
class BloomPanel extends React.Component <{ scripts: ObserverData['scripts'], setProperty: SetProperty }> {
    shouldComponentUpdate(nextProps: Readonly<{ scripts: ObserverData['scripts']; setProperty: SetProperty; }>): boolean {
        return JSON.stringify(nextProps.scripts) !== JSON.stringify(this.props.scripts);
    }

    render() {
        const props = this.props;
        return (
            <Panel headerText='BLOOM' id='scene-panel' flexShrink={0} flexGrow={0} collapsible={true} collapsed={true}>
                <Toggle label='Enable' value={props.scripts.bloom.enabled} setProperty={(value: boolean) => props.setProperty('scripts.bloom.enabled', value)} />
                <Slider label='Intensity' precision={2} min={0} max={1} value={props.scripts.bloom.bloomIntensity} setProperty={(value: number) => props.setProperty('scripts.bloom.bloomIntensity', value)} />
                <Slider label='Threshold' precision={2} min={0} max={1} value={props.scripts.bloom.bloomThreshold} setProperty={(value: number) => props.setProperty('scripts.bloom.bloomThreshold', value)} />
                <Slider label='Amount' precision={2} min={1} max={30} value={props.scripts.bloom.blurAmount} setProperty={(value: number) => props.setProperty('scripts.bloom.blurAmount', value)} />
            </Panel>
        );
    }
}
class ColorAdjustPanel extends React.Component <{ scripts: ObserverData['scripts'], setProperty: SetProperty }> {
    shouldComponentUpdate(nextProps: Readonly<{ scripts: ObserverData['scripts']; setProperty: SetProperty; }>): boolean {
        return JSON.stringify(nextProps.scripts) !== JSON.stringify(this.props.scripts);
    }

    render() {
        const props = this.props;
        return (
            <Panel headerText='COLOR' id='scene-panel' flexShrink={0} flexGrow={0} collapsible={true} collapsed={true}>
                <Toggle label='Enable' value={props.scripts.brightnesscontrast.enabled} setProperty={(value: boolean) => props.setProperty('scripts.brightnesscontrast.enabled', value)} />
                <Slider label='Brightness' precision={2} min={-1} max={1} value={props.scripts.brightnesscontrast.brightness} setProperty={(value: number) => props.setProperty('scripts.brightnesscontrast.brightness', value)} />
                <Slider label='Contrast' precision={2} min={-1} max={1} value={props.scripts.brightnesscontrast.contrast} setProperty={(value: number) => props.setProperty('scripts.brightnesscontrast.contrast', value)} />
                <Toggle label='Enable' value={props.scripts.huesaturation.enabled} setProperty={(value: boolean) => props.setProperty('scripts.huesaturation.enabled', value)} />
                <Slider label='Hue' precision={2} min={-1} max={1} value={props.scripts.huesaturation.hue} setProperty={(value: number) => props.setProperty('scripts.huesaturation.hue', value)} />
                <Slider label='Saturation' precision={2} min={-1} max={1} value={props.scripts.huesaturation.saturation} setProperty={(value: number) => props.setProperty('scripts.huesaturation.saturation', value)} />
            </Panel>
        );
    }
}
class VinettePanel extends React.Component <{ scripts: ObserverData['scripts'], setProperty: SetProperty }> {
    shouldComponentUpdate(nextProps: Readonly<{ scripts: ObserverData['scripts']; setProperty: SetProperty; }>): boolean {
        return JSON.stringify(nextProps.scripts) !== JSON.stringify(this.props.scripts);
    }

    render() {
        const props = this.props;
        return (
            <Panel headerText='VINETTE' id='scene-panel' flexShrink={0} flexGrow={0} collapsible={true} collapsed={true}>
                <Toggle label='Enable' value={props.scripts.vignette.enabled} setProperty={(value: boolean) => props.setProperty('scripts.vignette.enabled', value)} />
                <Slider label='Offset' precision={2} min={0} max={2} value={props.scripts.vignette.offset} setProperty={(value: number) => props.setProperty('scripts.vignette.offset', value)} />
                <Slider label='Darkness' precision={2} min={0} max={1} value={props.scripts.vignette.darkness} setProperty={(value: number) => props.setProperty('scripts.vignette.darkness', value)} />
            </Panel>
        );
    }
}
class DOFPanel extends React.Component <{ scripts: ObserverData['scripts'], setProperty: SetProperty }> {
    shouldComponentUpdate(nextProps: Readonly<{ scripts: ObserverData['scripts']; setProperty: SetProperty; }>): boolean {
        return JSON.stringify(nextProps.scripts) !== JSON.stringify(this.props.scripts);
    }

    render() {
        const props = this.props;
        return (
            <Panel headerText='DOF' id='scene-panel' flexShrink={0} flexGrow={0} collapsible={true} collapsed={true}>
                <Toggle label='Enable' value={props.scripts.bokeh.enabled} setProperty={(value: boolean) => props.setProperty('scripts.bokeh.enabled', value)} />
                <Slider label='MaxBlur' precision={3} min={0} max={0.1} value={props.scripts.bokeh.maxBlur} setProperty={(value: number) => props.setProperty('scripts.bokeh.maxBlur', value)} />
                <Slider label='Aperture' precision={3} min={0} max={0.2} value={props.scripts.bokeh.aperture} setProperty={(value: number) => props.setProperty('scripts.bokeh.aperture', value)} />
            </Panel>
        );
    }
}
class ShowPanel extends React.Component <{ showData: ObserverData['show'], setProperty: SetProperty }> {
    shouldComponentUpdate(nextProps: Readonly<{ showData: ObserverData['show'], setProperty: SetProperty }>): boolean {
        return JSON.stringify(nextProps.showData) !== JSON.stringify(this.props.showData);
    }

    render() {
        const props = this.props;
        return (
            <Panel headerText='DEBUG' id='scene-panel' flexShrink={0} flexGrow={0} collapsible={true} collapsed={true}>
                    <Toggle label='Grid' value={props.showData.grid} setProperty={(value: boolean) => props.setProperty('show.grid', value)}/>
                    <Toggle label='Stats' value={props.showData.stats} setProperty={(value: boolean) => props.setProperty('show.stats', value)}/>
                    <Toggle label='Depth' value={props.showData.depth} setProperty={(value: boolean) => props.setProperty('show.depth', value)}/>
            </Panel>
        );
    }
}

class LeftPanel extends React.Component <{ observerData: ObserverData, setProperty: SetProperty }> {
    isMobile: boolean;
    constructor(props: any) {
        super(props);
        this.isMobile = (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    }

    shouldComponentUpdate(nextProps: Readonly<{ observerData: ObserverData; setProperty: SetProperty; }>): boolean {
        return JSON.stringify(nextProps.observerData.scene) !== JSON.stringify(this.props.observerData.scene);
    }

    componentDidMount(): void {
        // set up the control panel toggle button
        // @ts-ignore
        document.getElementById('panel-toggle').addEventListener('click', function () {
            toggleCollapsed();
        });
        // @ts-ignore
        document.getElementById('title').addEventListener('click', function () {
            toggleCollapsed();
        });
        // we require this setTimeout because panel isn't yet created and so fails
        // otherwise.
        setTimeout(() => toggleCollapsed());
    }

    componentDidUpdate(prevProps: Readonly<{ observerData: ObserverData; setProperty: SetProperty; }>): void {
        if (!this.isMobile && prevProps.observerData.scene.nodes === '[]' && this.props.observerData.scene.nodes !== '[]') {
            //openPanel();
        }
    }

    render() {
        const scene = this.props.observerData.scene;
        return (
            <Container id='scene-container' flex>
                <div id='scene-scrolly-bits'>
                    <ScenePanel sceneData={scene} setProperty={this.props.setProperty} />
                    <CameraPanel setProperty={this.props.setProperty} observerData={this.props.observerData} />
                    <EnvironmentPanel setProperty={this.props.setProperty} lightingData={this.props.observerData.lighting} uiData={this.props.observerData.ui} />
                    <LightingPanel setProperty={this.props.setProperty} lightingData={this.props.observerData.lighting} uiData={this.props.observerData.ui} />
                    {/* <SubLightingPanel setProperty={this.props.setProperty} lightingData={this.props.observerData.lighting} uiData={this.props.observerData.ui} /> */}
                    {/* <LightingBakePanel setProperty={this.props.setProperty} lighting={this.props.observerData.lighting}/> */}
                    <ColorAdjustPanel setProperty={this.props.setProperty} scripts={this.props.observerData.scripts} />
                    <BloomPanel setProperty={this.props.setProperty} scripts={this.props.observerData.scripts} />
                    <DOFPanel setProperty={this.props.setProperty} scripts={this.props.observerData.scripts} />
                    <VinettePanel setProperty={this.props.setProperty} scripts={this.props.observerData.scripts} />
                    <SSAOPanel setProperty={this.props.setProperty} scripts={this.props.observerData.scripts} />
                    <ShowPanel setProperty={this.props.setProperty} showData={this.props.observerData.show}/>    
                </div>
            </Container>
        );
    }
}

export default LeftPanel;
