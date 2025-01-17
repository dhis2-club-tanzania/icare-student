import { UserGet } from "src/app/shared/resources/openmrs";

export function formatCurrentUserDetails(userDetails): UserGet {
  return {
    links: userDetails.links,
    uuid: userDetails.uuid,
    display: userDetails.display,
    username: userDetails.username,
    systemId: userDetails.systemId,
    userProperties: userDetails.userProperties,
    person: userDetails.person,
    privileges: userDetails.privileges,
    roles: userDetails.roles,
  };
}
