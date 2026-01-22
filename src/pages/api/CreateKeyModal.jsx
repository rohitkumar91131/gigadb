import { useState } from "react";
import { Plus, Copy, Check, Terminal, AlertTriangle, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApiKeys } from "../../context/ApiKeyContext";
import { toast } from "sonner"; // Toast import karein

export default function CreateKeyModal() {
  const { createApiKey } = useApiKeys();

  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [generatedKey, setGeneratedKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- SUBMIT HANDLE ---
  const handleSubmit = async () => {
    if (!projectName.trim()) return;
    setLoading(true);
    try {
      // createApiKey function ab Humein RAW Key return karega (Context update ke baad)
      const rawKey = await createApiKey(projectName);
      setGeneratedKey(rawKey);
      setProjectName("");
    } catch (e) {
      // Error is handled in context via toast
    } finally {
      setLoading(false);
    }
  };

  // --- COPY HANDLE ---
  const handleCopy = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      toast.success("Secret key copied to clipboard!");
      
      // 2 seconds baad wapas Copy icon layein
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // --- CLOSE HANDLE ---
  const handleClose = () => {
    setIsOpen(false);
    // Thoda delay taaki modal band hone ke baad state clear ho (visual glitch na ho)
    setTimeout(() => {
        setGeneratedKey(null);
        setCopied(false);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => {
        if(!val) handleClose();
        setIsOpen(val);
    }}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Create New Key
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${generatedKey ? 'bg-green-100' : 'bg-blue-50'}`}>
                {generatedKey ? <Check className="h-5 w-5 text-green-600" /> : <Key className="h-5 w-5 text-blue-600" />}
            </div>
            <DialogTitle>
                {generatedKey ? "API Key Generated" : "Create API Key"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {generatedKey
              ? "Your API key has been created successfully."
              : "Enter a name for your project to generate a new secret key."}
          </DialogDescription>
        </DialogHeader>

        {/* --- STATE 1: INPUT FORM --- */}
        {!generatedKey ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Project Name</label>
              <div className="relative">
                <Terminal className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g. My NextJS App"
                  className="pl-9"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!projectName || loading}>
                {loading ? "Generating..." : "Create Secret Key"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          /* --- STATE 2: SUCCESS & COPY --- */
          <div className="space-y-5 py-2 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Warning Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex gap-3 items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                    <p className="font-semibold">Save this key now!</p>
                    <p className="opacity-90 mt-0.5">
                        We can only show you this key once. If you lose it, you will have to create a new one.
                    </p>
                </div>
            </div>

            {/* Key Input & Copy Button */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your Secret Key
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Input 
                        value={generatedKey} 
                        readOnly 
                        className="font-mono text-sm bg-slate-50 border-slate-200 text-slate-700 pr-2" 
                        onClick={(e) => e.target.select()} // Click pe poora select ho jaye
                    />
                </div>
                <Button 
                    size="icon" 
                    onClick={handleCopy}
                    className={copied ? "bg-green-600 hover:bg-green-700 transition-all" : "bg-slate-900 hover:bg-slate-800 transition-all"}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <Copy className="h-4 w-4 text-white" />
                  )}
                </Button>
              </div>
            </div>

            <DialogFooter className="sm:justify-between sm:flex-row-reverse gap-2 pt-2">
              <Button onClick={handleClose} className="w-full sm:w-auto">
                I have saved it
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}