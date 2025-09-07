import { ExternalLink, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const sponsors = [
  {
    name: 'Lovable',
    description: 'Powers rapid UI development and prototyping for Office Chaos',
    logo: '🎨',
    url: 'https://lovable.dev',
    color: 'hover:bg-purple-50 hover:border-purple-200'
  },
  {
    name: 'Exa',
    description: 'AI-powered search engine for discovering trending memes and content',
    logo: '🔍',
    url: 'https://exa.ai',
    color: 'hover:bg-blue-50 hover:border-blue-200'
  },
  {
    name: 'OpenAI',
    description: 'Language models powering intelligent event processing and validation',
    logo: '🤖',
    url: 'https://openai.com',
    color: 'hover:bg-green-50 hover:border-green-200'
  },
  {
    name: 'Supabase',
    description: 'Real-time database and authentication infrastructure',
    logo: '⚡',
    url: 'https://supabase.com',
    color: 'hover:bg-emerald-50 hover:border-emerald-200'
  }
];

export function SponsorFooter() {
  return (
    <footer className="bg-gradient-card border-t border-border/50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="w-4 h-4 text-pink-400" />
            <span>Powered by amazing sponsors</span>
          </div>
          
          <TooltipProvider>
            <div className="flex items-center gap-3">
              {sponsors.map((sponsor) => (
                <Tooltip key={sponsor.name}>
                  <TooltipTrigger asChild>
                    <a
                      href={sponsor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-xl border-2 border-border/30 bg-white/50 backdrop-blur-sm transition-all duration-200 shadow-sm",
                        "hover:shadow-button hover:scale-105 hover:-translate-y-0.5",
                        sponsor.color
                      )}
                    >
                      <span className="text-lg">{sponsor.logo}</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-center">
                    <div className="flex items-center gap-2 font-semibold mb-1">
                      <span>{sponsor.name}</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {sponsor.description}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
          
          <p className="text-xs text-muted-foreground text-center">
            Built with 💖 for real-time office chaos management
          </p>
        </div>
      </div>
    </footer>
  );
}