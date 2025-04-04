export const sqlInjectionCheck = (value: string) => {
  const sqlInjectionPattern =
    /(\b(SELECT|INSERT|DELETE|UPDATE|DROP|UNION|--|\*|;|OR|AND)\b|["'`])/i;
  return !sqlInjectionPattern.test(value);
};
