//initalise express
import express from 'express';
import {IGameStartPlayer, IGame, IUser, Teams} from "./interfaces";
import {getTeam, getCtwClass} from "./utility";
import {sendEndCall, sendTeamsToSockets, startWebsocket} from "./socket";

const app = express();
app.use('/public',express.static('./dir/public'));
app.use(express.json());

export const games: IGame[] = [];

startWebsocket();

app.post('/api/mc/startGame', (req, res) => {
    const id: string = Math.random().toString(36).substring(2,7);
    let request:IGameStartPlayer[] = req.body;
    let game: IGame = {
        id: id,
        users: [], 
        connections: []
    };
    request.forEach(player => {
        let newPlayer:IUser = {
            name: player.name,
            team: getTeam(player.teamName),
            class: getCtwClass(player.className),
        }
        game.users.push(newPlayer);
    });
    res.send({"code": 200, "id": id});
    games.push(game);
})

app.post('/api/mc/endGame', (req, res) => {
    let game: IGame = games.find(game => game.id === req.body.gameId) as IGame;
    if(game){
        sendEndCall(game.id);
        games.splice(games.indexOf(game), 1);
        res.send({"code": 200});
    }
    else{
        res.send({"code": 404});
    }
    
})

app.post('/api/mc/teamAdd', (req, res) => {
    let request = req.body
    let game: IGame = games.find(game => game.id === request.gameId) as IGame;
    if(game){
        let user = game.users.find(user => user.name === request.name) || null;
        if (user) {
            user.team = getTeam(request.team);
        } else {
            user = {
                name: request.name,
                team: getTeam(request.team),
                class: "None",
            }
            game.users.push(user);
        }
        
        res.send({"code": 200});
        sendTeamsToSockets(request.gameId);
    }else {
        res.send({"code": 404});
    }
})

app.post('/api/mc/teamRemove', (req, res) => {
    let request = req.body
    let game: IGame = games.find(game => game.id === request.gameId) as IGame;
    if(game){
        let user = game.users.find(user => user.name === request.name) || null;
        if (user) {
            user.team = Teams.NoTeam;
        }
        res.send({"code": 200});
        sendTeamsToSockets(request.gameId);
    }else {
    res.send({"code": 404})};
})

app.post('/api/mc/classChange', (req, res) => {
    let request = req.body;
    if (request.class === "?"){console.log("it is a question mark")}
    res.send({"code": 200});
})

app.get('/overlay/:gameId', (req, res) => {

    res.cookie('gameId', req.params.gameId);
    res.sendFile(__dirname + '/pages/overlay.html');
});

app.listen(8080, () => {
    console.log('server started on port 8080');
})