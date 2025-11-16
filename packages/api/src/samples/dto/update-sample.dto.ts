import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsNumber,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSampleDto {
  @ApiPropertyOptional({ description: 'Date sample was received' })
  @IsOptional()
  @IsDateString()
  dateReceived?: string;

  @ApiPropertyOptional({ description: 'Due date for sample testing' })
  @IsOptional()
  @IsDateString()
  dateDue?: string;

  @ApiPropertyOptional({ description: 'Raw material supplier name' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  rmSupplier?: string;

  @ApiPropertyOptional({ description: 'Sample description' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  sampleDescription?: string;

  @ApiPropertyOptional({ description: 'Universal Identification Number code' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  uinCode?: string;

  @ApiPropertyOptional({ description: 'Sample batch identifier' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  sampleBatch?: string;

  @ApiPropertyOptional({
    description: 'Temperature on receipt in Celsius',
    minimum: -273.15,
    maximum: 1000,
  })
  @IsOptional()
  @IsNumber()
  @Min(-273.15)
  @Max(1000)
  temperatureOnReceiptC?: number;

  @ApiPropertyOptional({ description: 'Storage conditions for sample' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  storageConditions?: string;

  @ApiPropertyOptional({ description: 'Additional comments' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  comments?: string;

  // Status flags
  @ApiPropertyOptional({ description: 'Flag for expired raw material' })
  @IsOptional()
  @IsBoolean()
  expiredRawMaterial?: boolean;

  @ApiPropertyOptional({ description: 'Flag for post-irradiated raw material' })
  @IsOptional()
  @IsBoolean()
  postIrradiatedRawMaterial?: boolean;

  @ApiPropertyOptional({ description: 'Flag for stability study' })
  @IsOptional()
  @IsBoolean()
  stabilityStudy?: boolean;

  @ApiPropertyOptional({ description: 'Flag for urgent sample' })
  @IsOptional()
  @IsBoolean()
  urgent?: boolean;

  @ApiPropertyOptional({ description: 'All micro tests assigned flag' })
  @IsOptional()
  @IsBoolean()
  allMicroTestsAssigned?: boolean;

  @ApiPropertyOptional({ description: 'All chemistry tests assigned flag' })
  @IsOptional()
  @IsBoolean()
  allChemistryTestsAssigned?: boolean;

  @ApiPropertyOptional({ description: 'Released flag' })
  @IsOptional()
  @IsBoolean()
  released?: boolean;

  @ApiPropertyOptional({ description: 'Retest flag' })
  @IsOptional()
  @IsBoolean()
  retest?: boolean;

  @ApiPropertyOptional({ description: 'Release date' })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;
}
