// let cookieString = document.cookie;
// console.log(cookieString);
// let port = cookieString
//     .split("; ")
//     .find((cookie) => cookie.startsWith("port"))
//     ?.substring(5);

// let protocol = cookieString
//     .split("; ")
//     .find((cookie) => cookie.startsWith("protocol"))
//     ?.substring(9);

// let host = cookieString
//     .split("; ")
//     .find((cookie) => cookie.startsWith("host"))
//     ?.substring(5);

// let url = `${
//     host?.substring(0, 10) === "localhost" ? "ws" : "wss"
// }://${host}:${port}`;

var host = location.origin.replace(/^http/, "ws");

const keepAlive = () => {
    return setInterval(() => {
        let now = new Date();
        console.log(
            `Socket has been open for ${
                (now.getTime() - openTime.getTime()) / 1000
            } seconds`
        );
        if ((now.getTime() - openTime.getTime()) / 1000 / 60 > 10) {
            webSocket.close();
        }
        if (webSocket.readyState === WebSocket.OPEN) {
            let wsMessage: IWebSocketMessage = {
                type: "keepAlive",
                publicGameId: gameId,
                data: {},
            };
            webSocket.send(JSON.stringify(wsMessage));
        }
    }, 50000);
};

let intervalID;

// console.log(host);

let webSocket = new WebSocket(host);

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
    publicGameId: string;
    data: any;
}

let openTime: Date;

let gameId = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("gameId"))
    ?.substring(7);

webSocket.onopen = () => {
    if (gameId) {
        let message: IWebSocketMessage = {
            type: "init",
            publicGameId: gameId,
            data: {},
        };
        openTime = new Date();
        intervalID = keepAlive();
        webSocket.send(JSON.stringify(message));
    }
};

webSocket.onmessage = (message) => {
    let decodedMessage: IWebSocketMessage = JSON.parse(message.data);
    // console.log(decodedMessage);
    if (decodedMessage.publicGameId === gameId) {
        // console.log(decodedMessage);
        switch (decodedMessage.type) {
            case "initComplete":
                if (decodedMessage.data.check) {
                    console.log(decodedMessage.data);
                    ctwMode = decodedMessage.data.ctwMode;
                    console.log(ctwMode);
                    connectionComplete = true;
                } else {
                    let root = document.getElementById("root");
                    root ? (root.innerText = "Connection failed") : null;
                }
                break;
            case "teams":
                // console.log(connectionComplete);
                setTeams(decodedMessage.data);
                break;
            case "end":
                let root = document.getElementById("root");
                if (root) {
                    root.innerText = "Game ended";
                }
                webSocket.close();
            default:
                break;
        }
    }
};

webSocket.onclose = () => {
    let closeTime = new Date();
    let timeOpen = closeTime.getTime() - openTime.getTime();
    console.log(`Socket was open for ${timeOpen / 1000} seconds`);
    clearInterval(intervalID);
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
    "pestilent",
    "plaguedoctor",
    "ranger",
    "rogue",
    "shieldmaiden",
    "spider",
    "trappingturtle",
    "voodoo",
    "strongman",
];

function createTable(players: IUser[], team: string) {
    // console.log(ctwMode);
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
