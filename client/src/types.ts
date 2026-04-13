export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage: string | null;
  category: string;
}

export interface Member {
  id: number;
  name: string;
  role: string;
  image: string | null;
  bio: string;
  type: 'executive' | 'advisory';
}
