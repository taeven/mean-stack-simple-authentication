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
export class SignUpResponse {
  message: string;
}
export class SignUpParameters {
  name: string;
  email: string;
  password: string;
  country: string;
  timezone: string;
  dob: string;
}
