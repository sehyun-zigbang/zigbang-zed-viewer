// --------------- POST EFFECT DEFINITION --------------- //
/**
 * @class
 * @name BrightnessContrastEffect
 * @classdesc Changes the brightness and contrast of the input render target.
 * @description Creates new instance of the post effect.
 * @augments PostEffect
 * @param {GraphicsDevice} graphicsDevice - The graphics device of the application.
 * @property {number} brightness Controls the brightness of the render target. Ranges from -1 to 1 (-1 is solid black, 0 no change, 1 solid white).
 * @property {number} contrast Controls the contrast of the render target. Ranges from -1 to 1 (-1 is solid gray, 0 no change, 1 maximum contrast).
 */
class BrightnessContrastEffect extends pc.PostEffect {
    constructor(graphicsDevice) {
        super(graphicsDevice);

        // Shader author: tapio / http://tapio.github.com/
        this.shader = new pc.Shader(graphicsDevice, {
            attributes: {
                aPosition: pc.SEMANTIC_POSITION
            },
            vshader: [
                "attribute vec2 aPosition;",
                "",
                "varying vec2 vUv0;",
                "",
                "void main(void)",
                "{",
                "    gl_Position = vec4(aPosition, 0.0, 1.0);",
                "    vUv0 = (aPosition.xy + 1.0) * 0.5;",
                "}"
            ].join("\n"),
            fshader: [
                "precision " + graphicsDevice.precision + " float;",
                "",
                "uniform sampler2D uColorBuffer;",
                "uniform float uBrightness;",
                "uniform float uContrast;",
                "",
                "varying vec2 vUv0;",
                "",
                "void main() {",
                "    gl_FragColor = texture2D( uColorBuffer, vUv0 );",
                "    gl_FragColor.rgb += uBrightness;",
                "",
                "    if (uContrast > 0.0) {",
                "        gl_FragColor.rgb = (gl_FragColor.rgb - 0.5) / (1.0 - uContrast) + 0.5;",
                "    } else {",
                "        gl_FragColor.rgb = (gl_FragColor.rgb - 0.5) * (1.0 + uContrast) + 0.5;",
                "    }",
                "}"
            ].join("\n")
        });

        // Uniforms
        this.brightness = 0;
        this.contrast = 0;
    }

    render(inputTarget, outputTarget, rect) {
        var device = this.device;
        var scope = device.scope;

        scope.resolve("uBrightness").setValue(this.brightness);
        scope.resolve("uContrast").setValue(this.contrast);
        scope.resolve("uColorBuffer").setValue(inputTarget.colorBuffer);
        pc.drawFullscreenQuad(device, outputTarget, this.vertexBuffer, this.shader, rect);
    }
}

// ----------------- SCRIPT DEFINITION ------------------ //
var BrightnessContrast = pc.createScript('brightnesscontrast');

BrightnessContrast.attributes.add('brightness', {
    type: 'number',
    default: 0,
    min: -1,
    max: 1,
    title: 'Brightness'
});

BrightnessContrast.attributes.add('contrast', {
    type: 'number',
    default: 0,
    min: -1,
    max: 1,
    title: 'Contrast'
});

BrightnessContrast.prototype.initialize = function () {
    this.effect = new BrightnessContrastEffect(this.app.graphicsDevice);
    this.effect.brightness = this.brightness;
    this.effect.contrast = this.contrast;

    this.on('attr', function (name, value) {
        this.effect[name] = value;
    }, this);

    var queue = this.entity.camera.postEffects;

    //queue.addEffect(this.effect);
    var added = false;
    this.on('state', function (enabled) {
        if(added != enabled)
        {
            added = enabled;
            if (enabled) {
                queue.addEffect(this.effect);
            } else {
                queue.removeEffect(this.effect);
            }
        }
    });

    this.on('destroy', function () {
        queue.removeEffect(this.effect);
    });
};
