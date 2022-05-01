import { Teams } from "./interfaces";

export function getTeam(team: string): Teams {
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

export function getCtwClassFromCode(ctwClassCode: number): String {
    let normilisedCode = ctwClassCode - 57616;

    switch (normilisedCode) {
        case 0:
            return "knight";
        case 1:
            return "luteboi";
        case 2:
            return "architect";
        case 3:
            return "ranger";
        case 4:
            return "messenger";
        case 16:
            return "bulwark";
        case 17:
            return "cleric";
        case 18:
            return "captain";
        case 19:
            return "none";
        case 20:
            return "spider";
        case 32:
            return "pest";
        case 33:
            return "plague";
        case 34:
            return "looter";
        case 35:
            return "executioner";
        case 50:
            return "grenadier";
        case 51:
            return "duelst";
        case 66:
            return "explorer";
        case 67:
            return "rogue";
        case 80:
            return "shieldmaiden";
        case 81:
            return "voodoo";
        case 82:
            return "enchanter";
        case 83:
            return "illusionist";
        case 98:
            return "iceman";
        case 99:
            return "barbarian";
        case 114:
            return "turtle";

        default:
            return "none";
    }
}
