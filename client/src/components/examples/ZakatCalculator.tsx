import { ThemeProvider } from "../ThemeProvider";
import { ZakatCalculator } from "../ZakatCalculator";

export default function ZakatCalculatorExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background max-w-2xl mx-auto">
        <ZakatCalculator />
      </div>
    </ThemeProvider>
  );
}
