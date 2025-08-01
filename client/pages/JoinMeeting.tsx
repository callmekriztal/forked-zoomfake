import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Video } from "lucide-react";

export default function JoinMeeting() {
  const [meetingCode, setMeetingCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingCode.trim()) {
      navigate("/meeting");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
        </div>

        <Card className="shadow-2xl border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <Video className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-2xl font-bold text-foreground">FakeZoom</h1>
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Join a Meeting
            </h2>
            <p className="text-muted-foreground">
              Enter your meeting code to get started
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="meetingCode"
                  className="text-foreground font-medium"
                >
                  Enter Meeting Code
                </Label>
                <Input
                  id="meetingCode"
                  type="text"
                  placeholder="e.g. 123-456-789"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  className="h-12 text-lg bg-background border-border focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={!meetingCode.trim()}
              >
                Join Now
              </Button>
            </form>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                By joining, you agree to our privacy policy and terms of
                service.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
