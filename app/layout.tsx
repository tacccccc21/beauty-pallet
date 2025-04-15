import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import Header from "./components/layouts/Header/Header";
import Footer from "./components/layouts/Footer/Footer";
import { UserProvider } from "./context/UserContext";
import ToReview from "./components/elements/ToReview/ToReview";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beauty Palette",
  description: 'コスメレビュー共有サイト',
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
      <UserProvider>
        <Header></Header>
          {children}
        <Footer></Footer>
      </UserProvider>
      <ToReview></ToReview>
      </body>
    </html>
  );
}
