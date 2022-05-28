var express = require("express");
var app = express();
const PORT = 3000;
var path = require("path");
const fs = require("fs");
app.use(express.json());
app.use(express.static("static")); // serwuje stronę index.html
//const cors = require("cors");
//app.use(cors());

// przykładowy get obsługujący request ze strony

let users = [];
let czyZbijany = false;
let zbited = {};
let currentTab = [
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
];
let position = {};
let id = 0;
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"));
    console.log(__dirname);
});
app.post("/ADD_USER", (req, res) => {
    let username = req.body.user;
    // res.setHeader("content-type", "application/json");
    if (users.length < 2)
        if (users.indexOf(username) >= 0) res.json({ x: 0 });
        else {
            users.push(username);
            console.log(users);
            let y = "czarnymi";
            if (users.length == 1) y = "białymi";
            res.json({ x: 1, y: y });
        }
    else res.json({ x: 2 });
});
app.post("/RESET", (req, res) => {
    users = [];
    czyZbijany = false;
    zbited = {};
    currentTab = [
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
    ];
    id = 0;
    position = {};
    console.log("zresetowano");
});
app.post("/CHECK", (req, res) => {
    res.json({ x: users.length });
});
app.post("/MOVE", (req, res) => {
    let body = req.body;
    console.log(body);
    currentTab[body.xa][body.za] = 0;
    currentTab[body.xb][body.zb] = body.color == "pionek_white" ? 1 : 2;
    id = body.id;
    position = { x: body.xb, z: body.zb };
    if (Math.abs(body.xa - body.xb) == 2) {
        let xc = body.xa - 1;
        if (body.xb > body.xa) xc = body.xa + 1;
        let zc = body.za - 1;
        if (body.zb > body.za) zc = body.za + 1;
        currentTab[xc][zc] = 0;
        let zbijany = { xc: xc, zc: zc };
        czyZbijany = true;
        zbited = zbijany;
        res.json({ x: currentTab, zbijany: zbijany });
        return 0;
    }
    console.log("sex");

    res.json({ x: currentTab });
});
app.post("/GET_BOARD", (req, res) => {
    if (czyZbijany) {
        czyZbijany = false;
        res.json({ tab: currentTab, id: id, position: position, zbijany: zbited });
        return 0;
    }
    res.json({ tab: currentTab, id: id, position: position });
});

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT);
});
