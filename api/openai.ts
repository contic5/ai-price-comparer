/// <reference types="node" />

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: any, res: any) 
{
    if (req.method !== "POST") 
    {
        return res.status(405).json({
        error: "Method not allowed",
        });
    }

    try 
    {
        let { prompt } = req.body;
        console.log("Beginning Fetch");

        if (!prompt) {
        return res.status(400).json({
            error: "Missing prompt",
        });
        }
        
        const response = await client.responses.create({
        tools: [
        {
            type: "web_search"
        }
        ],
        tool_choice: "required",
        model: "gpt-6-luna",
        input: prompt,
        });
        
        console.log("Fetch Completed");

        res.status(200).json({
        response: response.output_text,
        });
    } 
    catch (error) 
    {
        console.error("ERROR ALERT");
        console.error(error);

        res.status(500).json({
        error: "Failed to contact OpenAI",
        });
    }
}