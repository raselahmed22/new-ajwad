import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  ShoppingBag, X, Plus, Minus, Search, Trash2, Pencil, LayoutDashboard,
  Package, Receipt, Settings as SettingsIcon, LogOut, TrendingUp, DollarSign,
  ShoppingCart, Boxes, AlertTriangle, ArrowRight, ArrowLeft, Check, CreditCard,
  Radio, Store as StoreIcon, Lock, Eye, EyeOff, RotateCcw, Filter, ChevronDown
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Design system (self-contained styles + fonts)                     */
/* ------------------------------------------------------------------ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap');

.at-root{
  --paper:#F1F0EC; --surface:#FFFFFF; --ink:#16161A; --ink-soft:#3B3B44;
  --muted:#7A7A84; --line:#E4E3DD; --line-strong:#D5D4CD;
  --accent:#2733E6; --accent-press:#1B24C4; --accent-tint:#EBEDFF;
  --live:#188A4A; --live-tint:#E4F3EA; --warn:#B4460F; --warn-tint:#F8EBE2;
  --display:'Space Grotesk',system-ui,sans-serif;
  --body:'Inter',system-ui,sans-serif;
  --mono:'Space Mono',ui-monospace,monospace;
  color:var(--ink); font-family:var(--body);
  background:var(--paper); min-height:100vh; -webkit-font-smoothing:antialiased;
}
.at-root *{box-sizing:border-box;}
.at-root button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit;}
.at-root input,.at-root textarea,.at-root select{font-family:inherit;font-size:14px;color:var(--ink);}
.at-mono{font-family:var(--mono);font-variant-numeric:tabular-nums;}
.at-disp{font-family:var(--display);letter-spacing:-0.01em;}

/* focus + motion floor */
.at-root :focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:4px;}
@media (prefers-reduced-motion:reduce){.at-root *{animation:none!important;transition:none!important;}}

/* buttons */
.at-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;
  font-family:var(--display);font-weight:600;font-size:13px;letter-spacing:.01em;
  padding:12px 20px;border-radius:2px;transition:transform .12s ease,background .15s ease;}
.at-btn:active{transform:translateY(1px);}
.at-btn-primary{background:var(--accent);color:#fff;}
.at-btn-primary:hover{background:var(--accent-press);}
.at-btn-dark{background:var(--ink);color:var(--paper);}
.at-btn-dark:hover{background:#000;}
.at-btn-ghost{background:transparent;color:var(--ink);border:1px solid var(--line-strong);}
.at-btn-ghost:hover{border-color:var(--ink);}
.at-btn-sm{padding:8px 14px;font-size:12px;}
.at-btn:disabled{opacity:.5;cursor:not-allowed;}

.at-eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);}
.at-pulse{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--live);position:relative;}
.at-pulse::after{content:'';position:absolute;inset:0;border-radius:50%;background:var(--live);animation:atping 1.8s ease-out infinite;}
@keyframes atping{0%{transform:scale(1);opacity:.6;}100%{transform:scale(3.2);opacity:0;}}
@keyframes atrise{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}
@keyframes atfade{from{opacity:0;}to{opacity:1;}}
.at-rise{animation:atrise .35s ease both;}

/* form controls */
.at-field{width:100%;padding:11px 13px;border:1px solid var(--line-strong);border-radius:2px;
  background:var(--surface);transition:border-color .15s ease;}
.at-field:focus{outline:none;border-color:var(--accent);}
.at-label{display:block;font-size:12px;font-weight:600;color:var(--ink-soft);margin-bottom:6px;}

/* cards / surfaces */
.at-card{background:var(--surface);border:1px solid var(--line);border-radius:3px;}

/* store product card */
.at-prod{background:var(--surface);border:1px solid var(--line);cursor:pointer;
  transition:border-color .18s ease,transform .18s ease;display:flex;flex-direction:column;}
.at-prod:hover{border-color:var(--ink);}
.at-prod:hover .at-prod-img{transform:scale(1.02);}
.at-prod-imgwrap{overflow:hidden;aspect-ratio:3/4;background:var(--paper);}
.at-prod-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease;}

/* overlay + drawer */
.at-scrim{position:fixed;inset:0;background:rgba(16,16,20,.5);z-index:60;animation:atfade .2s ease;}
.at-drawer{position:fixed;top:0;right:0;bottom:0;width:100%;max-width:420px;background:var(--paper);
  z-index:70;display:flex;flex-direction:column;box-shadow:-20px 0 60px rgba(0,0,0,.15);animation:atslide .28s cubic-bezier(.2,.8,.2,1);}
@keyframes atslide{from{transform:translateX(100%);}to{transform:none;}}
.at-modal{position:fixed;inset:0;z-index:70;display:flex;align-items:flex-start;justify-content:center;
  padding:24px;overflow:auto;animation:atfade .2s ease;}

/* admin nav */
.at-navitem{display:flex;align-items:center;gap:11px;width:100%;padding:10px 14px;border-radius:3px;
  font-size:14px;font-weight:500;color:var(--muted);transition:background .12s ease,color .12s ease;}
