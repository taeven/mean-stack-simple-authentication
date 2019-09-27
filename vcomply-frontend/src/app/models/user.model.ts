class Message {
  status: string;
  user: string;
}
export class SignInResponse {
  message: Message | any;
}

export class LogoutResponse {
  message: string;
}
export class SignInParameters {
  email: string;
  password: string;
}
