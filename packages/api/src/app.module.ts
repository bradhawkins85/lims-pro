import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuditModule } from './audit/audit.module';
import { JobsModule } from './jobs/jobs.module';
import { SamplesModule } from './samples/samples.module';
import { TestAssignmentsModule } from './test-assignments/test-assignments.module';
import { COAReportsModule } from './coa-reports/coa-reports.module';
import { ClientsModule } from './clients/clients.module';
import { MethodsModule } from './methods/methods.module';
import { SpecificationsModule } from './specifications/specifications.module';
import { SectionsModule } from './sections/sections.module';
import { TestDefinitionsModule } from './test-definitions/test-definitions.module';
import { TestPacksModule } from './test-packs/test-packs.module';
import { LabSettingsModule } from './lab-settings/lab-settings.module';
import { HealthModule } from './health/health.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { PermissionsGuard } from './auth/permissions.guard';
import { AuditContextMiddleware } from './audit/audit-context.middleware';
import { loggerConfig } from './config/logger.config';
import { validateEnvironment } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment, // Validate environment variables at startup
    }),
    // Rate limiting (OWASP ASVS L2) - 100 requests per minute per IP
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests
      },
    ]),
    loggerConfig,
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    AuditModule,
    JobsModule,
    SamplesModule,
    TestAssignmentsModule,
    COAReportsModule,
    ClientsModule,
    MethodsModule,
    SpecificationsModule,
    SectionsModule,
    TestDefinitionsModule,
    TestPacksModule,
    LabSettingsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply audit context middleware to all routes
    // This will set PostgreSQL session variables for audit triggers
    consumer.apply(AuditContextMiddleware).forRoutes('*');
  }
}
