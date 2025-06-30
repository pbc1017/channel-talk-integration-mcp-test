import { IsString, IsNotEmpty } from 'class-validator';

export class MemberHashRequestDto {
  @IsString()
  @IsNotEmpty()
  memberId: string;
}

export class MemberHashResponseDto {
  memberHash: string;
}
