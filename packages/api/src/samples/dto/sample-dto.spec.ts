import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CreateSampleDto } from './create-sample.dto';
import { UpdateSampleDto } from './update-sample.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

describe('Sample DTOs', () => {
  describe('CreateSampleDto', () => {
    it('should validate a valid DTO', async () => {
      const dto = plainToClass(CreateSampleDto, {
        jobId: '123e4567-e89b-12d3-a456-426614174000',
        clientId: '123e4567-e89b-12d3-a456-426614174001',
        sampleCode: 'SMPL-2024-001',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should reject invalid UUID for jobId', async () => {
      const dto = plainToClass(CreateSampleDto, {
        jobId: 'invalid-uuid',
        clientId: '123e4567-e89b-12d3-a456-426614174001',
        sampleCode: 'SMPL-2024-001',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('jobId');
    });

    it('should reject invalid UUID for clientId', async () => {
      const dto = plainToClass(CreateSampleDto, {
        jobId: '123e4567-e89b-12d3-a456-426614174000',
        clientId: 'not-a-uuid',
        sampleCode: 'SMPL-2024-001',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('clientId');
    });

    it('should reject missing required fields', async () => {
      const dto = plainToClass(CreateSampleDto, {
        jobId: '123e4567-e89b-12d3-a456-426614174000',
        // Missing clientId and sampleCode
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should validate optional temperature within range', async () => {
      const dto = plainToClass(CreateSampleDto, {
        jobId: '123e4567-e89b-12d3-a456-426614174000',
        clientId: '123e4567-e89b-12d3-a456-426614174001',
        sampleCode: 'SMPL-2024-001',
        temperatureOnReceiptC: 25.5,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should reject temperature below absolute zero', async () => {
      const dto = plainToClass(CreateSampleDto, {
        jobId: '123e4567-e89b-12d3-a456-426614174000',
        clientId: '123e4567-e89b-12d3-a456-426614174001',
        sampleCode: 'SMPL-2024-001',
        temperatureOnReceiptC: -300, // Below -273.15
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const tempError = errors.find(
        (e) => e.property === 'temperatureOnReceiptC',
      );
      expect(tempError).toBeDefined();
    });

    it('should reject temperature above maximum', async () => {
      const dto = plainToClass(CreateSampleDto, {
        jobId: '123e4567-e89b-12d3-a456-426614174000',
        clientId: '123e4567-e89b-12d3-a456-426614174001',
        sampleCode: 'SMPL-2024-001',
        temperatureOnReceiptC: 1500, // Above 1000
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const tempError = errors.find(
        (e) => e.property === 'temperatureOnReceiptC',
      );
      expect(tempError).toBeDefined();
    });

    it('should validate boolean flags', async () => {
      const dto = plainToClass(CreateSampleDto, {
        jobId: '123e4567-e89b-12d3-a456-426614174000',
        clientId: '123e4567-e89b-12d3-a456-426614174001',
        sampleCode: 'SMPL-2024-001',
        urgent: true,
        stabilityStudy: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate date strings', async () => {
      const dto = plainToClass(CreateSampleDto, {
        jobId: '123e4567-e89b-12d3-a456-426614174000',
        clientId: '123e4567-e89b-12d3-a456-426614174001',
        sampleCode: 'SMPL-2024-001',
        dateReceived: '2024-01-15T10:30:00.000Z',
        dateDue: '2024-01-20T10:30:00.000Z',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should reject invalid date strings', async () => {
      const dto = plainToClass(CreateSampleDto, {
        jobId: '123e4567-e89b-12d3-a456-426614174000',
        clientId: '123e4567-e89b-12d3-a456-426614174001',
        sampleCode: 'SMPL-2024-001',
        dateReceived: 'not-a-date',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const dateError = errors.find((e) => e.property === 'dateReceived');
      expect(dateError).toBeDefined();
    });

    it('should enforce maximum string lengths', async () => {
      const longString = 'a'.repeat(300); // Exceeds 255 char limit
      const dto = plainToClass(CreateSampleDto, {
        jobId: '123e4567-e89b-12d3-a456-426614174000',
        clientId: '123e4567-e89b-12d3-a456-426614174001',
        sampleCode: longString,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const lengthError = errors.find((e) => e.property === 'sampleCode');
      expect(lengthError).toBeDefined();
    });
  });

  describe('UpdateSampleDto', () => {
    it('should validate optional fields', async () => {
      const dto = plainToClass(UpdateSampleDto, {
        urgent: true,
        temperatureOnReceiptC: 20,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate empty DTO (all fields optional)', async () => {
      const dto = plainToClass(UpdateSampleDto, {});

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should reject invalid temperature', async () => {
      const dto = plainToClass(UpdateSampleDto, {
        temperatureOnReceiptC: -300,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should validate release date', async () => {
      const dto = plainToClass(UpdateSampleDto, {
        releaseDate: '2024-01-15T10:30:00.000Z',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
