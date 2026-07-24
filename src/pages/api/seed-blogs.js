  import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const blogs = [
    {
      title: "SaaS Dashboard UX: Designing for Data-Heavy Interfaces",
      slug: "saas-dashboard-ux-designing-interfaces",
      category: "UI/UX Design",
      bg_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      description: "Learn how to structure complex metrics, manage cognitive load, and design responsive, bento-style dashboards that delight SaaS users.",
      meta_description: "Discover UX patterns for SaaS dashboards. Learn how to optimize layouts, handle complex data, and design responsive grids for metrics.",
      keywords: "SaaS Dashboard UX, Dashboard UI Design, Data Visualization, Bento Grid UI, Product Design Patterns",
      content: `
        <h2>Designing intuitive dashboards for complex SaaS platforms is one of the hardest challenges in product design.</h2>
        <p>Startups and enterprise systems alike face the same core problem: how to display high volumes of actionable data without inducing cognitive overload in the user. When users log in, they should immediately grasp key metrics and know where to look next.</p>
        
        <h3>1. The Visual Hierarchy of Metrics</h3>
        <p>Every dashboard layout needs a clear hierarchy. Place high-level KPI indicators at the top of the interface using compact bento-grid widgets. Secondary data, such as real-time line charts, should occupy the center, while logs and lists belong at the bottom. Grouping related items together inside card panels with solid background colors helps keep elements separate and highly readable.</p>
        
        <h3>2. Managing Cognitive Load and Whitespace</h3>
        <p>Avoid the temptation to fill every square pixel of the screen. Incorporate an 8px spacing design token grid to create natural separation. Keeping background contrast high and utilizing standard font scales (like Outfit or Inter) ensures scanning is fatigue-free. When displaying numbers, simplify them: write <strong>$4.8k</strong> instead of <strong>$4,821.56</strong> unless absolute precision is critical.</p>

        <h3>3. Progressive Disclosure</h3>
        <p>Use tabs, hover states, and expandible cards to show critical data first. Let users click into individual metrics to see detailed breakdowns. This preserves clean layout aesthetics while keeping deeper insights accessible.</p>
      `
    },
    {
      title: "Why Next.js is the Ultimate Framework for Modern Product Portfolios",
      slug: "nextjs-ultimate-framework-product-portfolios",
      category: "Development",
      bg_image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=800&q=80",
      description: "An in-depth look at why Pages and App Router architecture, static generation, and automated SEO optimization make Next.js the absolute best choice for developer portfolios.",
      meta_description: "Learn why Next.js is the ideal framework for portfolio design. Covers static generation, Pages router SEO, fast loading, and performance optimizations.",
      keywords: "Next.js Portfolio, React Portfolio, Frontend Portfolio SEO, Core Web Vitals, Portfolio Development Guide",
      content: `
        <h2>A portfolio is a developer's most important marketing tool.</h2>
        <p>In today's competitive job market, your personal site must load instantly, showcase complex layouts smoothly, and rank high on search engines. Next.js has emerged as the industry-standard choice for modern portfolios due to its out-of-the-box performance and indexing capabilities.</p>
        
        <h3>1. Static Site Generation (SSG) for Instant Speeds</h3>
        <p>Next.js compiles pages at build time. When a recruiter clicks your link, the server serves pre-rendered HTML files immediately, rather than waiting for Javascript to bundle on the client. This drives page load times down to sub-second levels, checking off Google's Core Web Vitals criteria.</p>
        
        <h3>2. Built-in SEO Optimization Tools</h3>
        <p>Using next/head or standard layout configuration, you can inject descriptive page titles, canonical tags, and structured JSON-LD schemas. These signals allow search spiders to index your experience, projects, and blogs effortlessly, making you highly discoverable on Google.</p>

        <h3>3. Scalable Asset Delivery</h3>
        <p>The Next.js <code>&lt;Image&gt;</code> component automatically resizes and formats your high-fidelity design mockups into lightweight WebP formats. This prevents large graphic files from bloating bandwidth and ruining layout stability.</p>
      `
    },
    {
      title: "The Anatomy of a High-Converting Landing Page",
      slug: "anatomy-high-converting-landing-page",
      category: "Product Strategy",
      bg_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      description: "Deconstructing landing page layouts that successfully bridge the gap between design aesthetic, product value communication, and business conversions.",
      meta_description: "Explore the core components of a high-converting landing page. Learn how to structure hero sections, CTAs, testimonials, and layout grids.",
      keywords: "Landing Page UX, Conversion Rate Optimization, SaaS Landing Page, Hero Section Design, Landing Page Anatomy",
      content: `
        <h2>A great landing page is more than just pretty shapes and colors.</h2>
        <p>It is a highly engineered user experience that leads a visitor from interest to action. To convert visitors into customers, your layout needs to answer three core questions in less than 5 seconds: What is this product? Who is it for? Why should they care?</p>
        
        <h3>1. The Hero Section Hook</h3>
        <p>The above-the-fold hero layout must carry a clear, high-contrast headline, a short supporting description, and a single, obvious Call-to-Action (CTA) button. Avoid secondary distraction triggers like nested links or unnecessary clutter. Surround the CTA with ample whitespace to maximize clickability.</p>
        
        <h3>2. High-Trust Case Studies & Social Proof</h3>
        <p>Google algorithms and users value authenticity. Feature real client metrics, testimonials, and growth statistics. Align your metrics using a responsive bento grid to represent visual clean layout patterns.</p>

        <h3>3. Reducing User Friction</h3>
        <p>Keep forms simple. Every input field added to a signup flow drops conversion rates by up to 10%. Enable quick OAuth logins (like Google or GitHub) to get users inside the product environment as quickly as possible.</p>
      `
    },
    {
      title: "Scaling UI: Building Accessible Design Systems with CSS Variables",
      slug: "scaling-ui-accessible-design-systems-css-variables",
      category: "UI/UX Design",
      bg_image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      description: "How to leverage modern CSS variables, semantic tokens, and Tailwind configuration to build consistent, dark-mode friendly, and WCAG-compliant design systems.",
      meta_description: "Learn how to build accessible design systems using CSS variables and Tailwind. Learn about spacing grids, typography, and dark mode themes.",
      keywords: "Design Systems, CSS Variables, Accessible UI, Tailwind CSS themes, Web Accessibility Guide",
      content: `
        <h2>Design systems are the backbone of modern digital products.</h2>
        <p>They allow designers and developers to speak the same language, keeping interfaces unified as features scale. Leveraging CSS variables alongside utility frameworks like Tailwind is the most efficient way to build design tokens that translate directly from Figma to code.</p>
        
        <h3>1. Creating Spacing and Typography Spans</h3>
        <p>Map your layout spacing directly to a base-8 scale (8px, 16px, 24px, 32px). This creates proportional balance. Define custom typography tokens for body text, subtitles, and headings using custom root variables so they adapt smoothly across viewport breakpoints.</p>
        
        <h3>2. Designing for Dark and Light Modes</h3>
        <p>Instead of hardcoding color variables, utilize semantic tokens like <code>--color-background</code>, <code>--color-surface</code>, and <code>--color-primary</code>. This enables you to toggle themes globally simply by changing color variables on the HTML body class.</p>

        <h3>3. Meeting WCAG Accessibility Criteria</h3>
        <p>Ensure that text colors meet the minimum WCAG AA contrast ratio of 4.5:1 against their backgrounds. Test your interface elements under high zoom levels and verify keyboard navigability to prevent user friction.</p>
      `
    },
    {
      title: "Smooth Sailing: Navigating 3D Transforms and GPU Acceleration",
      slug: "smooth-sailing-navigating-3d-transforms-gpu",
      category: "Development",
      bg_image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
      description: "Learn best practices for hardware-accelerated animations, managing perspective depth, and eliminating repaint lag in 3D layered interfaces.",
      meta_description: "A developer's guide to CSS 3D transforms, hardware acceleration, will-change optimization, and rendering performance.",
      keywords: "CSS 3D Transforms, Web Animation Performance, GPU Acceleration, Perspective Layout, CSS Animation Guide",
      content: `
        <h2>Adding depth to a web layout creates a memorable user experience.</h2>
        <p>Using 3D rotation, isometric perspectives, and layered cards makes portfolios and product landing pages feel alive. However, improper configuration can cause repaints, leading to stuttering animations and battery drain on mobile devices.</p>
        
        <h3>1. Enabling GPU Hardware Acceleration</h3>
        <p>Always instruct the browser's compositor to handle animating layers by adding <code>will-change: transform, opacity;</code> and <code>backface-visibility: hidden;</code> to your target classes. This separates the element into a dedicated GPU layer, preventing layout recalculation on every frame.</p>
        
        <h3>2. Managing Perspective and Z-Index</h3>
        <p>Define <code>perspective: 1500px;</code> on the parent container to control the depth of the 3D space. When cards slide past or behind each other, adjust their Z-depth translates (e.g. <code>translate3d(x, y, z)</code>) rather than relying solely on z-index. This ensures realistic perspective scaling and overlap behavior.</p>

        <h3>3. Easing Curves and Cycle Speed</h3>
        <p>Avoid standard linear transforms for interactive components. Use ease-out or custom cubic-beziers to give cards natural weight and friction. Keep cycle loops between 4 to 8 seconds so the motion is engaging but never distracting.</p>
      `
    },
    {
      title: "Solving Checkout Friction: A Case Study in SaaS Optimization",
      slug: "solving-checkout-friction-saas-optimization",
      category: "UX Research",
      bg_image: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=800&q=80",
      description: "Analyze user drop-off behavior, identify conversion hurdles, and optimize checkouts to increase signup rates and business LTV.",
      meta_description: "Discover how to optimize SaaS checkouts. UX analysis on reducing form fields, checkout layouts, and conversion rate enhancement.",
      keywords: "SaaS Checkout UX, Conversion Optimization, Friction Reduction, Checkout UX Case Study, SaaS Conversion Metrics",
      content: `
        <h2>Cart drop-off is the largest leakage point in the SaaS sales funnel.</h2>
        <p>Organizations invest heavily in driving traffic to their sites, only to lose users at the final step. Optimizing this flow is a combination of user psychology, UI clarity, and engineering simplicity.</p>
        
        <h3>1. Reducing Information Friction</h3>
        <p>Audit your checkout form fields. Do you really need their phone number, address, and company size at the moment of billing? Every unnecessary input field acts as a barrier. Keep registration details to a bare minimum: email, card number, and password.</p>
        
        <h3>2. Providing Visual Guides</h3>
        <p>Use active step indicators (e.g. 'Register', 'Secure Payment', 'Setup Dashboard') to give the user a clear sense of progress. Place trusted security badges and direct contact links near the primary action button to reassure customers.</p>

        <h3>3. Real-Time Form Validation</h3>
        <p>Show validation errors as the user typing, rather than waiting for them to click submit and reload. This prevents frustration and guides them to checkout completion without interruption.</p>
      `
    },
    {
      title: "Figma to React: Best Practices for Seamless Developer Handoff",
      slug: "figma-to-react-best-practices-developer-handoff",
      category: "Product Strategy",
      bg_image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=80",
      description: "How product designers and developers can align components, naming conventions, and layout structures to speed up build cycles.",
      meta_description: "Learn best practices for Figma to React developer handoff. Align design systems, layers naming, spacing tokens, and component files.",
      keywords: "Figma to React, Developer Handoff, Design Systems Sync, UI Engineering Workflows, Product Development Lifecycle",
      content: `
        <h2>The gap between design and engineering is the source of major project delay.</h2>
        <p>When layouts in code do not match the design mockup, design integrity suffers. Bridging this gap requires aligning workflows around shared components, naming conventions, and layout tokens.</p>
        
        <h3>1. Syncing Design Tokens</h3>
        <p>Ensure that colors, typography sizes, and border-radius parameters have the exact same names in Figma variables as they do in your CSS or Tailwind config. This keeps definitions unified and simplifies style updates.</p>
        
        <h3>2. Organizing Figma Layers Like Code</h3>
        <p>Product designers should group elements logically using Figma's auto-layout properties, mimicking CSS flexbox and grid behaviors. This makes it easy for developers to inspect sizes and translate layers directly into HTML DOM nodes.</p>

        <h3>3. Component-Driven Collaboration</h3>
        <p>Keep a shared component library (e.g. Storybook or Figma Library) that serves as the single source of truth. When updating a component, update both platforms in sync to avoid styling discrepancies.</p>
      `
    },
    {
      title: "User Journey Mapping: Turning Friction Points into Growth Opportunities",
      slug: "user-journey-mapping-friction-to-growth",
      category: "UX Research",
      bg_image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
      description: "How to identify customer pain points, trace user pathways, and optimize product flows to turn friction points into user conversion vectors.",
      meta_description: "A guide on how to build and analyze User Journey Maps. Discover user pain points, friction mapping, and layout optimizations.",
      keywords: "User Journey Map, UX Research, Customer Experience, Product Design Strategy, UX Friction Analysis",
      content: `
        <h2>Understanding how users experience your product is key to growth.</h2>
        <p>A user journey map is a visual representation of the stages a user goes through when interacting with your product. Mapping these pathways helps uncover design hurdles and feature blind spots.</p>
        
        <h3>1. Gathering Real User Research</h3>
        <p>Do not base your journey maps on assumptions. Perform user interviews, run usability tests, and inspect analytics data. Trace exactly where users drop off, get confused, or spend excessive time.</p>
        
        <h3>2. Mapping Pain Points to Solutions</h3>
        <p>Create a layout matrix aligning user emotions, friction points, design solutions, and expected growth outcomes. This helps you prioritize design improvements based on actual user needs.</p>

        <h3>3. Iterating and Validating Layouts</h3>
        <p>Implement prototypes, test them under real-world scenarios, and iterate. A journey map is not static; update it as features change and new metrics are unlocked.</p>
      `
    },
    {
      title: "Core Web Vitals: A Frontend Developer's Guide to Speed and Rankings",
      slug: "core-web-vitals-frontend-developers-guide",
      category: "Development",
      bg_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      description: "A technical breakdown of Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS) optimization for Next.js apps.",
      meta_description: "Learn how to optimize Core Web Vitals (LCP, CLS, INP) for Google SEO rankings. Next.js performance tips, image loading, and speed audits.",
      keywords: "Core Web Vitals, Page Speed Optimization, CLS, LCP, Next.js Performance, SEO Frontend Guide",
      content: `
        <h2>Search engines prioritize speed.</h2>
        <p>Google's page experience signals (Core Web Vitals) measure how quickly a page renders, how interactive it is, and how stable the layout is as assets load. Failing these metrics hurts your search engine rankings and user retention.</p>
        
        <h3>1. Optimizing Largest Contentful Paint (LCP)</h3>
        <p>Identify the largest visual block above the fold (e.g. hero images). Serve it pre-rendered from the server, compress it to modern WebP format, and preload it to ensure it displays immediately when the page opens.</p>
        
        <h3>2. Eradicating Cumulative Layout Shift (CLS)</h3>
        <p>Layout shifts occur when assets load without reserved dimensions, shifting surrounding elements. Always define explicit width and height ratios for images, video elements, and ad boxes to preserve visual stability.</p>

        <h3>3. Streamlining Interaction to Next Paint (INP)</h3>
        <p>INP measures the delay between a user clicking an element and the browser rendering the next frame. Keep javascript bundles small, defer non-critical scripts, and offload expensive calculations to background workers.</p>
      `
    },
    {
      title: "The Future of Digital Product Design: AI Co-pilots and Adaptive Interfaces",
      slug: "future-digital-product-design-ai-adaptive",
      category: "Product Strategy",
      bg_image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
      description: "Exploring the next wave of product design trends: AI-assisted vector systems, personalized UX journeys, and adaptive light/dark mode components.",
      meta_description: "Read about the future of product design. Explores AI design tools, adaptive layouts, personalization, and user experience trends.",
      keywords: "Future of Product Design, AI UX Design, Adaptive Interfaces, Personalization UI, UIUX Trends",
      content: `
        <h2>Digital product design is entering a paradigm shift.</h2>
        <p>AI tools and adaptive systems are changing how interfaces are built and consumed. Designers and frontend developers are transitioning from creating static screens to managing dynamic design systems.</p>
        
        <h3>1. AI-Driven Design Assistance</h3>
        <p>Co-pilot systems help designers automate redundant tasks: resizing layouts, translating copies, and generating vector anchors. This frees up product teams to focus on strategy, user research, and complex user flows.</p>
        
        <h3>2. Adaptive and Personalized Interfaces</h3>
        <p>Tomorrow's products will adapt to individual user preferences in real-time: adjusting text size based on screen zoom levels, modifying layouts based on usage history, and offering personalized themes.</p>

        <h3>3. Unified Design-to-Code Pipelines</h3>
        <p>The distinction between design and development is blurring. Modern visual editors will output production-ready React components directly, streamlining deployment cycles and keeping systems aligned.</p>
      `
    }
  ];

  try {
    const slugs = blogs.map((b) => b.slug);

    // Delete existing entries to prevent primary key conflicts
    await supabase.from("blogs").delete().in("slug", slugs);

    // Insert fresh, high-quality entries
    const { data, error } = await supabase.from("blogs").insert(blogs).select();

    if (error) {
      console.error("Supabase insertion error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      message: "10 High-Ranking SEO Blogs successfully uploaded!",
      count: data?.length || 0,
      slugs: data?.map((b) => b.slug)
    });
  } catch (err) {
    console.error("Unexpected error seeding blogs:", err);
    return res.status(500).json({ error: err.message });
  }
}
