import { games } from "../../app";
import { IGame } from "../../interfaces";
import { sendChangesToConnections } from "../../socket";
import { getCtwClass } from "../../utility";

const classChange = (request: any) => {
    let game: IGame = games.find(
        (game) => game.privateId === request.gameId
    ) as IGame;
    if (game) {
        let user =
            game.users.find((user) => user.name === request.name) || null;
        if (user) {
            user.class = getCtwClass(request.class);
        }
        sendChangesToConnections(request.gameId);
        return { code: 200 };
    } else {
        return { code: 404 };
    }
};

export default classChange;
