import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

/**
 * Data transfer object for creating a new event.
 */
export class CreateeventDto {
  /**
   * The heading of the event.
   */
  @IsString()
  @IsNotEmpty()
  public heading: string;

  /**
   * The subheading of the event (optional).
   */
  @IsString()
  @IsOptional()
  public subHeading: string;

  /**
   * The link of the event (optional).
   */
  @IsString()
  @IsOptional()
  public link: string;

  /**
   * The date of the event (optional).
   */
  @IsString()
  @IsNotEmpty()
  public date: string;

  /**
   * The provider of the event.
   */
  @IsString()
  @IsNotEmpty()
  public provider: string;
}

export class GetEventsDto {
  @IsNumber()
  @IsOptional()
  public skip: number;

  @IsNumber()
  @IsOptional()
  public limit: number;
}
