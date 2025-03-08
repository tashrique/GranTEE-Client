export interface Scholarship {
    id: string;
    title: string;
    maxAmountPerApplicant: number;
    deadline: string;
    applicants: number;
    description: string;
    requirements: string[];
    balance: number;
    creator: string;
  }