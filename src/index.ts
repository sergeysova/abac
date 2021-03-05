import { Schema } from './schema';
import { Effect } from './desicion';

type Context = Record<string, string>;

export function check(context: Context, schema: Schema): Effect {
  return 'DENY';
}
