import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="w-full absolute min-h-screen text-center mx-auto flex items-center justify-center">
      <div className="text-center flex flex-col items-center">
        <AlertTriangle className="w-20 h-20 text-destructive mb-6" />
        <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          Sorry, the page you’re looking for doesn’t exist.
        </p>
        <Button asChild>
          <Link href="/">Go Back Home</Link>
        </Button>
      </div>
    </div>
  );
}
