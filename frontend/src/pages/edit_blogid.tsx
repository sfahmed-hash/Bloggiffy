//@ts-nocheck
import { createOpenAI } from "@ai-sdk/openai";
import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { en } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  FormattingToolbar,
  FormattingToolbarController,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  getFormattingToolbarItems,
  useCreateBlockNote,
} from "@blocknote/react";
import {
  AIMenuController,
  AIToolbarButton,
  createAIExtension,
  createBlockNoteAIClient,
  getAISlashMenuItems,
} from "@blocknote/xl-ai";
import { en as aiEn } from "@blocknote/xl-ai/locales";
import "@blocknote/xl-ai/style.css";
import { useState, useEffect } from "react";
import Preview from "./Preview";
export const BLOCKNOTE_AI_SERVER_API_KEY = "BLOCKNOTE_SECRET";
export const BLOCKNOTE_AI_SERVER_BASE_URL = "http://localhost:3001/ai";
import axios from "axios";
import { BACKEND_URL } from "../config";
import GitHubNavbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Using proxy requests through your custom Express server
const client = createBlockNoteAIClient({
  apiKey: BLOCKNOTE_AI_SERVER_API_KEY,
  baseURL: BLOCKNOTE_AI_SERVER_BASE_URL,
});

// Use OpenAI model via proxy client
const model = createOpenAI({
  ...client.getProviderSettings("openai"),
})("gpt-4o-mini", {});

export default function EditBlogById(){
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState();
    const [changeToPreview, setChangeToPreview] = useState(false);

    useEffect(() => {
            const fetchBlogById = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`${BACKEND_URL}/blog/${id}`, {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                    });
                    setBlog(response.data.blog )
                    console.log("Blog Response:", response.data);
    
                    if (response.status === 200) {
                        setBlog(response.data.blog || response.data);
                        console.log(blog)
                    } else {
                        toast.error("Blog not found", { position: "top-right" });
                    }
                } catch (error) {
                    console.error("Error fetching blog:", error);
                    toast.error("Failed to load blog", { position: "top-right" });
                } finally {
                    setLoading(false);
                }
            };
    
            fetchBlogById()
        }, []);

    const editor = useCreateBlockNote({
        dictionary: {
        ...en,
        ai: aiEn,
        },
        extensions: [
        createAIExtension({
            model,
        }),
        ],
        initialContent: blog?.content || undefined
    });

    // Update editor content when blog data loads
    useEffect(() => {
        if (blog?.content && editor) {
            editor.replaceBlocks(editor.document, blog.content);
        }
    }, [blog, editor]);

    const handlePreview = () => {
        const editorContent = editor.document;
        console.log("Storing blog content for preview:", editorContent);
        
        // Store content in state and localStorage
        // TODO : try to find a correct type for this
        //@ts-ignore
        setContent(editorContent);
        localStorage.setItem("blogPreviewContent", JSON.stringify(editorContent));
        setChangeToPreview(true);
    };

    const handleBackToEdit = () => {
        setChangeToPreview(false);
    };

    if (changeToPreview) {
        return <Preview content={content} onBackToEdit={handleBackToEdit} option={0} />;
    }
  
    return (
        <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
          {/* Navbar */}
          <GitHubNavbar />
    
          {/* Page Heading */}
          <div className="mt-4 flex justify-between px-4 py-2">
            <h1 className="text-3xl font-bold mb-4 text-white px-4 pt-4">
            📝 Edit existing Blog
            </h1>
            <button
              onClick={handlePreview}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Preview Blog
            </button>
          </div>
    
          {/* Editor Container */}
          {!loading && <div className="flex-1 max-h-[70vh] overflow-auto rounded-lg border border-gray-700 mx-4">
            <BlockNoteView
              editor={editor}
              className="min-h-[400px] px-4 py-2 overflow-auto"
              theme="dark"
              formattingToolbar={false}
              slashMenu={false}
            >
              {/* AI Commands */}
              <AIMenuController />
    
              {/* Formatting Toolbar with AI */}
              <FormattingToolbarWithAI />
    
              {/* Slash Menu with AI */}
              <SuggestionMenuWithAI editor={editor} />
            </BlockNoteView>
          </div>}
    
          {/* Save Button */}
    
        </div> 
      );  
}

// Formatting toolbar with the `AIToolbarButton` added
function FormattingToolbarWithAI() {
  return (
    <FormattingToolbarController
      formattingToolbar={() => (
        <FormattingToolbar>
          {...getFormattingToolbarItems()}
          <AIToolbarButton />
        </FormattingToolbar>
      )}
    />
  );
}

// Slash menu with the AI option added
function SuggestionMenuWithAI(props: {
  editor: BlockNoteEditor<any, any, any>;
}) {
  return (
    <SuggestionMenuController
      triggerCharacter="/"
      getItems={async (query) =>
        filterSuggestionItems(
          [
            ...getDefaultReactSlashMenuItems(props.editor),
            ...getAISlashMenuItems(props.editor),
          ],
          query
        )
      }
    />
  );
}