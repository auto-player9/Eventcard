import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ArrowIcon, BoxIcon, GlobeIcon, MobileIcon, ReceiptIcon, WebIcon, WrenchIcon } from "@/components/Icons";
import { EventCardItem, SynclyDiagram } from "@/components/Products";
import { ContactForm } from "@/components/ContactForm";
import { CONTACT_EMAIL, SYNCLY_URL } from "@/lib/site";

const SERVICES = [
  { Icon: WebIcon, title: "Web applications", text: "Dashboards, portals and internal tools shaped around how your team works." },
  { Icon: MobileIcon, title: "Mobile apps", text: "iOS and Android apps for your customers or your staff." },
  { Icon: GlobeIcon, title: "Websites", text: "Modern sites that explain what you do and turn visitors into leads." },
  { Icon: ReceiptIcon, title: "POS and retail systems", text: "Point of sale for shops, restaurants and cafés, connected to your stock." },
  { Icon: BoxIcon, title: "Warehouse and inventory", text: "Stock, orders and fulfilment tracked in one place, across locations." },
  { Icon: WrenchIcon, title: "IT support", text: "Help that keeps your systems running and your team productive." },
];

const STEPS = [
  { title: "Understand", text: "We start with your business and the problem you need solved, not the technology." },
  { title: "Design", text: "You see the flows and screens and approve them before any code is written." },
  { title: "Build", text: "We build in short steps and show you working progress as we go." },
  { title: "Support", text: "After launch we stay on to fix, improve and keep everything running." },
];

export default function HomePage() {
  return (
    <>
      <Hero
        title="We solve business problems and create new technologies."
        lead="Estware means software that estimates value. We study your problem, design the right solution and build it, from web and mobile apps to our own products like Syncly."
      >
        <Link className="btn btn-primary" href="#contact">
          Start a project <ArrowIcon />
        </Link>
        <Link className="btn btn-ghost" href="/services">
          See our services
        </Link>
      </Hero>

      <section className="band" id="services" aria-labelledby="services-title">
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <h2 id="services-title">What we build</h2>
              <p className="lead">Tell us the problem. We design the software that fixes it, build it, and keep it running.</p>
            </div>
            <Link className="btn btn-ghost" href="/services">
              All services <ArrowIcon />
            </Link>
          </div>
          <div className="grid">
            {SERVICES.map(({ Icon, title, text }) => (
              <article key={title} className="card reveal">
                <Icon />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band products" id="work" aria-labelledby="work-title">
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <h2 id="work-title">Our work</h2>
              <p className="lead">Products we designed, built and run ourselves.</p>
            </div>
          </div>
          <div className="work-item prod">
            <div className="reveal">
              <span className="kicker">Commerce platform</span>
              <h3 className="proj">Syncly</h3>
              <p className="lead">
                Warehouse, point of sale, online store and delivery, all running on one shared inventory. Sell in the
                shop and online without counting stock twice.
              </p>
              <p className="who">Built for retail shops, restaurants and cafés.</p>
              <div className="actions">
                <a className="btn btn-primary" href={SYNCLY_URL}>
                  Visit Syncly <ArrowIcon />
                </a>
                <Link className="btn btn-ghost" href="/services#syncly">
                  How it works
                </Link>
              </div>
            </div>
            <SynclyDiagram />
          </div>
          <EventCardItem />
        </div>
      </section>

      <section className="band process" id="process" aria-labelledby="process-title">
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <h2 id="process-title">How we work</h2>
              <p className="lead">A clear path from your problem to working software, with you involved at every step.</p>
            </div>
          </div>
          <ol className="steps reveal">
            {STEPS.map(({ title, text }) => (
              <li key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band on-night" id="contact" aria-labelledby="contact-title">
        <div className="wrap contact">
          <div className="reveal">
            <h2 id="contact-title">Have a problem to solve?</h2>
            <p className="lead">Tell us what you need. We&apos;ll reply with questions, a plan and an estimate.</p>
            <a className="mail" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
