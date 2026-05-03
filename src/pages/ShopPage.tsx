import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ShoppingBag, ArrowLeft, Star, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const FALLBACK_MERCH = [
  { name: "3GMG Classic Tee", price: 35, category: "apparel", description: "Rep the brand. Premium cotton." },
  { name: "Hood's Paparazzi Hoodie", price: 55, category: "apparel", description: "Stay warm. Stay real." },
  { name: "Meadowbrook Snapback", price: 30, category: "accessories", description: "Fort Worth fitted." },
  { name: "Fort Worth Rep Tee", price: 35, category: "apparel", description: "817 all day." },
];

export default function ShopPage() {
  const products = useQuery(api.commandCenter.getMerchProducts);
  const items = (products && products.length > 0) ? products : FALLBACK_MERCH;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0ece4]">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-orange-500/10 to-transparent">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-[#D4A843] text-sm mb-8 hover:text-[#E8C767] transition-colors"><ArrowLeft className="size-4" /> Back to Home</Link>
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag className="size-5 text-orange-400" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-orange-400 uppercase">Official Merch</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl tracking-wider mb-4">3GMG <span className="text-[#D4A843]">MERCH</span></h1>
          <p className="text-[#888078] max-w-xl text-lg">Official Meadowbrook Montrell merch. Rep the movement.</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item: any, idx: number) => (
            <div key={item._id || idx} className="group bg-[#141414]/80 border border-[#D4A843]/10 rounded-lg overflow-hidden hover:border-[#D4A843]/30 transition-all hover:shadow-[0_0_30px_rgba(212,168,67,0.1)]">
              {/* Product Image Placeholder */}
              <div className="aspect-square bg-gradient-to-br from-[#1a1a1a] to-[#111] flex items-center justify-center relative overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <ShoppingBag className="size-16 text-[#D4A843]/20 mx-auto mb-2" />
                    <span className="text-[10px] text-[#555] tracking-widest uppercase">{item.category}</span>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#D4A843]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-[#D4A843] text-[#0a0a0a] font-bold text-sm px-6 py-2.5 rounded transform scale-95 group-hover:scale-100 transition-transform">COMING SOON</span>
                </div>
              </div>
              <div className="p-5">
                <span className="text-[9px] font-bold tracking-widest uppercase text-[#D4A843]/70">{item.category}</span>
                <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mt-1">{item.name}</h3>
                {item.description && <p className="text-xs text-[#888] mt-1 line-clamp-2">{item.description}</p>}
                <div className="flex items-center justify-between mt-4">
                  <span className="font-display text-2xl text-[#D4A843]">${item.price}</span>
                  {item.inventory !== undefined && item.inventory <= 10 && (
                    <span className="text-[9px] font-bold tracking-widest uppercase text-red-400 bg-red-500/10 px-2 py-1 rounded">Low Stock</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-[#141414]/60 border border-[#D4A843]/15 rounded-lg p-12">
          <ShoppingBag className="size-12 text-[#D4A843] mx-auto mb-4" />
          <h3 className="font-display text-2xl text-[#D4A843] tracking-wider mb-3">MORE MERCH COMING SOON</h3>
          <p className="text-[#888] max-w-md mx-auto mb-6">Full online store launching soon. Follow @meadowbrookmontrell for drop announcements.</p>
          <a href="https://www.instagram.com/meadowbrookmontrell" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-sm px-6 py-3 rounded hover:bg-[#E8C767] transition-all">
            Follow for Drops <ExternalLink className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
