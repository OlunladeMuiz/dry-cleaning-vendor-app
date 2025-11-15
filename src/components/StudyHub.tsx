import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Brain, 
  Upload, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Plus,
  FileText,
  Zap,
  Calendar as CalendarIcon,
  Trash2,
  Edit,
  Play,
  Book
} from "lucide-react";

interface StudyGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: Date;
}

interface StudyReminder {
  id: string;
  title: string;
  time: string;
  days: string[];
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: string;
}

interface StudySession {
  id: string;
  subject: string;
  duration: number;
  date: Date;
  technique: string;
}

export function StudyHub() {
  const [goals, setGoals] = useState<StudyGoal[]>([
    {
      id: "1",
      title: "Complete Calculus Chapter 5",
      description: "Finish all exercises and practice problems",
      target: 50,
      current: 32,
      unit: "problems",
      deadline: new Date(2025, 10, 20),
    },
  ]);

  const [reminders, setReminders] = useState<StudyReminder[]>([
    {
      id: "1",
      title: "Chemistry Lab Review",
      time: "18:00",
      days: ["Mon", "Wed", "Fri"],
    },
  ]);

  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: "1",
      question: "What is the derivative of x²?",
      answer: "2x",
      subject: "Calculus",
    },
  ]);

  const [sessions, setSessions] = useState<StudySession[]>([
    {
      id: "1",
      subject: "Physics",
      duration: 45,
      date: new Date(),
      technique: "Pomodoro",
    },
  ]);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>("");

  const studyTechniques = [
    { name: "Pomodoro", description: "25 min focus + 5 min break", icon: Clock },
    { name: "Feynman", description: "Explain concepts simply", icon: Brain },
    { name: "Active Recall", description: "Test yourself frequently", icon: Zap },
    { name: "SQ3R", description: "Survey, Question, Read, Recite, Review", icon: Book },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsAnalyzing(true);
      
      // Simulate AI analysis
      setTimeout(() => {
        setAiResponse(`Analysis of "${file.name}":
        
📚 Key Concepts Identified:
- Advanced calculus principles
- Integration techniques
- Differential equations

❓ Generated Technical Questions:
1. Explain the fundamental theorem of calculus
2. How do you solve improper integrals?
3. What are the applications of partial derivatives?

💡 Study Recommendations:
- Focus on practice problems for integration
- Review chain rule applications
- Study real-world applications`);
        setIsAnalyzing(false);
      }, 2000);
    }
  };

  const totalStudyTime = sessions.reduce((sum, s) => sum + s.duration, 0);
  const weeklyGoal = 300; // minutes
  const studyProgress = (totalStudyTime / weeklyGoal) * 100;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="pb-24 px-4 space-y-6 max-w-6xl mx-auto overflow-x-hidden">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Weekly Progress</p>
                <p className="text-2xl mt-1">{totalStudyTime} min</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">of {weeklyGoal} min goal</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <Progress value={studyProgress} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800 overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Active Goals</p>
                <p className="text-2xl mt-1">{goals.length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">in progress</p>
              </div>
              <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Flashcards</p>
                <p className="text-2xl mt-1">{flashcards.length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">ready to review</p>
              </div>
              <Brain className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="techniques" className="space-y-4">
        <TabsList className="grid grid-cols-2 sm:grid-cols-2 sm:grid-cols-4 w-full">
          <TabsTrigger value="techniques">Techniques</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="ai">AI Tools</TabsTrigger>
        </TabsList>

        {/* Study Techniques */}
        <TabsContent value="techniques" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Study Techniques</CardTitle>
              <CardDescription>Choose a proven method to boost your learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {studyTechniques.map((technique) => {
                  const Icon = technique.icon;
                  return (
                    <Card key={technique.name} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{technique.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {technique.description}
                            </p>
                            <Button size="sm" className="mt-3">
                              <Play className="w-3 h-3 mr-1" />
                              Start Session
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Study Reminders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Study Reminders</CardTitle>
                  <CardDescription>Never miss a study session</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Reminder
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Study Reminder</DialogTitle>
                      <DialogDescription>Set up a recurring study reminder</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input placeholder="e.g., Review Chemistry Notes" />
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input type="time" />
                      </div>
                      <Button className="w-full">Create Reminder</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-medium">{reminder.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {reminder.time} • {reminder.days.join(", ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals */}
        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Study Goals</CardTitle>
                  <CardDescription>Track your academic objectives</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      New Goal
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Study Goal</DialogTitle>
                      <DialogDescription>Set a new academic goal to track</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Goal Title</Label>
                        <Input placeholder="e.g., Master Organic Chemistry" />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea placeholder="Details about your goal..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Target</Label>
                          <Input type="number" placeholder="100" />
                        </div>
                        <div className="space-y-2">
                          <Label>Unit</Label>
                          <Input placeholder="problems" />
                        </div>
                      </div>
                      <Button className="w-full">Create Goal</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals.map((goal) => (
                  <Card key={goal.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{goal.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {goal.description}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {formatDate(goal.deadline)}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Progress</span>
                            <span>
                              {goal.current} / {goal.target} {goal.unit}
                            </span>
                          </div>
                          <Progress value={(goal.current / goal.target) * 100} />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            Update Progress
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flashcards */}
        <TabsContent value="flashcards" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Flashcard Library</CardTitle>
                  <CardDescription>Review and create study flashcards</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Flashcard
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>New Flashcard</DialogTitle>
                      <DialogDescription>Create a flashcard for quick review</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="math">Mathematics</SelectItem>
                            <SelectItem value="physics">Physics</SelectItem>
                            <SelectItem value="chemistry">Chemistry</SelectItem>
                            <SelectItem value="biology">Biology</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Question</Label>
                        <Textarea placeholder="What is the question?" />
                      </div>
                      <div className="space-y-2">
                        <Label>Answer</Label>
                        <Textarea placeholder="What is the answer?" />
                      </div>
                      <Button className="w-full">Create Flashcard</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {flashcards.map((card) => (
                  <Card key={card.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <Badge variant="secondary" className="mb-3">
                        {card.subject}
                      </Badge>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Q:</p>
                          <p>{card.question}</p>
                        </div>
                        <div className="pt-2 border-t dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400">A:</p>
                          <p className="text-blue-600 dark:text-blue-400">{card.answer}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Tools */}
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                AI Study Assistant
              </CardTitle>
              <CardDescription>
                Upload documents for AI-powered analysis and question generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="mb-2">Upload PDF or Document</p>
                <p className="text-sm text-gray-500 mb-4">
                  AI will analyze and generate study materials
                </p>
                <label htmlFor="file-upload">
                  <Button asChild>
                    <span className="cursor-pointer">
                      <FileText className="w-4 h-4 mr-2" />
                      Choose File
                    </span>
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {uploadedFile && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>{uploadedFile.name}</span>
                  </div>
                  {isAnalyzing && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="animate-spin">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-sm">Analyzing with AI...</span>
                    </div>
                  )}
                </div>
              )}

              {aiResponse && (
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <CardContent className="pt-6">
                    <div className="whitespace-pre-line text-sm">{aiResponse}</div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Save to Flashcards
                      </Button>
                      <Button size="sm" variant="outline">
                        Generate More Questions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Reading Techniques Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Reading Techniques</CardTitle>
              <CardDescription>Enhance your comprehension and retention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    name: "SQ3R Method",
                    steps: "Survey → Question → Read → Recite → Review",
                  },
                  {
                    name: "Skimming",
                    steps: "Quick overview to grasp main ideas",
                  },
                  {
                    name: "Active Reading",
                    steps: "Annotate, highlight, and take notes",
                  },
                  {
                    name: "Critical Analysis",
                    steps: "Evaluate arguments and evidence",
                  },
                ].map((technique) => (
                  <div
                    key={technique.name}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{technique.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {technique.steps}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}