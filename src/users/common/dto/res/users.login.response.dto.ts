export class UsersLoginResDto {
  token?: string | undefined;
  message : string;

  constructor(  token?: string | undefined, message?: string | undefined) {
    this.token = token;
    this.message = message;
  }
}
