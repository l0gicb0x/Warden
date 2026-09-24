import { supabase } from '../supabase.js';
import { normalizeError } from '../errors.js';

/**
 * Direct Supabase data provider for real-time and DB-backed entities (e.g. runs, run_events).
 */
export const supabaseProvider = {
  /**
   * Fetch a list of records from a table.
   * @param {string} table - Table name
   * @param {object} [options]
   * @param {object} [options.filter] - Key-value pair equality filter
   * @param {string} [options.select] - Fields to select (default '*')
   * @param {object} [options.order] - { column, ascending }
   * @param {object} [options.range] - { from, to }
   */
  async getList(table, options = {}) {
    try {
      const { filter, select = '*', order, range } = options;
      let query = supabase.from(table).select(select);

      if (filter) {
        Object.entries(filter).forEach(([key, val]) => {
          if (val !== undefined && val !== null) {
            query = query.eq(key, val);
          }
        });
      }

      if (order) {
        query = query.order(order.column, { ascending: order.ascending ?? true });
      }

      if (range) {
        query = query.range(range.from, range.to);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  /**
   * Fetch a single record by primary key ID.
   * @param {string} table 
   * @param {string|number} id 
   * @param {string} [select='*'] 
   */
  async getOne(table, id, select = '*') {
    try {
      const { data, error } = await supabase
        .from(table)
        .select(select)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  /**
   * Insert one or more records.
   * @param {string} table 
   * @param {object|Array<object>} payload 
   */
  async create(table, payload) {
    try {
      const { data, error } = await supabase
        .from(table)
        .insert(payload)
        .select();

      if (error) throw error;
      return Array.isArray(payload) ? data : data[0];
    } catch (err) {
      throw normalizeError(err);
    }
  },

  /**
   * Update a record by ID.
   * @param {string} table 
   * @param {string|number} id 
   * @param {object} payload 
   */
  async update(table, id, payload) {
    try {
      const { data, error } = await supabase
        .from(table)
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  /**
   * Delete a record by ID.
   * @param {string} table 
   * @param {string|number} id 
   */
  async delete(table, id) {
    try {
      const { data, error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw normalizeError(err);
    }
  },

  /**
   * Subscribe to real-time changes on a table.
   * @param {string} table 
   * @param {function} callback - Function called with payload on change
   * @param {object} [options]
   * @param {string} [options.event='*'] - 'INSERT' | 'UPDATE' | 'DELETE' | '*'
   * @param {string} [options.filter] - e.g. 'run_id=eq.123'
   * @returns {object} Subscription object with an `unsubscribe` method
   */
  subscribe(table, callback, options = {}) {
    const { event = '*', filter } = options;
    const channelName = `realtime:${table}:${Date.now()}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event, schema: 'public', table, filter },
        (payload) => callback(payload)
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      },
    };
  },
};
