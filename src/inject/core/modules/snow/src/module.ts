import { Module, injectify } from '../../../definitions/module'

/**
 * https://codepen.io/loktar00/pen/CHpGo
 */
let blocking = 'pointer-events:none'
let opacity = 0.5
let id = (+new Date()).toString()

/**
 * Parse params
 */
if (Module.params == true) blocking = ''
if (typeof Module.params == 'object') {
  if (Module.params.opacity) opacity = Module.params.opacity
  if (Module.params.blocking) blocking = ''
};

(function() {
    // @ts-ignore
    let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    window.requestAnimationFrame = requestAnimationFrame;
})();

/**
 * Load some custom CSS with the style module
 */
injectify.module('style', 'body{overflow-x:hidden}canvas{opacity:' + opacity + ';position:absolute;top:0;left:0;z-index:999;' + blocking + '}')

/**
 * Create a canvas element
 */
let canvas = document.createElement('canvas')
document.body.appendChild(canvas)

let flakes = []
let ctx = canvas.getContext("2d")
let flakeCount = 400
let mX = -100
let mY = -100

canvas.width = window.innerWidth;
canvas.height = document.body.scrollHeight;
canvas.id = id

function snow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < flakeCount; i++) {
        let flake = flakes[i],
            x = mX,
            y = mY,
            minDist = 150,
            x2 = flake.x,
            y2 = flake.y

        let dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
            dx = x2 - x,
            dy = y2 - y

        if (dist < minDist) {
            let force = minDist / (dist * dist),
                xcomp = (x - x2) / dist,
                ycomp = (y - y2) / dist,
                deltaV = force / 2

            flake.velX -= deltaV * xcomp
            flake.velY -= deltaV * ycomp

        } else {
            flake.velX *= .98;
            if (flake.velY <= flake.speed) {
                flake.velY = flake.speed
            }
            flake.velX += Math.cos(flake.step += .05) * flake.stepSize
        }

        ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
        flake.y += flake.velY
        flake.x += flake.velX

        if (flake.y >= canvas.height || flake.y <= 0) {
            reset(flake)
        }


        if (flake.x >= canvas.width || flake.x <= 0) {
            reset(flake)
        }

        ctx.beginPath()
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fill()
    }
    requestAnimationFrame(snow)
};

function reset(flake) {
    flake.x = Math.floor(Math.random() * canvas.width)
    flake.y = 0
    flake.size = (Math.random() * 3) + 2
    flake.speed = (Math.random() * 1) + 0.5
    flake.velY = flake.speed
    flake.velX = 0
    flake.opacity = (Math.random() * 0.5) + 0.3
}

function init() {
    for (let i = 0; i < flakeCount; i++) {
        let x = Math.floor(Math.random() * canvas.width),
            y = Math.floor(Math.random() * canvas.height),
            size = (Math.random() * 3) + 2,
            speed = (Math.random() * 1) + 0.5,
            opacity = (Math.random() * 0.5) + 0.3

        flakes.push({
            speed: speed,
            velY: speed,
            velX: 0,
            x: x,
            y: y,
            size: size,
            stepSize: (Math.random()) / 30,
            step: 0,
            opacity: opacity
        })
    }

    snow()
}

canvas.addEventListener("mousemove", function(e) {
    mX = e.clientX,
    mY = e.clientY
})

window.addEventListener("resize", function() {
    canvas.width = window.innerWidth
    canvas.height = document.body.scrollHeight
})

init()
Module.resolve(document.getElementById(id))
