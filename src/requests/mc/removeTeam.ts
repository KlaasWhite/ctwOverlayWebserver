import { games } from "../../app";
import {
    CtwOverlayGenericResponse,
    CtwOverlayRemoveTeamRequest,
} from "../../classes/mc";
import { IGame, Teams } from "../../interfaces";
import { sendChangesToConnections } from "../../socket";
import { getTeam } from "../../utility";

const removeTeam = (
    request: CtwOverlayRemoveTeamRequest
): CtwOverlayGenericResponse => {
    // console.log("RemoveTeam");
    // console.log(request);
    let game: IGame = games.find(
        (game) => game.privateGameId === request.privateGameId
    ) as IGame;
    if (game) {
        let team: Teams = getTeam(request.teamName);
        game.players.forEach((user) => {
            user.team == team ? (user.team = Teams.Spectator) : null;
        });
        sendChangesToConnections(request.privateGameId);
        return new CtwOverlayGenericResponse(200);
    } else {
        return new CtwOverlayGenericResponse(404);
    }
};

export default removeTeam;
