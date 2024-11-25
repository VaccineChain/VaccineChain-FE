export interface UserInfo {
  UserId: string;
  Email: string;
  FirstName: string;
  LastName: string;
  DateOfBirth: Date;
  Address: string;
  ProfilePicture: string;
  Role: Role;
}

export interface Role {
  RoleId: string;
  Name: string;
}

export interface ChangeAvatar {
  multipartFile: File;
}

export interface Cover {
  id?: string;
  imageId: string;
  imageUrl: string;
}

export interface Skill {
  id: string;
  skillName: string;
  certificationName: string;
}

export interface Experience {
  id: string;
  companyOrSchoolName: string;
  positionOrDegree: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  location: string;
  experienceType: ExperienceType;
}

export enum ExperienceType {
  WORK = 'WORK',
  EDUCATION = 'EDUCATION',
}
