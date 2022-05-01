let cookieString = document.cookie;
console.log(cookieString);
let port = cookieString
    .split("; ")
    .find((cookie) => cookie.startsWith("port"))
    ?.substring(5);

let protocol = cookieString
    .split("; ")
    .find((cookie) => cookie.startsWith("protocol"))
    ?.substring(9);

let host = cookieString
    .split("; ")
    .find((cookie) => cookie.startsWith("host"))
    ?.substring(5);

let url = `${protocol === "http" ? "ws" : "wss"}://${host}:${port}`;

console.log(url);

let webSocket = new WebSocket(url);

let connectionComplete = false;
let ctwMode = true;

interface IUser {
    name: string;
    class: string;
}

let teamRed: IUser[] = [];
let teamBlue: IUser[] = [];

interface IWebSocketMessage {
    type: string;
    publicId: string;
    data: any;
}

let gamePublicId = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("gameId"))
    ?.substring(7);

webSocket.onopen = () => {
    if (gamePublicId) {
        let message: IWebSocketMessage = {
            type: "init",
            publicId: gamePublicId,
            data: {},
        };
        webSocket.send(JSON.stringify(message));
    }
};

webSocket.onmessage = (message) => {
    let decodedMessage: IWebSocketMessage = JSON.parse(message.data);
    console.log(decodedMessage);
    if (decodedMessage.publicId === gamePublicId) {
        console.log(decodedMessage);
        switch (decodedMessage.type) {
            case "initComplete":
                if (decodedMessage.data.check) {
                    console.log(decodedMessage.data);
                    ctwMode = decodedMessage.data.ctwMode;
                    connectionComplete = true;
                } else {
                    let root = document.getElementById("root");
                    root ? (root.innerText = "Connection failed") : null;
                }
                break;
            case "teams":
                console.log(connectionComplete);
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
    console.log(teamRed);
    console.log(teamBlue);
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
    console.log(ctwMode);
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
                ${ctwMode ? `<img src=${icon} ></img>` : ""}
                `
                    : `
                ${ctwMode ? `<img src=${icon} ></img>` : ""}
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
