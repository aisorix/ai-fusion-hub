import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, Camera, Palette, User, Wand2, ChevronRight, ChevronLeft } from 'lucide-react';
import ImagineTemplatePreview, { type Template } from './ImagineTemplatePreview';
import type { AspectRatio, Resolution } from './ImagineOptionsPanel';

// === Real sample thumbnails ===
import imgMonochrome from '@/assets/templates/monochrome.jpg';
import imgColourBlock from '@/assets/templates/colour-block.jpg';
import imgRunway from '@/assets/templates/runway.jpg';
import imgRisograph from '@/assets/templates/risograph.jpg';
import imgTechnicolour from '@/assets/templates/technicolour.jpg';
import imgGothicClay from '@/assets/templates/gothic-clay.jpg';
import imgDynamite from '@/assets/templates/dynamite.jpg';
import imgSalon from '@/assets/templates/salon.jpg';
import imgSketch from '@/assets/templates/sketch.jpg';
import imgCinematic from '@/assets/templates/cinematic.jpg';
import imgSteampunk from '@/assets/templates/steampunk.jpg';
import imgSunrise from '@/assets/templates/sunrise.jpg';
import imgProductAd from '@/assets/templates/product-ad.jpg';
import imgFantasyCover from '@/assets/templates/fantasy-cover.jpg';
import imgEduDiagram from '@/assets/templates/edu-diagram.jpg';
import imgCosmicInfographic from '@/assets/templates/cosmic-infographic.jpg';
import imgCellDiagram from '@/assets/templates/cell-diagram.jpg';
import imgMangaStrip from '@/assets/templates/manga-strip.jpg';
import imgAutumnPortrait from '@/assets/templates/autumn-portrait.jpg';
import imgCyberpunkGame from '@/assets/templates/cyberpunk-game.jpg';
import imgCraftsmanHouse from '@/assets/templates/craftsman-house.jpg';
import imgRecipeInfographic from '@/assets/templates/recipe-infographic.jpg';
import imgStorybook from '@/assets/templates/storybook.jpg';
import imgChibi from '@/assets/templates/chibi.jpg';
import imgProfessionalHeadshot from '@/assets/templates/professional-headshot.jpg';
import imgLogoEditor from '@/assets/templates/logo-editor.jpg';
import img70sStreet from '@/assets/templates/70s-street.jpg';
import imgQualityEnhancer from '@/assets/templates/quality-enhancer.jpg';
import imgComicBook from '@/assets/templates/comic-book.jpg';
import imgVirtualTryon from '@/assets/templates/virtual-tryon.jpg';
import imgSwapBackground from '@/assets/templates/swap-background.jpg';
import imgModelProductShot from '@/assets/templates/model-product-shot.jpg';
import img80sAnime from '@/assets/templates/80s-anime.jpg';
import imgStyleTransfer from '@/assets/templates/style-transfer.jpg';
import imgWatercolour from '@/assets/templates/watercolour.jpg';
import imgVideoGame from '@/assets/templates/video-game.jpg';
import img3dAnimation from '@/assets/templates/3d-animation.jpg';

export type { Template } from './ImagineTemplatePreview';

interface Props {
  onUseTemplate: (prompt: string, aspect?: AspectRatio, resolution?: Resolution, sampleUrl?: string) => void;
  /** When true, render compact (no internal header — header lives in parent tab bar). */
  embedded?: boolean;
}

type Category = 'all' | 'styles' | 'creations' | 'portraits' | 'transforms';

const CATS: { id: Category; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'styles', label: 'Styles', icon: Palette },
  { id: 'creations', label: 'Creations', icon: Sparkles },
  { id: 'portraits', label: 'Portraits', icon: User },
  { id: 'transforms', label: 'Transforms', icon: Wand2 },
];

