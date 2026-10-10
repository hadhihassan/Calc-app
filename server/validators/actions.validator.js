import { z } from 'zod';

export const actionCalculationSchema = z.object({
  operation: z.enum(['+', '-', '*', '/'], {
    errorMap: () => ({ message: 'Operation must be one of: +, -, *, /' })
  }),
  numbers: z.union([
    z.string().trim().min(1, 'Numbers are required and cannot be empty'),
    z.array(z.union([z.number(), z.string()]), { required_error: 'Numbers array is required' })
      .min(1, 'At least 1 number is required (cannot be empty)')
  ])
}).transform((data, ctx) => {
  let parsedNumbers = [];

  if (typeof data.numbers === 'string') {
    const rawItems = data.numbers.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (rawItems.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide at least 1 number (cannot be empty).'
      });
      return z.NEVER;
    }

    for (let i = 0; i < rawItems.length; i++) {
      const num = Number(rawItems[i]);
      if (isNaN(num)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Item "${rawItems[i]}" at position ${i + 1} is not a valid number.`
        });
        return z.NEVER;
      }
      parsedNumbers.push(num);
    }
  } else if (Array.isArray(data.numbers)) {
    if (data.numbers.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Numbers array cannot be empty. At least 1 number is required.'
      });
      return z.NEVER;
    }

    for (let i = 0; i < data.numbers.length; i++) {
      const item = data.numbers[i];
      if (typeof item === 'string' && item.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Item at position ${i + 1} cannot be empty.`
        });
        return z.NEVER;
      }

      const num = Number(item);
      if (isNaN(num)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Item "${item}" at position ${i + 1} is not a valid number.`
        });
        return z.NEVER;
      }
      parsedNumbers.push(num);
    }
  }

  // Minimum 1 number required, no empty
  if (parsedNumbers.length < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least 1 number is required (cannot be empty).'
    });
    return z.NEVER;
  }

  // Check division by zero (for multiple numbers)
  if (data.operation === '/') {
    for (let i = 1; i < parsedNumbers.length; i++) {
      if (parsedNumbers[i] === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Division by zero is not allowed.'
        });
        return z.NEVER;
      }
    }
  }

  return {
    operation: data.operation,
    numbers: parsedNumbers
  };
});
