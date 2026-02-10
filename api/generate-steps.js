import fetch from "node-fetch";

export default async function handler(req,res){
  if(req.method !== "POST") return res.status(405).json({error:"Method not allowed"});
  
  const {category, subcategory, description} = req.body;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  const prompt = `
You are CoursePath, an AI assistant.
Category: ${category}
Subcategory: ${subcategory}
Problem: ${description}

Give 5-8 numbered step-by-step instructions to solve this problem.
Use simple language and be encouraging.
`;

  try{
    const response = await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${OPENAI_API_KEY}`
      },
      body:JSON.stringify({
        model:"gpt-4.1-mini",
        messages:[{role:"user",content:prompt}],
        temperature:0.4
      })
    });

    const data = await response.json();
    res.status(200).json({steps:data.choices[0].message.content});
  }catch(err){
    res.status(500).json({error:"AI request failed"});
  }
}
