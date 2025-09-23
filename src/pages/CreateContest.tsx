import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ContestCreationForm } from "@/components/ContestCreationForm";
import PageTransition from "@/components/PageTransition";

export default function CreateContest() {
  const handleContestCreated = () => {
    // Optionally show a success message or redirect
    console.log("Contest created successfully");
  };

  return (
    <PageTransition>
      <div className="min-h-screen cosmic-bg">
        <Header />
      
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-display font-bold">Create New Contest</h1>
              <Button variant="outline" asChild>
                <Link to="/contests">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Contests
                </Link>
              </Button>
            </div>
          
            <Card>
              <CardHeader>
                <CardTitle>Contest Details</CardTitle>
              </CardHeader>
              <CardContent>
                <ContestCreationForm onContestCreated={handleContestCreated} />
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
