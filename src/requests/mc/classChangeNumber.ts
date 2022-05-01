import { games } from "../../app";
import { IGame } from "../../interfaces";
import { sendChangesToConnections } from "../../socket";
import { getCtwClassFromCode } from "../../utility";

const classChangeNumber = (request: any) => {
    console.log(request);
    let game = games.find((game) => game.privateId === request.gameId) as IGame;

    if (game) {
        let user =
            game.users.find((user) => user.name === request.name) || null;
        if (user) {
            user.class = getCtwClassFromCode(request.class);
        } else {
            return { code: 200 };
        }
        console.log(games);
        sendChangesToConnections(request.gameId);

        return { code: 200 };
    }
};

export default classChangeNumber;
