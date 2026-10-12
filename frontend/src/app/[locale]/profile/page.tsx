import { getTranslations } from 'next-intl/server';
import ProfilePageView from '@/src/views/profilePageView';

export default async function ProfilePage() {
  // Busca as traduções no servidor sem dar erro de contexto do cliente
  const t = await getTranslations('Profile');

  // Passamos as strings traduzidas ou o próprio namespace se necessário
  return <ProfilePageView />;
}