import { games } from "../../app";
import { IGame, IGameStartPlayer, IUser } from "../../interfaces";
import { getCtwClassFromCode, getTeam } from "../../utility";

const startGame = (request: IGameStartPlayer[], playerName: string) => {
    const privateId: string = Math.random().toString(36).substring(2, 20);
    const publicId: string = playerName;
    if (games.find((game) => game.publicId === publicId)) {
        games.splice(
            games.findIndex((game) => game.publicId === publicId),
            1
        );
    }
    let game: IGame = {
        privateId: privateId,
        publicId: publicId,
        users: [],
        connections: [],
        ctwMode: true,
    };
    request.forEach((player) => {
        let newPlayer: IUser = {
            name: player.name,
            team: getTeam(player.teamName),
            class: player.classNumber
                ? getCtwClassFromCode(player.classNumber)
                : "none",
        };
        game.users.push(newPlayer);
    });
    console.log(
        game.publicId + " created a game with private id " + game.privateId
    );
    games.push(game);
    return { code: 200, privateId: privateId };
};

export default startGame;
