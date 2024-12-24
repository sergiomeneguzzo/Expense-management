import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExpenseDTO {
  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  date?: Date;

  @IsBoolean()
  isIncome: boolean;
}

export class UpdateExpenseDTO {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsBoolean()
  isIncome?: boolean;
}