.at-navitem:hover{background:rgba(255,255,255,.06);color:#fff;}
.at-navitem.active{background:var(--accent);color:#fff;}

/* stat */
.at-stat-num{font-family:var(--mono);font-weight:700;font-size:30px;letter-spacing:-.02em;line-height:1;}

/* table */
.at-table{width:100%;border-collapse:collapse;}
.at-table th{text-align:left;font-size:11px;letter-spacing:.06em;text-transform:uppercase;
  color:var(--muted);font-weight:600;padding:12px 14px;border-bottom:1px solid var(--line);}
.at-table td{padding:14px;border-bottom:1px solid var(--line);font-size:14px;vertical-align:middle;}
.at-table tr:last-child td{border-bottom:none;}

.at-badge{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:11px;
  padding:4px 9px;border-radius:2px;text-transform:uppercase;letter-spacing:.04em;}

.at-scroll::-webkit-scrollbar{width:8px;height:8px;}
.at-scroll::-webkit-scrollbar-thumb{background:var(--line-strong);border-radius:8px;}
`;

/* ------------------------------------------------------------------ */
/*  Persistent storage helpers                                         */
/* ------------------------------------------------------------------ */
const KEYS = { products: "atelier:products", orders: "atelier:orders", settings: "atelier:settings" };

async function loadKey(key, fallback) {
  try {
    const r = await window.storage.get(key, false);
    return r ? JSON.parse(r.value) : fallback;
  } catch {
    return fallback;
  }
}
async function saveKey(key, value) {
  try {
    const r = await window.storage.set(key, JSON.stringify(value), false);
    if (!r) console.error("storage.set returned null for", key);
  } catch (e) {
    console.error("storage error", key, e);
  }
}

/* ------------------------------------------------------------------ */
/*  Seed data                                                          */
/* ------------------------------------------------------------------ */
const CATEGORIES = ["Tops", "Knitwear", "Outerwear", "Bottoms", "Dresses", "Accessories"];
const SWATCHES = [
  { bg: "#1B1B20", fg: "#E9E7DF" }, { bg: "#E7E3D8", fg: "#1B1B20" },
  { bg: "#2733E6", fg: "#EDEBFF" }, { bg: "#7C8B6E", fg: "#F3F5EE" },
  { bg: "#B4634B", fg: "#FBEFE9" }, { bg: "#46505C", fg: "#E9EEF2" },
  { bg: "#C9B08A", fg: "#2A2420" }, { bg: "#5B3A56", fg: "#F3E9F1" },
];
const uid = (p = "id") => p + "_" + Math.random().toString(36).slice(2, 9);

function seedProducts() {
  const raw = [
    ["Boxy Poplin Shirt", "Tops", 78, 24, ["XS", "S", "M", "L", "XL"], "Crisp cotton poplin with a relaxed, squared silhouette. Mother-of-pearl buttons."],
    ["Merino Ribbed Knit", "Knitwear", 120, 12, ["S", "M", "L"], "Fine-gauge extra-fine merino. Warm without weight, holds its shape."],
    ["Waxed Field Jacket", "Outerwear", 245, 7, ["S", "M", "L", "XL"], "British waxed cotton, four-pocket field cut, corduroy collar."],
    ["Pleated Wide Trouser", "Bottoms", 135, 18, ["28", "30", "32", "34", "36"], "High-rise, single-pleat, fluid drape in wool-blend twill."],
    ["Bias-Cut Slip Dress", "Dresses", 165, 9, ["XS", "S", "M", "L"], "Cut on the bias in matte satin. Adjustable straps, midi length."],
    ["Structured Wool Coat", "Outerwear", 390, 4, ["S", "M", "L"], "Double-faced wool, unlined for a clean line. Concealed placket."],
    ["Cashmere Crew", "Knitwear", 210, 15, ["S", "M", "L", "XL"], "Two-ply Grade-A cashmere. The everyday luxury layer."],
    ["Cotton Tank", "Tops", 42, 40, ["XS", "S", "M", "L"], "Heavyweight ribbed cotton, scooped neck, boxed hem."],
    ["Leather Belt", "Accessories", 68, 30, ["S/M", "L/XL"], "Vegetable-tanned full-grain leather, solid brass buckle."],
    ["Silk Neck Scarf", "Accessories", 55, 3, ["One Size"], "Hand-rolled silk twill, seasonal print."],
    ["Tapered Denim", "Bottoms", 118, 22, ["28", "30", "32", "34"], "13oz Japanese selvedge, mid-rise, tapered leg."],
    ["Linen Camp Shirt", "Tops", 88, 0, ["S", "M", "L", "XL"], "Airy European linen, camp collar, patch pocket. Restocking soon."],
  ];
  return raw.map((r, i) => ({
    id: uid("prod"), name: r[0], category: r[1], price: r[2], stock: r[3],
    sizes: r[4], description: r[5], status: "active",
    colorKey: i % SWATCHES.length, image: "",
    createdAt: Date.now() - (raw.length - i) * 86400000,
  }));
}

function seedOrders(products) {
  const now = Date.now();
  const pick = (n) => products.filter(p => p.stock > 0)[n % products.length];
  const mk = (daysAgo, status, prodIdxs) => {
    const items = prodIdxs.map((pi, k) => {
      const p = pick(pi);
      return { id: p.id, name: p.name, size: p.sizes[0], price: p.price, qty: (k % 2) + 1, colorKey: p.colorKey };
    });
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const shipping = subtotal > 150 ? 0 : 12;
    return {
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      createdAt: now - daysAgo * 86400000 - Math.floor(Math.random() * 6e7),
      items, subtotal, shipping, total: subtotal + shipping, status,
      customer: { name: ["Ava Lindqvist", "Noah Carr", "Mira Okoye", "Leo Fontaine", "Saanvi Rao"][daysAgo % 5], email: "customer@example.com", address: "12 Market St, Portland, OR" },
      payment: { brand: "Visa", last4: String(4000 + daysAgo).slice(-4) },
    };
  };
  return [
    mk(0, "paid", [0, 3]), mk(1, "shipped", [2]), mk(1, "delivered", [5, 6]),
    mk(2, "delivered", [1]), mk(3, "shipped", [4, 7]), mk(4, "delivered", [0]),
    mk(5, "delivered", [3, 6]), mk(6, "pending", [2]),
  ];
}

const DEFAULT_SETTINGS = { brand: "ATELIER", tagline: "Considered clothing, made to last.", currency: "USD", symbol: "$", freeShipOver: 150, flatShip: 12, adminPass: "admin" };

/* ------------------------------------------------------------------ */
/*  Small utilities                                                    */
/* ------------------------------------------------------------------ */
const useMoney = (settings) => useCallback(
  (n) => settings.symbol + Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }),
  [settings.symbol]
);
const timeAgo = (ts) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return s + "s ago";
  const m = Math.floor(s / 60); if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60); if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
};
const STATUS_META = {
  pending: { label: "Pending", bg: "var(--warn-tint)", fg: "var(--warn)" },
  paid: { label: "Paid", bg: "var(--accent-tint)", fg: "var(--accent)" },
  shipped: { label: "Shipped", bg: "#EEF0F2", fg: "#46505C" },
  delivered: { label: "Delivered", bg: "var(--live-tint)", fg: "var(--live)" },
};

/* ------------------------------------------------------------------ */
/*  Generated product image (self-contained SVG, no external hosts)    */
/* ------------------------------------------------------------------ */
function ProductImage({ product, className }) {
  if (product.image) {
    return <img src={product.image} alt={product.name} className={className} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  }
  const sw = SWATCHES[product.colorKey % SWATCHES.length];
  const patterns = ["stripe", "grid", "solid", "diag"];
  const pat = patterns[Math.abs(hashStr(product.name)) % patterns.length];
  const pid = "p" + Math.abs(hashStr(product.id)) % 100000;
  const words = product.name.split(" ");
  const l1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const l2 = words.slice(Math.ceil(words.length / 2)).join(" ");
  return (
    <svg viewBox="0 0 300 400" className={className} style={{ width: "100%", height: "100%", display: "block" }} preserveAspectRatio="xMidYMid slice" role="img" aria-label={product.name}>
      <defs>
        {pat === "stripe" && <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill={sw.bg} /><rect width="6" height="16" fill={sw.fg} opacity="0.10" /></pattern>}
        {pat === "grid" && <pattern id={pid} width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill={sw.bg} /><path d="M26 0V26M0 26H26" stroke={sw.fg} strokeWidth="1" opacity="0.12" /></pattern>}
        {pat === "diag" && <pattern id={pid} width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="20" height="20" fill={sw.bg} /><rect width="8" height="20" fill={sw.fg} opacity="0.08" /></pattern>}
      </defs>
      <rect width="300" height="400" fill={pat === "solid" ? sw.bg : `url(#${pid})`} />
      <text x="24" y="42" fill={sw.fg} opacity="0.7" style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: 2 }}>{product.category.toUpperCase()}</text>
      <text x="24" y="352" fill={sw.fg} style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 600 }}>{l1}</text>
      {l2 && <text x="24" y="382" fill={sw.fg} style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 26, fontWeight: 600 }}>{l2}</text>}
    </svg>
  );
}
function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; } return h; }

