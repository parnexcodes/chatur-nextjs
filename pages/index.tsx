import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { PromptType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState<PromptType>("Generate SEO Article");
  const [generatedText, setGeneratedText] = useState("");

  const textRef = useRef<null | HTMLDivElement>(null);

  const scrollToText = () => {
    if (textRef.current !== null) {
      textRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  let newprompt = "";
  switch (prompt) {
    case "Generate SEO Article":
      newprompt = `Writer Very Proficient SEO Writer Writes Fluently English. First Create Two Tables. First Table Should be the Outline of the Article and the Second Should be the Article. Bold the Heading of the Second Table using Markdown language. Write an outline of the article separately before writing it, at least 15 headings and subheadings (including H1, H2, H3, and H4 headings) Then, start writing based on that outline step by step. Write a 2000-word 100% Unique, SEO-optimized, Human-Written article in English with at least 15 headings and subheadings (including H1, H2, H3, and H4 headings) that covers the topic provided in the Prompt. Write The article In Your Own Words Rather Than Copying And Pasting From Other Sources. Consider perplexity and burstiness when creating content, ensuring high levels of both without losing specificity or context. Use fully detailed paragraphs that engage the reader. Write In A Conversational Style As Written By A Human (Use An Informal Tone, Utilize Personal Pronouns, Keep It Simple, Engage The Reader, Use The Active Voice, Keep It Brief, Use Rhetorical Questions, and Incorporate Analogies And Metaphors).  End with a conclusion paragraph and 5 unique FAQs After The Conclusion. this is important to Bold the Title and all headings of the article, and use appropriate headings for H tags.
    Now Write An Article On This Topic "${text}"`;
      break;
    case "Generate LinkedIn Post":
      newprompt = `Generate LinkedIn Post English\n\n${text}`;
      break;
    case "Generate Youtube Video Script":
      newprompt = `Create a compelling and captivating YouTube video script from the following description: ${text}`;
      break;
    case "Generate Instagram post description / caption":
      newprompt = `
    Write me the Instagram post description or caption in just a few sentences for the post "${text}".
    Format every new sentence with new lines so the text is more readable.
    Include emojis and the best Instagram hashtags for that post.
    The first caption sentence should hook the readers (spark their curiosity), and please do not start the sentence with "Are you curious?"
    write all output in English
    `;
      break;
    case "Generate Summary of a Website (enter url)":
      newprompt = `
      Your task is to analyze the website I give you and report the key points in bullets. First add a Title to the report, there should no limit in words to the report, ensure that all the points are consicely reported out.  Please use as many bullet points as needed. After reporting out Finally add a "Key Takeaway" from the URL. All outputs shall be in English. The text to the report should be read from this URL: ${text}
      `;
      break;
    case "Generate your own Prompt":
      newprompt = `Write about ${text} in 120 words. Keep it short and simple, language should be English`
      break;
    case "Ask about anything":
      newprompt = text
      break;
  }

  const generateText = async (e: any) => {
    e.preventDefault();
    setGeneratedText("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newprompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedText((prev) => prev + chunkValue);
    }
    scrollToText();
    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>chatur - generate human-like text</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Generate Human text using chatGPT
        </h1>
        <p className="text-slate-500 mt-5">1,278 generated so far.</p>
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">Enter a string.</p>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={"e.g. Web development, AI, React vs Next.js etc."}
          />
          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">Select your prompt.</p>
          </div>
          <div className="block">
            <DropDown prompt={prompt} setPrompt={(newPrompt) => setPrompt(newPrompt)} />
          </div>

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateText(e)}
            >
              Generate your text &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-10">
          {generatedText && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={textRef}
                >
                  Your generated text
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                <div
                  className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedText);
                    toast("Text copied to clipboard", {
                      icon: "✂️",
                    });
                  }}
                >
                  <p>{generatedText}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
