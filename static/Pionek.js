class Pionek extends THREE.Mesh {
    constructor(x, a, b) {
        super(); // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
        if (x == 2) {
            this.texture = new THREE.TextureLoader().load("./textures/black.jpg");
            this.name = "pionek_black";
        } else {
            this.texture = new THREE.TextureLoader().load("./textures/white.jpg");
            this.name = "pionek_white";
        }
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: false,
            opacity: 1,
            map: this.texture,
        });
        this.positionx = a;
        this.positionz = b;
        this.geometry = new THREE.CylinderGeometry(45, 45, 30, 64);
    }
    picked() {
        this.material.map = null;
        this.material.needsUpdate = true;
        this.material.color.setHex(0xffff00);
    }
    unpicked() {
        this.material.map = this.texture;
        this.material.color.setHex(0xffffff);
        this.material.needsUpdate = true;
    }
}
