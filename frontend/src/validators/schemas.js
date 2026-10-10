import { z } from 'zod';

// Registration schema
export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

// Login schema
export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

// Calculator input schema
export const calculatorInputSchema = z.object({
  operation: z.enum(['+', '-', '*', '/'], {
    errorMap: () => ({ message: 'Please select a valid operation' })
  }),
  numbersStr: z.string().trim().min(1, 'Please enter at least 1 number')
})
  // Ensure all items are valid numbers (min 1 item, cannot be empty)
  .refine(
    ({ numbersStr }) => {
      const items = numbersStr.split(',').map(s => s.trim()).filter(Boolean);
      return items.length >= 1 && items.every(s => !isNaN(Number(s)));
    },
    { message: 'Please provide valid numbers (e.g. 10, 20)' }
  )
  // Ensure no division by zero
  .refine(
    ({ operation, numbersStr }) => {
      if (operation !== '/') return true;
      const nums = numbersStr.split(',').map(s => Number(s.trim()));
      return !nums.slice(1).includes(0);
    },
    { message: 'Division by zero is not allowed' }
  );
