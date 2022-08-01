export class CtwOverlayPlayer {
    public name: string;
    public teamName: string;
    public classNumber: number;
}

export class CtwOverlayRemoveTeamRequest {
    public privateGameId: string;
    public teamName: string;
}

export class CtwOverlayResetPlayerTeamRequest {
    public playerName: string;
    public privateGameId: string;
    public teamName: string;
}

export class CtwOverlayResetOverlayRequest {
    public privateGameId: string;
    public players: CtwOverlayPlayer[];
}

export class CtwOverlaySetPlayerClassRequest {
    public name: string;
    public classCode: number;
    public privateGameId: string;
}

export class CtwOverlaySetPlayerTeamRequest {
    public playerName: string;
    public teamName: string;
    public privateGameId: string;
}

export class CtwOverlayStartOverlayRequest {
    public ctwMode: boolean;
    public playerName: string;
    public players: CtwOverlayPlayer[];
    public version: string;
}

export class CtwOverlayStartOverlayResponse {
    public privateGameId: string;
    public code: number;

    public constructor(privateGameId: string, code: number) {
        this.privateGameId = privateGameId;
        this.code = code;
    }
}

export class CtwOverlayGenericResponse {
    public code: number;

    public constructor(code: number) {
        this.code = code;
    }
}

export class CtwOverlayStopOverlayRequest {
    public privateGameId: string;
}
