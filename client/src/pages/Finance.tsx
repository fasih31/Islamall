import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Calculator, BookOpen, TrendingUp } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface FinanceArticle {
  id: string;
  title: string;
  category: string;
  content: string;
}

interface ZakatResult {
  total: number;
  zakatAmount: number;
  breakdown: {
    cash: number;
    gold: number;
    silver: number;
    investments: number;
  };
}

export default function FinancePage() {
  const { toast } = useToast();
  const [cash, setCash] = useState("");
  const [gold, setGold] = useState("");
  const [silver, setSilver] = useState("");
  const [investments, setInvestments] = useState("");
  const [zakatResult, setZakatResult] = useState<ZakatResult | null>(null);

  const { data: articles, isLoading } = useQuery<FinanceArticle[]>({
    queryKey: ["/api/finance/articles"],
  });

  const zakatMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/finance/zakat", data);
      return await response.json() as ZakatResult;
    },
    onSuccess: (data: ZakatResult) => {
      setZakatResult(data);
      toast({
        title: "Zakat Calculated",
        description: `Your zakat amount is $${data.zakatAmount.toFixed(2)}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to calculate zakat. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCalculateZakat = () => {
    zakatMutation.mutate({
      cash: parseFloat(cash || "0"),
      gold: parseFloat(gold || "0"),
      silver: parseFloat(silver || "0"),
      investments: parseFloat(investments || "0"),
    });
  };

  const getCategoryColor = (category: string) => {
    if (category === "Zakat") return "bg-green-500/10 text-green-700 dark:text-green-400";
    if (category === "Investment") return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
    return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              Islamic Finance
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Calculate your Zakat, learn about halal investments, and explore
              Islamic finance principles.
            </p>
          </div>

          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="calculator" data-testid="tab-calculator">
                <Calculator className="h-4 w-4 mr-2" />
                Zakat Calculator
              </TabsTrigger>
              <TabsTrigger value="articles" data-testid="tab-articles">
                <BookOpen className="h-4 w-4 mr-2" />
                Resources
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="mt-8 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Calculate Your Zakat
                  </CardTitle>
                  <CardDescription>
                    Enter your assets to calculate the mandatory 2.5% charity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cash">Cash & Savings ($)</Label>
                      <Input
                        id="cash"
                        type="number"
                        placeholder="0.00"
                        value={cash}
                        onChange={(e) => setCash(e.target.value)}
                        data-testid="input-cash"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gold">Gold Value ($)</Label>
                      <Input
                        id="gold"
                        type="number"
                        placeholder="0.00"
                        value={gold}
                        onChange={(e) => setGold(e.target.value)}
                        data-testid="input-gold"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="silver">Silver Value ($)</Label>
                      <Input
                        id="silver"
                        type="number"
                        placeholder="0.00"
                        value={silver}
                        onChange={(e) => setSilver(e.target.value)}
                        data-testid="input-silver"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="investments">Investments ($)</Label>
                      <Input
                        id="investments"
                        type="number"
                        placeholder="0.00"
                        value={investments}
                        onChange={(e) => setInvestments(e.target.value)}
                        data-testid="input-investments"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleCalculateZakat}
                    disabled={zakatMutation.isPending}
                    className="w-full"
                    data-testid="button-calculate-zakat"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Zakat
                  </Button>

                  {zakatResult && (
                    <Card className="bg-primary/5">
                      <CardHeader>
                        <CardTitle className="text-2xl">
                          ${zakatResult.zakatAmount.toFixed(2)}
                        </CardTitle>
                        <CardDescription>
                          Your Zakat Amount (2.5% of ${zakatResult.total.toFixed(2)})
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">From Cash:</p>
                            <p className="font-semibold">
                              ${zakatResult.breakdown.cash.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">From Gold:</p>
                            <p className="font-semibold">
                              ${zakatResult.breakdown.gold.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">From Silver:</p>
                            <p className="font-semibold">
                              ${zakatResult.breakdown.silver.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              From Investments:
                            </p>
                            <p className="font-semibold">
                              ${zakatResult.breakdown.investments.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="articles" className="mt-8">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-40" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles?.map((article) => (
                    <Card key={article.id} data-testid={`card-article-${article.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <CardTitle className="text-lg line-clamp-2">
                            {article.title}
                          </CardTitle>
                          <Badge className={getCategoryColor(article.category)}>
                            {article.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-4">
                          {article.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
