export interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profile: Profile;
  avatar?: Avatar;
  cover?: Cover;
  skills?: Array<Skill>;
  experiences?: Array<Experience>;
}

export interface Profile {
  id?: string;
  gender: boolean;
  dateOfBirth: Date;
  country: string;
  address: string;
  aboutMe: string;
  phoneNumber: string;
  hobbies: Array<string>;
}

export interface Avatar {
  id?: string;
  imageId: string;
  imageUrl: string;
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
