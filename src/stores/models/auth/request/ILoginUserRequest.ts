export interface ILoginUserRequest {
  userName: string;
  password: string;
  expected_role?: string;
}
