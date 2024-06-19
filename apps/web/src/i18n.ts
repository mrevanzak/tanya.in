import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = cookies().get("NEXT_LOCALE")?.value ?? "id";
  const messages = (await import(`../public/locales/${locale}.json`)) as {
    default: Record<string, string>;
  };

  return {
    locale,
    messages: messages.default,
  };
});