const TEMPLATES: Template[] = [
  // STYLES
  { id: 'monochrome', category: 'styles', title: 'Monochrome', image: imgMonochrome,
    prompt: 'A cinematic monochrome portrait of a man with strong shadows and high-contrast lighting, fine film grain, 35mm photography, dramatic mood, black and white',
    aspect: '4:3', resolution: '2K' },
  { id: 'colour-block', category: 'styles', title: 'Colour block', image: imgColourBlock,
    prompt: 'A woman standing in a room with bold colour-blocked walls of pink, teal and yellow, minimalist editorial fashion photography, soft daylight, geometric composition',
    aspect: '4:3', resolution: '2K' },
  { id: 'runway', category: 'styles', title: 'Runway', image: imgRunway,
    prompt: 'A high-fashion runway portrait, model in avant-garde silhouette against a sunset gradient backdrop, dramatic side lighting, editorial Vogue style',
    aspect: '9:16', resolution: '2K' },
  { id: 'risograph', category: 'styles', title: 'Risograph', image: imgRisograph,
    prompt: 'A risograph print illustration with two-tone neon pink and green ink, halftone texture, screen-print grain, punk poster aesthetic',
    aspect: '1:1', resolution: '1K' },
  { id: 'technicolour', category: 'styles', title: 'Technicolour', image: imgTechnicolour,
    prompt: 'A technicolour double-exposure poster of a woman in profile layered with a silhouette of another figure, saturated magenta and teal palette, vintage cinema aesthetic',
    aspect: '4:3', resolution: '2K' },
  { id: 'gothic-clay', category: 'styles', title: 'Gothic clay', image: imgGothicClay,
    prompt: 'A stop-motion claymation character with oversized glasses, gothic Victorian library setting, warm tungsten light, Wes Anderson framing',
    aspect: '4:3', resolution: '2K' },
  { id: 'dynamite', category: 'styles', title: 'Dynamite', image: imgDynamite,
    prompt: 'Action-movie poster, a man walking away from a massive fireball explosion in slow motion, cinematic IMAX framing, hyper-detailed',
    aspect: '16:9', resolution: '2K' },
  { id: 'salon', category: 'styles', title: 'Salon', image: imgSalon,
    prompt: 'A soft natural-light portrait of a woman with a bob haircut against a textured beige wall, fashion editorial, neutral tones, shot on Hasselblad',
    aspect: '4:3', resolution: '2K' },
  { id: 'sketch', category: 'styles', title: 'Sketch', image: imgSketch,
    prompt: 'A delicate pencil sketch of a woman, loose graphite linework on textured cream paper, photographed on a wooden desk in soft window light',
    aspect: '4:3', resolution: '1K' },
  { id: 'cinematic', category: 'styles', title: 'Cinematic', image: imgCinematic,
    prompt: 'A cinematic still of a lone figure at a wooden table under a single pendant lamp, deep shadows, teal-orange grading, anamorphic lens flare',
    aspect: '21:9', resolution: '2K' },
  { id: 'steampunk', category: 'styles', title: 'Steampunk', image: imgSteampunk,
    prompt: 'A steampunk warrior in brass armour overlooking a Victorian city at golden hour, gears and airships in the sky, oil-painted concept art',
    aspect: '16:9', resolution: '2K' },
  { id: 'sunrise', category: 'styles', title: 'Sunrise', image: imgSunrise,
    prompt: 'A silhouette of a person standing in a misty meadow at sunrise, warm golden lens flare, soft dewy atmosphere, photorealistic landscape',
    aspect: '16:9', resolution: '2K' },

  // CREATIONS
  { id: 'product-ad', category: 'creations', title: 'Product Ad', image: imgProductAd,
    prompt: 'Luxury skincare product hero shot on a marble countertop with aloe leaves, headline "INSTANT RADIANCE. DEEP HYDRATION. CLINICALLY PROVEN RESULTS." in elegant serif, soft natural light',
    aspect: '4:3', resolution: '2K' },
  { id: 'fantasy-cover', category: 'creations', title: 'Fantasy Cover', image: imgFantasyCover,
    prompt: 'Epic fantasy audiobook cover, a young female warrior with a glowing sword overlooking a sprawling ancient elven city at sunset, vibrant warm colors, detailed armor, digital painting',
    aspect: '9:16', resolution: '2K' },
  { id: 'edu-diagram', category: 'creations', title: 'Educational Diagram', image: imgEduDiagram,
    prompt: 'A friendly educational infographic titled "THE WATER CYCLE: NATURE\'S JOURNEY" with cute illustrated sun, clouds, rain and rivers, labelled stages, pastel colours',
    aspect: '4:3', resolution: '2K' },
  { id: 'cosmic-infographic', category: 'creations', title: 'Cosmic Infographic', image: imgCosmicInfographic,
    prompt: 'A vibrant infographic titled "THE COSMIC FABRIC" showing planets, stars and orbital paths around a glowing sun, deep navy background, science illustration style',
    aspect: '4:3', resolution: '2K' },
  { id: 'cell-diagram', category: 'creations', title: 'Science Diagram', image: imgCellDiagram,
    prompt: 'A scientific diagram of a plant cell with labelled organelles (nucleus, mitochondria, chloroplast, cell wall) on a dark background, clean vector illustration',
    aspect: '1:1', resolution: '2K' },
  { id: 'manga-strip', category: 'creations', title: 'Manga Strip', image: imgMangaStrip,
    prompt: 'A four-panel Japanese manga strip of two friends excitedly discussing a limited-edition pudding, expressive faces, screentone shading, speech bubbles in Japanese',
    aspect: '3:4', resolution: '2K' },
  { id: 'autumn-portrait', category: 'creations', title: 'Autumn Portrait', image: imgAutumnPortrait,
    prompt: 'A stylish woman in a wide-brim hat and rust-orange blazer, blurred golden autumn leaves in the background, warm bokeh, fashion editorial',
    aspect: '9:16', resolution: '2K' },
  { id: 'cyberpunk-game', category: 'creations', title: 'Cyberpunk Game', image: imgCyberpunkGame,
    prompt: 'Cyberpunk video game key art, a hero piloting a neon spacecraft above a futuristic city, holographic title "NEBULA DRIFTER", electric pink and cyan lighting',
    aspect: '16:9', resolution: '2K' },
  { id: 'craftsman-house', category: 'creations', title: 'Architecture', image: imgCraftsmanHouse,
    prompt: 'A craftsman-style suburban home at dusk with warm window light, manicured front lawn and trees, real-estate twilight photography',
    aspect: '4:3', resolution: '2K' },
  { id: 'recipe-infographic', category: 'creations', title: 'Recipe Infographic', image: imgRecipeInfographic,
    prompt: 'A hand-drawn infographic titled "THE PROCESS OF MAKING FRENCH BOUILLABAISSE" with numbered steps, illustrated ingredients, kraft paper background',
    aspect: '4:3', resolution: '2K' },
  { id: 'storybook', category: 'creations', title: 'Storybook', image: imgStorybook,
    prompt: 'A whimsical children\'s book illustration of an elephant sitting under giant glowing mushrooms in an enchanted forest, watercolour style',
    aspect: '4:3', resolution: '2K' },

  // PORTRAITS
  { id: 'chibi', category: 'portraits', title: 'Chibi', image: imgChibi, needsPhoto: true,
    prompt: 'Turn the uploaded photo into an adorable chibi-style character with oversized sparkling eyes, soft pastel shading, denim jacket, sunny street background',
    aspect: '3:4', resolution: '2K' },
  { id: 'professional-headshot', category: 'portraits', title: 'Professional Headshot', image: imgProfessionalHeadshot, needsPhoto: true,
    prompt: 'Transform the uploaded photo into a polished corporate headshot, subject in a tailored navy blazer, soft studio grey backdrop, professional lighting',
    aspect: '3:4', resolution: '2K' },
  { id: 'logo-editor', category: 'portraits', title: 'Logo Editor', image: imgLogoEditor,
    prompt: 'Design a minimalist monochrome brand logo, abstract geometric mark with bold negative space, premium matte black on light grey background',
    aspect: '1:1', resolution: '2K' },
  { id: '70s-street', category: 'portraits', title: '70s Street Style', image: img70sStreet, needsPhoto: true,
    prompt: 'Reimagine the uploaded photo as a 1970s street-style portrait, vintage film grain, woman in green turtleneck and sunglasses, yellow taxi in the background',
    aspect: '3:4', resolution: '2K' },
  { id: 'quality-enhancer', category: 'portraits', title: 'Quality Enhancer', image: imgQualityEnhancer, needsPhoto: true,
    prompt: 'Upscale and enhance the uploaded photo to ultra-high resolution, restore fine details in skin, hair and fabric, natural colour grading, sharpen subtly',
    aspect: '4:3', resolution: '4K' },
  { id: 'comic-book', category: 'portraits', title: 'Comic Book', image: imgComicBook, needsPhoto: true,
    prompt: 'Transform the uploaded photo into a vintage American comic-book illustration, bold inked lines, halftone shading, retro 1960s interior background',
    aspect: '3:4', resolution: '2K' },
  { id: 'virtual-tryon', category: 'portraits', title: 'Virtual Try-On', image: imgVirtualTryon, needsPhoto: true,
    prompt: 'Dress the subject from the uploaded photo in a tailored navy blazer with a draped jacket, modern studio loft background, fashion lookbook photography',
    aspect: '3:4', resolution: '2K' },

  // TRANSFORMS
  { id: 'swap-background', category: 'transforms', title: 'Swap Background', image: imgSwapBackground, needsPhoto: true,
    prompt: 'Replace the background of the uploaded photo with a sunlit beach towel and seashells, preserve subject lighting, photorealistic compositing',
    aspect: '1:1', resolution: '2K' },
  { id: 'model-product-shot', category: 'transforms', title: 'Model Product Shot', image: imgModelProductShot, needsPhoto: true,
    prompt: 'Place the uploaded product into a lifestyle scene with a male model wearing headphones on a rainy city train platform, cinematic colour grade',
    aspect: '3:4', resolution: '2K' },
  { id: '80s-anime', category: 'transforms', title: '80s Anime', image: img80sAnime, needsPhoto: true,
    prompt: 'Convert the uploaded photo into a 1980s anime cel-shaded illustration, vibrant colours, retro diner background, hand-painted gradients',
    aspect: '3:4', resolution: '2K' },
  { id: 'style-transfer', category: 'transforms', title: 'Style Transfer', image: imgStyleTransfer, needsPhoto: true,
    prompt: 'Apply a bold pop-art style transfer to the uploaded photo, flat colour blocks, thick outlines, decorative sunflower motifs',
    aspect: '3:4', resolution: '2K' },
  { id: 'watercolour', category: 'transforms', title: 'Watercolour Portrait', image: imgWatercolour, needsPhoto: true,
    prompt: 'Transform the uploaded photo into a loose watercolour portrait on textured paper, soft wet-on-wet washes, Venetian canal background',
    aspect: '3:4', resolution: '2K' },
  { id: 'video-game', category: 'transforms', title: 'Video Game', image: imgVideoGame, needsPhoto: true,
    prompt: 'Render the uploaded subject as a stylized 3D video-game character in Pixar-Unreal hybrid style, exaggerated features, soft studio lighting',
    aspect: '3:4', resolution: '2K' },
  { id: '3d-animation', category: 'transforms', title: '3D Animation', image: img3dAnimation, needsPhoto: true,
    prompt: 'Transform the uploaded subject into a cute 3D animated character holding an ice-cream cone, big expressive eyes, soft Pixar-style lighting, pastel city background',
    aspect: '3:4', resolution: '2K' },
];

