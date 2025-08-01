import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8 text-center space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <Video className="h-12 w-12 text-primary mr-3" />
                <h1 className="text-4xl font-bold text-foreground">FakeZoom</h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Connect with your team anywhere
              </p>
            </div>

            <Link to="/join" className="block">
              <Button
                size="lg"
                className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Join a Meeting
              </Button>
            </Link>

            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <span>•</span>
                <span>HD Video & Audio</span>
                <span>•</span>
                <span>Screen Sharing</span>
                <span>•</span>
              </div>
              <p className="text-xs text-muted-foreground">
                No downloads required. Works in your browser.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
