import { games } from "../../app";
import {
    CtwOverlayGenericResponse,
    CtwOverlayResetOverlayRequest,
} from "../../classes/mc";
import { IGame, IPlayer } from "../../interfaces";
import { sendChangesToConnections } from "../../socket";
import { getCtwClassFromCode, getTeam } from "../../utility";

const resetOverlay = (
    request: CtwOverlayResetOverlayRequest
): CtwOverlayGenericResponse => {
    // console.log("ResetOverlay");
    // console.log(request);
    let game: IGame = games.find(
        (game) => game.privateGameId === request.privateGameId
    );

    if (!game) {
        return new CtwOverlayGenericResponse(404);
    }

    let newPlayerList: IPlayer[] = [];

    request.players.forEach((player) => {
        let newPlayer: IPlayer = {
            name: player.name,
            team: getTeam(player.teamName),
            class: player.classNumber
                ? getCtwClassFromCode(player.classNumber)
                : "none",
        };
        newPlayerList.push(newPlayer);
    });

    game.players = newPlayerList;
    sendChangesToConnections(request.privateGameId);
    return new CtwOverlayGenericResponse(200);
};

export default resetOverlay;