/* ------------------------------------------------------------------ */
/*  ROOT APP                                                           */
/* ------------------------------------------------------------------ */
export default function App() {
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [activity, setActivity] = useState([]);
  const [mode, setMode] = useState("store"); // store | admin
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);

  // initial load / seed
  useEffect(() => {
    (async () => {
      let p = await loadKey(KEYS.products, null);
      let o = await loadKey(KEYS.orders, null);
      let s = await loadKey(KEYS.settings, null);
      if (!p) { p = seedProducts(); await saveKey(KEYS.products, p); }
      if (!o) { o = seedOrders(p); await saveKey(KEYS.orders, o); }
      if (!s) { s = DEFAULT_SETTINGS; await saveKey(KEYS.settings, s); }
      setProducts(p); setOrders(o); setSettings({ ...DEFAULT_SETTINGS, ...s }); setReady(true);
    })();
  }, []);

  // persistence
  useEffect(() => { if (ready) saveKey(KEYS.products, products); }, [products, ready]);
  useEffect(() => { if (ready) saveKey(KEYS.orders, orders); }, [orders, ready]);
  useEffect(() => { if (ready) saveKey(KEYS.settings, settings); }, [settings, ready]);

  const pushActivity = useCallback((text, kind = "info") => {
    setActivity(a => [{ id: uid("act"), text, kind, ts: Date.now() }, ...a].slice(0, 40));
  }, []);
  const notify = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); }, []);

  const money = useMoney(settings);

  const placeOrder = useCallback((order) => {
    setOrders(o => [order, ...o]);
    setProducts(ps => ps.map(p => {
      const bought = order.items.filter(it => it.id === p.id).reduce((s, it) => s + it.qty, 0);
      return bought ? { ...p, stock: Math.max(0, p.stock - bought) } : p;
    }));
    pushActivity(`New order ${order.id} · ${money(order.total)}`, "order");
  }, [pushActivity, money]);

  const resetAll = useCallback(async () => {
    const p = seedProducts(); const o = seedOrders(p);
    setProducts(p); setOrders(o); setSettings(DEFAULT_SETTINGS);
    await saveKey(KEYS.products, p); await saveKey(KEYS.orders, o); await saveKey(KEYS.settings, DEFAULT_SETTINGS);
    notify("Store reset to sample data");
  }, [notify]);

  if (!ready) {
    return (
      <div className="at-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <style>{STYLES}</style>
        <div style={{ textAlign: "center" }}>
          <div className="at-disp" style={{ fontSize: 22, letterSpacing: ".3em" }}>ATELIER</div>
          <div className="at-mono" style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>loading your store…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="at-root">
      <style>{STYLES}</style>
      {mode === "store" ? (
        <Storefront
          products={products} settings={settings} cart={cart} setCart={setCart}
          money={money} placeOrder={placeOrder} onEnterAdmin={() => setMode("admin")} notify={notify}
        />
      ) : (
        <Admin
          products={products} setProducts={setProducts} orders={orders} setOrders={setOrders}
          settings={settings} setSettings={setSettings} money={money}
          activity={activity} pushActivity={pushActivity} notify={notify}
          onExit={() => setMode("store")} onReset={resetAll}
        />
      )}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "var(--ink)", color: "var(--paper)", padding: "12px 20px", borderRadius: 3, zIndex: 90, fontSize: 13, fontWeight: 500 }} className="at-rise">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  STOREFRONT                                                        */
