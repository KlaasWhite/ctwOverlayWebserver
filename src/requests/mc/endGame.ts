import { games } from "../../app";
import { IGame } from "../../interfaces";
import { sendEndCall } from "../../socket";

const endGame = (request: any) => {
    let game: IGame = games.find(
        (game) => game.privateId === request.gameId
    ) as IGame;
    if (game) {
        sendEndCall(game.privateId);
        games.splice(games.indexOf(game), 1);
        return { code: 200 };
    } else {
        return { code: 404 };
    }
};

export default endGame;
