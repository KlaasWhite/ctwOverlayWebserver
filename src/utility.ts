import { Teams,} from "./interfaces";

export function getTeam(team: string): Teams {
    switch (team.toLowerCase()) {
        case "red":
        case "wool_red":
            return Teams.Red;
        case "blue":
        case "wool_blue":
            return Teams.Blue;
        case "spectator":
            return Teams.Spectator;
        default:
            return Teams.NoTeam;
    }
}

export function getCtwClass(ctwClass: string): String{
    return "None";
}