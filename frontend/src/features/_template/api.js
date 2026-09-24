/**
 * Feature API template
 * --------------------
 * Copy this folder, rename _template → your feature name, then
 * replace 'template' references with your resource name.
 *
 * This file defines all data-access functions for the feature.
 * It imports ONLY from the unified data bridge.
 */

import { db } from '@/lib/dataProvider';

/**
 * Fetch all records for this feature.
 * Switch between db.supabase (realtime tables) and db.rest (Express endpoints).
 */
export const fetchAll = async (filters = {}) => {
  // Example: Supabase-backed entity
  // return db.supabase.getList('your_table', { filter: filters, order: { column: 'created_at', ascending: false } });

  // Example: REST-backed entity
  // return db.rest.get('/your-endpoint', filters);

  throw new Error('fetchAll not implemented — replace this stub');
};

export const fetchOne = async (id) => {
  // return db.supabase.getOne('your_table', id);
  throw new Error('fetchOne not implemented — replace this stub');
};

export const create = async (payload) => {
  // return db.supabase.create('your_table', payload);
  throw new Error('create not implemented — replace this stub');
};

export const update = async (id, payload) => {
  // return db.supabase.update('your_table', id, payload);
  throw new Error('update not implemented — replace this stub');
};

export const remove = async (id) => {
  // return db.supabase.delete('your_table', id);
  throw new Error('remove not implemented — replace this stub');
};
