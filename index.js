/**
 * 1 unit = 1 cm
 */

var THREE = require('three')
import { OrbitControls } from './lib/controls/OrbitControls';
import { RenderPass } from './lib/postprocessing/RenderPass';
import { ShaderPass } from './lib/postprocessing/ShaderPass';
import { EffectComposer } from './lib/postprocessing/EffectComposer';
import { DepthLimitedBlurShader } from './lib/shaders/DepthLimitedBlurShader';
import { GlitchPass } from './lib/shaders/GlitchPass';
import BoidManager from './src/boidManager';
import { utils } from './src/util'

var scene, camera, renderer, controls, light, lure, boidManager, clock;
var composer
var obstacles = []

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.z = 500;

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // CONTROLS
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 100;
  controls.maxDistance = 1000;
  controls.maxPolarAngle = Math.PI / 2;

  // WORLD OBSTACLES
  var hasObstacles = true
  if (hasObstacles) {
    utils.addObstacle(obstacles, scene, 50, 50, 50, 0xFFFFFF, 200, 200, 200)
    utils.addObstacle(obstacles, scene, 50, 100, 50, 0xFFFFFF, 100, 100, -200)
    utils.addObstacle(obstacles, scene, 100, 50, 50, 0xFFFFFF, -200, 150, 200)
    utils.addObstacle(obstacles, scene, 50, 50, 50, 0xFFFFFF, -150, 150, -200)
    utils.addObstacle(obstacles, scene, 50, 100, 100, 0xA399EE, -20, 300, -20)
    utils.addObstacle(obstacles, scene, 50, 50, 50, 0x555555, 150, -200, 200)
    utils.addObstacle(obstacles, scene, 50, 100, 100, 0x555555, 80, -100, -180)
    utils.addObstacle(obstacles, scene, 100, 50, 100, 0x555555, -220, -150, 180)
    utils.addObstacle(obstacles, scene, 100, 50, 50, 0x555555, -150, -150, -150)
    utils.addObstacle(obstacles, scene, 100, 50, 100, 0x555555, 20, -300, -20)
  }

  // LIGHTS

  //ambient light
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  light = new THREE.PointLight(0xffffff, 0.5, 500);
  light.position.set(0, 100, 0);
  scene.add(light);

  // TARGET

  lure = null
  // lure = new THREE.PointLight(0xffffff, 3, 500);
  // lure.position.set(0, 50, 0);
  // scene.add(lure);
  // var lightHelper = new THREE.PointLightHelper(lure);
  // scene.add(lightHelper);

  // BOIDS
  const numberOfBoids = 300
  boidManager = new BoidManager(scene, numberOfBoids, obstacles, lure)
  boidManager.boids.forEach(boid => {
    scene.add(boid.mesh)
  })

  // CLOCK
  clock = new THREE.Clock();

  var axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);

  // COMPOSER + PASSES
  composer = new EffectComposer(renderer)

  var renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)
  renderPass.renderToScreen = true;

  // var pass1 = new GlitchPass(64)
  // // pass1.goWild = true
  // composer.addPass(pass1)
  // pass1.renderToScreen = true
}

// loop vars
var counter = 0;
var paused = false
var slowPanEnabled = false

function update(delta) {
  counter += 0.001;

  boidManager.update(delta)

  if (slowPanEnabled) {
    camera.lookAt(light.position);
    camera.position.x = Math.sin(counter) * 500;
    camera.position.z = Math.cos(counter) * 500;
  }

  if (lure) {
    lure.position.x = Math.sin(counter * 5) * 400;
    lure.position.y = Math.cos(counter * 10) * 400;
    lure.position.z = Math.cos(counter * 15) * 400;
  }
}

function render() {
  var delta = clock.getDelta();
  if (!paused) {
    update(delta)
  }

  // renderer.render(scene, camera);
  composer.render()
}

var animate = function () {
  requestAnimationFrame(animate);

  // only required if controls.enableDamping = true, or if controls.autoRotate = true
  controls.update();

  render()
};

window.addEventListener('resize', function () {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  var keyCode = event.which;
  if (keyCode == 32) {
    paused = !paused;

    // disable slow-pan so when animation is resumed, the viewer has the controls.
    if (slowPanEnabled) {
      slowPanEnabled = false
    }
  }
};


init()

animate();