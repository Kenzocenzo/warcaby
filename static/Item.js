class Item extends THREE.Mesh {
    constructor(x, a, b) {
        super(); // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha

        if (x == 1) {
            this.texture = new THREE.TextureLoader().load("./textures/black2.jpg");
            this.name = "item_black";
        } else {
            this.texture = new THREE.TextureLoader().load("./textures/white.jpg");
            this.name = "item_white";
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
        this.geometry = new THREE.BoxGeometry(100, 30, 100);
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
