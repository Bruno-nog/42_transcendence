
import { api } from '@/src/lib/axios';
import { Media } from '@/src/types/media';

export async function searchMedia(title: string): Promise<Media> {
  const { data } = await api.get<Media>("/search", {
    params: {
      title,
    },
  });

  return data;
}