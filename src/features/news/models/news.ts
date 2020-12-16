interface NewsSource {
  Name: string;
  Avatar: string;
}

export interface NewsKey {
  Source: string;
  CreatedAt: number;
}

export interface News {
  Id: string;
  Title: string;
  Summary: string;
  Source: NewsSource;
  CreatedAt: number;
  Image?: string;
  Link?: string;
}
