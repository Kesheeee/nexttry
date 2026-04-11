import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface Post {
  id: string;
  title: string;
  summary: string;
  label: string;
  author: string;
  published: string;
  url: string;
  image: string;
}

interface Blog7Props {
  tagline?: string;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  posts?: Post[];
}

const Blog7 = ({
  tagline = "From the Blog",
  heading = "Stories & Insights",
  description = "Real stories, practical advice, and guidance for every stage of life — from school to career to everything beyond.",
  buttonText = "View all articles",
  buttonUrl = "/blog",
  posts = [],
}: Blog7Props) => {
  return (
    <section className="py-32">
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6">
            {tagline}
          </Badge>
          <h2 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            {heading}
          </h2>
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            {description}
          </p>
          <Button variant="link" className="w-full sm:w-auto" asChild>
            <a href={buttonUrl}>
              {buttonText}
              <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <Card key={post.id} className="grid grid-rows-[auto_auto_1fr_auto]">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-t-lg">
                <a href={post.url} className="transition-opacity duration-200 hover:opacity-70 block h-full">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover object-center"
                  />
                </a>
              </div>
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-1">{post.label}</Badge>
                <h3 className="text-lg font-semibold hover:underline md:text-xl">
                  <a href={post.url}>{post.title}</a>
                </h3>
                <p className="text-xs text-muted-foreground">
                  {post.author} · {post.published}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{post.summary}</p>
              </CardContent>
              <CardFooter>
                <a href={post.url} className="flex items-center text-sm text-foreground hover:underline">
                  Read more
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Blog7 };
