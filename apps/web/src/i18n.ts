import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  cookies().has("NEXT_LOCALE") || cookies().set("NEXT_LOCALE", "id");
  const locale = cookies().get("NEXT_LOCALE")?.value;
  const messages = (await import(`../public/locales/${locale}.json`)) as {
    default: Record<string, string>;
  };

  return {
    locale,
    messages: messages.default,
  };
});
