import { ApiProperty, PartialType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class AuthenticatedUser extends PartialType(User) {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA5YWVhMTJkLWE4YmUtNDhlOS1iOTdkLTZkYjNkMTBkMmQ1NyIsImlhdCI6MTczMjUzNTU5NSwiZXhwIjoxNzMyNTQyNzk1fQ.Y8Akv0hStaBG4BWFuKfhxjHVHUTMEgBt8ZrSFEp-e1Q',
    description: 'User bearer token',
    nullable: false,
  })
  token: string;
}
