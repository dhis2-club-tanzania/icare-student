import * as _ from 'lodash';

export function sanitizeUsers(users) {
  return _.map(users, (user) => {
    return {
      id: user?.uuid,
      uuid: user?.uuid,
      person: user?.person,
      username: user?.username,
    };
  });
}
