import { games } from "../../app";
import { IGame, Teams } from "../../interfaces";
import { sendChangesToConnections } from "../../socket";
import { getTeam } from "../../utility";

/**
 *
 * {
 *  gameId: string
 *  team: string
 * }
 */

const removeTeam = (request: any) => {
    console.log(request);
    let game: IGame = games.find(
        (game) => game.privateId === request.gameId
    ) as IGame;
    if (game) {
        let team: Teams = getTeam(request.team);
        game.users.forEach((user) => {
            user.team == team ? (user.team = Teams.Spectator) : null;
        });
        return { code: 200 };
    } else {
        return { code: 404 };
    }
};

export default removeTeam;
