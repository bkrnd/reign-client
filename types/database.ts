export interface World {
    id: string;
    slug: string;
    name: string;
    ownerId: string;
    boardSize: number;
    maxPlayers: number;
    createdAt: string;
}

export interface Square {
    id: string;
    worldSlug: string;
    x: number;
    y: number;
    ownerId: string | null;
    defenseBonus: number;
}