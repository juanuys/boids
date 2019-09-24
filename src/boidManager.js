var THREE = require('three')
import Boid from './boid';

export default class BoidManager {
  /**
   *
   * @param {*} numberOfBoids
   * @param {*} obstacles other obstacles in the world to consider when avoiding collisions
   * @param {*} target a target for all boids to move towards
   */
  constructor(scene, numberOfBoids = 20, obstacles = [], target = null) {

    // create the boids
    this.initBoids(scene, numberOfBoids, target)

    // for each boid, add the other boids to its collidableMeshList, and also add
    // the meshes from the common collidableMeshList

    this.obstacles = obstacles
  }

  initBoids(scene, numberOfBoids, target) {
    this.boids = this.boids || [];

    var randomX, randomY, randomZ, colour, followTarget, quaternion

    for (let i = 0; i < numberOfBoids; i++) {
      randomX = Math.random() * 250 - 125
      randomY = Math.random() * 250 - 125
      randomZ = Math.random() * 250 - 125
      colour = null // will use default color in getBoid
      followTarget = false
      quaternion = null

      // reference boid
      if (i === 0) {
        randomX = 0
        randomY = 0
        randomZ = 0
        colour = 0xe56289
        // followTarget = true
        quaternion = null
      }

      var position = new THREE.Vector3(randomX, randomY, randomZ)

      var boid = new Boid(scene, target, position, quaternion, colour, followTarget);
      this.boids.push(boid)
    }
  }

  update(delta) {
    this.boids.forEach(boid => {
      boid.update(delta, this.boids, this.obstacles)
    })
  }
}