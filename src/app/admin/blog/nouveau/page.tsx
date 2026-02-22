// Page de creation d'un nouvel article de blog
// Server Component : affiche le formulaire vierge

import BlogForm from "@/components/admin/blog/BlogForm";

export const metadata = {
  title: "Nouvel article - Blog - Administration",
};

export default function NewBlogPostPage() {
  return <BlogForm />;
}
