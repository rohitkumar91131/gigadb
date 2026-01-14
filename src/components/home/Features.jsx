import { Zap, ShieldCheck, Globe2, Cpu } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Disk-based Storage",
    description: "All data is written to JSONL files on disk. Nothing is in RAM-only. Data survives restarts and crashes.",
    icon: Zap,
  },
  {
    title: "B+ Tree Indexing",
    description: "Every indexed field maps keys to byte offsets, giving fast search, filters and pagination without scanning files.",
    icon: ShieldCheck,
  },
  {
    title: "Append-only Engine",
    description: "Records are never overwritten. New data is always appended, which keeps writes fast and prevents corruption.",
    icon: Globe2,
  },
  {
    title: "Offset-based Reads",
    description: "Queries jump directly to the exact byte position in files using indexes instead of reading the whole collection.",
    icon: Cpu,
  },
]

export default function Features() {
  return (
    <section className="py-24 bg-white dark:bg-zinc-900">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Built like a real database
          </h2>
          <p className="text-lg text-muted-foreground">
            GigaDB is not a toy JSON store. It is a disk-backed, indexed database engine.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-300">
                  <feature.icon size={24} />
                </div>
                <CardTitle className="text-xl">
                  {feature.title}
                </CardTitle>
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
  )
}
