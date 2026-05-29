import React, { useState, useEffect } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';

// Інтерфейс для сирих даних з CryptoCompare API
interface CryptoCompareArticle {
  id: string;
  published_on: number; // Unix timestamp
  title: string;
  source: string;
  url: string;
  categories: string;
}

interface FormattedNewsItem {
  id: string;
  time: string;
  headline: string;
  provider: string;
  url: string;
  categories: string;
}

interface AssetConfig {
  symbol: string;
  color: string;
}

// Визначаємо іконку монети (перевіряємо і заголовок, і теги категорій від API)
const detectAsset = (title: string = '', categories: string = ''): AssetConfig => {
  const text = (title + ' ' + categories).toUpperCase();
  if (text.includes('BTC') || text.includes('BITCOIN')) return { symbol: '₿', color: 'text-amber-500' };
  if (text.includes('ETH') || text.includes('ETHEREUM')) return { symbol: 'Ξ', color: 'text-indigo-400' };
  if (text.includes('HL') || text.includes('HYPERLIQUID')) return { symbol: 'H', color: 'text-emerald-400' };
  if (text.includes('HBAR') || text.includes('HEDERA')) return { symbol: 'Ħ', color: 'text-slate-300' };
  if (text.includes('RUNE') || text.includes('THORCHAIN')) return { symbol: 'R', color: 'text-teal-400' };
  if (text.includes('SOL') || text.includes('SOLANA')) return { symbol: 'S', color: 'text-purple-400' };
  
  return { symbol: 'N', color: 'text-zinc-500' };
};

// Перетворення Unix timestamp в "X minutes ago"
const formatTimeAgo = (timestamp: number): string => {
  const now = Math.floor(Date.now() / 1000);
  const elapsed = now - timestamp;

  if (elapsed < 60) return 'Just now';
  const minutes = Math.floor(elapsed / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  
  return new Date(timestamp * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export function NewsPage(): React.JSX.Element {
  const [news, setNews] = useState<FormattedNewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        
        // Стабільне та відкрите фінансове API
        const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const json = await response.json();
        const articles: CryptoCompareArticle[] = json.Data || [];

        const formattedNews: FormattedNewsItem[] = articles.slice(0, 15).map((item) => ({
          id: item.id,
          time: formatTimeAgo(item.published_on),
          headline: item.title,
          provider: item.source,
          url: item.url,
          categories: item.categories
        }));

        setNews(formattedNews);
        setError(null);
      } catch (err) {
        setError('Не вдалося завантажити свіжі новини через блокування запиту.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 3 * 60 * 1000); // Оновлення кожні 3 хвилини
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-black text-zinc-400 font-sans p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Таби/Фільтри */}
        <div className="flex items-center gap-3 mb-6 text-sm">
          <button 
            onClick={() => setActiveFilter('All')}
            className={`px-4 py-1.5 rounded-full font-medium transition-colors ${
              activeFilter === 'All' ? 'bg-white text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveFilter('Top stories')}
            className={`px-4 py-1.5 rounded-full font-medium transition-colors ${
              activeFilter === 'Top stories' ? 'bg-white text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'
            }`}
          >
            Top stories
          </button>
          <button className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-transparent border border-zinc-700 text-white hover:bg-zinc-900 transition-colors">
            More in News Flow <ChevronRight size={14} />
          </button>
        </div>

        {/* Спінер */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-2">
            <Loader2 className="animate-spin text-zinc-400" size={24} />
            <p className="text-sm">Оновлення стрічки новин...</p>
          </div>
        )}

        {/* Помилка */}
        {error && !loading && (
          <div className="text-center py-10 text-red-400 text-sm border border-dashed border-zinc-800 rounded-lg">
            {error} <br /> <span className="text-xs text-zinc-600">Спробуйте вимкнути VPN або перевірити CORS.</span>
          </div>
        )}

        {/* Таблиця */}
        {!loading && !error && (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-semibold text-zinc-600 border-b border-zinc-900/50">
                  <th className="py-2.5 w-32 font-normal">Time</th>
                  <th className="py-2.5 w-24 font-normal">Instrument</th>
                  <th className="py-2.5 font-normal">Headline</th>
                  <th className="py-2.5 w-36 font-normal text-right">Provider</th>
                </tr>
              </thead>
              <tbody className="text-[14px]">
                {news.map((item) => {
                  const asset = detectAsset(item.headline, item.categories);
                  
                  return (
                    <tr 
                      key={item.id} 
                      className="border-b border-zinc-900/60 hover:bg-zinc-950/40 transition-colors group"
                    >
                      <td className="py-3.5 text-zinc-500 whitespace-nowrap">
                        {item.time}
                      </td>
                      
                      <td className="py-3.5 pl-2">
                        <div className={`w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center font-bold text-[10px] ${asset.color} border border-zinc-800 shadow-sm`}>
                          {asset.symbol}
                        </div>
                      </td>
                      
                      <td className="py-3.5 pr-4 text-zinc-200 font-medium tracking-wide group-hover:text-white transition-colors cursor-pointer">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="block hover:underline">
                          {item.headline}
                        </a>
                      </td>
                      
                      <td className="py-3.5 text-zinc-500 text-right whitespace-nowrap">
                        {item.provider}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}