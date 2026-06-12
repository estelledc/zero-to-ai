import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        tags: z.array(z.string()).optional(),
        learningPaths: z.array(z.string()).optional(),
        prerequisites: z.array(z.string()).optional(),
        relatedContent: z
          .array(
            z.object({
              slug: z.string(),
              label: z.string(),
            })
          )
          .optional(),
        lastVerified: z.string().optional(),
        toolVersion: z.string().optional(),
      }),
    }),
  }),
};
