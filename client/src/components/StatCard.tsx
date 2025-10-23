import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card className="p-6" data-testid={`card-stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex flex-col items-center gap-3 text-center">
        <Icon className="h-8 w-8 text-primary" />
        <div className="space-y-1">
          <p className="text-4xl font-bold" data-testid={`text-value-${label.toLowerCase().replace(/\s+/g, '-')}`}>
            {value}
          </p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </Card>
  );
}
