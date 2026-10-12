import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // O requestLocale agora é uma Promise nas versões mais recentes
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const messages = locale === 'en' 
  ? await import('@/public/messages/en.json') 
  : await import('@/public/messages/pt.json');

  return {
    locale,
    messages: messages.default
  };
});