import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome to Sellby Store - Your Favorite Online Shop',
  description: 'Discover the best deals on electronics, fashion, and more at Sellby Store. Shop now and enjoy fast shipping and great prices!',
  openGraph: {
    title: 'Welcome to Sellby Store - Your Favorite Online Shop',
    description: 'Discover the best deals on electronics, fashion, and more at Sellby Store. Shop now and enjoy fast shipping and great prices!',
    url: 'https://sellby.netlify.app',
    siteName: 'Sellby Store',
    images: [
      {
        url: 'https://sellby.netlify.app/seo/homepage.png',
        width: 1200,
        height: 630,
        alt: 'Sellby Store Homepage',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Welcome to Sellby Store - Your Favorite Online Shop',
    description: 'Discover the best deals on electronics, fashion, and more at Sellby Store. Shop now and enjoy fast shipping and great prices!',
    images: ['https://sellby.netlify.app/seo/homepage.png'],
  },
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
