import { games } from "../../app";
import { IGame } from "../../interfaces";

/**
 *
 * {
 *  gameId: string
 *  enabled: string
 * }
 */

const setCtwMode = (request: any) => {
    let mode: boolean = request.enabled === "true" ? true : false;
    let game: IGame = games.find(
        (game) => game.privateId === request.gameId
    ) as IGame;
    game.ctwMode = mode;
    return { code: 200 };
};

export default setCtwMode;
