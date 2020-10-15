export interface IUpdateStudentDto {
  name?: string;
  summoner?: string;
  email?: string;
  password?: string;
  annotations?: { [key: string]: any };
}
