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

export interface User {
    id: string;
    username: string;
    createdAt: string;
    role?: 'USER' | 'ADMIN';
    userType?: 'GUEST' | 'REGISTERED';
}

export interface AuthResponse {
    token: string;
    username: string;
    userId: string;
    role: 'USER' | 'ADMIN';
    userType: 'GUEST' | 'REGISTERED';
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
}