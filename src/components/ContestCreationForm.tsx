import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { contestServiceFunctions } from "@/lib/contestService";
import { Subject } from "@/lib/types";
import { subjectService } from "@/lib/firestoreService";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  subjectId: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  duration: z.number().min(1).max(120),
  questionsCount: z.number().min(1).max(50),
  prize: z.string().min(5, {
    message: "Prize description must be at least 5 characters.",
  }),
  maxParticipants: z.number().optional(),
});

interface ContestCreationFormProps {
  onContestCreated: () => void;
}

export function ContestCreationForm({ onContestCreated }: ContestCreationFormProps) {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch subjects when component mounts
  useState(() => {
    const fetchSubjects = async () => {
      try {
        const fetchedSubjects = await subjectService.getAllSubjects();
        setSubjects(fetchedSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast({
          title: "Error",
          description: "Failed to load subjects",
          variant: "destructive",
        });
      }
    };
    
    fetchSubjects();
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      subjectId: undefined,
      startDate: format(new Date(Date.now() + 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"),
      endDate: format(new Date(Date.now() + 25 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"),
      difficulty: "Medium",
      duration: 15,
      questionsCount: 10,
      prize: "100 XP + Badge",
      maxParticipants: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      
      // Convert date strings to Date objects
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);
      
      // Validate dates
      if (startDate >= endDate) {
        toast({
          title: "Invalid Dates",
          description: "End date must be after start date",
          variant: "destructive",
        });
        return;
      }
      
      if (startDate < new Date()) {
        toast({
          title: "Invalid Start Date",
          description: "Start date must be in the future",
          variant: "destructive",
        });
        return;
      }
      
      // Create contest
      await contestServiceFunctions.createContest({
        title: values.title,
        description: values.description,
        subjectId: values.subjectId === "none" ? undefined : values.subjectId,
        startDate,
        endDate,
        difficulty: values.difficulty,
        duration: values.duration,
        questionsCount: values.questionsCount,
        prize: values.prize,
        maxParticipants: values.maxParticipants,
        participants: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      toast({
        title: "Contest Created",
        description: "Your contest has been created successfully",
      });
      
      // Reset form
      form.reset();
      onContestCreated();
    } catch (error) {
      console.error("Error creating contest:", error);
      toast({
        title: "Error",
        description: "Failed to create contest",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contest Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contest title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your contest"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Associate this contest with a specific subject
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date & Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date & Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="questionsCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Questions</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxParticipants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Participants (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(e.target.value ? +e.target.value : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="prize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prize</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 100 XP + Gold Badge" {...field} />
                </FormControl>
                <FormDescription>
                  Describe the prize for winning this contest
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating..." : "Create Contest"}
          </Button>
        </form>
      </Form>
    </div>
  );
}