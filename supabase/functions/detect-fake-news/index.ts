import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, image } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let contentToAnalyze = text;

    // If image is provided, use OCR via AI
    if (image) {
      console.log('Processing image with OCR...');
      const ocrResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Extract all text from this image. Return only the extracted text, nothing else.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: image
                  }
                }
              ]
            }
          ]
        }),
      });

      if (!ocrResponse.ok) {
        const errorText = await ocrResponse.text();
        console.error('OCR error:', errorText);
        throw new Error('Failed to extract text from image');
      }

      const ocrData = await ocrResponse.json();
      contentToAnalyze = ocrData.choices?.[0]?.message?.content;
      console.log('Extracted text:', contentToAnalyze);
    }

    if (!contentToAnalyze || contentToAnalyze.trim().length === 0) {
      throw new Error('No content to analyze');
    }

    // Analyze the content for fake news
    console.log('Analyzing content for fake news...');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a fake news detection AI. Analyze the given news content and determine if it's real or fake news. 
            
Consider these factors:
- Sensational or clickbait language
- Lack of credible sources
- Emotional manipulation
- Factual inconsistencies
- Bias and misinformation patterns
- Grammar and writing quality
- Verifiable claims

Respond with a JSON object containing:
{
  "isReal": boolean,
  "confidence": number (0-1),
  "reasoning": "detailed explanation of your analysis"
}`
          },
          {
            role: 'user',
            content: contentToAnalyze
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', errorText);
      throw new Error('Failed to analyze content');
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;
    console.log('AI response:', aiResponse);

    // Parse the AI response
    let result;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: analyze the text response
        const isReal = !aiResponse.toLowerCase().includes('fake') && 
                       !aiResponse.toLowerCase().includes('false') &&
                       !aiResponse.toLowerCase().includes('misinformation');
        result = {
          isReal,
          confidence: 0.7,
          reasoning: aiResponse
        };
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback response
      result = {
        isReal: true,
        confidence: 0.5,
        reasoning: 'Unable to determine with high confidence. Please verify from multiple sources.'
      };
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in detect-fake-news function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
