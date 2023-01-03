"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameGateway = exports.Game = exports.gametodatabase = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const games_service_1 = require("./games.service");
const min = (a, b) => {
    return a < b ? a : b;
};
const max = (a, b) => {
    return a > b ? a : b;
};
class gametodatabase {
    constructor() {
        this.scorewin = 0;
        this.scorelose = 0;
    }
}
exports.gametodatabase = gametodatabase;
class Game {
    constructor(server) {
        this.server = server;
        this.width = 800;
        this.height = 400;
        this.aspectRatio = 2;
        this.initBallX = this.width / 2;
        this.initBallY = this.height / 2;
        this.ballRadius = 10;
        this.ballSpeed = 3;
        this.paddleWidth = 10;
        this.paddleHeight = 100;
        this.paddleSpeed = 10;
        this.ballX = this.initBallX;
        this.ballY = this.initBallY;
        this.ballDirX = 1;
        this.ballDirY = 1;
        this.exportgame;
        this.paddleOneX = 0;
        this.paddleOneY = 0;
        this.paddleTwoX = this.width - this.paddleWidth;
        this.paddleTwoY = 0;
        this.exportgame = new gametodatabase();
        this.state = "waiting";
        this.players = [];
        this.room = "";
        this.exportgame.scorewin = 0;
        this.exportgame.scorelose = 0;
        this.scores = [0, 0];
        this.maxScore = 2;
        this.rounds = 2;
        this.roundsWin = [0, 0];
        this.winner = "";
        this.lastscored = "";
        this.mod = "";
    }
    setMod(name) { this.mod = name; }
    getMod() { return this.mod; }
    cleanup() {
        clearInterval(this.loop);
    }
    getPlayers() { return this.players; }
    playerDisconnect(id) {
        if (this.players[0] === id) {
            this.winner = this.players[1];
            this.exportgame.scorewin = this.scores[1];
            this.exportgame.scorelose = this.scores[0];
            this.exportgame.winnerid = this.player2id;
            this.exportgame.loserid = this.player1id;
        }
        else {
            this.winner = this.players[0];
            this.exportgame.scorewin = this.scores[0];
            this.exportgame.scorelose = this.scores[1];
            this.exportgame.winnerid = this.player1id;
            this.exportgame.loserid = this.player2id;
        }
        this.setState("disconnect");
        console.log('here');
        this.gameservice.pushgame(this.exportgame, this.index);
        this.server.to(this.room).emit("gameState", this.getGameState());
        this.cleanup();
    }
    addPlayer(socket, playerid) {
        if (this.players.length === 0) {
            this.player1id = playerid;
        }
        if (this.players.length === 1) {
            this.player2id = playerid;
        }
        if (this.players.length < 2) {
            this.players.push(socket.id);
        }
        if (this.players.length === 2) {
            this.lastscored = this.players[0];
            this.index = this.gameservice.gametolive({
                p1: this.player1id, p2: this.player2id,
                score1: 0,
                score2: 0,
                rounds1: 0,
                rounds2: 0
            });
            this.run();
            this.setState("init");
        }
    }
    addSpec(id) {
        this.spectators.push(id);
    }
    setRoomName(name) { this.room = name; }
    getRoomName() { return this.room; }
    ;
    setState(state) { this.state = state; }
    getState() { return this.state; }
    async run() {
        let fps = 60;
        let i = 0;
        this.loop = setInterval(() => {
            if (this.state != "init") {
                this.updateBall();
                this.handlePaddleOneBounce();
                this.handlePaddleTwoBounce();
                this.updateScore();
            }
            if (i % 200 === 0) {
            }
            i++;
            this.server.to(this.room).emit("gameState", this.getGameState());
        }, 1000 / fps);
    }
    initRound(id) {
        this.scores[0] = 0;
        this.scores[1] = 0;
        console.log("player " + this.players.indexOf(id) + " inited the round");
        if (id === this.players[0]) {
            this.ballX = this.width / 10;
            this.ballY = this.height / 5;
            this.ballDirX *= -1;
        }
        else if (id === this.players[1]) {
            this.ballX = this.width * (9 / 10);
            this.ballY = this.height / 5;
            this.ballDirX *= -1;
        }
    }
    initGame(id) {
        if (id === this.players[0]) {
            this.ballX = this.width / 10;
            this.ballY = this.height / 5;
            this.ballDirX *= -1;
        }
        else if (id === this.players[1]) {
            this.ballX = this.width * (9 / 10);
            this.ballY = this.height / 5;
            this.ballDirX *= -1;
        }
    }
    updateBall() {
        this.ballX += this.ballSpeed * this.ballDirX;
        this.ballY += this.ballSpeed * this.ballDirY;
        if (this.ballX + this.ballRadius / 2 >= this.width || this.ballX - this.ballRadius / 2 <= 0)
            this.ballDirX *= -1;
        if (this.ballY + this.ballRadius / 2 >= this.height || this.ballY - this.ballRadius / 2 <= 0)
            this.ballDirY *= -1;
    }
    updateScore() {
        if (this.ballX > this.paddleTwoX) {
            console.log("scored1");
            this.scores[0]++;
            this.lastscored = this.players[0];
            if (this.scores[0] === this.maxScore) {
                this.roundsWin[0]++;
                this.winner = this.players[0];
                this.setState("endRound");
                this.cleanup();
            }
            else {
                this.setState("scored");
                this.cleanup();
            }
        }
        else if (this.ballX < this.paddleOneX + this.paddleWidth) {
            console.log("scored2");
            this.scores[1]++;
            this.lastscored = this.players[1];
            if (this.scores[1] === this.maxScore) {
                this.roundsWin[1]++;
                this.winner = this.players[1];
                this.setState("endRound");
                this.cleanup();
            }
            else {
                this.setState("scored");
                this.cleanup();
            }
        }
        if (this.roundsWin[0] === this.rounds) {
            console.log('this.scores[0]');
            console.log(this.scores[1]);
            console.log(this.scores[0]);
            this.winner = this.players[0];
            this.loser = this.players[1];
            const a = this.scores[0];
            const b = this.scores[1];
            this.exportgame.scorewin = a;
            this.exportgame.scorelose = b;
            this.exportgame.winnerid = this.player1id;
            this.exportgame.loserid = this.player2id;
            this.setState("endGame");
            this.gameservice.pushgame(this.exportgame, this.index);
            this.cleanup();
        }
        else if (this.roundsWin[1] === this.rounds) {
            this.exportgame.scorewin = 0;
            this.exportgame.scorelose = 0;
            console.log('this.scores[1]');
            console.log(this.scores[1]);
            console.log(this.scores[0]);
            this.exportgame.scorewin = this.scores[1];
            this.exportgame.scorelose = this.scores[0];
            this.exportgame.winnerid = this.player2id;
            this.exportgame.loserid = this.player1id;
            this.setState("endGame");
            this.gameservice.pushgame(this.exportgame, this.index);
            this.cleanup();
        }
    }
    handlePaddleOneBounce() {
        if (this.ballDirX === -1
            && this.ballY > this.paddleOneY
            && this.ballY < this.paddleOneY + this.paddleHeight) {
            if (this.ballX - this.ballRadius / 2 - this.paddleWidth <= 0)
                this.ballDirX *= -1;
        }
    }
    handlePaddleTwoBounce() {
        if (this.ballDirX === 1
            && this.ballY > this.paddleTwoY
            && this.ballY < this.paddleTwoY + this.paddleHeight) {
            if (this.ballX + this.ballRadius / 2 + this.paddleWidth >= this.width)
                this.ballDirX *= -1;
        }
    }
    updatePaddleOne(input) {
        if (input === "DOWN") {
            this.paddleOneY += this.paddleSpeed;
            this.paddleOneY = min(this.paddleOneY, this.height - this.paddleHeight);
        }
        else {
            this.paddleOneY -= this.paddleSpeed;
            this.paddleOneY = max(this.paddleOneY, 0);
        }
    }
    updatePaddleTwo(input) {
        if (input === "DOWN") {
            this.paddleTwoY += this.paddleSpeed;
            this.paddleTwoY = min(this.paddleTwoY, this.height - this.paddleHeight);
        }
        else {
            this.paddleTwoY -= this.paddleSpeed;
            this.paddleTwoY = max(this.paddleTwoY, 0);
        }
    }
    handleInput(payload) {
        if ((this.state === "endRound") && payload.input === "SPACE") {
            this.gameservice.updatescore(this.index, this.scores[0], this.scores[1], this.roundsWin);
            this.initRound(payload.userId);
            this.cleanup();
            this.run();
            this.setState("play");
        }
        else if ((this.state === "scored" || this.state === "init") && payload.input === "SPACE") {
            this.gameservice.updatescore(this.index, this.scores[0], this.scores[1], this.roundsWin);
            this.initGame(payload.userId);
            this.cleanup();
            this.run();
            this.setState("play");
        }
        else if (payload.input !== "SPACE") {
            if (payload.userId === this.players[0])
                this.updatePaddleOne(payload.input);
            else
                this.updatePaddleTwo(payload.input);
        }
    }
    getGameState() {
        return {
            ballX: this.ballX,
            ballY: this.ballY,
            ballDirX: this.ballDirX,
            ballDirY: this.ballDirY,
            paddleOneX: this.paddleOneX,
            paddleOneY: this.paddleOneY,
            paddleTwoX: this.paddleTwoX,
            paddleTwoY: this.paddleTwoY,
            state: this.state,
            players: this.players,
            scores: this.scores,
            maxScore: this.maxScore,
            winner: this.winner,
            lastscored: this.lastscored,
            rounds: this.rounds,
            roundsWin: this.roundsWin,
            width: this.width,
            height: this.height,
            aspectRatio: this.aspectRatio,
            paddleHeight: this.paddleHeight,
            paddleWidth: this.paddleWidth,
            ballRadius: this.ballRadius,
            mod: this.mod
        };
    }
}
exports.Game = Game;
let gameGateway = class gameGateway {
    constructor(gameservice) {
        this.gameservice = gameservice;
        this.logger = new common_1.Logger("AppGateway");
        this.games = Array();
        this.playerToGameIndex = new Map();
    }
    afterInit(server) {
        this.server = server;
        this.logger.log("INITIALIZED");
    }
    handleConnection(client, ...args) {
        this.logger.log(`A player is connected ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`A player is disconnected ${client.id}`);
        if (this.playerToGameIndex.has(client.id)) {
            this.games[this.playerToGameIndex.get(client.id)].playerDisconnect(client.id);
            this.playerToGameIndex.delete(client.id);
        }
    }
    explive(socket) {
        socket.emit("dffdfd", "slkh dskl");
    }
    spectJoinRoom(socket, payload) {
        socket.join(payload.input);
    }
    async getusercookie(cookie) {
        this.gameservice.getfromcookie(cookie);
    }
    async joinRoom(socket, payload) {
        let user = await this.gameservice.getfromcookie(socket.handshake.headers.cookie);
        const roomName = socket.id;
        if (this.games.length) {
            let i = 0;
            for (; i < this.games.length; i++) {
                if (this.games[i].getPlayers().length === 1 && this.games[i].getMod() == payload.input) {
                    this.games[i].addPlayer(socket, user);
                    socket.join(this.games[i].room);
                    this.playerToGameIndex.set(socket.id, i);
                    break;
                }
            }
            if (i === this.games.length) {
                this.games.push(new Game(this.server));
                this.games[i].setMod(payload.input);
                this.games[i].gameservice = this.gameservice;
                this.games[i].setRoomName(roomName);
                this.games[i].addPlayer(socket, user);
                socket.join(roomName);
                this.playerToGameIndex.set(socket.id, i);
            }
        }
        else {
            this.games.push(new Game(this.server));
            this.games[0].setMod(payload.input);
            this.games[0].setRoomName(roomName);
            this.games[0].addPlayer(socket, user);
            this.games[0].gameservice = this.gameservice;
            socket.join(roomName);
            this.playerToGameIndex.set(socket.id, 0);
        }
    }
    handlePlayerInput(client, payload) {
        this.games[this.playerToGameIndex.get(client.id)].handleInput(Object.assign(Object.assign({}, payload), { userId: client.id }));
    }
};
__decorate([
    (0, websockets_1.SubscribeMessage)('livenowtoserver'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], gameGateway.prototype, "explive", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('spectJoined'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], gameGateway.prototype, "spectJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('playerJoined'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], gameGateway.prototype, "joinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('playerInput'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], gameGateway.prototype, "handlePlayerInput", null);
gameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(6001, {
        cors: {
            origin: 'http://localhost:3000',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [games_service_1.GamesService])
], gameGateway);
exports.gameGateway = gameGateway;
//# sourceMappingURL=games.gateway.js.map