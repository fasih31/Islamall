import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ValidationCriteria {
  score: number;
  notes: string;
}

interface ValidationResult {
  classification: "Sahih" | "Hasan" | "Da'if" | "Mawdu'" | "Unknown";
  analysis: string;
  criteria: {
    sanad: ValidationCriteria;
    adalah: ValidationCriteria;
    dabt: ValidationCriteria;
    shudhudh: ValidationCriteria;
    illah: ValidationCriteria;
  };
}

export default function HadithValidator() {
  const [hadithText, setHadithText] = useState("");
  const [narrator, setNarrator] = useState("");
  const [source, setSource] = useState("");
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const { toast } = useToast();

  const validateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/hadith/validate", {
        hadithText,
        narrator: narrator || undefined,
        source: source || undefined,
      });
      return await response.json();
    },
    onSuccess: (data: ValidationResult) => {
      setValidationResult(data);
      toast({
        title: "Validation Complete",
        description: `Classification: ${data.classification}`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "";
      const isQuotaError = errorMessage.includes("503") || 
                          errorMessage.includes("quota") || 
                          errorMessage.includes("temporarily unavailable");
      
      const message = isQuotaError
        ? "Validation service temporarily unavailable. The feature requires OpenAI credits."
        : "Failed to validate Hadith. Please try again.";
      
      toast({
        title: "Validation Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hadithText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter the Hadith text in Arabic",
        variant: "destructive",
      });
      return;
    }
    validateMutation.mutate();
  };

  const getClassificationColor = (classification: string) => {
    const colors: Record<string, string> = {
      Sahih: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
      Hasan: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
      "Da'if": "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
      "Mawdu'": "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
      Unknown: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
    };
    return colors[classification] || colors.Unknown;
  };

  const getClassificationIcon = (classification: string) => {
    if (classification === "Sahih") return <CheckCircle2 className="h-5 w-5" />;
    if (classification === "Hasan") return <CheckCircle2 className="h-5 w-5" />;
    if (classification === "Da'if") return <AlertCircle className="h-5 w-5" />;
    if (classification === "Mawdu'") return <XCircle className="h-5 w-5" />;
    return <Shield className="h-5 w-5" />;
  };

  const criteriaLabels = {
    sanad: "Sanad (Chain of Narration)",
    adalah: "'Adālah (Integrity)",
    dabt: "Ḍabṭ (Accuracy & Memory)",
    shudhudh: "'Adam al-Shudhūdh (No Contradiction)",
    illah: "'Adam al-'Illah (No Hidden Defect)",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-10 w-10 text-primary" />
              <h1 className="font-serif text-4xl md:text-5xl font-bold">
                Hadith Validator
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Validate Hadith authenticity using classical Islamic scholarship criteria.
              Based on the science of ʿIlm al-Ḥadīth used by scholars like Imam al-Bukhari and Imam Muslim.
            </p>
          </div>

          {/* Validation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Enter Hadith Details</CardTitle>
              <CardDescription>
                Provide the Hadith text in Arabic. Narrator and source information are optional but help improve accuracy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="hadith-text">Hadith Text (Arabic) *</Label>
                  <Textarea
                    id="hadith-text"
                    placeholder="Enter the Hadith text in Arabic..."
                    value={hadithText}
                    onChange={(e) => setHadithText(e.target.value)}
                    className="min-h-32 font-arabic text-lg"
                    dir="rtl"
                    data-testid="input-hadith-text"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="narrator">Narrator (Optional)</Label>
                    <Input
                      id="narrator"
                      placeholder="e.g., Abu Hurairah"
                      value={narrator}
                      onChange={(e) => setNarrator(e.target.value)}
                      data-testid="input-narrator"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="source">Source (Optional)</Label>
                    <Input
                      id="source"
                      placeholder="e.g., Sahih Bukhari"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      data-testid="input-source"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={validateMutation.isPending}
                  data-testid="button-validate"
                >
                  {validateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Validate Hadith
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Validation Results */}
          {validationResult && (
            <div className="space-y-6">
              {/* Classification Badge */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-4">
                    <div 
                      className={`flex items-center gap-3 px-6 py-3 rounded-lg border ${getClassificationColor(validationResult.classification)}`}
                      data-testid="badge-classification"
                    >
                      {getClassificationIcon(validationResult.classification)}
                      <span className="font-semibold text-xl" data-testid="text-classification">
                        {validationResult.classification}
                      </span>
                      {validationResult.classification === "Sahih" && <span className="text-sm">(Authentic)</span>}
                      {validationResult.classification === "Hasan" && <span className="text-sm">(Good)</span>}
                      {validationResult.classification === "Da'if" && <span className="text-sm">(Weak)</span>}
                      {validationResult.classification === "Mawdu'" && <span className="text-sm">(Fabricated)</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p 
                    className="text-muted-foreground leading-relaxed whitespace-pre-wrap"
                    data-testid="text-analysis"
                  >
                    {validationResult.analysis}
                  </p>
                </CardContent>
              </Card>

              {/* Criteria Scores */}
              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Criteria</CardTitle>
                  <CardDescription>
                    Assessment based on the five classical criteria of Hadith authentication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(validationResult.criteria).map(([key, value]) => (
                    <div key={key} className="space-y-2" data-testid={`card-criteria-${key}`}>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                          {criteriaLabels[key as keyof typeof criteriaLabels]}
                        </Label>
                        <Badge variant="outline" data-testid={`badge-score-${key}`}>{value.score}/10</Badge>
                      </div>
                      <Progress value={value.score * 10} className="h-2" data-testid={`progress-${key}`} />
                      <p className="text-sm text-muted-foreground" data-testid={`text-notes-${key}`}>{value.notes}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
