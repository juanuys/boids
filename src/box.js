var THREE = require('three')

export default class Box {
  constructor(width = 100, height = 100, depth = 100, color = 0xffffff) {
      const geometry = new THREE.BoxGeometry(width, height, depth, 1, 1, 1);

      this.mesh = new THREE.Group();
      var lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05 });
      const meshMaterial = new THREE.MeshLambertMaterial({
          color,
          transparent: true,
          opacity: 0.9,
          wireframe: false,
          depthWrite: false,
          blending: THREE.NormalBlending
      });
      this.mesh.add(new THREE.Mesh(geometry, meshMaterial));
      this.mesh.add(new THREE.LineSegments(new THREE.WireframeGeometry(geometry), lineMaterial));
  }
}