import { createOpenAI } from "@ai-sdk/openai";
import { filterSuggestionItems } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { useState } from "react";
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
import GitHubNavbar from "../components/Navbar";
import Preview from "./Preview"; 
import { BACKEND_URL } from "../config";

export const BLOCKNOTE_AI_SERVER_API_KEY="BLOCKNOTE_SECRET"
export const BLOCKNOTE_AI_SERVER_BASE_URL=`${BACKEND_URL}/ai`

// Using proxy requests through your custom Express server
const client = createBlockNoteAIClient({
  apiKey: BLOCKNOTE_AI_SERVER_API_KEY,
  baseURL: BLOCKNOTE_AI_SERVER_BASE_URL,
});

// Use OpenAI model via proxy client
const model = createOpenAI({
  // call via our proxy client
  ...client.getProviderSettings("openai"),
})("gpt-4o-mini", {});

export default function Editlog() {
  const [content, setContent] = useState();
  const [changeToPreview, setChangeToPreview] = useState(false); 

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
    initialContent: [
      {
        type: "heading",
        props: {
          level: 1,
        },
        content: "✨ Start Writing Your Blog",
      },
      {
        type: "paragraph",
        content:
          "Begin writing your blog post here. You can use AI features by typing '/' to open the slash menu or selecting text and clicking the AI button in the toolbar.",
      },
    ],
  });

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
    return <Preview content={content} onBackToEdit={handleBackToEdit} option={1}/>;
  }

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white ">
      <GitHubNavbar />
      {/* Header */}

      <div className="mt-4 flex justify-between ">
        <h1 className="text-3xl font-bold mb-4 text-white">📝 Create New Blog</h1>
        <button
          onClick={handlePreview}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Preview Blog
        </button>
      </div>
      

      {/* Editor */}
      <div className="flex-1 max-[70vh] overflow-auto rounded-lg border border-gray-700">
        <BlockNoteView
          editor={editor}
          className=" min-h-[400px] px-4 py-2 overflow-auto"
          theme="dark"
          // We're disabling some default UI elements to customize them
          formattingToolbar={false}
          slashMenu={false}
        >
          {/* Add the AI Command menu to the editor */}
          <AIMenuController />

          {/* We disabled the default formatting toolbar with `formattingToolbar=false` 
          and replace it for one with an "AI button" (defined below). 
          (See "Formatting Toolbar" in docs)
          */}
          <FormattingToolbarWithAI />

          {/* We disabled the default SlashMenu with `slashMenu=false` 
          and replace it for one with an AI option (defined below). 
          (See "Suggestion Menus" in docs)
          */}
          <SuggestionMenuWithAI editor={editor} />
        </BlockNoteView>
      </div>
    </div>
  );
}

function FormattingToolbarWithAI() {
  return (
    <FormattingToolbarController
      formattingToolbar={() => (
        <FormattingToolbar>
          {...getFormattingToolbarItems()}
          {/* Add the AI button */}
          <AIToolbarButton />
        </FormattingToolbar>
      )}
    />
  );
}

function SuggestionMenuWithAI(props: any) {
  return (
    <SuggestionMenuController
      triggerCharacter="/"
      getItems={async (query) =>
        filterSuggestionItems(
          [
            ...getDefaultReactSlashMenuItems(props.editor),
            // add the default AI slash menu items, or define your own
            ...getAISlashMenuItems(props.editor),
          ],
          query,
        )
      }
    />
  );
}