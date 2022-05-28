class Ui {
    constructor() {
        window.addEventListener("resize", onWindowResize, false);
        function onWindowResize() {
            game.camera.aspect = window.innerWidth / window.innerHeight;
            game.camera.updateProjectionMatrix();

            game.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        let dialog = document.getElementById("dialog");
        this.time = 30;

        dialog.showModal();

        document.getElementById("login").addEventListener("click", () => {
            let username = document.getElementById("input").value;
            if (username == "") return 0;
            net.login(username, (data) => {
                switch (data.x) {
                    case 0:
                        document.getElementById("logger").innerText = "Taki użytkownik już się zalogował";
                        break;
                    case 1:
                        document.getElementById(
                            "header"
                        ).innerHTML = `USER_ADDED</br>Witaj <b>${username}</b>, grasz ${data.y}`;
                        dialog.close();
                        game.createPionki();
                        if (data.y == "czarnymi") game.blackSide();

                        let waiterer = document.getElementById("waiter");
                        waiterer.showModal();
                        let interval = setInterval(() => {
                            this.waiter(interval);
                        }, 500);
                        break;
                    case 2:
                        document.getElementById("logger").innerText = "Maksymalna liczba użytkowników";
                        break;
                }
            });
        });

        document.getElementById("reset").addEventListener("click", () => {
            net.reset();
        });
    }
    waiter(interval) {
        net.check((data) => {
            if (game.color != "black") {
                game.isMoving = true;
            }
            if (data.x >= 2) {
                clearInterval(interval);
                document.getElementById("waiter").close();
                this.createTab(game.pionki);
                this.waitPrzeciwnik();
            }
        });
    }

    createTab(x) {
        let tab = [...x];
        let str = "";
        if (game.color == "black") {
            tab.slice()
                .reverse()
                .forEach((el) => {
                    el.slice()
                        .reverse()
                        .forEach((x) => {
                            str += x.toString();
                            str += " ";
                        });
                    str += "</br>";
                });
        } else {
            tab.forEach((el) => {
                el.forEach((x) => {
                    str += x.toString();
                    str += " ";
                });
                str += "</br>";
            });
        }

        document.getElementById("tab").innerHTML = str;
    }
    waitPrzeciwnik() {
        let dialog = document.getElementById("whenMove");
        if (!game.isMoving) {
            dialog.showModal();
            document.getElementById("timer").innerText = 30;
            this.time = 29;
            let interval = setInterval(() => {
                this.waiter_two(interval);
            }, 1000);
        }
    }
    waiter_two(interval) {
        document.getElementById("timer").innerText = this.time;
        if (this.time == 0) {
            document.getElementById("timer").innerText = "Wygrałeś w grę";
            clearInterval(interval);
            net.win();
        } else
            net.getBoard((data) => {
                if (data.lost == true) {
                    clearInterval(interval);
                    document.getElementById("timer").innerText = "Przegrałeś w grę, rych wykonany po czasie";
                } else if (JSON.stringify(data.tab) != JSON.stringify(game.pionki)) {
                    game.pionki = data.tab;
                    clearInterval(interval);
                    this.createTab(game.pionki);
                    document.getElementById("whenMove").close();
                    game.isMoving = true;
                    game.movePionek(data.id, data.position);

                    if (data.zbijany != undefined) {
                        game.zabij(data.zbijany.xc, data.zbijany.zc);
                    }
                }
            });

        this.time--;
    }
}
