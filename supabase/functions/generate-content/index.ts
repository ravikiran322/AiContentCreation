import "jsr:@supabase/functions-js/edge-runtime.d.ts";

declare const Deno: {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function generateContentTemplate(
  title: string,
  type: string,
  topic: string
): string {
  const templates: Record<string, (title: string, topic: string) => string> = {
    blog: (title, topic) => `# ${title}

## Introduction
Start with a compelling hook that draws readers into the topic. Explain why this topic matters and what readers will learn.

## What is ${topic}?
Define the key concepts and provide context for understanding this subject.

## Key Benefits
- Benefit 1: Explain the first major advantage
- Benefit 2: Discuss the second important benefit
- Benefit 3: Cover the third significant point

## How It Works
Break down the process step by step with clear examples and explanations.

## Real-World Examples
Share practical examples and case studies that demonstrate the value.

## Common Mistakes
Highlight what to avoid when working with this topic.

## Best Practices
Provide actionable tips for success.

## Conclusion
Summarize the key points and reinforce the main message.

## Call to Action
Encourage readers to take the next step, whether it's subscribing, trying a tool, or learning more.`,

    social: (title, topic) =>
      `${title}\n\nDiscover the power of ${topic}. Whether you're just starting out or looking to level up, this is something you need to know about.\n\n✓ Easy to implement\n✓ Proven results\n✓ Worth your time\n\nLearn more about how ${topic} can transform your approach.\n\n#${topic.replace(/\s+/g, '')} #Content #Tips #Growth #Success`,

    email: (title, topic) =>
      `Subject: Transform Your ${topic} Strategy Today\n\n---\n\nHi there,\n\nI wanted to share something valuable with you: ${title}.\n\nIn today's competitive landscape, understanding ${topic} can make all the difference. Here's what you need to know:\n\n✓ Why ${topic} matters now more than ever\n✓ How successful people leverage this\n✓ Quick actionable steps to get started\n✓ Common pitfalls to avoid\n\nThe best time to start was yesterday. The second best time is right now.\n\nReady to dive deeper? Click below to explore our complete guide.\n\n[Click Here to Learn More]\n\nBest regards,\nYour Content Team\n\nP.S. This is something your competitors already know about. Don't fall behind.`,

    marketing: (title, topic) =>
      `Discover: ${title}\n\nTransform Your ${topic} Game\n\nWhy settle for ordinary when you can be extraordinary?\n\nOur solution brings:\n✓ Proven results in ${topic}\n✓ Easy implementation\n✓ Measurable impact\n✓ Professional support\n✓ 100% satisfaction guarantee\n\nWhat Makes Us Different:\n- Deep expertise in ${topic}\n- Customer-first approach\n- Continuous innovation\n- Real results\n\nJoin thousands who've already transformed their ${topic} strategy.\n\n[Get Started Today - Risk Free]\n\nLimited time offer: Get started today and receive a free consultation.`,

    guide: (title, topic) =>
      `# ${title}\n\n## Getting Started\n\n### What You'll Need\n- Basic understanding of ${topic}\n- Willingness to follow steps\n- 15-30 minutes of your time\n\n## Step-by-Step Instructions\n\n### Step 1: Understand the Fundamentals\nBegin by grasping the core concepts of ${topic}. This foundation is crucial for success.\n\n### Step 2: Gather Your Resources\nCollect everything you need to implement this guide effectively.\n\n### Step 3: Create Your Plan\nOutline your specific approach to ${topic}.\n\n### Step 4: Take Action\nStart implementing what you've learned. Small steps lead to big results.\n\n### Step 5: Review and Optimize\nAssess your progress and fine-tune your approach.\n\n## Pro Tips\n- Tip 1: Share your progress with others\n- Tip 2: Stay consistent with your efforts\n- Tip 3: Adapt based on results\n\n## Common Questions\n\nQ: How long will this take?\nA: Results vary, but most people see progress within days.\n\nQ: What if I struggle?\nA: That's normal. Go back to the fundamentals and try again.\n\n## Next Steps\nNow that you understand ${topic}, consider exploring advanced strategies to accelerate your results.`,

    script: (title, topic) =>
      `# Video Script: ${title}\n\n[OPENING - 0:00]\nHello and welcome back to the channel! Today we're diving into something really important: ${title}. If you've been curious about ${topic}, this video is for you.\n\n[HOOK - 0:15]\nHere's the thing about ${topic}: most people don't understand it correctly, and that's costing them. By the end of this video, you'll know exactly what to do.\n\n[MAIN CONTENT - 1:00]\nLet me break this down into three key points:\n\nFirst, the basics of ${topic}\nSecond, why it matters for you\nThird, exactly how to get started\n\n[POINT 1 - 1:30]\nWhen it comes to ${topic}...\n\n[POINT 2 - 3:00]\nHere's why this is important...\n\n[POINT 3 - 4:30]\nReady to actually start? Here's your action plan...\n\n[CLOSING - 6:00]\nThat's it! You now have everything you need to master ${topic}. If you found this helpful, smash that like button and subscribe for more content just like this.\n\n[CALL TO ACTION - 6:30]\nCheck the description for resources and links. See you in the next one!
`,
  };

  const template = templates[type] || templates.blog;
  return template(title, topic);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { title, type, platform, topic } = await req.json();

    if (!title || !type || !topic) {
      throw new Error('Missing required fields: title, type, topic');
    }

    const content = generateContentTemplate(title, type, topic);

    return new Response(JSON.stringify({ content, success: true }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
