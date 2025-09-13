import { useLanguageStore } from '@store/languageStore'
import { getTranslation } from '@translations/index'

export function useTranslation() {
  const { currentLanguage } = useLanguageStore()
  return getTranslation(currentLanguage)
}