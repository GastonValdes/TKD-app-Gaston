import { useTranslation } from 'react-i18next';
import { contentTranslations } from '@/data/translations';
import { ListingTranslationType } from '@/data/translations/types';

export const useTranslatedContent = () => {
  const { i18n } = useTranslation();
  
  const getTranslatedContent = (): ListingTranslationType[] => {
    return contentTranslations[i18n.language as keyof typeof contentTranslations] || contentTranslations.en;
  };

  const getTranslatedItem = (id: string): ListingTranslationType | undefined => {
    const content = getTranslatedContent();
    return content.find(item => item.id === id);
  };

  return {
    content: getTranslatedContent(),
    getItem: getTranslatedItem
  };
};