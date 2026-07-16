export interface StoreSettings {
  id: number;
  opens_at: string;
  closes_at: string;
  days_open: number[];
  holiday_mode: boolean;
  closed_message: string | null;
}
