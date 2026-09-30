export class CreateSaasPlanDto {
  code!: string;
  name!: string;
  priceCents!: number;
  currency!: string;
  maxMembers?: number;
  maxStaff?: number;
  isActive?: boolean;
}
