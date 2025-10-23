import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ZakatCalculator() {
  const [assets, setAssets] = useState({
    cash: "",
    gold: "",
    silver: "",
    investments: "",
  });
  const [result, setResult] = useState<number | null>(null);

  const calculateZakat = () => {
    const total =
      parseFloat(assets.cash || "0") +
      parseFloat(assets.gold || "0") +
      parseFloat(assets.silver || "0") +
      parseFloat(assets.investments || "0");

    const zakatAmount = total * 0.025;
    setResult(zakatAmount);
    console.log("Zakat calculated:", zakatAmount);
  };

  return (
    <Card className="p-8" data-testid="card-zakat-calculator">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-2xl mb-2">Zakat Calculator</h3>
          <p className="text-sm text-muted-foreground">
            Calculate your annual Zakat (2.5% of eligible wealth)
          </p>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="cash">Cash & Bank Balance ($)</Label>
            <Input
              id="cash"
              type="number"
              placeholder="0.00"
              value={assets.cash}
              onChange={(e) => setAssets({ ...assets, cash: e.target.value })}
              data-testid="input-cash"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gold">Gold Value ($)</Label>
            <Input
              id="gold"
              type="number"
              placeholder="0.00"
              value={assets.gold}
              onChange={(e) => setAssets({ ...assets, gold: e.target.value })}
              data-testid="input-gold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="silver">Silver Value ($)</Label>
            <Input
              id="silver"
              type="number"
              placeholder="0.00"
              value={assets.silver}
              onChange={(e) => setAssets({ ...assets, silver: e.target.value })}
              data-testid="input-silver"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="investments">Investments & Stocks ($)</Label>
            <Input
              id="investments"
              type="number"
              placeholder="0.00"
              value={assets.investments}
              onChange={(e) => setAssets({ ...assets, investments: e.target.value })}
              data-testid="input-investments"
            />
          </div>
        </div>

        <Button onClick={calculateZakat} className="w-full" data-testid="button-calculate">
          Calculate Zakat
        </Button>

        {result !== null && (
          <div className="p-6 bg-primary/10 rounded-lg text-center" data-testid="result-zakat">
            <p className="text-sm text-muted-foreground mb-1">Your Zakat Amount</p>
            <p className="text-4xl font-bold text-primary">${result.toFixed(2)}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
