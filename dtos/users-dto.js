export class UsersDto {
  email;

  id;

  name;

  status;

  lastLoginDate;

  registrationDate;

  access;

  constructor(model) {
    this.name = model.name;
    this.email = model.email;
    this.id = model._id;
    this.lastLoginDate = model.lastLoginDate;
    this.registrationDate = model.registrationDate;
    this.status = model.status;
    this.access = model.access;
  }
};