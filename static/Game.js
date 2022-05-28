class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.set(0, 500, 900);
        this.camera.lookAt(this.scene.position);
        this.axes = new THREE.AxesHelper(1000);
        this.scene.add(this.axes);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(0x0066ff);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("root").append(this.renderer.domElement);
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2();
        this.szachownica = [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
        ];
        this.pionki = [
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
        ];
        this.helpBoard = [];
        this.board = new THREE.Object3D();
        this.pionks = new THREE.Object3D();
        this.board.position.set(50, 0, 50);
        this.pionks.position.set(50, 0, 50);
        this.color = "white";
        this.createBoard();
        //this.createPionki();
        this.scene.add(this.board);
        this.scene.add(this.pionks);
        this.pioneczek = "";
        this.isPionek = true;
        this.isMoving = true;
        this.render(); // wywołanie metody render
        this.helpTab = [];
    }
    createBoard() {
        for (let i = -400; i < 400; i += 100) {
            let array = [];
            for (let j = -400; j < 400; j += 100) {
                let material;
                if (this.szachownica[i / 100 + 4][j / 100 + 4] == 0) material = 1;
                else material = 2;
                const item = new Item(material, j / 100 + 4, i / 100 + 4);
                item.position.set(i, 0, j);
                this.board.add(item);
                array.push(item);
            }
            this.helpBoard.push(array);
        }
    }
    checker(x, z) {
        try {
            console.log(this.pionki[x][z]);
            if (this.pionki[x][z] == 0) {
                console.log("pogchamp widzowie");
                let item = this.helpBoard[z][x];
                this.helpTab.push(item);
                item.picked();
            }
            if (this.pionki[x][z] == 1 && this.color == "black") {
                console.log("pogchamp widzowie");
                let i = -1;
                if (z > this.pioneczek.positionz) i = 1;
                if (this.pionki[x + 1][z + i] == 0) {
                    let item = this.helpBoard[z + i][x + 1];
                    this.helpTab.push(item);
                    item.picked();
                }
            }
            if (this.pionki[x][z] == 2 && this.color == "white") {
                console.log("pogchamp widzowie");
                let i = -1;
                if (z > this.pioneczek.positionz) i = 1;
                if (this.pionki[x - 1][z + i] == 0) {
                    let item = this.helpBoard[z + i][x - 1];
                    this.helpTab.push(item);
                    item.picked();
                }
            }
        } catch {
            console.log("pogchamp");
        }
    }
    createPionki() {
        for (let i = -400; i < 400; i += 100) {
            for (let j = -400; j < 400; j += 100) {
                let x = this.pionki[j / 100 + 4][i / 100 + 4];
                if (x != 0) {
                    const pionek = new Pionek(x, j / 100 + 4, i / 100 + 4);
                    this.pionks.add(pionek);
                    pionek.position.set(i, 40, j);
                }
            }
        }
        document.getElementById("changer").addEventListener("click", (e) => {
            this.isPionek = true;
            this.helpTab.forEach((el) => {
                el.unpicked();
            });

            this.helpTab = [];
            this.pioneczek.unpicked();
        });
        window.addEventListener("mousedown", (e) => {
            if (this.isMoving) {
                this.mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
                this.mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
                this.raycaster.setFromCamera(this.mouseVector, this.camera);
                const intersects = this.raycaster.intersectObjects(this.scene.children);
                if (intersects.length > 0) {
                    if (this.isPionek == true) {
                        let x = "pionek_black";
                        if (this.color == "white") x = "pionek_white";
                        if (intersects[0].object.name == x) {
                            console.log(intersects[0].object);
                            this.pioneczek = intersects[0].object;
                            intersects[0].object.picked();
                            this.isPionek = false;
                            let z = -1;
                            if (this.color == "black") z = 1;
                            this.checker(this.pioneczek.positionx + z, this.pioneczek.positionz - 1);
                            this.checker(this.pioneczek.positionx + z, this.pioneczek.positionz + 1);
                            console.log(this.helpTab);
                        }
                    } else {
                        if (intersects[0].object.name == "item_black") {
                            if (intersects[0].object == this.helpTab[0] || intersects[0].object == this.helpTab[1]) {
                                this.helpTab.forEach((el) => el.unpicked());
                                this.helpTab = [];

                                let tab = intersects[0].object;
                                // this.pioneczek.position.set(tab.position.x, 40, tab.position.z);

                                this.pioneczek.unpicked();
                                this.isPionek = true;
                                const move = new TWEEN.Tween(this.pioneczek.position) // co
                                    .to({ x: tab.position.x, z: tab.position.z }, 500) // do jakiej pozycji, w jakim czasie
                                    .repeat(0) // liczba powtórzeń
                                    .easing(TWEEN.Easing.Cubic.Out) // typ easingu (zmiana w czasie)
                                    .onUpdate(() => {
                                        //console.log(this.pioneczek.position);
                                    })
                                    .onComplete(() => {
                                        console.log("koniec animacji");
                                    }) // funkcja po zakończeniu animacji
                                    .start();
                                let body = {
                                    xa: this.pioneczek.positionx,
                                    za: this.pioneczek.positionz,
                                    xb: tab.position.z / 100 + 4,
                                    zb: tab.position.x / 100 + 4,
                                    color: this.pioneczek.name,
                                    id: this.pioneczek.id,
                                };

                                this.isMoving = false;
                                this.pionki[body.xa][body.za] = 0;
                                this.pionki[body.xb][body.zb] = body.color == "pionek_white" ? 1 : 2;
                                this.pioneczek.positionx = tab.position.z / 100 + 4;
                                this.pioneczek.positionz = tab.position.x / 100 + 4;
                                net.move(body);

                                ui.waitPrzeciwnik();
                            }
                        }
                    }
                }
            }
        });
    }
    blackSide() {
        this.camera.position.set(0, 500, -900);
        this.camera.lookAt(this.scene.position);
        this.color = "black";
        this.isMoving = false;
    }
    zabij(x, z) {
        console.log(this.pionki[x][z]);
        console.log(x);
        console.log(z);
        this.pionki[x][z] == 0;
        this.pionks.children.forEach((el) => {
            if (el.positionx == x && el.positionz == z) {
                console.log(el);
                this.pionks.remove(el);
                this.scene.remove(el);
            }
        });
    }
    movePionek(id, position) {
        let pion = this.pionks.getObjectById(id);
        console.log(pion.positionx);
        console.log(pion.positionz);
        pion.positionx = position.x;
        pion.positionz = position.z;
        //pion.positionx = position.z
        const mover = new TWEEN.Tween(pion.position) // co
            .to({ x: (position.z - 4) * 100, z: (position.x - 4) * 100 }, 500) // do jakiej pozycji, w jakim czasie
            .repeat(0) // liczba powtórzeń
            .easing(TWEEN.Easing.Cubic.Out) // typ easingu (zmiana w czasie)
            .onUpdate(() => {
                //console.log(this.pioneczek.position);
            })
            .onComplete(() => {}) // funkcja po zakończeniu animacji
            .start();
        // pion.position.x = (position.z - 4) * 100;
        // pion.position.z = (position.x - 4) * 100;
    }
    render = () => {
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
        TWEEN.update();
    };
}
