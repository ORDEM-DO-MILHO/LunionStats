import { RolesBuilder } from 'nest-access-control';

export enum Roles {
  Admin = 'admin',
  Teacher = 'teacher',
  Student = 'student',
}

export const roles: RolesBuilder = new RolesBuilder();

roles
  .grant(Roles.Student)
  .readOwn('profile')
  .deleteOwn('profile')
  .deny(Roles.Student)
  .createAny('annotation')

  .grant(Roles.Teacher)
  .createAny('annotation')
  .readAny(['profile', 'annotation'])
  .updateOwn(['profile', 'annotation'])
  .deleteOwn(['profile', 'annotation'])
  .deny(Roles.Teacher)
  .deleteAny('profile')

  .grant(Roles.Admin)
  .createAny(['profile', 'annotation'])
  .readAny(['profile', 'annotation'])
  .updateAny(['profile', 'annotation'])
  .deleteAny(['profile', 'annotation']);
