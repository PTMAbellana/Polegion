export interface CompetitionType {
  id: number;
  title: string;
  status: 'ACTIVE' | 'ONGOING' | 'DONE';
}