/* ================================================================== */
function Storefront({ products, settings, cart, setCart, money, placeOrder, onEnterAdmin, notify }) {
  const [view, setView] = useState("home"); // home | checkout | confirm
  const [quick, setQuick] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured");
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const addToCart = (product, size) => {
    setCart(c => {
      const key = product.id + "|" + size;
      const existing = c.find(i => i.key === key);
      if (existing) return c.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { key, id: product.id, name: product.name, size, price: product.price, colorKey: product.colorKey, image: product.image, qty: 1 }];
    });
    setQuick(null); setCartOpen(true); notify(`Added ${product.name} (${size})`);
  };
  const updateQty = (key, d) => setCart(c => c.map(i => i.key === key ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const removeItem = (key) => setCart(c => c.filter(i => i.key !== key));

  const visible = useMemo(() => {
    let list = products.filter(p => p.status === "active");
    if (cat !== "All") list = list.filter(p => p.category === cat);
    if (q.trim()) list = list.filter(p => (p.name + p.category).toLowerCase().includes(q.toLowerCase()));
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, cat, q, sort]);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= settings.freeShipOver ? 0 : settings.flatShip;

  const completeOrder = (customer, payment) => {
    const order = {
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      createdAt: Date.now(),
      items: cart.map(({ key, ...rest }) => rest),
      subtotal, shipping, total: subtotal + shipping,
      status: "paid", customer, payment,
    };
    placeOrder(order); setConfirmedOrder(order); setCart([]); setView("confirm");
  };

  if (view === "checkout") {
    return <Checkout cart={cart} subtotal={subtotal} shipping={shipping} settings={settings} money={money}
      onBack={() => setView("home")} onComplete={completeOrder} />;
  }
  if (view === "confirm" && confirmedOrder) {
    return <Confirmation order={confirmedOrder} settings={settings} money={money} onDone={() => { setView("home"); setConfirmedOrder(null); }} />;
  }

  return (
    <div>
      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(241,240,236,.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => { setView("home"); setCat("All"); }} className="at-disp" style={{ fontSize: 22, fontWeight: 700, letterSpacing: ".24em" }}>{settings.brand}</button>
          <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {["All", ...CATEGORIES].map(c => (
              <button key={c} onClick={() => setCat(c)} className="at-nav-cat"
                style={{ display: "none", padding: "8px 12px", fontSize: 13, fontWeight: 500, color: cat === c ? "var(--ink)" : "var(--muted)", borderBottom: cat === c ? "2px solid var(--ink)" : "2px solid transparent" }}>
                {c}
              </button>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setCartOpen(true)} style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="at-mono" style={{ position: "absolute", top: -8, right: -10, background: "var(--accent)", color: "#fff", fontSize: 10, minWidth: 17, height: 17, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 24px 40px" }}>
        <div className="at-eyebrow" style={{ marginBottom: 16 }}>New Season · {new Date().getFullYear()}</div>
        <h1 className="at-disp" style={{ fontSize: "clamp(38px,6vw,72px)", fontWeight: 700, lineHeight: 1.02, maxWidth: 820, margin: 0 }}>
          {settings.tagline}
        </h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 16, maxWidth: 460, marginTop: 20, lineHeight: 1.6 }}>
          {products.filter(p => p.status === "active").length} pieces in stock across {CATEGORIES.length} categories. Free shipping over {money(settings.freeShipOver)}.
        </p>
      </section>

      {/* Filter bar */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", paddingBottom: 20, borderBottom: "1px solid var(--line)", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["All", ...CATEGORIES].map(c => (
              <button key={c} onClick={() => setCat(c)} className="at-btn at-btn-sm" style={{ background: cat === c ? "var(--ink)" : "transparent", color: cat === c ? "var(--paper)" : "var(--ink-soft)", border: cat === c ? "none" : "1px solid var(--line-strong)" }}>{c}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search" className="at-field" style={{ paddingLeft: 34, width: 160 }} />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} className="at-field" style={{ width: 150 }}>
              <option value="featured">Featured</option>
              <option value="low">Price: Low–High</option>
              <option value="high">Price: High–Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 24px 80px" }}>
        {visible.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
            <p style={{ fontSize: 15 }}>Nothing matches that yet. Try another category or clear your search.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 20 }}>
            {visible.map(p => (
              <article key={p.id} className="at-prod at-rise" onClick={() => setQuick(p)}>
                <div className="at-prod-imgwrap" style={{ position: "relative" }}>
                  <ProductImage product={p} className="at-prod-img" />
                  {p.stock === 0 && <span className="at-badge" style={{ position: "absolute", top: 12, left: 12, background: "var(--ink)", color: "var(--paper)" }}>Sold out</span>}
                  {p.stock > 0 && p.stock <= 5 && <span className="at-badge" style={{ position: "absolute", top: 12, left: 12, background: "var(--warn-tint)", color: "var(--warn)" }}>Low stock</span>}
                </div>
                <div style={{ padding: "14px 14px 16px" }}>
                  <div className="at-eyebrow" style={{ marginBottom: 6 }}>{p.category}</div>
                  <div className="at-disp" style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.25 }}>{p.name}</div>
                  <div className="at-mono" style={{ fontSize: 14, marginTop: 8 }}>{money(p.price)}</div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--line)", background: "var(--ink)", color: "var(--paper)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "44px 24px", display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="at-disp" style={{ fontSize: 18, letterSpacing: ".24em", fontWeight: 700 }}>{settings.brand}</div>
            <div className="at-mono" style={{ fontSize: 11, color: "rgba(241,240,236,.55)", marginTop: 8 }}>© {new Date().getFullYear()} — All rights reserved</div>
          </div>
          <button onClick={onEnterAdmin} className="at-btn at-btn-sm" style={{ background: "rgba(255,255,255,.08)", color: "var(--paper)" }}>
            <Lock size={13} /> Admin panel
          </button>
        </div>
      </footer>

      {/* Quick view */}
      {quick && <QuickView product={quick} settings={settings} money={money} onClose={() => setQuick(null)} onAdd={addToCart} />}

      {/* Cart drawer */}
      {cartOpen && (
        <>
          <div className="at-scrim" onClick={() => setCartOpen(false)} />
          <aside className="at-drawer at-scroll">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 22px", borderBottom: "1px solid var(--line)" }}>
              <div className="at-disp" style={{ fontSize: 16, fontWeight: 700 }}>Your bag · {cartCount}</div>
              <button onClick={() => setCartOpen(false)}><X size={20} /></button>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: "8px 0" }} className="at-scroll">
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--muted)" }}>
                  <ShoppingBag size={32} style={{ opacity: .4 }} />
                  <p style={{ marginTop: 14, fontSize: 14 }}>Your bag is empty.</p>
                  <button onClick={() => setCartOpen(false)} className="at-btn at-btn-ghost at-btn-sm" style={{ marginTop: 16 }}>Keep shopping</button>
                </div>
              ) : cart.map(item => (
                <div key={item.key} style={{ display: "flex", gap: 12, padding: "14px 22px", borderBottom: "1px solid var(--line)" }}>
                  <div style={{ width: 62, height: 82, flexShrink: 0, overflow: "hidden" }}><ProductImage product={item} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="at-disp" style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                    <div className="at-mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>Size {item.size}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--line-strong)", borderRadius: 2 }}>
                        <button onClick={() => updateQty(item.key, -1)} style={{ padding: "6px 9px" }}><Minus size={13} /></button>
                        <span className="at-mono" style={{ fontSize: 13, minWidth: 22, textAlign: "center" }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.key, 1)} style={{ padding: "6px 9px" }}><Plus size={13} /></button>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span className="at-mono" style={{ fontSize: 13 }}>{money(item.price * item.qty)}</span>
                        <button onClick={() => removeItem(item.key)} style={{ color: "var(--muted)" }}><Trash2 size={15} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ borderTop: "1px solid var(--line)", padding: "18px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: "var(--muted)" }}>Subtotal</span><span className="at-mono">{money(subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 14 }}>
                  <span style={{ color: "var(--muted)" }}>Shipping</span><span className="at-mono">{shipping === 0 ? "Free" : money(shipping)}</span>
                </div>
                <button onClick={() => { setCartOpen(false); setView("checkout"); }} className="at-btn at-btn-primary" style={{ width: "100%" }}>
                  Checkout · {money(subtotal + shipping)} <ArrowRight size={15} />
                </button>
              </div>
            )}
          </aside>
        </>
      )}
    </div>
  );
}

