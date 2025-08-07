import type { Link } from "../types";

export const SITE = {
  title: "EntryEarns",
  description: "A knowledge platform for skill development and insights",
  author: "EntryEarns Team",
  url: "https://entryearns.com",
  locale: "en-US",
  dir: "ltr",
  charset: "UTF-8",
  basePath: "/",
  postsPerPage: 4,
  googleAnalyticsId: "G-CDCLETJMND",
};

export const NAVIGATION_LINKS: Link[] = [
  {
    href: "/about",
    text: "About",
  },
];

export const OTHER_LINKS: Link[] = [
  {
    href: "/about",
    text: "About us",
  },
  {
    href: "/contact",
    text: "Contact",
  },
  {
    href: "/privacy",
    text: "Privacy",
  },
  {
    href: "/terms",
    text: "Terms",
  },
  {
    href: "/cookie-policy",
    text: "Cookie Policy",
  },
];

export const SOCIAL_LINKS: Link[] = [
  {
    href: "https://t.me/entryearns",
    text: "Telegram",
    icon: "telegram",
  },
  {
    href: "https://twitter.com/entryearns",
    text: "Twitter",
    icon: "newTwitter",
  },
  {
    href: "https://www.facebook.com/entryearns",
    text: "Facebook",
    icon: "facebook",
  },
];
