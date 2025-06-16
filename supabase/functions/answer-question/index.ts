
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { question } = await req.json()

    if (!question) {
      return new Response(
        JSON.stringify({ error: 'Question is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // For now, return a structured response
    // You'll need to add your Gemini API key to make actual API calls
    const prompt = `As an Ethiopian Orthodox Tewahedo Church (EOTC) spiritual advisor, please provide a thoughtful and accurate answer to this question based on Orthodox theology and traditions: "${question}"

Please ensure your answer is:
1. Rooted in Orthodox Christian theology
2. Respectful of EOTC traditions
3. Helpful and educational
4. Appropriate for believers seeking spiritual guidance

Question: ${question}`

    // This is a placeholder response structure
    // Replace with actual Gemini API call when you have the API key
    const response = {
      answer: `Thank you for your question about "${question}". 

Based on Ethiopian Orthodox Tewahedo Church teachings, this is an important spiritual matter that requires careful consideration. 

I recommend consulting with your spiritual father or priest for personalized guidance, as they can provide counsel specific to your spiritual journey. You may also find relevant teachings in our Sacred Teachings section.

For immediate reference, please explore our FAQ section which contains answers to many common questions about Orthodox faith and practice.

May God bless you in your spiritual journey.`
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
