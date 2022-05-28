class Net {
    login(username, x) {
        fetch("/ADD_USER", {
            method: "post",
            body: JSON.stringify({ user: username }),
            headers: { "Content-Type": "application/json" },
        }) // fetch
            .then((response) => response.json())
            .then(
                (data) => x(data) // dane odpowiedzi z serwera
            );
    }
    check(x) {
        fetch("/CHECK", {
            method: "post",
        }) // fetch
            .then((response) => response.json())
            .then(
                (data) => {
                    x(data);
                } // dane odpowiedzi z serwera
            );
    }
    move(x) {
        fetch("/MOVE", {
            method: "post",
            body: JSON.stringify(x),
            headers: { "Content-Type": "application/json" },
        }) // fetch
            .then((response) => response.json())
            .then(
                (data) => {
                    if (data.zbijany != undefined) {
                        console.log("poddaję się");
                        game.zabij(data.zbijany.xc, data.zbijany.zc);
                        game.pionki[data.zbijany.xc][data.zbijany.zc] = 0;
                    }
                    ui.createTab(data.x);
                } // dane odpowiedzi z serwera
            );
    }
    getBoard(x) {
        fetch("/GET_BOARD", {
            method: "post",
        }) // fetch
            .then((response) => response.json())
            .then(
                (data) => {
                    x(data);
                } // dane odpowiedzi z serwera
            );
    }
    win() {
        fetch("/WIN", {
            method: "post",
        }) // fetch
            .then((response) => response.json())
            .then(
                (data) => {} // dane odpowiedzi z serwera
            );
    }
    reset() {
        fetch("/RESET", {
            method: "post",
        });
    }
}
