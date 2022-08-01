import { games } from "../../app";
import {
    CtwOverlayGenericResponse,
    CtwOverlayStopOverlayRequest,
} from "../../classes/mc";
import { IGame } from "../../interfaces";
import { sendEndCall } from "../../socket";

const endOverlay = (
    request: CtwOverlayStopOverlayRequest
): CtwOverlayGenericResponse => {
    // console.log("EndOverlay");
    // console.log(request);
    let game: IGame = games.find(
        (game) => game.privateGameId === request.privateGameId
    ) as IGame;
    if (game) {
        sendEndCall(game.privateGameId);
        games.splice(games.indexOf(game), 1);
        return new CtwOverlayGenericResponse(200);
    } else {
        return new CtwOverlayGenericResponse(404);
    }
};

export default endOverlay;
