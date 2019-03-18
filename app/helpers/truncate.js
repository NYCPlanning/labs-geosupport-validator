import { helper } from '@ember/component/helper';

export function truncate([string, length]/*, hash*/) {
  return string.substring(0, length);
}

export default helper(truncate);
