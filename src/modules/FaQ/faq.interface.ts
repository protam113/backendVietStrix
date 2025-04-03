// faq.interface.ts

export interface IFaq {
  _id: string;
  question: string;
  answer: string;
  status: 'show' | 'hide';
}
