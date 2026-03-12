import {getRequestConfig} from 'next-intl/server';
import {allMessages, defaultLocale, validateLocale} from "@/i18n/config";

export default getRequestConfig(async ({requestLocale}) => {
    const locale = await requestLocale;

    const validatedLocale = validateLocale(locale);

    const messages = allMessages[validatedLocale] || allMessages[defaultLocale];
    return {locale: validatedLocale, messages};
});
