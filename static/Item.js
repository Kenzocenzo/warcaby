class Item extends THREE.Mesh {

    constructor(x,a,b) {
        super() // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha

        if (x == 1) {
            this.material = new THREE.MeshBasicMaterial({
                color: 0x000000,
                side: THREE.DoubleSide,
                wireframe: false,
                transparent: false,

            });
            this.name = "item_black"
        }
        else {
            this.material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false,
                transparent: false,

            });
            this.name = "item_white"
        }
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
        this.material.color.setHex(0x000000);
        this.material.needsUpdate = true;
    }
}