import { getTranslations } from 'next-intl/server';
import ProfilePageView from '@/src/views/profilePageView';

export default async function ProfilePage() {
  const t = await getTranslations('Profile');

  return <ProfilePageView />;
}