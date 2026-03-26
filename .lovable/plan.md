

## Add File Upload Menu to Multi-Chat, Deck, Imagine, and Legends

Add the same attach menu (Upload Image, Take Photo, Attach File) with plan-based file size limits to all four tool input bars, matching the main ChatInput style shown in the reference image.

### Changes

**1. `src/components/aichat/SharedChatInput.tsx` (Multi-Window Chat)**
- Already has Upload Image and Upload Document in an attach menu
- Add "Take Photo" option with Camera icon (purple) between Upload Image and Upload Document
- Add plan-based file size limit indicator at top of menu (matching main ChatInput)
- Add camera input ref and camera capture handler
- Style the menu items to match main ChatInput: icon in colored rounded-lg box + label

**2. `src/components/deck/DeckPromptBar.tsx` (Sorix Deck)**
- Add Plus (+) button before the Sparkles icon
- Add attachment menu popup with Upload Image, Take Photo, Attach File
- Add file size limit indicator based on user plan from chatStore
- Add hidden file inputs, attachment state, FileChip previews
- Include the prompt text along with file data when generating
- Pass attachments to `onGenerate` callback (update interface)

**3. `src/components/imagine/ImaginePromptBar.tsx` (Sorix Imagine)**
- Add Plus (+) button before the Wand2 icon
- Add same attachment menu (Upload Image, Take Photo, Attach File) with plan limits
- Add hidden file inputs, attachment state, FileChip previews
- Pass attachments along with prompt to `onGenerate`

**4. `src/components/legends/LegendChat.tsx` (Sorix Legends)**
- Replace the existing single ImagePlus button with Plus (+) button that opens the styled attachment menu
- Add Take Photo and Attach File options (currently only has image upload)
- Add plan-based file size limit indicator
- Add document file input ref and handler
- Show FileChip previews instead of raw image preview

### Shared Pattern (all 4 files)
Each will use:
- `Plus` icon button that toggles an animated popup menu (framer-motion)
- Menu header showing "Max file size" + plan-colored badge
- 3 options: Upload Image (blue), Take Photo (purple), Attach File (green)
- Hidden `<input>` elements for image, file, and camera
- `FileChip` component for attachment previews
- `parseFile`, `getAcceptedFileTypes`, `getFileType` from `@/lib/fileParser`
- Plan-based size limits from `useChatStore` user.plan
- Toast notifications for errors/success

