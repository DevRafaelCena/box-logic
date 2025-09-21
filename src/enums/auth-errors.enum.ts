export enum AuthErrorMessages {
  NO_API_KEY = "API Key obrigatória. Inclua o header X-API-Key ou Authorization.",
  INVALID_API_KEY = "API Key inválida.",
  UNAUTHORIZED = "Acesso não autorizado.",
  FORBIDDEN = "Acesso negado para este recurso.",
  TOKEN_EXPIRED = "Token expirado.",
  MALFORMED_TOKEN = "Token mal formatado.",
}

export enum AuthErrorCodes {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  BAD_REQUEST = 400,
}
