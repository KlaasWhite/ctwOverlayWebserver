let webSocket = new WebSocket("ws://localhost:8090");

let connectionComplete = false;

interface IUser {
    name: string;
    class: string;
}

let teamRed: IUser[] = [];
let teamBlue: IUser[] = [];

interface IWebSocketMessage {
    type: string;
    id: string;
    data: any;
}

let gameId = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("gameId"))
    ?.substring(7);

console.log(
    document.cookie.split("; ").find((cookie) => cookie.startsWith("dev"))
);

let dev: boolean =
    document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("dev"))
        ?.substring(4) === "true";

console.log(dev);

webSocket.onopen = () => {
    if (gameId) {
        let message: IWebSocketMessage = {
            type: "init",
            id: gameId,
            data: {},
        };
        webSocket.send(JSON.stringify(message));
    }
};

webSocket.onmessage = (message) => {
    let decodedMessage: IWebSocketMessage = JSON.parse(message.data);
    if (decodedMessage.id === gameId) {
        switch (decodedMessage.type) {
            case "initComplete":
                if (decodedMessage.data) {
                    connectionComplete = true;
                    console.log("Connection complete");
                } else {
                    console.log("Connection failed");
                    let root = document.getElementById("root");
                    if (root) {
                        root.innerText = "Connection failed";
                    }
                }
                break;
            case "teams":
                setTeams(decodedMessage.data);
                break;
            case "end":
                let root = document.getElementById("root");
                if (root) {
                    root.innerText = "Game ended";
                }
            default:
                break;
        }
    }
};

function setTeams(teams: any[]) {
    teamRed = [];
    teamBlue = [];
    teams.forEach((player) => {
        let correctPlayer: IUser = {
            name: player.name,
            class: player.class,
        };
        if (player.team === 0) {
            teamRed.push(correctPlayer);
        } else if (player.team === 1) {
            teamBlue.push(correctPlayer);
        }
    });

    createTable(teamRed, "team_red");
    createTable(teamBlue, "team_blue");
}

const classList = [
    "barbarian",
    "bulwark",
    "captain",
    "cleric",
    "duelist",
    "enchanter",
    "executioner",
    "explorer",
    "grenadier",
    "iceman",
    "illusionist",
    "knight",
    "looter",
    "luteboi",
    "messenger",
    "pest",
    "plague",
    "ranger",
    "rogue",
    "shieldmaiden",
    "spider",
    "turtle",
    "voodoo",
];

function createTable(players: IUser[], team: string) {
    console.log(players);
    let column = document.getElementById(team);
    let teamName: String = team === "team_red" ? "Red" : "Blue";
    if (column) {
        let html = "";
        html += `<tr class="team-name"><th>${teamName}</th></tr>`;
        players.forEach((player) => {
            let icon = classList.includes(player.class)
                ? `../public/img/icons/${player.class}.png`
                : `../public/img/icons/none.png`;
            let column =
                team === "team_red"
                    ? `
                ${player.name}
                <img src=${icon} ></img>
                `
                    : `
                <img src=${icon} ></img>
                ${player.name}`;
            html += `<tr class="player" id=${player.name}>
                <td>
                    ${column}
                <td>
            </tr>`;
        });
        column.innerHTML = html;
    }
}
