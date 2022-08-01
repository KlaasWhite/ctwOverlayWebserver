import { games } from "../../app";
import {
    CtwOverlayGenericResponse,
    CtwOverlaySetPlayerTeamRequest,
} from "../../classes/mc";
import { IGame } from "../../interfaces";
import { sendChangesToConnections } from "../../socket";
import { getTeam } from "../../utility";

const setPlayerTeam = (
    request: CtwOverlaySetPlayerTeamRequest
): CtwOverlayGenericResponse => {
    console.log("SetPlayerTeam");
    console.log(request);
    let game: IGame = games.find(
        (game) => game.privateGameId === request.privateGameId
    ) as IGame;
    if (game) {
        let user =
            game.players.find((user) => user.name === request.playerName) ||
            null;
        if (user) {
            user.team = getTeam(request.teamName);
        } else {
            user = {
                name: request.playerName,
                team: getTeam(request.teamName),
                class: "none",
            };
            game.players.push(user);
        }
        sendChangesToConnections(request.privateGameId);
        return new CtwOverlayGenericResponse(200);
    } else {
        return new CtwOverlayGenericResponse(404);
    }
};

export default setPlayerTeam;
