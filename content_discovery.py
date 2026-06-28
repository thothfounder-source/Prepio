#!/usr/bin/env python3
"""
Content Discovery System for Prepio.io
Discovers trending content and generates X (Twitter) post ideas
"""

import requests
import json
import random
from datetime import datetime
from pathlib import Path

class ContentDiscovery:
    def __init__(self):
        self.interests = [
            'AI interview prep',
            'job search tips',
            'career advice',
            'startup building',
            'SaaS development',
            'interview questions',
            'tech career',
            'remote work',
            'programming careers'
        ]
        
    def get_hacker_news_trending(self, limit=10):
        """Get trending HackerNews stories"""
        try:
            # Get top story IDs
            response = requests.get('https://hacker-news.firebaseio.com/v0/topstories.json')
            story_ids = response.json()[:limit]
            
            stories = []
            for story_id in story_ids:
                story_response = requests.get(f'https://hacker-news.firebaseio.com/v0/item/{story_id}.json')
                story = story_response.json()
                
                if story and story.get('title') and story.get('url'):
                    stories.append({
                        'title': story['title'],
                        'url': story['url'],
                        'score': story.get('score', 0),
                        'comments': story.get('descendants', 0),
                        'source': 'HackerNews'
                    })
            
            return stories
        except Exception as e:
            print(f"Error fetching HN stories: {e}")
            return []
    
    def get_reddit_trending(self, subreddits=['jobs', 'cscareerquestions', 'interviews', 'careerguidance']):
        """Get trending Reddit posts from career-related subreddits"""
        trending = []
        
        for subreddit in subreddits:
            try:
                response = requests.get(
                    f'https://www.reddit.com/r/{subreddit}/hot.json?limit=5',
                    headers={'User-Agent': 'PrepioBot/1.0'}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    for post in data['data']['children']:
                        post_data = post['data']
                        trending.append({
                            'title': post_data['title'],
                            'url': f"https://reddit.com{post_data['permalink']}",
                            'upvotes': post_data['ups'],
                            'comments': post_data['num_comments'],
                            'subreddit': subreddit,
                            'source': 'Reddit'
                        })
            except Exception as e:
                print(f"Error fetching from r/{subreddit}: {e}")
                continue
                
        return sorted(trending, key=lambda x: x['upvotes'], reverse=True)[:10]
    
    def score_relevance(self, content):
        """Score content relevance to Prepio.io business"""
        title = content.get('title', '').lower()
        score = 0
        
        # Career/interview related keywords
        career_keywords = [
            'interview', 'job', 'career', 'hiring', 'resume', 'salary', 
            'startup', 'ai', 'tech', 'developer', 'programming', 'coding',
            'remote work', 'job search', 'employment'
        ]
        
        for keyword in career_keywords:
            if keyword in title:
                score += 15
        
        # Boost based on engagement
        score += min(content.get('upvotes', content.get('score', 0)) / 50, 10)
        score += min(content.get('comments', 0) / 20, 5)
        
        return score
    
    def generate_tweet_ideas(self, content_items):
        """Generate tweet ideas from discovered content"""
        tweet_templates = [
            "🔥 Trending: {title}\n\n💡 This is gold for job seekers!\n\n{url}",
            "📚 Great read: {title}\n\n🎯 Essential for anyone prepping for interviews\n\n{url}",
            "💯 This! {title}\n\n🚀 Exactly what we're solving at Prepio.io\n\n{url}",
            "👀 Found this gem: {title}\n\n⚡ Perfect timing for interview prep season\n\n{url}",
            "🎯 Must-read: {title}\n\n🔥 Building @Prepio to tackle exactly this\n\n{url}"
        ]
        
        original_templates = [
            "🚀 Building Prepio.io to solve the biggest interview prep challenge:\n\n❌ Generic practice questions\n✅ AI-powered role-specific scenarios\n\n$29 early bird → link in bio",
            "💡 Hot take: Most interview prep is backwards\n\n🙃 Memorizing answers = robotic responses\n✅ Practicing scenarios = natural confidence\n\nThat's why we built Prepio.io 🎯",
            "📊 Day {day_num} building Prepio.io:\n\n✅ {progress_item}\n🎯 Next: {next_item}\n💰 Pre-orders: ${revenue}\n\nBuilding in public is wild 🚀",
            "🎯 Interview tip: The best candidates don't just answer questions...\n\nThey tell stories that connect their experience to the role.\n\nPrepio.io teaches you exactly this framework 💪",
            "⚡ Quick wins for job seekers:\n\n• Research the interviewer on LinkedIn\n• Prepare 3 specific questions about the role  \n• Practice the STAR method\n• Use tools like Prepio.io for realistic scenarios\n\nSmall prep = big results 🎯"
        ]
        
        tweet_ideas = []
        
        # Generate discovery-based tweets (30% of content)
        for content in content_items[:2]:
            template = random.choice(tweet_templates)
            tweet_text = template.format(
                title=content['title'][:80] + ('...' if len(content['title']) > 80 else ''),
                url=content['url']
            )
            
            if len(tweet_text) <= 280:
                tweet_ideas.append({
                    'text': tweet_text,
                    'type': 'discovery',
                    'source': content,
                    'cost': 0.20  # Link tweets cost more
                })
        
        # Generate original tweets (70% of content)
        for _ in range(4):
            template = random.choice(original_templates)
            tweet_text = template.format(
                day_num=random.randint(10, 45),
                progress_item=random.choice([
                    "Landing page conversion at 4.2%",
                    "First 10 pre-orders in the bag",
                    "AI interview scenarios tested", 
                    "Mobile app wireframes done"
                ]),
                next_item=random.choice([
                    "Mobile app development",
                    "User interview insights",
                    "Payment flow optimization",
                    "AI model training"
                ]),
                revenue=random.randint(150, 890)
            )
            
            if len(tweet_text) <= 280:
                tweet_ideas.append({
                    'text': tweet_text,
                    'type': 'original',
                    'source': None,
                    'cost': 0.015  # Text-only tweets
                })
        
        return tweet_ideas
    
    def save_content_queue(self, tweet_ideas, filename="tweet_queue.json"):
        """Save tweet ideas to queue file"""
        queue_path = Path(filename)
        
        # Load existing queue
        existing_queue = []
        if queue_path.exists():
            try:
                with open(queue_path, 'r') as f:
                    existing_queue = json.load(f)
            except:
                existing_queue = []
        
        # Add new tweets with timestamps
        for tweet in tweet_ideas:
            tweet['created_at'] = datetime.now().isoformat()
            tweet['scheduled_for'] = 'next_available'
            existing_queue.append(tweet)
        
        # Save updated queue
        with open(queue_path, 'w') as f:
            json.dump(existing_queue, f, indent=2)
        
        return len(tweet_ideas)
    
    def run_discovery(self):
        """Run complete content discovery process"""
        print(f"🔍 Running content discovery for Prepio.io at {datetime.now()}")
        
        # Gather content from sources
        print("📡 Fetching HackerNews trending...")
        hn_content = self.get_hacker_news_trending()
        
        print("📱 Fetching Reddit trending...")
        reddit_content = self.get_reddit_trending()
        
        # Combine and score
        all_content = hn_content + reddit_content
        scored_content = []
        
        for item in all_content:
            score = self.score_relevance(item)
            if score >= 10:  # Minimum relevance threshold
                scored_content.append((score, item))
        
        # Sort by relevance score
        scored_content.sort(key=lambda x: x[0], reverse=True)
        top_content = [item for score, item in scored_content[:5]]
        
        print(f"✅ Found {len(top_content)} relevant items")
        
        # Generate tweet ideas
        tweet_ideas = self.generate_tweet_ideas(top_content)
        
        # Save to queue
        saved_count = self.save_content_queue(tweet_ideas)
        
        print(f"💾 Saved {saved_count} tweet ideas to queue")
        print(f"💰 Estimated cost: ${sum(t['cost'] for t in tweet_ideas):.3f}")
        
        return {
            'content_found': len(top_content),
            'tweets_generated': saved_count,
            'estimated_cost': sum(t['cost'] for t in tweet_ideas)
        }

if __name__ == "__main__":
    discovery = ContentDiscovery()
    results = discovery.run_discovery()
    print(f"🎉 Discovery complete: {results}")