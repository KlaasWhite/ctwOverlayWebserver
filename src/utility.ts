import { Teams } from "./interfaces";

export function getTeam(team: string): Teams {
    console.log("Get team: " + team);
    switch (team.toLowerCase()) {
        case "red":
        case "wool_red":
        case "redwool":
            return Teams.Red;
        case "blue":
        case "wool_blue":
        case "bluewool":
            return Teams.Blue;
        case "spectator":
            return Teams.Spectator;
        default:
            return Teams.NoTeam;
    }
}

export function getCtwClass(ctwClass: string): String {
    return ctwClass.toLowerCase();
}
