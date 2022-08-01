import { games } from "../../app";
import {
    CtwOverlayGenericResponse,
    CtwOverlaySetPlayerClassRequest,
} from "../../classes/mc";
import { IGame } from "../../interfaces";
import { sendChangesToConnections } from "../../socket";
import { getCtwClassFromCode } from "../../utility";

const setPlayerClass = (
    request: CtwOverlaySetPlayerClassRequest
): CtwOverlayGenericResponse => {
    // console.log("SetPlayerClass");
    // console.log(request);
    let game = games.find(
        (game) => game.privateGameId === request.privateGameId
    ) as IGame;

    if (game) {
        let user =
            game.players.find((user) => user.name === request.name) || null;
        if (user) {
            user.class = getCtwClassFromCode(request.classCode);
        } else {
            return new CtwOverlayGenericResponse(404);
        }
        // console.log(games);
        sendChangesToConnections(request.privateGameId);

        return new CtwOverlayGenericResponse(200);
    }
};

export default setPlayerClass;
