import {
  IsString,
  IsNotEmpty,
  IsPort,
  IsUrl,
  IsOptional,
  IsIn,
  validateSync,
} from 'class-validator';
import { plainToClass } from 'class-transformer';

/**
 * Environment variables validation schema
 * Ensures all required configuration is present and valid at startup
 */
export class EnvironmentVariables {
  // Database
  @IsNotEmpty()
  @IsString()
  DATABASE_URL: string;

  // JWT Configuration
  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;

  @IsOptional()
  @IsString()
  JWT_EXPIRATION?: string = '7d';

  // MinIO Configuration
  @IsNotEmpty()
  @IsString()
  MINIO_ENDPOINT: string;

  @IsNotEmpty()
  @IsPort()
  MINIO_PORT: string;

  @IsNotEmpty()
  @IsString()
  MINIO_ACCESS_KEY: string;

  @IsNotEmpty()
  @IsString()
  MINIO_SECRET_KEY: string;

  @IsNotEmpty()
  @IsIn(['true', 'false'])
  MINIO_USE_SSL: string;

  @IsNotEmpty()
  @IsString()
  MINIO_BUCKET_NAME: string;

  // Puppeteer/Chrome
  @IsOptional()
  @IsString()
  CHROME_WS_ENDPOINT?: string;

  // PDF Storage
  @IsOptional()
  @IsString()
  PDF_STORAGE_PATH?: string = 'coa-reports';

  // Server Configuration
  @IsOptional()
  @IsPort()
  PORT?: string = '3000';

  @IsOptional()
  @IsIn(['development', 'production', 'test'])
  NODE_ENV?: string = 'development';

  // Web URL for CORS
  @IsOptional()
  @IsString()
  WEB_URL?: string;
}

/**
 * Validate environment variables at application startup
 * Throws an error if validation fails
 */
export function validateEnvironment(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => {
        const constraints = error.constraints
          ? Object.values(error.constraints)
          : [];
        return `${error.property}: ${constraints.join(', ')}`;
      })
      .join('\n');

    throw new Error(
      `Configuration validation failed:\n${errorMessages}\n\nPlease check your .env file and ensure all required variables are set.`,
    );
  }

  return validatedConfig;
}
