import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  parentId: number; // we cannot create root folder through the API

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
