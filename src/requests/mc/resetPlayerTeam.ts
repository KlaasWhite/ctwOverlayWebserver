import { games } from "../../app";
import {
    CtwOverlayGenericResponse,
    CtwOverlayResetPlayerTeamRequest,
} from "../../classes/mc";
import { IGame, Teams } from "../../interfaces";
import { sendChangesToConnections } from "../../socket";

const resetPlayerTeam = (
    request: CtwOverlayResetPlayerTeamRequest
): CtwOverlayGenericResponse => {
    console.log("ResetPlayerTeam");
    console.log(request);
    let game: IGame = games.find(
        (game) => game.privateGameId === request.privateGameId
    ) as IGame;
    if (game) {
        let user =
            game.players.find((user) => user.name === request.playerName) ||
            null;
        if (user) {
            user.team = Teams.NoTeam;
        }
        sendChangesToConnections(request.privateGameId);
        return new CtwOverlayGenericResponse(200);
    } else {
        return new CtwOverlayGenericResponse(404);
    }
};

export default resetPlayerTeam;
