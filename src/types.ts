export interface PageType {
  id: string;
  name: string;
  title: string;
}

export interface PhotoType {
  src: string;
  caption: string;
}

export interface HeartType {
  startX: number;
  endX: number;
  duration: number;
  delay: number;
}
