import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, Camera, Palette, User, Wand2, ChevronRight, ChevronLeft } from 'lucide-react';
import ImagineTemplatePreview, { type Template } from './ImagineTemplatePreview';
import type { AspectRatio, Resolution } from './ImagineOptionsPanel';

export type { Template } from './ImagineTemplatePreview';

interface Props {
  onUseTemplate: (prompt: string, aspect?: AspectRatio, resolution?: Resolution, sampleUrl?: string) => void;
}

type Category = 'styles' | 'creations' | 'portraits' | 'transforms';

const CATS: { id: Category; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'styles', label: 'Styles', icon: Palette },
  { id: 'creations', label: 'Creations', icon: Sparkles },
  { id: 'portraits', label: 'Portraits', icon: User },
  { id: 'transforms', label: 'Transforms', icon: Wand2 },
];

// Curated template library. `grad` defines the visual chip style.
const TEMPLATES: Template[] = [
  // STYLES
  { id: 'monochrome', category: 'styles', title: 'Monochrome', grad: 'from-zinc-900 via-zinc-700 to-zinc-500', icon: '◐',
    prompt: 'A cinematic monochrome portrait of a man with strong shadows and high-contrast lighting, fine film grain, 35mm photography, dramatic mood, black and white',
    aspect: '4:3', resolution: '2K' },
  { id: 'colour-block', category: 'styles', title: 'Colour block', grad: 'from-sky-400 via-amber-300 to-emerald-400', icon: '▣',
    prompt: 'A woman standing in a room with bold colour-blocked walls of pink, teal and yellow, minimalist editorial fashion photography, soft daylight, geometric composition',
    aspect: '4:3', resolution: '2K' },
  { id: 'runway', category: 'styles', title: 'Runway', grad: 'from-violet-700 via-fuchsia-500 to-amber-300', icon: '✦',
    prompt: 'A high-fashion runway portrait, model in avant-garde silhouette against a sunset gradient backdrop, dramatic side lighting, editorial Vogue style',
    aspect: '9:16', resolution: '2K' },
  { id: 'risograph', category: 'styles', title: 'Risograph', grad: 'from-pink-500 via-fuchsia-500 to-emerald-400', icon: '▦',
    prompt: 'A risograph print illustration with two-tone neon pink and green ink, halftone texture, screen-print grain, punk poster aesthetic',
    aspect: '1:1', resolution: '1K' },
  { id: 'technicolour', category: 'styles', title: 'Technicolour', grad: 'from-rose-500 via-purple-600 to-indigo-700', icon: '◭',
    prompt: 'A technicolour double-exposure poster of a woman in profile layered with a silhouette of another figure, saturated magenta and teal palette, vintage cinema aesthetic',
    aspect: '4:3', resolution: '2K' },
  { id: 'gothic-clay', category: 'styles', title: 'Gothic clay', grad: 'from-stone-700 via-amber-700 to-stone-900', icon: '☗',
    prompt: 'A stop-motion claymation character with oversized glasses, gothic Victorian library setting, warm tungsten light, Wes Anderson framing',
    aspect: '4:3', resolution: '2K' },
  { id: 'dynamite', category: 'styles', title: 'Dynamite', grad: 'from-orange-600 via-red-600 to-yellow-400', icon: '✺',
    prompt: 'Action-movie poster, a man walking away from a massive fireball explosion in slow motion, cinematic IMAX framing, hyper-detailed',
    aspect: '16:9', resolution: '2K' },
  { id: 'salon', category: 'styles', title: 'Salon', grad: 'from-stone-300 via-neutral-200 to-stone-400', icon: '◔',
    prompt: 'A soft natural-light portrait of a woman with a bob haircut against a textured beige wall, fashion editorial, neutral tones, shot on Hasselblad',
    aspect: '4:3', resolution: '2K' },
  { id: 'sketch', category: 'styles', title: 'Sketch', grad: 'from-amber-100 via-stone-300 to-amber-200', icon: '✎',
    prompt: 'A delicate pencil sketch of a woman, loose graphite linework on textured cream paper, photographed on a wooden desk in soft window light',
    aspect: '4:3', resolution: '1K' },
  { id: 'cinematic', category: 'styles', title: 'Cinematic', grad: 'from-amber-900 via-yellow-700 to-stone-900', icon: '◧',
    prompt: 'A cinematic still of a lone figure at a wooden table under a single pendant lamp, deep shadows, teal-orange grading, anamorphic lens flare',
    aspect: '21:9', resolution: '2K' },
  { id: 'steampunk', category: 'styles', title: 'Steampunk', grad: 'from-amber-700 via-orange-600 to-stone-800', icon: '⚙',
    prompt: 'A steampunk warrior in brass armour overlooking a Victorian city at golden hour, gears and airships in the sky, oil-painted concept art',
    aspect: '16:9', resolution: '2K' },
  { id: 'sunrise', category: 'styles', title: 'Sunrise', grad: 'from-rose-300 via-amber-300 to-yellow-200', icon: '☀',
    prompt: 'A silhouette of a person standing in a misty meadow at sunrise, warm golden lens flare, soft dewy atmosphere, photorealistic landscape',
    aspect: '16:9', resolution: '2K' },

  // CREATIONS
  { id: 'product-ad', category: 'creations', title: 'Product Ad', grad: 'from-emerald-200 via-white to-stone-200', icon: '⬚',
    prompt: 'Luxury skincare product hero shot on a marble countertop with aloe leaves, headline "INSTANT RADIANCE. DEEP HYDRATION. CLINICALLY PROVEN RESULTS." in elegant serif, soft natural light',
    aspect: '4:3', resolution: '2K' },
  { id: 'fantasy-cover', category: 'creations', title: 'Fantasy Cover', grad: 'from-purple-700 via-orange-500 to-amber-300', icon: '⚔',
    prompt: 'Epic fantasy audiobook cover, a young female warrior with a glowing sword overlooking a sprawling ancient elven city at sunset, vibrant warm colors, detailed armor, digital painting',
    aspect: '9:16', resolution: '2K' },
  { id: 'edu-diagram', category: 'creations', title: 'Educational Diagram', grad: 'from-sky-300 via-emerald-300 to-yellow-300', icon: '☼',
    prompt: 'A friendly educational infographic titled "THE WATER CYCLE: NATURE\'S JOURNEY" with cute illustrated sun, clouds, rain and rivers, labelled stages, pastel colours',
    aspect: '4:3', resolution: '2K' },
  { id: 'cosmic-infographic', category: 'creations', title: 'Cosmic Infographic', grad: 'from-indigo-900 via-purple-800 to-amber-500', icon: '◉',
    prompt: 'A vibrant infographic titled "THE COSMIC FABRIC" showing planets, stars and orbital paths around a glowing sun, deep navy background, science illustration style',
    aspect: '4:3', resolution: '2K' },
  { id: 'cell-diagram', category: 'creations', title: 'Science Diagram', grad: 'from-emerald-500 via-teal-600 to-indigo-700', icon: '◯',
    prompt: 'A scientific diagram of a plant cell with labelled organelles (nucleus, mitochondria, chloroplast, cell wall) on a dark background, clean vector illustration',
    aspect: '1:1', resolution: '2K' },
  { id: 'manga-strip', category: 'creations', title: 'Manga Strip', grad: 'from-amber-200 via-orange-300 to-rose-300', icon: '☷',
    prompt: 'A four-panel Japanese manga strip of two friends excitedly discussing a limited-edition pudding, expressive faces, screentone shading, speech bubbles in Japanese',
    aspect: '3:4', resolution: '2K' },
  { id: 'autumn-portrait', category: 'creations', title: 'Autumn Portrait', grad: 'from-orange-500 via-amber-500 to-yellow-600', icon: '✿',
    prompt: 'A stylish woman in a wide-brim hat and rust-orange blazer, blurred golden autumn leaves in the background, warm bokeh, fashion editorial',
    aspect: '9:16', resolution: '2K' },
  { id: 'cyberpunk-game', category: 'creations', title: 'Cyberpunk Game', grad: 'from-fuchsia-600 via-cyan-400 to-indigo-700', icon: '◆',
    prompt: 'Cyberpunk video game key art, a hero piloting a neon spacecraft above a futuristic city, holographic title "NEBULA DRIFTER", electric pink and cyan lighting',
    aspect: '16:9', resolution: '2K' },
  { id: 'craftsman-house', category: 'creations', title: 'Architecture', grad: 'from-emerald-700 via-amber-600 to-stone-400', icon: '⌂',
    prompt: 'A craftsman-style suburban home at dusk with warm window light, manicured front lawn and trees, real-estate twilight photography',
    aspect: '4:3', resolution: '2K' },
  { id: 'recipe-infographic', category: 'creations', title: 'Recipe Infographic', grad: 'from-amber-300 via-orange-400 to-red-500', icon: '⌬',
    prompt: 'A hand-drawn infographic titled "THE PROCESS OF MAKING FRENCH BOUILLABAISSE" with numbered steps, illustrated ingredients, kraft paper background',
    aspect: '4:3', resolution: '2K' },
  { id: 'storybook', category: 'creations', title: 'Storybook', grad: 'from-yellow-300 via-green-400 to-emerald-500', icon: '✾',
    prompt: 'A whimsical children\'s book illustration of an elephant sitting under giant glowing mushrooms in an enchanted forest, watercolour style',
    aspect: '4:3', resolution: '2K' },

  // PORTRAITS
  { id: 'chibi', category: 'portraits', title: 'Chibi', grad: 'from-amber-300 via-rose-300 to-sky-300', icon: '☺', needsPhoto: true,
    prompt: 'Turn the uploaded photo into an adorable chibi-style character with oversized sparkling eyes, soft pastel shading, denim jacket, sunny street background',
    aspect: '3:4', resolution: '2K' },
  { id: 'professional-headshot', category: 'portraits', title: 'Professional Headshot', grad: 'from-slate-700 via-slate-500 to-slate-300', icon: '◉', needsPhoto: true,
    prompt: 'Transform the uploaded photo into a polished corporate headshot, subject in a tailored navy blazer, soft studio grey backdrop, professional lighting',
    aspect: '3:4', resolution: '2K' },
  { id: 'logo-editor', category: 'portraits', title: 'Logo Editor', grad: 'from-zinc-800 via-zinc-600 to-zinc-400', icon: '◬',
    prompt: 'Design a minimalist monochrome brand logo, abstract geometric mark with bold negative space, premium matte black on light grey background',
    aspect: '1:1', resolution: '2K' },
  { id: '70s-street', category: 'portraits', title: '70s Street Style', grad: 'from-amber-700 via-emerald-600 to-stone-400', icon: '☼', needsPhoto: true,
    prompt: 'Reimagine the uploaded photo as a 1970s street-style portrait, vintage film grain, woman in green turtleneck and sunglasses, yellow taxi in the background',
    aspect: '3:4', resolution: '2K' },
  { id: 'quality-enhancer', category: 'portraits', title: 'Quality Enhancer', grad: 'from-sky-300 via-emerald-300 to-amber-200', icon: '✦', needsPhoto: true,
    prompt: 'Upscale and enhance the uploaded photo to ultra-high resolution, restore fine details in skin, hair and fabric, natural colour grading, sharpen subtly',
    aspect: '4:3', resolution: '4K' },
  { id: 'comic-book', category: 'portraits', title: 'Comic Book', grad: 'from-yellow-400 via-orange-400 to-red-500', icon: '✶', needsPhoto: true,
    prompt: 'Transform the uploaded photo into a vintage American comic-book illustration, bold inked lines, halftone shading, retro 1960s interior background',
    aspect: '3:4', resolution: '2K' },
  { id: 'virtual-tryon', category: 'portraits', title: 'Virtual Try-On', grad: 'from-indigo-600 via-blue-500 to-slate-400', icon: '⌘', needsPhoto: true,
    prompt: 'Dress the subject from the uploaded photo in a tailored navy blazer with a draped jacket, modern studio loft background, fashion lookbook photography',
    aspect: '3:4', resolution: '2K' },

  // TRANSFORMS
  { id: 'swap-background', category: 'transforms', title: 'Swap Background', grad: 'from-orange-400 via-rose-400 to-amber-200', icon: '⇆', needsPhoto: true,
    prompt: 'Replace the background of the uploaded photo with a sunlit beach towel and seashells, preserve subject lighting, photorealistic compositing',
    aspect: '1:1', resolution: '2K' },
  { id: 'model-product-shot', category: 'transforms', title: 'Model Product Shot', grad: 'from-stone-500 via-stone-300 to-amber-200', icon: '◫', needsPhoto: true,
    prompt: 'Place the uploaded product into a lifestyle scene with a male model wearing headphones on a rainy city train platform, cinematic colour grade',
    aspect: '3:4', resolution: '2K' },
  { id: '80s-anime', category: 'transforms', title: '80s Anime', grad: 'from-pink-400 via-rose-400 to-amber-300', icon: '✧', needsPhoto: true,
    prompt: 'Convert the uploaded photo into a 1980s anime cel-shaded illustration, vibrant colours, retro diner background, hand-painted gradients',
    aspect: '3:4', resolution: '2K' },
  { id: 'style-transfer', category: 'transforms', title: 'Style Transfer', grad: 'from-emerald-600 via-yellow-400 to-rose-400', icon: '◈', needsPhoto: true,
    prompt: 'Apply a bold pop-art style transfer to the uploaded photo, flat colour blocks, thick outlines, decorative sunflower motifs',
    aspect: '3:4', resolution: '2K' },
  { id: 'watercolour', category: 'transforms', title: 'Watercolour Portrait', grad: 'from-sky-400 via-teal-300 to-amber-200', icon: '✺', needsPhoto: true,
    prompt: 'Transform the uploaded photo into a loose watercolour portrait on textured paper, soft wet-on-wet washes, Venetian canal background',
    aspect: '3:4', resolution: '2K' },
  { id: 'video-game', category: 'transforms', title: 'Video Game', grad: 'from-amber-300 via-orange-400 to-emerald-500', icon: '◴', needsPhoto: true,
    prompt: 'Render the uploaded subject as a stylized 3D video-game character in Pixar-Unreal hybrid style, exaggerated features, soft studio lighting',
    aspect: '3:4', resolution: '2K' },
  { id: '3d-animation', category: 'transforms', title: '3D Animation', grad: 'from-rose-400 via-pink-300 to-sky-300', icon: '☻', needsPhoto: true,
    prompt: 'Transform the uploaded subject into a cute 3D animated character holding an ice-cream cone, big expressive eyes, soft Pixar-style lighting, pastel city background',
    aspect: '3:4', resolution: '2K' },
];

