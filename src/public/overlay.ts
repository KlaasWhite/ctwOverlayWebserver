let webSocket = new WebSocket('ws://localhost:8090');

let connectionComplete = false;

interface IUser {
    name: string,
    class: string,
}


let teamRed: IUser[] = [];
let teamBlue: IUser[] = [];



interface IWebSocketMessage{
    type: string,
    id: string, 
    data: any
}

let gameId = document.cookie.split('; ').find(cookie => cookie.startsWith('gameId'))?.substring(7);

webSocket.onopen = () => {

    if(gameId){
        let message:IWebSocketMessage = {
            type: "init",
            id: gameId,
            data: {}
        }
        webSocket.send(JSON.stringify(message));
    }
}

webSocket.onmessage = (message => {
    let decodedMessage: IWebSocketMessage = JSON.parse(message.data);
    if (decodedMessage.id === gameId){
        switch (decodedMessage.type) {
            case "initComplete":
                if(decodedMessage.data){
                    connectionComplete = true;
                    console.log("Connection complete")
                }
                else {
                    console.log("Connection failed")
                    let root = document.getElementById("root");
                    if (root){
                        root.innerText = "Connection failed";
                    }
                }
                break;
            case "teams": 
                setTeams(decodedMessage.data);
                break;
            case "end":
                let root = document.getElementById("root");
                    if (root){
                        root.innerText = "Game ended";
                    }
            default:
                break;
        }
    }
})

function setTeams(teams: any[]){
    teamRed = [];
    teamBlue = [];
    teams.forEach(player => {
        let correctPlayer:IUser = {
            name: player.name,
            class: player.class
        }
        if (player.team === 0) {
            teamRed.push(correctPlayer);
        } else if (player.team === 1){
            teamBlue.push(correctPlayer);
        }
    })

    createTable(teamRed, "team_red");
    createTable(teamBlue, "team_blue");
}

function createTable(players : IUser[], team: string){
    let column = document.getElementById(team);
    let teamName: String = (team === "team_red") ? "Red" : "Blue";
    if (column){
        let html = "";
        html += `<tr class="team-name"><th>${teamName}</th></tr>`;
        players.forEach(player => {
            html += `<tr class="player"><td>${player.name}${(player.class === "None") ? "" : " : " + player.class}<td></tr>`
        })
        column.innerHTML = html;
    }
    
}