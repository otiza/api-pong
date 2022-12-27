/// <reference types="node" />
import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from "socket.io";
import { GamesService } from './games.service';
export interface UserInput {
    input: string;
    userId: string;
}
export interface GameID {
    input: string;
}
export interface Mode {
    input: string;
}
export interface gametodatabase {
    winnerid: string;
    loserid: string;
    scorewin: number;
    scorelose: number;
}
export interface Game {
    server: Server;
    width: number;
    height: number;
    aspectRatio: number;
    exportgame: gametodatabase;
    initBallX: number;
    initBallY: number;
    ballRadius: number;
    ballSpeed: number;
    gameservice: GamesService;
    paddleWidth: number;
    paddleHeight: number;
    paddleSpeed: number;
    ballX: number;
    ballY: number;
    ballDirX: number;
    ballDirY: number;
    paddleOneX: number;
    paddleOneY: number;
    paddleTwoX: number;
    paddleTwoY: number;
    loop: NodeJS.Timer;
    state: string;
    players: Array<string>;
    spectators: Array<string>;
    player1id: string;
    player2id: string;
    scores: Array<number>;
    maxScore: number;
    lastscored: string;
    rounds: number;
    roundsWin: Array<number>;
    winner: string;
    loser: string;
    room: string;
    mod: string;
}
export interface GameState {
    width: number;
    height: number;
    aspectRatio: number;
    ballX: number;
    ballY: number;
    ballDirX: number;
    ballDirY: number;
    ballRadius: number;
    paddleOneX: number;
    paddleOneY: number;
    paddleTwoX: number;
    paddleTwoY: number;
    paddleWidth: number;
    paddleHeight: number;
    state: string;
    players: Array<string>;
    scores: Array<number>;
    maxScore: number;
    rounds: number;
    roundsWin: Array<number>;
    winner: string;
    lastscored: string;
    mod: string;
}
export declare class gametodatabase {
    constructor();
}
export declare class Game {
    constructor(server: Server);
    setMod(name: string): void;
    getMod(): string;
    cleanup(): void;
    getPlayers(): Array<string>;
    playerDisconnect(id: string): void;
    addPlayer(socket: any, playerid: string): void;
    addSpec(id: string): void;
    setRoomName(name: string): void;
    getRoomName(): string;
    setState(state: string): void;
    getState(): string;
    run(): Promise<void>;
    initRound(id: string): void;
    initGame(id: string): void;
    updateBall(): void;
    updateScore(): void;
    handlePaddleOneBounce(): void;
    handlePaddleTwoBounce(): void;
    updatePaddleOne(input: string): void;
    updatePaddleTwo(input: string): void;
    handleInput(payload: UserInput): void;
    getGameState(): GameState;
}
export declare class gameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private gameservice;
    private server;
    constructor(gameservice: GamesService);
    private logger;
    private games;
    private playerToGameIndex;
    afterInit(server: Server): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: Socket): void;
    spectJoinRoom(socket: Socket, payload: GameID): void;
    getusercookie(cookie: string): Promise<void>;
    joinRoom(socket: Socket, payload: Mode): void;
    handlePlayerInput(client: Socket, payload: UserInput): void;
}
