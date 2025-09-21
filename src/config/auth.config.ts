import { AuthErrorMessages, AuthErrorCodes } from "../enums/auth-errors.enum";

export class AuthConfig {
  static getValidApiKeys(): string[] {
    const envKeys = process.env.VALID_API_KEYS;

    if (!envKeys || envKeys.trim() === "") {
      throw new Error(
        "❌ ERRO CRÍTICO: Variável VALID_API_KEYS não encontrada no .env!\n" +
          "📝 Configure suas API Keys no arquivo .env:\n" +
          "   VALID_API_KEYS=sua-key-aqui,outra-key\n" +
          "🔒 NUNCA use chaves padrão em produção!"
      );
    }

    const keys = envKeys
      .split(",")
      .map((key) => key.trim())
      .filter((key) => key.length > 0);

    if (keys.length === 0) {
      throw new Error("❌ ERRO: Nenhuma API Key válida encontrada no .env!");
    }

    return keys;
  }

  static readonly AUTH_HEADERS = ["x-api-key", "authorization"];

  static getErrorMessages() {
    return {
      NO_API_KEY: AuthErrorMessages.NO_API_KEY,
      INVALID_API_KEY: AuthErrorMessages.INVALID_API_KEY,
      UNAUTHORIZED: AuthErrorMessages.UNAUTHORIZED,
    };
  }

  /**
   * Obtém os códigos de erro HTTP
   */
  static getErrorCodes() {
    return {
      UNAUTHORIZED: AuthErrorCodes.UNAUTHORIZED,
      FORBIDDEN: AuthErrorCodes.FORBIDDEN,
      BAD_REQUEST: AuthErrorCodes.BAD_REQUEST,
    };
  }

  /**
   * Verifica se está permitido usar Bearer token
   */
  static allowBearerToken(): boolean {
    return process.env.ALLOW_BEARER_TOKEN === "true";
  }

  static getAuthHeaderName(): string {
    return process.env.AUTH_HEADER_NAME || "x-api-key";
  }
}
