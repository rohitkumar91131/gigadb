import { Zap, ShieldCheck, Globe2, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Real-time Sync",
    description: "Updates are pushed to all connected clients instantly. No manual refresh needed.",
    icon: Zap,
  },
  {
    title: "Enterprise Security",
    description: "Bank-grade encryption at rest and in transit. Your data is safe with us.",
    icon: ShieldCheck,
  },
  {
    title: "Global Edge Network",
    description: "Low latency access from anywhere in the world via our distributed edge nodes.",
    icon: Globe2,
  },
  {
    title: "Serverless Compute",
    description: "Run custom functions on database events without managing a single server.",
    icon: Cpu,
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-white dark:bg-zinc-900">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything you need to build faster
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform handles the heavy lifting so you can focus on your code.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
                  <feature.icon size={24} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}