function QuickView({ product, settings, money, onClose, onAdd }) {
  const [size, setSize] = useState(null);
  const soldOut = product.stock === 0;
  return (
    <>
      <div className="at-scrim" onClick={onClose} />
      <div className="at-modal" onClick={onClose}>
        <div className="at-card at-rise" onClick={e => e.stopPropagation()} style={{ maxWidth: 780, width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden", marginTop: 40 }}>
          <div style={{ aspectRatio: "3/4", background: "var(--paper)", minWidth: 0 }}><ProductImage product={product} /></div>
          <div style={{ padding: 28, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="at-eyebrow">{product.category}</span>
              <button onClick={onClose}><X size={18} /></button>
            </div>
            <h2 className="at-disp" style={{ fontSize: 26, fontWeight: 700, marginTop: 12, lineHeight: 1.1 }}>{product.name}</h2>
            <div className="at-mono" style={{ fontSize: 18, marginTop: 10 }}>{money(product.price)}</div>
            <p style={{ color: "var(--ink-soft)", fontSize: 14, lineHeight: 1.6, marginTop: 16 }}>{product.description}</p>
            <div style={{ marginTop: "auto", paddingTop: 20 }}>
              <div className="at-label">Select size</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)} disabled={soldOut} className="at-mono"
                    style={{ padding: "9px 14px", fontSize: 12, border: "1px solid " + (size === s ? "var(--ink)" : "var(--line-strong)"), background: size === s ? "var(--ink)" : "transparent", color: size === s ? "var(--paper)" : "var(--ink)", borderRadius: 2 }}>{s}</button>
                ))}
              </div>
              <button disabled={soldOut || !size} onClick={() => onAdd(product, size)} className="at-btn at-btn-primary" style={{ width: "100%" }}>
                {soldOut ? "Sold out" : !size ? "Choose a size" : <>Add to bag <ShoppingBag size={15} /></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Checkout({ cart, subtotal, shipping, settings, money, onBack, onComplete }) {
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", zip: "", card: "", exp: "", cvc: "" });
  const [processing, setProcessing] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const cardFmt = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const expFmt = (v) => v.replace(/\D/g, "").slice(0, 4).replace(/(.{2})(.+)/, "$1/$2");
  const total = subtotal + shipping;

  const valid = form.name && /\S+@\S+/.test(form.email) && form.address && form.city && form.zip
    && form.card.replace(/\s/g, "").length === 16 && form.exp.length === 5 && form.cvc.length >= 3;

  const submit = () => {
    if (!valid || processing) return;
    setProcessing(true);
    // ── Simulated gateway. Replace this block with a real charge in production ──
    setTimeout(() => {
      onComplete(
        { name: form.name, email: form.email, address: `${form.address}, ${form.city} ${form.zip}` },
        { brand: "Visa", last4: form.card.replace(/\s/g, "").slice(-4) }
      );
    }, 1400);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={{ borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--muted)" }}><ArrowLeft size={16} /> Back to store</button>
          <div className="at-disp" style={{ fontSize: 18, letterSpacing: ".24em", fontWeight: 700 }}>{settings.brand}</div>
        </div>
      </header>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40 }}>
        <div>
          <h1 className="at-disp" style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Checkout</h1>
          <span className="at-badge" style={{ background: "var(--accent-tint)", color: "var(--accent)", marginBottom: 24 }}>Test mode — no real charge</span>

          <section style={{ marginTop: 28 }}>
            <div className="at-eyebrow" style={{ marginBottom: 14 }}>01 — Contact & shipping</div>
            <Field label="Full name" value={form.name} onChange={set("name")} placeholder="Ava Lindqvist" />
            <Field label="Email" value={form.email} onChange={set("email")} placeholder="you@email.com" type="email" />
            <Field label="Address" value={form.address} onChange={set("address")} placeholder="12 Market St" />
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
              <Field label="City" value={form.city} onChange={set("city")} placeholder="Portland" />
              <Field label="ZIP" value={form.zip} onChange={set("zip")} placeholder="97201" />
            </div>
          </section>

          <section style={{ marginTop: 28 }}>
            <div className="at-eyebrow" style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><CreditCard size={13} /> 02 — Payment</div>
            <Field label="Card number" value={form.card} onChange={(e) => setForm(f => ({ ...f, card: cardFmt(e.target.value) }))} placeholder="4242 4242 4242 4242" mono />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Expiry" value={form.exp} onChange={(e) => setForm(f => ({ ...f, exp: expFmt(e.target.value) }))} placeholder="12/28" mono />
              <Field label="CVC" value={form.cvc} onChange={(e) => setForm(f => ({ ...f, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))} placeholder="123" mono />
            </div>
            <p className="at-mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Use any 16-digit number — this is a demo gateway.</p>
          </section>

          <button onClick={submit} disabled={!valid || processing} className="at-btn at-btn-primary" style={{ width: "100%", marginTop: 28, padding: "15px" }}>
            {processing ? "Processing payment…" : <>Pay {money(total)} <Lock size={14} /></>}
          </button>
        </div>

        <aside>
          <div className="at-card" style={{ padding: 22, position: "sticky", top: 24 }}>
            <div className="at-eyebrow" style={{ marginBottom: 16 }}>Order summary</div>
            {cart.map(i => (
              <div key={i.key} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 58, flexShrink: 0, overflow: "hidden" }}><ProductImage product={i} /></div>
                <div style={{ flex: 1 }}>
                  <div className="at-disp" style={{ fontSize: 13, fontWeight: 600 }}>{i.name}</div>
                  <div className="at-mono" style={{ fontSize: 11, color: "var(--muted)" }}>{i.size} · ×{i.qty}</div>
                </div>
                <div className="at-mono" style={{ fontSize: 13 }}>{money(i.price * i.qty)}</div>
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--line)", marginTop: 8, paddingTop: 14 }}>
              <Row label="Subtotal" value={money(subtotal)} />
              <Row label="Shipping" value={shipping === 0 ? "Free" : money(shipping)} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                <span className="at-disp" style={{ fontWeight: 700 }}>Total</span>
                <span className="at-mono" style={{ fontWeight: 700, fontSize: 16 }}>{money(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
const Row = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
    <span style={{ color: "var(--muted)" }}>{label}</span><span className="at-mono">{value}</span>
  </div>
);
const Field = ({ label, mono, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    <label className="at-label">{label}</label>
    <input className={"at-field" + (mono ? " at-mono" : "")} {...props} />
  </div>
);

function Confirmation({ order, settings, money, onDone }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="at-card at-rise" style={{ maxWidth: 460, width: "100%", padding: 40, textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--live-tint)", color: "var(--live)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Check size={28} />
        </div>
        <h1 className="at-disp" style={{ fontSize: 24, fontWeight: 700 }}>Order confirmed</h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 8 }}>Thanks, {order.customer.name.split(" ")[0]}. A receipt is on its way to {order.customer.email}.</p>
        <div className="at-card" style={{ padding: 18, marginTop: 24, textAlign: "left", background: "var(--paper)" }}>
          <Row label="Order number" value={order.id} />
          <Row label="Items" value={order.items.reduce((s, i) => s + i.qty, 0)} />
          <Row label="Paid" value={money(order.total)} />
          <Row label="Card" value={`${order.payment.brand} ···· ${order.payment.last4}`} />
        </div>
        <button onClick={onDone} className="at-btn at-btn-dark" style={{ width: "100%", marginTop: 24 }}>Continue shopping</button>
        <p className="at-mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 14 }}>This order is now live in the admin dashboard.</p>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  ADMIN                                                             */
/* ================================================================== */
function Admin(props) {
  const { settings } = props;
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [nav, setNav] = useState("dashboard");

  if (!authed) {
    const attempt = () => {
      if (pass === settings.adminPass) { setAuthed(true); setErr(""); }
      else setErr("That passcode doesn't match. Try again.");
    };
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div className="at-card at-rise" style={{ maxWidth: 380, width: "100%", padding: 36 }}>
          <div className="at-disp" style={{ fontSize: 20, letterSpacing: ".24em", fontWeight: 700, textAlign: "center" }}>{settings.brand}</div>
          <div className="at-eyebrow" style={{ textAlign: "center", marginTop: 6, marginBottom: 28 }}>Operations · Admin access</div>
          <label className="at-label">Passcode</label>
          <div style={{ position: "relative" }}>
            <input type={show ? "text" : "password"} value={pass} autoFocus
              onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && attempt()}
              className="at-field at-mono" placeholder="••••••" style={{ paddingRight: 40 }} />
            <button onClick={() => setShow(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
          {err && <p style={{ color: "var(--warn)", fontSize: 12, marginTop: 8 }}>{err}</p>}
          <button onClick={attempt} className="at-btn at-btn-dark" style={{ width: "100%", marginTop: 20 }}>Enter dashboard</button>
          <p className="at-mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 16, textAlign: "center" }}>Demo passcode: <b>{settings.adminPass}</b> — change it in Settings.</p>
          <button onClick={props.onExit} style={{ width: "100%", marginTop: 12, fontSize: 12, color: "var(--muted)" }}>← Back to storefront</button>
        </div>
      </div>
    );
  }

  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: Receipt },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={{ width: 232, background: "var(--ink)", color: "var(--paper)", padding: "24px 16px", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0 }}>
        <div style={{ padding: "0 8px 24px" }}>
          <div className="at-disp" style={{ fontSize: 17, letterSpacing: ".2em", fontWeight: 700 }}>{settings.brand}</div>
          <div className="at-mono" style={{ fontSize: 10, color: "rgba(241,240,236,.5)", marginTop: 4 }}>ADMIN CONSOLE</div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          {NAV.map(n => {
            const I = n.icon;
            return <button key={n.id} onClick={() => setNav(n.id)} className={"at-navitem" + (nav === n.id ? " active" : "")}><I size={17} /> {n.label}</button>;
          })}
        </nav>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 12 }}>
          <button onClick={props.onExit} className="at-navitem"><StoreIcon size={17} /> View storefront</button>
          <button onClick={() => setAuthed(false)} className="at-navitem"><LogOut size={17} /> Sign out</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, overflow: "auto" }} className="at-scroll">
        {nav === "dashboard" && <Dashboard {...props} />}
        {nav === "products" && <ProductsManager {...props} />}
        {nav === "orders" && <OrdersManager {...props} />}
        {nav === "settings" && <SettingsPanel {...props} />}
      </main>
    </div>
  );
}

