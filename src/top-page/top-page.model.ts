export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products,
}

export class TopPageModel {
  _id: string;
  firstLevel: TopLevelCategory;
  secondCategory: string;
  title: string;
  category: string;
  hh?: {
    count: number;
    juniorSalary: number;
    middleSalary: number;
    seniorSalary: number;
  };
  advantages: Array<{
    title: string;
    description: string;
  }>;
  seoText: string;
  tagsTitles: string;
  tags: Array<string>;
}
