import { games } from "../../app";
import { IGame } from "../../interfaces";
import { sendChangesToConnections } from "../../socket";
import { getCtwClass, getTeam } from "../../utility";

/**
 *
 * {
 *  gameId: string
 *  team: string
 *  player: string
 * }
 */

const addPlayerToTeam = (request: any) => {
    let game: IGame = games.find(
        (game) => game.privateId === request.gameId
    ) as IGame;
    if (game) {
        let user =
            game.users.find((user) => user.name === request.name) || null;
        if (user) {
            user.team = getTeam(request.team);
            user.class = request.class
                ? getCtwClass(request.class)
                : user.class;
        } else {
            user = {
                name: request.name,
                team: getTeam(request.team),
                class: request.class ? getCtwClass(request.class) : "none",
            };
            game.users.push(user);
        }
        sendChangesToConnections(request.gameId);
        return { code: 200 };
    } else {
        return { code: 404 };
    }
};

export default addPlayerToTeam;
