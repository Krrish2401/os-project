import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_Key });

export async function recommendedFileName(metadata: any) {
    try {
        const insights = await groq.chat.completions.create({
            // Required parameters
            messages: [
                {
                    role: "system",
                    content: "You are an AI assistant that analyzes file metadata given",
                },
                {
                    role: "user",
                    content: `Analyze the following metadata and provide only the file name, with its fileUrl, that should be opened at the current time..do not provide any explaination, just two json pair,name(full name with extension) and url: ${JSON.stringify(metadata)}`,
                },
            ],
            model: "llama-3.3-70b-versatile", // Replace with the appropriate model if needed
            temperature: 0.5,
            max_completion_tokens: 1024,
            top_p: 1,
            stop: null,
            stream: false,
        }); 
        return insights;
    } catch (error) {
        console.error("Error sending metadata to GroqAI:", error);
        throw new Error("Failed to send metadata.");
    }
}