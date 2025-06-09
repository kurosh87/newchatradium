'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
  Settings,
  Plus,
  Trash2,
  ChevronDown,
  RotateCcw,
  ArrowLeft,
  Maximize2,
  ExternalLink,
  Eye,
  Brain,
  Sparkles,
  ChevronUp,
  MoreHorizontal,
  Square,
  ArrowUp,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export default function PlaygroundPage() {
  const [selectedModel, setSelectedModel] = useState('deepseek-ai/DeepSeek-V3');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [isApiViewOpen, setIsApiViewOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  
  // Settings
  const [outputLength, setOutputLength] = useState([512]);
  const [temperature, setTemperature] = useState([0.7]);
  const [responseFormat, setResponseFormat] = useState('Text');
  const [safetyModel, setSafetyModel] = useState('None');

  const handleSend = () => {
    if (!userMessage.trim()) return;
    
    const newMessages = [...messages];
    if (systemPrompt && newMessages.length === 0) {
      newMessages.push({ role: 'system', content: systemPrompt });
    }
    newMessages.push({ role: 'user', content: userMessage });
    
    setIsStreaming(true);
    // Mock streaming response
    setTimeout(() => {
      newMessages.push({ 
        role: 'assistant', 
        content: 'The prompt "test" has been received. If you have any specific questions, tasks, or need assistance with something, feel free to provide more details! For example:\n\n• Testing a function? Share the code or scenario.\n• Testing a concept? Let me know the topic.\n• Something else? Just ask!\n\nLet me know how I can help! 😊' 
      });
      setMessages(newMessages);
      setIsStreaming(false);
    }, 2000);
    
    setUserMessage('');
  };

  const clearSession = () => {
    setMessages([]);
    setSystemPrompt('');
    setUserMessage('');
  };

  const stopGeneration = () => {
    setIsStreaming(false);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const regenerate = () => {
    if (messages.length > 0) {
      const lastUserMessage = messages.filter(m => m.role === 'user').pop();
      if (lastUserMessage) {
        setUserMessage(lastUserMessage.content);
        const newMessages = messages.slice(0, -1);
        setMessages(newMessages);
      }
    }
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
        return `from together import Together

client = Together(api_key="YOUR_API_KEY")

response = client.chat.completions.create(
    model="${selectedModel}",
    messages=[
${messageArray}
    ],
    max_tokens=${outputLength[0]},
    temperature=${temperature[0]},
    top_p=1,
    top_k=50,
    repetition_penalty=1,
    stop=["<|eot_id|>","<|eom_id|>"],
    stream=True
)

for token in response:
    if hasattr(token, 'choices'):
        print(token.choices[0].delta.content, end="", flush=True)`;

      case 'typescript':
        return `import Together from "together-ai";

const together = new Together({
  apiKey: "YOUR_API_KEY",
});

async function main() {
  const response = await together.chat.completions.create({
    messages: [
${messageArray}
    ],
    model: "${selectedModel}",
    max_tokens: ${outputLength[0]},
    temperature: ${temperature[0]},
    top_p: 1,
    top_k: 50,
    repetition_penalty: 1,
    stop: ["<|eot_id|>", "<|eom_id|>"],
    stream: true,
  });

  for await (const token of response) {
    if (token.choices && token.choices[0] && token.choices[0].delta.content) {
      process.stdout.write(token.choices[0].delta.content);
    }
  }
}

main().catch(console.error);`;

      case 'curl':
        return `curl -X POST "https://api.together.xyz/v1/chat/completions" \\
     -H "Authorization: Bearer \$TOGETHER_API_KEY" \\
     -H "Content-Type: application/json" \\
     -d '{
       "model": "${selectedModel}",
       "max_tokens": ${outputLength[0]},
       "temperature": ${temperature[0]},
       "top_p": 1,
       "top_k": 50,
       "repetition_penalty": 1,
       "stop": ["<|eot_id|>", "<|eom_id|>"],
       "messages": [
${messageArray}
       ],
       "stream": true
     }'`;

      default:
        return getCodeExample();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-muted/20 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-border/40 z-[100] bg-gradient-to-r from-background/80 via-muted/40 to-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-background/60 supports-[backdrop-filter]:via-muted/20 supports-[backdrop-filter]:to-background/60 shadow-lg shadow-primary/5">
        <div className="flex items-center gap-4">
          <SidebarToggle />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-foreground rounded-full" />
              <span className="text-sm font-medium">Chat</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 text-muted-foreground hover:text-foreground cursor-pointer">
              <Brain className="w-4 h-4" />
              <span className="text-sm">deepseek-ai/DeepSeek-V3</span>
              <Copy className="w-3 h-3" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Sheet open={isApiViewOpen} onOpenChange={setIsApiViewOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="text-blue-400 border-blue-400 hover:bg-blue-400/10">
                <CodeIcon className="w-4 h-4 mr-2" />
                API view
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[800px] sm:max-w-[800px] bg-background border-border overflow-auto">
              <SheetHeader>
                <SheetTitle>API View</SheetTitle>
                <SheetDescription>
                  Generate a model response for the given prompt using the Together AI API
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Code Examples</h3>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-2">
                        <Button 
                          variant={selectedLanguage === 'python' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedLanguage('python')}
                        >
                          Python
                        </Button>
                        <Button 
                          variant={selectedLanguage === 'typescript' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedLanguage('typescript')}
                        >
                          TypeScript
                        </Button>
                        <Button 
                          variant={selectedLanguage === 'curl' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedLanguage('curl')}
                        >
                          cURL
                        </Button>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(getCodeExample())}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    
                    <div className="relative">
                      <pre className="bg-muted border border-border p-4 rounded-lg text-sm overflow-auto max-h-[500px] font-mono">
                        <code className="text-foreground leading-relaxed">
                          {getCodeExample()}
                        </code>
                      </pre>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <h4 className="text-md font-semibold">Current Configuration</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Model:</span>
                          <span className="font-mono">{selectedModel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Max Tokens:</span>
                          <span>{outputLength[0]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Temperature:</span>
                          <span>{temperature[0]}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Response Format:</span>
                          <span>{responseFormat}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Safety Model:</span>
                          <span>{safetyModel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Stream:</span>
                          <span>true</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* System Prompt */}
          <div className="p-4 md:p-6 border-b border-border/40">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-muted-foreground">System prompt</Label>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-1">
                  <Sparkles className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-1">
                  <ChevronUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Textarea
              placeholder="Enter a system prompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="min-h-[60px] bg-muted border-border text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-auto">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <div className="text-lg mb-2">Start typing...</div>
                </div>
              </div>
            ) : (
              <div className="p-4 md:p-6 space-y-6">
                {messages.map((message, index) => (
                  <div key={index} className="space-y-2">
                    {message.role !== 'system' && (
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium uppercase text-muted-foreground tracking-wider">
                          {message.role}
                        </Label>
                        {message.role === 'user' && (
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-1">
                            <span className="text-xs mr-1">test</span>
                            <Copy className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    )}
                    
                    <div className={cn(
                      "p-4 rounded-lg border",
                      message.role === 'user' 
                        ? 'bg-muted border-border' 
                        : message.role === 'assistant'
                        ? 'bg-muted border-blue-200 dark:border-blue-800'
                        : 'bg-muted border-border'
                    )}>
                      <div className="text-sm whitespace-pre-wrap text-foreground leading-relaxed">
                        {message.content}
                      </div>
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/40">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-xs"
                            onClick={() => copyMessage(message.content)}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-xs"
                            onClick={regenerate}
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Regenerate
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isStreaming && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground tracking-wider">
                      Assistant
                    </Label>
                    <div className="p-4 rounded-lg border bg-muted border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100" />
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Session Stats */}
            {messages.length > 0 && (
              <div className="px-4 py-2 border-t border-border/40 bg-background">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>20 tps</span>
                  <span>8 ↑</span>
                  <span>84 ↓</span>
                  <span>4132 ms</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-xs ml-auto"
                    onClick={clearSession}
                  >
                    Clear session
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 border-t border-border/40 bg-background">
            <div className="relative">
              <Textarea
                placeholder="Start typing..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                className="min-h-[60px] bg-muted border-border text-foreground placeholder:text-muted-foreground resize-none pr-12 pb-12"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                {isStreaming ? (
                  <Button
                    onClick={stopGeneration}
                    className="bg-red-600 hover:bg-red-700 text-white"
                    size="sm"
                  >
                    <Square className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSend}
                    disabled={!userMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                    size="sm"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="absolute bottom-3 left-3 text-xs text-muted-foreground">
                Enter to submit
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Settings */}
        {showSettings && (
          <div className="w-80 border-l border-border/40 bg-background overflow-auto">
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">MODEL</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSettings(false)}
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="mb-6">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="bg-muted border-border text-foreground">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-600" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="deepseek-ai/DeepSeek-V3">DeepSeek V3-0324</SelectItem>
                    <SelectItem value="meta-llama/Llama-3.1-8B-Instruct">Llama 3.1 8B</SelectItem>
                    <SelectItem value="meta-llama/Llama-3.1-70B-Instruct">Llama 3.1 70B</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-muted-foreground">SETTINGS</Label>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-1">
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm text-muted-foreground flex items-center gap-1">
                        OUTPUT LENGTH
                        <Info className="w-3 h-3 text-muted-foreground/60" />
                      </Label>
                      <span className="text-sm bg-muted px-2 py-1 rounded">AUTO</span>
                    </div>
                    <Slider
                      value={outputLength}
                      onValueChange={setOutputLength}
                      max={2048}
                      min={1}
                      step={1}
                      className="[&_[role=slider]]:bg-blue-600 [&_[role=slider]]:border-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm text-muted-foreground flex items-center gap-1">
                        TEMPERATURE
                        <Info className="w-3 h-3 text-muted-foreground/60" />
                      </Label>
                      <span className="text-sm bg-muted px-2 py-1 rounded">AUTO</span>
                    </div>
                    <Slider
                      value={temperature}
                      onValueChange={setTemperature}
                      max={2}
                      min={0}
                      step={0.01}
                      className="[&_[role=slider]]:bg-blue-600 [&_[role=slider]]:border-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm text-muted-foreground flex items-center gap-1">
                        RESPONSE FORMAT
                        <Info className="w-3 h-3 text-muted-foreground/60" />
                      </Label>
                    </div>
                    <Select value={responseFormat} onValueChange={setResponseFormat}>
                      <SelectTrigger className="bg-muted border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="Text">Text</SelectItem>
                        <SelectItem value="JSON">JSON</SelectItem>
                        <SelectItem value="Markdown">Markdown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm text-muted-foreground flex items-center gap-1">
                        FUNCTIONS
                        <Info className="w-3 h-3 text-muted-foreground/60" />
                      </Label>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-blue-600 border-border hover:bg-blue-50 dark:hover:bg-blue-950/30"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      add function
                    </Button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm text-muted-foreground">SAMPLING</Label>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-1">
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm text-muted-foreground flex items-center gap-1">
                        SAFETY MODEL
                        <Info className="w-3 h-3 text-muted-foreground/60" />
                      </Label>
                    </div>
                    <Select value={safetyModel} onValueChange={setSafetyModel}>
                      <SelectTrigger className="bg-muted border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Strict">Strict</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}