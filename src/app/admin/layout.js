export const metadata = {
  title: { default: "لوحة التحكم", template: "%s | لوحة BRXEL" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return children;
}
