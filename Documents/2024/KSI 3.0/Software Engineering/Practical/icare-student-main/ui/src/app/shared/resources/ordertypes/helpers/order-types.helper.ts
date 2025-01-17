import { map } from 'lodash';

export function sanitizeOrderTypes(types) {
  return map(types, (type) => {
    return {
      id: type?.uuid,
      uuid: type?.uuid,
      name: type?.display,
      display: type?.display,
      conceptClassName: type?.display.split(' ')[0],
    };
  });
}