const ImagineTemplates: React.FC<Props> = ({ onUseTemplate }) => {
  const [cat, setCat] = useState<Category>('styles');
  const [preview, setPreview] = useState<Template | null>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  const items = useMemo(() => TEMPLATES.filter(t => t.category === cat), [cat]);

  const scroll = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <h3 className="text-[13px] font-semibold tracking-wide uppercase text-foreground/80">
            Templates
          </h3>
          <span className="text-[11px] text-muted-foreground">{TEMPLATES.length}</span>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-muted/50 border border-border/40">
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
                    : 'text-muted-foreground hover:text-foreground border border-transparent'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scroller with arrow controls */}
      <div className="relative group">
        <button
          onClick={() => scroll(-1)}
          className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-9 h-9 rounded-full bg-background/90 backdrop-blur border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => scroll(1)}
          className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-9 h-9 rounded-full bg-background/90 backdrop-blur border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div
          ref={scrollerRef}
          className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map(t => (
            <button
              key={t.id}
              onClick={() => setPreview(t)}
              className="group/card relative shrink-0 snap-start w-[44%] sm:w-[28%] md:w-[20%] aspect-[4/5] rounded-2xl overflow-hidden border border-border/50 transition-all duration-300 hover:scale-[1.03] hover:border-primary/50 hover:shadow-[0_10px_30px_-12px_hsl(var(--primary)/0.45)]"
            >
              <div className={cn('absolute inset-0 bg-gradient-to-br', t.grad)} />
              {/* Soft noise/texture */}
              <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(circle_at_30%_20%,_white,_transparent_60%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Big stylised glyph */}
              <span className="absolute top-3 right-3 text-2xl text-white/60 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                {t.icon}
              </span>

              {/* Needs-photo badge */}
              {t.needsPhoto && (
                <span className="absolute top-3 left-3 flex items-center gap-1 text-[9.5px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur text-white/90 border border-white/15">
                  <Camera className="w-2.5 h-2.5" />
                  Photo
                </span>
              )}

              {/* Title */}
              <div className="absolute inset-x-0 bottom-0 p-3 text-left">
                <p className="text-white text-[13px] font-semibold drop-shadow-md">{t.title}</p>
                <p className="text-white/70 text-[10px] mt-0.5 opacity-0 group-hover/card:opacity-100 transition-opacity">
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

export default ImagineTemplates;
