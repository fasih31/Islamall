import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PDFViewer } from "@/components/PDFViewer";
import { ArrowLeft, BookOpen, ExternalLink, Download } from "lucide-react";
import { Link } from "wouter";

interface Book {
  id: string;
  title: string;
  titleArabic?: string;
  author: string;
  authorArabic?: string;
  category: string;
  description: string;
  language: string;
  coverImageUrl?: string;
  pdfUrl?: string;
  purchaseUrl?: string;
  isFeatured: boolean;
}

export default function BookDetail() {
  const [, params] = useRoute("/books/:id");
  const bookId = params?.id;

  const { data: book, isLoading } = useQuery<Book>({
    queryKey: [`/api/books/${bookId}`],
    enabled: !!bookId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            <Skeleton className="h-12 w-48" />
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="h-96" />
              <Skeleton className="h-96" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h1 className="text-3xl font-bold">Book Not Found</h1>
            <p className="text-muted-foreground">The book you're looking for doesn't exist.</p>
            <Link href="/books">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Library
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Back Button */}
          <Link href="/books">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Button>
          </Link>

          {/* Book Header */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Book Info */}
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div className="space-y-2">
                      <CardTitle className="text-2xl" data-testid="text-book-title">
                        {book.title}
                      </CardTitle>
                      {book.titleArabic && (
                        <p className="font-arabic text-xl text-primary" dir="rtl">
                          {book.titleArabic}
                        </p>
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-base pt-2">
                    {book.author}
                    {book.authorArabic && (
                      <span className="font-arabic block mt-1" dir="rtl">
                        {book.authorArabic}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{book.language}</Badge>
                    <Badge variant="outline">{book.category.replace(/_/g, ' ')}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">Description</h3>
                    <p className="text-sm text-muted-foreground" data-testid="text-book-description">
                      {book.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-4">
                    {book.pdfUrl && (
                      <Button variant="default" asChild data-testid="button-download-pdf">
                        <a href={book.pdfUrl} download target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </a>
                      </Button>
                    )}
                    {book.purchaseUrl && (
                      <Button variant="outline" asChild data-testid="button-purchase">
                        <a href={book.purchaseUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Purchase Book
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* PDF Viewer */}
            <div className="md:col-span-2">
              {book.pdfUrl ? (
                <PDFViewer pdfUrl={book.pdfUrl} title={book.title} />
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">PDF Not Available</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      The PDF for this book is not currently available. 
                      {book.purchaseUrl && " You can purchase the physical or digital copy using the link provided."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
