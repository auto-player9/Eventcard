import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import {
  ArrowIcon,
  BoxIcon,
  GlobeIcon,
  MobileIcon,
  ReceiptIcon,
  TickIcon,
  WebIcon,
  WrenchIcon,
} from "@/components/Icons";
import { EventCardItem, SynclyDiagram } from "@/components/Products";
import { SYNCLY_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services — Estware",
  description:
    "Custom web apps, mobile apps, websites, POS, warehouse systems and IT support from Estware, plus ready-made products: Syncly and EventCard.",
};

const SERVICES = [
  {
    Icon: WebIcon,
    title: "Web applications",
    text: "Dashboards, portals and internal tools shaped around how your team actually works.",
    get: ["Requirements and screen designs you approve first", "A fast, secure app built on modern technology", "Admin tools to manage your own data"],
  },
  {
    Icon: MobileIcon,
    title: "Mobile apps",
    text: "Apps for iOS and Android, for your customers or for your staff in the field.",
    get: ["One shared codebase for both platforms where it fits", "Publishing to the App Store and Google Play", "Updates and fixes after launch"],
  },
  {
    Icon: GlobeIcon,
    title: "Websites",
    text: "Modern sites that explain what you do clearly and turn visitors into leads.",
    get: ["Design that matches your brand", "Fast loading on phones", "Content you can update yourself"],
  },
  {
    Icon: ReceiptIcon,
    title: "POS and retail systems",
    text: "Point of sale for shops, restaurants and cafés, connected directly to your stock.",
    get: ["Sales, receipts and end-of-day cash-up", "Product and price management", "Reports on what sells and when"],
  },
  {
    Icon: BoxIcon,
    title: "Warehouse and inventory",
    text: "Stock, orders and fulfilment tracked in one place, across every location.",
    get: ["Stock levels per location", "Picking and packing for orders", "Full history of every stock movement"],
  },
  {
    Icon: WrenchIcon,
    title: "IT support",
    text: "Practical help that keeps your systems running and your team productive.",
    get: ["Fixes and regular maintenance", "Backups and monitoring of key systems", "Someone to call when something breaks"],
  },
];

const MODULES = [
  { title: "Warehouse", text: "Track stock, locations and every movement." },
  { title: "Point of sale", text: "Sell in store and update stock instantly." },
  { title: "Online store", text: "Sell online from the same inventory." },
  { title: "Delivery", text: "Manage and track orders on their way to customers." },
];

export default function ServicesPage() {
  return (
    <>
      <Hero
        compact
        title="Services and products"
        lead="Custom software for companies with a problem to solve, and ready-made products for businesses that want to start today."
      >
        <Link className="btn btn-primary" href="/#contact">
          Start a project <ArrowIcon />
        </Link>
        <Link className="btn btn-ghost" href="#syncly">
          See our products
        </Link>
      </Hero>

      <section className="band" aria-labelledby="custom-title">
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <h2 id="custom-title">Custom software</h2>
              <p className="lead">
                Every project starts with your problem. Here is what we can build for you and what you get with it.
              </p>
            </div>
          </div>
          <div style={{ marginTop: 44 }}>
            {SERVICES.map(({ Icon, title, text, get }) => (
              <article key={title} className="svc reveal">
                <div className="svc-t">
                  <Icon />
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
                <div className="get">
                  <p className="small">What you get</p>
                  <ul className="ticks">
                    {get.map((g) => (
                      <li key={g}>
                        <TickIcon />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band products" id="syncly" aria-labelledby="syncly-title">
        <div className="wrap prod">
          <div className="reveal">
            <span className="kicker">Our products</span>
            <h2 id="syncly-title">Syncly</h2>
            <p className="lead">
              One platform for the whole business: warehouse, point of sale, online store and delivery share the same
              inventory, so every sale updates stock everywhere at once.
            </p>
            <div className="modules">
              {MODULES.map((m) => (
                <div key={m.title} className="module">
                  <b>{m.title}</b>
                  <span>{m.text}</span>
                </div>
              ))}
            </div>
            <p className="who">Built for retail shops, restaurants and cafés.</p>
            <div className="actions">
              <a className="btn btn-primary" href={SYNCLY_URL}>
                Visit Syncly <ArrowIcon />
              </a>
            </div>
          </div>
          <SynclyDiagram bare />
        </div>
        <div className="wrap">
          <EventCardItem />
        </div>
      </section>

      <section className="band on-night" aria-labelledby="cta-title">
        <div className="wrap cta-band reveal">
          <div>
            <h2 id="cta-title">Not sure what you need?</h2>
            <p className="lead">
              Describe the problem in a few lines. We&apos;ll suggest the right approach and give you an estimate.
            </p>
          </div>
          <Link className="btn btn-primary" href="/#contact">
            Tell us the problem <ArrowIcon />
          </Link>
        </div>
      </section>
    </>
  );
}
