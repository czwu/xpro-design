import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'zh', // set locale
  fallbackLocale: 'ch',
  globalInjection:true,
  legacy: false,
  messages: {
    zh: {
      message: {
        hello: '你好世界',
      },
    },
    en: {
      message: {
        hello: 'hello world',
      },
    },
  },
})

export default i18n