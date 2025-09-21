import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { AuthConfig } from "../config/auth.config";

/**
 * Middleware para validação de autorização
 * Verifica se a requisição possui uma API Key válida
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Verifica se a API Key foi enviada no header
    const apiKey = req.headers["x-api-key"] || req.headers["authorization"];
    const errorMessages = AuthConfig.getErrorMessages();
    const errorCodes = AuthConfig.getErrorCodes();

    if (!apiKey) {
      throw new UnauthorizedException({
        statusCode: errorCodes.UNAUTHORIZED,
        message: errorMessages.NO_API_KEY,
        error: "Unauthorized",
      });
    }

    // Remove 'Bearer ' se presente no Authorization header (se permitido)
    let cleanApiKey = apiKey as string;
    if (AuthConfig.allowBearerToken() && typeof apiKey === "string") {
      cleanApiKey = apiKey.replace(/^Bearer\s+/i, "");
    }

    // Verifica se a API Key é válida
    const validKeys = AuthConfig.getValidApiKeys();
    if (!validKeys.includes(cleanApiKey)) {
      throw new UnauthorizedException({
        statusCode: errorCodes.UNAUTHORIZED,
        message: errorMessages.INVALID_API_KEY,
        error: "Unauthorized",
      });
    }

    // API Key válida, continua com a requisição
    next();
  }
}
