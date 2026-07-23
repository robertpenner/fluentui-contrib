import type { ButtonCase } from '../domain/ButtonCase';
import type { ButtonStyleContract } from '../domain/ButtonStyleContract';
import { typographyPolicy } from '../domain/policies';

export const resolveTypography = (input: ButtonCase): ButtonStyleContract['typography'] => ({
  ...typographyPolicy[input.density],
});