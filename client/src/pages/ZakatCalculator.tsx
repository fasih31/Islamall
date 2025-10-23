import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, DollarSign, Info, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate to USD
}

const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", rate: 3.75 },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", rate: 3.67 },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee", rate: 278 },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83 },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", rate: 4.47 },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", rate: 32 },
];

export default function ZakatCalculator() {
  // Asset values
  const [cash, setCash] = useState("");
  const [gold, setGold] = useState("");
  const [silver, setSilver] = useState("");
  const [investments, setInvestments] = useState("");
  const [businessAssets, setBusinessAssets] = useState("");
  const [otherAssets, setOtherAssets] = useState("");
  const [debts, setDebts] = useState("");
  const [currency, setCurrency] = useState<string>("USD");

  // Current Nisab rates (in USD) - These would normally come from an API
  const GOLD_PRICE_PER_GRAM_USD = 65; // Approximate
  const SILVER_PRICE_PER_GRAM_USD = 0.80; // Approximate
  const GOLD_NISAB_GRAMS = 87.48; // 7.5 tola or 612.36 grams / 7
  const SILVER_NISAB_GRAMS = 612.36; // 52.5 tola

  // Get selected currency
  const selectedCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  
  // Convert prices to selected currency
  const goldPricePerGram = GOLD_PRICE_PER_GRAM_USD * selectedCurrency.rate;
  const silverPricePerGram = SILVER_PRICE_PER_GRAM_USD * selectedCurrency.rate;
  
  const nisabGold = goldPricePerGram * GOLD_NISAB_GRAMS;
  const nisabSilver = silverPricePerGram * SILVER_NISAB_GRAMS;

  // Calculate total assets
  const totalAssets = 
    (parseFloat(cash) || 0) +
    (parseFloat(gold) || 0) +
    (parseFloat(silver) || 0) +
    (parseFloat(investments) || 0) +
    (parseFloat(businessAssets) || 0) +
    (parseFloat(otherAssets) || 0);

  const totalDebts = parseFloat(debts) || 0;
  const netAssets = totalAssets - totalDebts;
  const zakatAmount = netAssets * 0.025; // 2.5%

  const isZakatDue = netAssets >= nisabSilver; // Use silver nisab (lower threshold)

  const handleReset = () => {
    setCash("");
    setGold("");
    setSilver("");
    setInvestments("");
    setBusinessAssets("");
    setOtherAssets("");
    setDebts("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              Zakat & Nisab Calculator
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Calculate your Zakat obligation based on Islamic principles. 
              Zakat is 2.5% of zakatable wealth held for one lunar year.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Calculator Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calculate Your Zakat
                </CardTitle>
                <CardDescription>
                  Enter the value of your assets in your local currency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Currency Selector */}
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency" data-testid="select-currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((curr) => (
                        <SelectItem key={curr.code} value={curr.code} data-testid={`currency-${curr.code}`}>
                          {curr.symbol} {curr.code} - {curr.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Cash & Bank Balances */}
                <div className="space-y-2">
                  <Label htmlFor="cash">Cash & Bank Balances</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      {selectedCurrency.symbol}
                    </span>
                    <Input
                      id="cash"
                      type="number"
                      placeholder="0.00"
                      value={cash}
                      onChange={(e) => setCash(e.target.value)}
                      className="pl-10"
                      data-testid="input-cash"
                    />
                  </div>
                </div>

                {/* Gold Value */}
                <div className="space-y-2">
                  <Label htmlFor="gold">Gold Value</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      {selectedCurrency.symbol}
                    </span>
                    <Input
                      id="gold"
                      type="number"
                      placeholder="0.00"
                      value={gold}
                      onChange={(e) => setGold(e.target.value)}
                      className="pl-10"
                      data-testid="input-gold"
                    />
                  </div>
                </div>

                {/* Silver Value */}
                <div className="space-y-2">
                  <Label htmlFor="silver">Silver Value</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      {selectedCurrency.symbol}
                    </span>
                    <Input
                      id="silver"
                      type="number"
                      placeholder="0.00"
                      value={silver}
                      onChange={(e) => setSilver(e.target.value)}
                      className="pl-10"
                      data-testid="input-silver"
                    />
                  </div>
                </div>

                {/* Investments */}
                <div className="space-y-2">
                  <Label htmlFor="investments">Investments & Stocks</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      {selectedCurrency.symbol}
                    </span>
                    <Input
                      id="investments"
                      type="number"
                      placeholder="0.00"
                      value={investments}
                      onChange={(e) => setInvestments(e.target.value)}
                      className="pl-10"
                      data-testid="input-investments"
                    />
                  </div>
                </div>

                {/* Business Assets */}
                <div className="space-y-2">
                  <Label htmlFor="business">Business Assets (Inventory, Receivables)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      {selectedCurrency.symbol}
                    </span>
                    <Input
                      id="business"
                      type="number"
                      placeholder="0.00"
                      value={businessAssets}
                      onChange={(e) => setBusinessAssets(e.target.value)}
                      className="pl-10"
                      data-testid="input-business"
                    />
                  </div>
                </div>

                {/* Other Assets */}
                <div className="space-y-2">
                  <Label htmlFor="other">Other Zakatable Assets</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      {selectedCurrency.symbol}
                    </span>
                    <Input
                      id="other"
                      type="number"
                      placeholder="0.00"
                      value={otherAssets}
                      onChange={(e) => setOtherAssets(e.target.value)}
                      className="pl-10"
                      data-testid="input-other"
                    />
                  </div>
                </div>

                <Separator />

                {/* Debts */}
                <div className="space-y-2">
                  <Label htmlFor="debts">Debts & Liabilities (Deductible)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      {selectedCurrency.symbol}
                    </span>
                    <Input
                      id="debts"
                      type="number"
                      placeholder="0.00"
                      value={debts}
                      onChange={(e) => setDebts(e.target.value)}
                      className="pl-10"
                      data-testid="input-debts"
                    />
                  </div>
                </div>

                <Button onClick={handleReset} variant="outline" className="w-full" data-testid="button-reset">
                  Reset Calculator
                </Button>
              </CardContent>
            </Card>

            {/* Results Card */}
            <div className="space-y-6">
              {/* Nisab Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Current Nisab Values
                  </CardTitle>
                  <CardDescription>
                    Nisab is the minimum threshold for Zakat obligation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Gold Nisab (87.48g)</span>
                    <Badge variant="outline" data-testid="nisab-gold">
                      {selectedCurrency.symbol}{nisabGold.toFixed(2)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Silver Nisab (612.36g)</span>
                    <Badge variant="outline" data-testid="nisab-silver">
                      {selectedCurrency.symbol}{nisabSilver.toFixed(2)}
                    </Badge>
                  </div>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Most scholars recommend using the Silver Nisab (lower threshold) 
                      as it benefits more recipients.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Zakat Calculation Results */}
              <Card className={isZakatDue ? "border-primary" : ""}>
                <CardHeader>
                  <CardTitle>Your Zakat Calculation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Assets:</span>
                      <span className="font-medium" data-testid="total-assets">
                        {selectedCurrency.symbol}{totalAssets.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Minus Debts:</span>
                      <span className="font-medium text-muted-foreground">
                        {selectedCurrency.symbol}{totalDebts.toFixed(2)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Net Zakatable Wealth:</span>
                      <span className="font-bold" data-testid="net-assets">
                        {selectedCurrency.symbol}{netAssets.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {isZakatDue ? (
                    <>
                      <Separator />
                      <div className="bg-primary/10 rounded-lg p-4 space-y-2">
                        <p className="text-sm font-medium text-center">
                          Your Zakat Due (2.5%)
                        </p>
                        <p className="text-3xl font-bold text-center text-primary" data-testid="zakat-amount">
                          {selectedCurrency.symbol}{zakatAmount.toFixed(2)}
                        </p>
                      </div>
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          Your wealth exceeds the Nisab. Zakat is obligatory on you. 
                          May Allah accept your charity.
                        </AlertDescription>
                      </Alert>
                    </>
                  ) : (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription data-testid="no-zakat-message">
                        {netAssets > 0 
                          ? "Your wealth is below the Nisab threshold. Zakat is not obligatory, but voluntary charity (Sadaqah) is always encouraged."
                          : "Enter your assets above to calculate Zakat."}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Important Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Important Notes</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2 text-muted-foreground">
                  <p>• Zakat is due if wealth is held for one lunar year (Hawl)</p>
                  <p>• Personal use items (home, car, clothing) are not zakatable</p>
                  <p>• Consult a scholar for complex financial situations</p>
                  <p>• This calculator uses approximate metal prices</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
