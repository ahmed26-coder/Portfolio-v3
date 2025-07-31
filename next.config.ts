// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['xnuaqhaffihsznkcddiy.supabase.co'],
  },
};

export default withNextIntl(nextConfig);