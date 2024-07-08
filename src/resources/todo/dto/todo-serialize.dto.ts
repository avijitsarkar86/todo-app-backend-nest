import { Expose } from 'class-transformer';

export class TodoSerializeDto {
  @Expose()
  id: string;

  @Expose()
  description: string;
}
