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
        let { prompts } = req.body;
        console.log("Beginning Fetch");

        if (!prompts) {
        return res.status(400).json({
            error: "Missing prompts",
        });
        }
        if(prompts.length==0)
        {
            return res.status(400).json({
                error:"No prompts included"
            });
        }


        let responses:string[]=[];
        
        for(let i=0;i<prompts.length;i++)
        {
            const start_time: number = Date.now();
            const prompt=prompts[i];
            const response = await client.responses.create({
            tools: [
            {
                type: "web_search"
            }
            ],
            tool_choice: "required",
            model: "gpt-5-mini",
            input: prompt,
            });
            responses.push(response.output_text);

            const end_time: number = Date.now();

            console.log(`Runtime for Prompt ${i+1}: ${end_time-start_time} ms`);
        }
        console.log("Fetch Completed");

        res.status(200).json({
        responses: responses,
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