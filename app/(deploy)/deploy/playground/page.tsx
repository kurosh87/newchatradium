'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Copy, 
  Code as CodeIcon, 
  FileText, 
  Settings,
  Play,
  Plus,
  Trash2,
  ChevronDown,
  RotateCcw,
  ArrowLeft,
  Maximize2,
  ExternalLink,
  Eye,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedModel, setSelectedModel] = useState('deepseek-r1-0528');
  const [temperature, setTemperature] = useState([0.1]);
  const [maxTokens, setMaxTokens] = useState([4096]);
  const [topP, setTopP] = useState([1]);
  const [topK, setTopK] = useState([40]);
  const [presencePenalty, setPresencePenalty] = useState([0]);
  const [frequencyPenalty, setFrequencyPenalty] = useState([0]);
  const [stopSequences, setStopSequences] = useState('');
  const [echo, setEcho] = useState(false);
  const [systemMessage, setSystemMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isCodeSheetOpen, setIsCodeSheetOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('python');

  const handleSend = () => {
    if (!userMessage.trim()) return;
    
    const newMessages = [...messages];
    if (systemMessage && newMessages.length === 0) {
      newMessages.push({ role: 'system', content: systemMessage });
    }
    newMessages.push({ role: 'user', content: userMessage });
    
    // Mock response
    newMessages.push({ 
      role: 'assistant', 
      content: 'This is a mock response from the playground. In a real implementation, this would call your API.' 
    });
    
    setMessages(newMessages);
    setUserMessage('');
  };

  const getCodeExample = () => {
    const messageArray = messages.length > 0 
      ? messages.map(msg => `        {
            "role": "${msg.role}",
            "content": "${msg.content.replace(/"/g, '\\"')}"
        }`).join(',\n')
      : `        {
            "role": "user",
            "content": "${userMessage || 'Hello, how are you?'}"
        }`;

    switch (selectedLanguage) {
      case 'python':
        return `import requests
import json

url = "https://api.fireworks.ai/inference/v1/chat/completions"

payload = {
    "model": "accounts/fireworks/models/${selectedModel}",
    "max_tokens": ${maxTokens[0]},
    "top_p": ${topP[0]},
    "top_k": ${topK[0]},
    "presence_penalty": ${presencePenalty[0]},
    "frequency_penalty": ${frequencyPenalty[0]},
    "temperature": ${temperature[0]},
    "messages": [
${messageArray}
    ]
}
headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "Bearer <API_KEY>"
}

requests.request("POST", url, headers=headers, data=json.dumps(payload))`;

      case 'typescript':
        return `import axios from 'axios';

const url = 'https://api.fireworks.ai/inference/v1/chat/completions';

const payload = {
  model: 'accounts/fireworks/models/${selectedModel}',
  max_tokens: ${maxTokens[0]},
  top_p: ${topP[0]},
  top_k: ${topK[0]},
  presence_penalty: ${presencePenalty[0]},
  frequency_penalty: ${frequencyPenalty[0]},
  temperature: ${temperature[0]},
  messages: [
${messageArray}
  ]
};

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <API_KEY>'
};

axios.post(url, payload, { headers });`;

      default:
        return getCodeExample();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20 font-sans">
      <header className="flex sticky top-0 bg-background/95 backdrop-blur-sm py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/40">
        <SidebarToggle />
        <h1 className="text-lg font-semibold tracking-tight">Playground</h1>
        <div className="flex items-center gap-3 ml-auto">
          <Sheet open={isCodeSheetOpen} onOpenChange={setIsCodeSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="font-medium">
                <CodeIcon className="h-4 w-4 mr-2" />
                View Code
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[800px] sm:max-w-[800px]">
              <SheetHeader>
                <SheetTitle>Code Examples</SheetTitle>
                <SheetDescription>
                  Generate a model response for the given prompt. <Link href="#" className="text-blue-500 hover:underline">See full docs</Link>
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <div className="mb-4">
                  <h3 className="font-semibold mb-3">Completion</h3>
                  <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <div className="flex items-center justify-between mb-4">
                      <TabsList>
                        <TabsTrigger value="python">Python</TabsTrigger>
                        <TabsTrigger value="typescript">Typescript</TabsTrigger>
                        <TabsTrigger value="java">Java</TabsTrigger>
                        <TabsTrigger value="go">Go</TabsTrigger>
                        <TabsTrigger value="shell">Shell</TabsTrigger>
                      </TabsList>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(getCodeExample())}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <div className="relative">
                      <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg text-sm overflow-auto max-h-[600px] border">
                        <code className="text-slate-800 dark:text-slate-200">
                          {getCodeExample()}
                        </code>
                      </pre>
                    </div>
                  </Tabs>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/deploy/dashboard">
            <Button variant="outline" className="flex items-center gap-2 text-sm py-1.5 h-8 px-4 rounded-lg border-border/40 hover:border-border transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_50%_50%,_theme(colors.purple.500),transparent_50%)] pointer-events-none" />
        
        {/* Left Panel - Model Selection and Options */}
        <div className="w-[380px] border-r border-border/40 bg-background/80 backdrop-blur-sm overflow-auto">
          <div className="p-4 border-b border-border/40">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Brain className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">MODEL</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium">DeepSeek R1 05/28</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
              deepseek-r1-0528
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold mb-4 text-sm">Options</h3>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="w-full">
                <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
                <TabsTrigger value="completion" className="flex-1">Completion</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Temperature</Label>
                  <span className="text-sm font-medium">{temperature[0]}</span>
                </div>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  max={2}
                  min={0}
                  step={0.01}
                  className="w-full [&_[role=slider]]:bg-green-500 [&_[role=slider]]:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Max Tokens</Label>
                  <span className="text-sm font-medium">{maxTokens[0]}</span>
                </div>
                <Slider
                  value={maxTokens}
                  onValueChange={setMaxTokens}
                  max={32768}
                  min={1}
                  step={1}
                  className="w-full [&_[role=slider]]:bg-green-500 [&_[role=slider]]:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Top P</Label>
                  <span className="text-sm font-medium">{topP[0]}</span>
                </div>
                <Slider
                  value={topP}
                  onValueChange={setTopP}
                  max={1}
                  min={0}
                  step={0.01}
                  className="w-full [&_[role=slider]]:bg-green-500 [&_[role=slider]]:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Top K</Label>
                  <span className="text-sm font-medium">{topK[0]}</span>
                </div>
                <Slider
                  value={topK}
                  onValueChange={setTopK}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full [&_[role=slider]]:bg-green-500 [&_[role=slider]]:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Presence Penalty</Label>
                  <span className="text-sm font-medium">{presencePenalty[0]}</span>
                </div>
                <Slider
                  value={presencePenalty}
                  onValueChange={setPresencePenalty}
                  max={2}
                  min={-2}
                  step={0.01}
                  className="w-full [&_[role=slider]]:bg-green-500 [&_[role=slider]]:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Frequency Penalty</Label>
                  <span className="text-sm font-medium">{frequencyPenalty[0]}</span>
                </div>
                <Slider
                  value={frequencyPenalty}
                  onValueChange={setFrequencyPenalty}
                  max={2}
                  min={-2}
                  step={0.01}
                  className="w-full [&_[role=slider]]:bg-green-500 [&_[role=slider]]:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Stop</Label>
                <Input
                  placeholder="Enter a stop word"
                  value={stopSequences}
                  onChange={(e) => setStopSequences(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Context Length Exceeded Behavior</Label>
                <Select defaultValue="none">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="truncate">Truncate</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="echo" className="text-sm">Echo</Label>
                <Switch
                  id="echo"
                  checked={echo}
                  onCheckedChange={setEcho}
                />
              </div>

              <div className="pt-4 border-t border-border/40">
                <Label className="text-sm font-medium mb-2 block">Input Transformations</Label>
                <div className="flex items-center justify-between">
                  <Label htmlFor="document-linking" className="text-sm">Enable Document linking</Label>
                  <Switch id="document-linking" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Try out DeepSeek R1 05/28 (via our chat API)</h2>
              <p className="text-sm text-muted-foreground">
                Kick the tires, see how DeepSeek R1 05/28 performs on Fireworks AI
              </p>
            </div>

            <div className="space-y-4">
              {messages.length > 0 && (
                <div className="space-y-4 mb-6">
                  {messages.map((message, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm font-medium uppercase text-muted-foreground">
                        {message.role}
                      </Label>
                      <div className={cn(
                        "p-4 rounded-lg border",
                        message.role === 'user' 
                          ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' 
                          : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                      )}>
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium uppercase text-muted-foreground">
                    User
                  </Label>
                  <div className="relative">
                    <Textarea
                      placeholder="Type a message"
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      className="min-h-[120px] resize-none pr-12"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.metaKey) {
                          handleSend();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!userMessage.trim()}
                      className="absolute bottom-3 right-3 h-8 w-8 p-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}