import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import PublicMenuPage from "./MenuClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const { data } = await supabase
    .from("restaurantes")
    .select("nome, logo_url")
    .eq("slug", slug)
    .single();

  const title = `Cardápio Digital - ${data?.nome || 'Restaurante'}`;
  const description = "Confira nossas delícias e faça seu pedido online pelo MenuZen!";
  // Fallback image if restaurant has no logo
  const imageUrl = data?.logo_url || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function Page(props: PageProps) {
  return <PublicMenuPage params={props.params} />;
}