/* ---------- Dashboard ---------- */
function Dashboard({ products, orders, money, activity, pushActivity }) {
  const [clock, setClock] = useState(new Date());
  const [simulate, setSimulate] = useState(false);
  useEffect(() => { const t = setInterval(() => setClock(new Date()), 1000); return () => clearInterval(t); }, []);

  // optional demo traffic — clearly labelled, off by default
  useEffect(() => {
    if (!simulate) return;
    const active = products.filter(p => p.status === "active" && p.stock > 0);
    const t = setInterval(() => {
      const p = active[Math.floor(Math.random() * active.length)];
      if (!p) return;
      const verbs = ["viewed", "added to cart", "is browsing"];
      pushActivity(`Visitor ${verbs[Math.floor(Math.random() * verbs.length)]} ${p.name}`, "traffic");
    }, 3200);
    return () => clearInterval(t);
  }, [simulate, products, pushActivity]);

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const units = orders.reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty, 0), 0);
    const aov = orders.length ? revenue / orders.length : 0;
    const lowStock = products.filter(p => p.status === "active" && p.stock > 0 && p.stock <= 5);
    const outStock = products.filter(p => p.stock === 0);
    return { revenue, units, aov, orders: orders.length, lowStock, outStock };
  }, [orders, products]);

  const chartData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
      const next = d.getTime() + 86400000;
      const rev = orders.filter(o => o.createdAt >= d.getTime() && o.createdAt < next).reduce((s, o) => s + o.total, 0);
      days.push({ day: d.toLocaleDateString(undefined, { weekday: "short" }), revenue: rev });
    }
    return days;
  }, [orders]);

  const topProducts = useMemo(() => {
    const map = {};
    orders.forEach(o => o.items.forEach(i => { map[i.name] = (map[i.name] || 0) + i.qty; }));
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [orders]);

  const recent = orders.slice(0, 6);

  return (
    <div style={{ padding: 32, maxWidth: 1200 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 className="at-disp" style={{ fontSize: 26, fontWeight: 700 }}>Dashboard</h1>
            <span className="at-badge" style={{ background: "var(--live-tint)", color: "var(--live)" }}><span className="at-pulse" /> Live</span>
          </div>
          <div className="at-mono" style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>{clock.toLocaleString(undefined, { weekday: "long", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={simulate} onChange={e => setSimulate(e.target.checked)} /> Simulate live traffic (demo)
        </label>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard icon={DollarSign} label="Total revenue" value={money(stats.revenue)} accent="var(--accent)" />
        <StatCard icon={ShoppingCart} label="Orders" value={stats.orders} accent="var(--ink)" />
        <StatCard icon={TrendingUp} label="Avg order value" value={money(stats.aov)} accent="var(--live)" />
        <StatCard icon={Boxes} label="Units sold" value={stats.units} accent="var(--ink)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Revenue chart */}
        <div className="at-card" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
            <div className="at-eyebrow">Revenue · last 7 days</div>
            <div className="at-mono" style={{ fontSize: 13, fontWeight: 700 }}>{money(chartData.reduce((s, d) => s + d.revenue, 0))}</div>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2733E6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2733E6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEE" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#7A7A84", fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#7A7A84", fontFamily: "Space Mono" }} axisLine={false} tickLine={false} width={44} />
                <Tooltip contentStyle={{ borderRadius: 4, border: "1px solid #E4E3DD", fontSize: 12, fontFamily: "Space Mono" }} formatter={(v) => [money(v), "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#2733E6" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live activity */}
        <div className="at-card" style={{ padding: 22, display: "flex", flexDirection: "column" }}>
          <div className="at-eyebrow" style={{ marginBottom: 16 }}>Live activity</div>
          <div style={{ flex: 1, overflow: "auto", maxHeight: 224, display: "flex", flexDirection: "column", gap: 12 }} className="at-scroll">
            {activity.length === 0 ? (
              <div style={{ color: "var(--muted)", fontSize: 13, textAlign: "center", paddingTop: 40 }}>
                Waiting for activity…<br /><span className="at-mono" style={{ fontSize: 11 }}>Place an order or enable demo traffic.</span>
              </div>
            ) : activity.map(a => (
              <div key={a.id} className="at-rise" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, marginTop: 6, background: a.kind === "order" ? "var(--live)" : a.kind === "traffic" ? "var(--accent)" : "var(--muted)", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, lineHeight: 1.4 }}>{a.text}</div>
                  <div className="at-mono" style={{ fontSize: 10, color: "var(--muted)" }}>{timeAgo(a.ts)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent orders */}
        <div className="at-card">
          <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)" }} className="at-eyebrow">Recent orders</div>
          <table className="at-table">
            <tbody>
              {recent.map(o => (
                <tr key={o.id}>
                  <td className="at-mono" style={{ fontSize: 12 }}>{o.id}</td>
                  <td style={{ fontSize: 13 }}>{o.customer.name}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className="at-mono" style={{ textAlign: "right", fontSize: 13 }}>{money(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Inventory + top sellers */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {(stats.lowStock.length > 0 || stats.outStock.length > 0) && (
            <div className="at-card" style={{ padding: 20 }}>
              <div className="at-eyebrow" style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14, color: "var(--warn)" }}><AlertTriangle size={13} /> Inventory alerts</div>
              {stats.outStock.map(p => <AlertRow key={p.id} name={p.name} note="Sold out" tone="var(--warn)" />)}
              {stats.lowStock.map(p => <AlertRow key={p.id} name={p.name} note={`${p.stock} left`} tone="var(--warn)" />)}
            </div>
          )}
          <div className="at-card" style={{ padding: 20 }}>
            <div className="at-eyebrow" style={{ marginBottom: 14 }}>Best sellers</div>
            {topProducts.length === 0 ? <p style={{ fontSize: 13, color: "var(--muted)" }}>No sales yet.</p> :
              topProducts.map(([name, qty], i) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <span className="at-mono" style={{ fontSize: 12, color: "var(--muted)", width: 18 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ flex: 1, fontSize: 13 }}>{name}</span>
                  <span className="at-mono" style={{ fontSize: 12 }}>{qty} sold</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
const StatCard = ({ icon: I, label, value, accent }) => (
  <div className="at-card" style={{ padding: 20 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
      <span className="at-eyebrow">{label}</span>
      <span style={{ color: accent }}><I size={17} /></span>
    </div>
    <div className="at-stat-num">{value}</div>
  </div>
);
const AlertRow = ({ name, note, tone }) => (
  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
    <span>{name}</span><span className="at-mono" style={{ fontSize: 12, color: tone }}>{note}</span>
  </div>
);
const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META.pending;
  return <span className="at-badge" style={{ background: m.bg, color: m.fg }}>{m.label}</span>;
};

/* ---------- Products manager ---------- */
function ProductsManager({ products, setProducts, notify, pushActivity }) {
  const [editing, setEditing] = useState(null); // product | 'new' | null
  const [q, setQ] = useState("");
  const money = useMoney(DEFAULT_SETTINGS);

  const filtered = products.filter(p => (p.name + p.category).toLowerCase().includes(q.toLowerCase()));

  const save = (data) => {
    if (data.id && products.some(p => p.id === data.id)) {
      setProducts(ps => ps.map(p => p.id === data.id ? data : p));
      notify(`Updated “${data.name}”`);
    } else {
      const created = { ...data, id: uid("prod"), createdAt: Date.now() };
      setProducts(ps => [created, ...ps]);
      pushActivity(`Product added · ${data.name}`, "info");
      notify(`Added “${data.name}”`);
    }
    setEditing(null);
  };
  const remove = (p) => { setProducts(ps => ps.filter(x => x.id !== p.id)); notify(`Removed “${p.name}”`); };

  return (
    <div style={{ padding: 32, maxWidth: 1200 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="at-disp" style={{ fontSize: 26, fontWeight: 700 }}>Products</h1>
          <div className="at-mono" style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{products.length} items · {products.filter(p => p.status === "active").length} live</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products" className="at-field" style={{ paddingLeft: 34, width: 200 }} />
          </div>
          <button onClick={() => setEditing("new")} className="at-btn at-btn-primary at-btn-sm"><Plus size={15} /> Add product</button>
        </div>
      </div>

      <div className="at-card" style={{ overflow: "hidden" }}>
        <table className="at-table">
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 52, flexShrink: 0, overflow: "hidden", borderRadius: 2 }}><ProductImage product={p} /></div>
                    <span className="at-disp" style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</span>
                  </div>
                </td>
                <td style={{ color: "var(--muted)" }}>{p.category}</td>
                <td className="at-mono">{money(p.price)}</td>
                <td className="at-mono" style={{ color: p.stock === 0 ? "var(--warn)" : p.stock <= 5 ? "var(--warn)" : "var(--ink)" }}>{p.stock}</td>
                <td><span className="at-badge" style={{ background: p.status === "active" ? "var(--live-tint)" : "#EEE", color: p.status === "active" ? "var(--live)" : "var(--muted)" }}>{p.status}</span></td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                    <button onClick={() => setEditing(p)} style={{ padding: 7, color: "var(--muted)" }}><Pencil size={15} /></button>
                    <button onClick={() => remove(p)} style={{ padding: 7, color: "var(--muted)" }}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <ProductEditor product={editing === "new" ? null : editing} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}

function ProductEditor({ product, onSave, onClose }) {
  const [f, setF] = useState(product || { name: "", category: CATEGORIES[0], price: "", stock: "", sizes: ["S", "M", "L"], description: "", status: "active", colorKey: Math.floor(Math.random() * SWATCHES.length), image: "" });
  const [sizeInput, setSizeInput] = useState("");
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const valid = f.name.trim() && f.price !== "" && f.stock !== "";
  const submit = () => valid && onSave({ ...f, price: Number(f.price), stock: Number(f.stock) });

  return (
    <>
      <div className="at-scrim" onClick={onClose} />
      <div className="at-modal" onClick={onClose}>
        <div className="at-card at-rise" onClick={e => e.stopPropagation()} style={{ maxWidth: 560, width: "100%", marginTop: 30, maxHeight: "88vh", overflow: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--line)", position: "sticky", top: 0, background: "var(--surface)", zIndex: 1 }}>
            <h2 className="at-disp" style={{ fontSize: 18, fontWeight: 700 }}>{product ? "Edit product" : "New product"}</h2>
            <button onClick={onClose}><X size={20} /></button>
          </div>
          <div style={{ padding: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 18, marginBottom: 18 }}>
              <div style={{ aspectRatio: "3/4", overflow: "hidden", borderRadius: 2, border: "1px solid var(--line)" }}>
                <ProductImage product={{ ...f, id: f.id || "preview" }} />
              </div>
              <div>
                <label className="at-label">Product name</label>
                <input value={f.name} onChange={e => set("name", e.target.value)} className="at-field" placeholder="Boxy Poplin Shirt" style={{ marginBottom: 12 }} />
                <label className="at-label">Description</label>
                <textarea value={f.description} onChange={e => set("description", e.target.value)} className="at-field" rows={2} placeholder="Short product story…" style={{ resize: "vertical" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label className="at-label">Category</label>
                <select value={f.category} onChange={e => set("category", e.target.value)} className="at-field">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="at-label">Price</label><input type="number" value={f.price} onChange={e => set("price", e.target.value)} className="at-field at-mono" placeholder="0" /></div>
              <div><label className="at-label">Stock</label><input type="number" value={f.stock} onChange={e => set("stock", e.target.value)} className="at-field at-mono" placeholder="0" /></div>
            </div>

            <label className="at-label">Sizes</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {f.sizes.map(s => (
                <span key={s} className="at-mono" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", border: "1px solid var(--line-strong)", borderRadius: 2, fontSize: 12 }}>
                  {s}<button onClick={() => set("sizes", f.sizes.filter(x => x !== s))} style={{ color: "var(--muted)" }}><X size={12} /></button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input value={sizeInput} onChange={e => setSizeInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && sizeInput.trim()) { set("sizes", [...f.sizes, sizeInput.trim()]); setSizeInput(""); } }} className="at-field" placeholder="Add a size + Enter" style={{ flex: 1 }} />
            </div>

            <label className="at-label">Image URL <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional — leave blank for a generated tile)</span></label>
            <input value={f.image} onChange={e => set("image", e.target.value)} className="at-field" placeholder="https://…" style={{ marginBottom: 16 }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                <input type="checkbox" checked={f.status === "active"} onChange={e => set("status", e.target.checked ? "active" : "draft")} />
                Live on storefront
              </label>
              <button onClick={() => set("colorKey", (f.colorKey + 1) % SWATCHES.length)} className="at-btn at-btn-ghost at-btn-sm"><RotateCcw size={13} /> Swatch</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, padding: "16px 24px", borderTop: "1px solid var(--line)", position: "sticky", bottom: 0, background: "var(--surface)" }}>
            <button onClick={onClose} className="at-btn at-btn-ghost" style={{ flex: 1 }}>Cancel</button>
            <button onClick={submit} disabled={!valid} className="at-btn at-btn-primary" style={{ flex: 2 }}>{product ? "Save changes" : "Add product"}</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Orders manager ---------- */
function OrdersManager({ orders, setOrders, money, pushActivity }) {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);
  const FLOW = ["pending", "paid", "shipped", "delivered"];

  const list = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const setStatus = (id, status) => {
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
    pushActivity(`Order ${id} → ${STATUS_META[status].label}`, "info");
    setOpen(o => o && o.id === id ? { ...o, status } : o);
  };

  return (
    <div style={{ padding: 32, maxWidth: 1200 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="at-disp" style={{ fontSize: 26, fontWeight: 700 }}>Orders</h1>
        <div className="at-mono" style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{orders.length} total · {money(orders.reduce((s, o) => s + o.total, 0))} lifetime</div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {["all", ...FLOW].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="at-btn at-btn-sm" style={{ background: filter === f ? "var(--ink)" : "transparent", color: filter === f ? "var(--paper)" : "var(--ink-soft)", border: filter === f ? "none" : "1px solid var(--line-strong)", textTransform: "capitalize" }}>{f}</button>
        ))}
      </div>

      <div className="at-card" style={{ overflow: "hidden" }}>
        <table className="at-table">
          <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Date</th><th>Status</th><th>Total</th></tr></thead>
          <tbody>
            {list.map(o => (
              <tr key={o.id} onClick={() => setOpen(o)} style={{ cursor: "pointer" }}>
                <td className="at-mono" style={{ fontSize: 12 }}>{o.id}</td>
                <td style={{ fontSize: 13 }}>{o.customer.name}</td>
                <td className="at-mono" style={{ fontSize: 13 }}>{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                <td className="at-mono" style={{ fontSize: 12, color: "var(--muted)" }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td><StatusBadge status={o.status} /></td>
                <td className="at-mono" style={{ fontWeight: 700 }}>{money(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontSize: 14 }}>No orders with this status yet.</div>}
      </div>

      {open && (
        <>
          <div className="at-scrim" onClick={() => setOpen(null)} />
          <aside className="at-drawer at-scroll" style={{ background: "var(--surface)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 22px", borderBottom: "1px solid var(--line)" }}>
              <div>
                <div className="at-disp" style={{ fontSize: 17, fontWeight: 700 }}>{open.id}</div>
                <div className="at-mono" style={{ fontSize: 11, color: "var(--muted)" }}>{new Date(open.createdAt).toLocaleString()}</div>
              </div>
              <button onClick={() => setOpen(null)}><X size={20} /></button>
            </div>
            <div style={{ padding: 22, overflow: "auto" }} className="at-scroll">
              <div className="at-eyebrow" style={{ marginBottom: 10 }}>Update status</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
                {FLOW.map(s => (
                  <button key={s} onClick={() => setStatus(open.id, s)} className="at-btn at-btn-sm" style={{ background: open.status === s ? STATUS_META[s].fg : "transparent", color: open.status === s ? "#fff" : "var(--ink-soft)", border: open.status === s ? "none" : "1px solid var(--line-strong)", textTransform: "capitalize" }}>{s}</button>
                ))}
              </div>

              <div className="at-eyebrow" style={{ marginBottom: 10 }}>Customer</div>
              <div className="at-card" style={{ padding: 14, background: "var(--paper)", marginBottom: 22 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{open.customer.name}</div>
                <div className="at-mono" style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{open.customer.email}</div>
                <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 6 }}>{open.customer.address}</div>
              </div>

              <div className="at-eyebrow" style={{ marginBottom: 10 }}>Items</div>
              {open.items.map((i, k) => (
                <div key={k} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 42, height: 56, overflow: "hidden", flexShrink: 0 }}><ProductImage product={i} /></div>
                  <div style={{ flex: 1 }}>
                    <div className="at-disp" style={{ fontSize: 13, fontWeight: 600 }}>{i.name}</div>
                    <div className="at-mono" style={{ fontSize: 11, color: "var(--muted)" }}>{i.size} · ×{i.qty}</div>
                  </div>
                  <div className="at-mono" style={{ fontSize: 13 }}>{money(i.price * i.qty)}</div>
                </div>
              ))}
              <div style={{ borderTop: "1px solid var(--line)", marginTop: 12, paddingTop: 14 }}>
                <Row label="Subtotal" value={money(open.subtotal)} />
                <Row label="Shipping" value={open.shipping === 0 ? "Free" : money(open.shipping)} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                  <span className="at-disp" style={{ fontWeight: 700 }}>Total</span>
                  <span className="at-mono" style={{ fontWeight: 700, fontSize: 15 }}>{money(open.total)}</span>
                </div>
                <div className="at-mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 12 }}>Paid · {open.payment.brand} ···· {open.payment.last4}</div>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

/* ---------- Settings ---------- */
function SettingsPanel({ settings, setSettings, notify, onReset }) {
  const [f, setF] = useState(settings);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const save = () => { setSettings({ ...f, freeShipOver: Number(f.freeShipOver), flatShip: Number(f.flatShip) }); notify("Settings saved"); };

  return (
    <div style={{ padding: 32, maxWidth: 640 }}>
      <h1 className="at-disp" style={{ fontSize: 26, fontWeight: 700, marginBottom: 24 }}>Settings</h1>

      <div className="at-card" style={{ padding: 24, marginBottom: 20 }}>
        <div className="at-eyebrow" style={{ marginBottom: 18 }}>Brand</div>
        <label className="at-label">Store name</label>
        <input value={f.brand} onChange={e => set("brand", e.target.value)} className="at-field at-disp" style={{ marginBottom: 16, fontSize: 16, letterSpacing: ".1em" }} />
        <label className="at-label">Tagline</label>
        <input value={f.tagline} onChange={e => set("tagline", e.target.value)} className="at-field" />
      </div>

      <div className="at-card" style={{ padding: 24, marginBottom: 20 }}>
        <div className="at-eyebrow" style={{ marginBottom: 18 }}>Commerce</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div><label className="at-label">Currency code</label><input value={f.currency} onChange={e => set("currency", e.target.value)} className="at-field at-mono" /></div>
          <div><label className="at-label">Currency symbol</label><input value={f.symbol} onChange={e => set("symbol", e.target.value)} className="at-field at-mono" /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div><label className="at-label">Free shipping over</label><input type="number" value={f.freeShipOver} onChange={e => set("freeShipOver", e.target.value)} className="at-field at-mono" /></div>
          <div><label className="at-label">Flat shipping rate</label><input type="number" value={f.flatShip} onChange={e => set("flatShip", e.target.value)} className="at-field at-mono" /></div>
        </div>
      </div>

      <div className="at-card" style={{ padding: 24, marginBottom: 20 }}>
        <div className="at-eyebrow" style={{ marginBottom: 18 }}>Security</div>
        <label className="at-label">Admin passcode</label>
        <input value={f.adminPass} onChange={e => set("adminPass", e.target.value)} className="at-field at-mono" style={{ maxWidth: 220 }} />
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>Used to reach this admin console from the storefront.</p>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={save} className="at-btn at-btn-primary">Save settings</button>
        <button onClick={onReset} className="at-btn at-btn-ghost"><RotateCcw size={14} /> Reset store to sample data</button>
      </div>
    </div>
  );
}