const ImagineTemplates: React.FC<Props> = ({ onUseTemplate, embedded }) => {
  const [cat, setCat] = useState<Category>('all');
  const [preview, setPreview] = useState<Template | null>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  const items = useMemo(
    () => (cat === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.category === cat)),
    [cat]
  );

  const scroll = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <section className="w-full">
      {/* Header (hidden when embedded inside a tab — parent already shows the tab bar) */}
      {!embedded && (
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <h3 className="text-[13px] font-semibold tracking-wide uppercase text-foreground/80">
              Templates
            </h3>
            <span className="text-[11px] text-muted-foreground">{TEMPLATES.length}</span>
          </div>
        </div>
      )}

      {/* Category pills */}
      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
        {CATS.map(c => {
          const Icon = c.icon;
          const active = cat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200',
                active
                  ? 'bg-gradient-to-br from-primary/15 to-primary/5 text-primary border border-primary/40 shadow-[0_2px_10px_-2px_hsl(var(--primary)/0.3)]'
                  : 'text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/30 bg-card/40'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="relative group">
        <button
          onClick={() => scroll(-1)}
          className="hidden md:flex items-center justify-center absolute left-0 top-32 -translate-x-3 z-10 w-9 h-9 rounded-full bg-background/90 backdrop-blur border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => scroll(1)}
          className="hidden md:flex items-center justify-center absolute right-0 top-32 translate-x-3 z-10 w-9 h-9 rounded-full bg-background/90 backdrop-blur border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div
          ref={scrollerRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pb-2"
        >
          {items.map(t => (
            <button
              key={t.id}
              onClick={() => setPreview(t)}
              className="group/card relative aspect-[4/5] rounded-2xl overflow-hidden border border-border/50 transition-all duration-300 hover:scale-[1.03] hover:border-primary/50 hover:shadow-[0_10px_30px_-12px_hsl(var(--primary)/0.45)] bg-muted"
            >
              <img
                src={t.image}
                alt={t.title}
                loading="lazy"
                width={512}
                height={640}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
              />
              {/* Bottom gradient for label readability */}
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              {/* Needs-photo badge */}
              {t.needsPhoto && (
                <span className="absolute top-2.5 left-2.5 flex items-center gap-1 text-[9.5px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-black/55 backdrop-blur text-white/95 border border-white/15">
                  <Camera className="w-2.5 h-2.5" />
                  Photo
                </span>
              )}

              {/* Title */}
              <div className="absolute inset-x-0 bottom-0 p-3 text-left">
                <p className="text-white text-[13px] font-semibold drop-shadow-md leading-tight">
                  {t.title}
                </p>
                <p className="text-white/75 text-[10px] mt-0.5 opacity-0 group-hover/card:opacity-100 transition-opacity">
                  {t.aspect} · {t.resolution}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <ImagineTemplatePreview
        template={preview}
        onClose={() => setPreview(null)}
        onUsePrompt={(tpl) => {
          onUseTemplate(tpl.prompt, tpl.aspect, tpl.resolution);
          setPreview(null);
        }}
        onUseAsReference={(tpl, sampleDataUrl) => {
          onUseTemplate(tpl.prompt, tpl.aspect, tpl.resolution, sampleDataUrl);
          setPreview(null);
        }}
      />
    </section>
  );
};

export const TEMPLATE_COUNT = TEMPLATES.length;
export default ImagineTemplates;
