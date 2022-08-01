import { games } from "../../app";
import {
    CtwOverlayStartOverlayRequest,
    CtwOverlayStartOverlayResponse,
} from "../../classes/mc";
import { IGame, IPlayer } from "../../interfaces";
import { getCtwClassFromCode, getTeam } from "../../utility";

const startOverlay = (
    request: CtwOverlayStartOverlayRequest
): CtwOverlayStartOverlayResponse => {
    console.log("StartOverlay");
    console.log(request);
    let privateGameId: string = Math.random().toString(36).substring(2, 20);
    const publicGameId: string = request.playerName;

    while (
        games.filter((game) => game.privateGameId === privateGameId).length > 0
    ) {
        privateGameId = Math.random().toString(36).substring(2, 20);
    }

    if (request.version !== "1.1") {
        return new CtwOverlayStartOverlayResponse(privateGameId, 200);
    }

    if (games.find((game) => game.publicGameId === publicGameId)) {
        games.splice(
            games.findIndex((game) => game.publicGameId === publicGameId),
            1
        );
    }
    let game: IGame = {
        privateGameId: privateGameId,
        publicGameId: publicGameId,
        players: [],
        wsConnections: [],
        ctwMode: request.ctwMode,
    };
    request.players.forEach((player) => {
        let newPlayer: IPlayer = {
            name: player.name,
            team: getTeam(player.teamName),
            class: player.classNumber
                ? getCtwClassFromCode(player.classNumber)
                : "none",
        };
        game.players.push(newPlayer);
    });
    console.log(
        game.publicGameId +
            " created a game with private id " +
            game.privateGameId +
            " and with ctwmode: " +
            request.ctwMode
    );
    games.push(game);
    return new CtwOverlayStartOverlayResponse(privateGameId, 200);
};

export default startOverlay;
