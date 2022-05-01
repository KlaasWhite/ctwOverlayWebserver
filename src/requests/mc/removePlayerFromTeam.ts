import { games } from "../../app";
import { IGame, Teams } from "../../interfaces";
import { sendChangesToConnections } from "../../socket";

const removePlayerFromTeam = (request: any) => {
    let game: IGame = games.find(
        (game) => game.privateId === request.gameId
    ) as IGame;
    if (game) {
        let user =
            game.users.find((user) => user.name === request.name) || null;
        if (user) {
            user.team = Teams.NoTeam;
        }
        sendChangesToConnections(request.gameId);
        return { code: 200 };
    } else {
        return { code: 404 };
    }
};

export default removePlayerFromTeam;
