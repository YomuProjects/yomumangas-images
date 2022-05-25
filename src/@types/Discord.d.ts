interface FetchTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
}

interface FetchUserResponse {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null | undefined;
    mfa_enabled?: boolean;
    banner?: string | null | undefined;
    accent_color?: string | null | undefined;
    locale?: string;
    verified?: boolean;
    email?: string | null | undefined;
    flags?: number;
    premium_type?: number;
    public_flags?: number;
}