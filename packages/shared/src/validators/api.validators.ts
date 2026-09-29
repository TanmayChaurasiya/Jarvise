// ============================================================
// @jarvis/shared - API Validators
// ============================================================

import { z } from 'zod';

/** Pagination query schema */
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/** MongoDB ObjectId format */
export const ObjectIdSchema = z.string().regex(
  /^[0-9a-fA-F]{24}$/,
  'Invalid ObjectId format',
);

/** ISO date string */
export const ISODateSchema = z.string().datetime({ message: 'Invalid ISO date format' });

/** Validate that a value is a non-empty trimmed string */
export const NonEmptyStringSchema = z.string().trim().min(1, 'String must not be empty');

export type PaginationQuery = z.infer<typeof PaginationSchema>;
