export class CreateStudentDto {
  name: string;
  summoner: string;
  email: string;
  password: string;
  status: string;
  annotations?: { [key: string]: any };
}
