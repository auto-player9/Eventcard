import Link from "next/link";
import {
  ArrowIcon,
  BagIcon,
  BoxIcon,
  ClockIcon,
  PinIcon,
  ReceiptIcon,
  RingsIcon,
  TruckIcon,
} from "./Icons";
import { EVENTCARD_DEMO_URL } from "@/lib/site";

const NODES = [
  { left: "20%", top: "18%", Icon: BoxIcon, title: "Warehouse", text: "Stock and locations" },
  { left: "80%", top: "18%", Icon: ReceiptIcon, title: "Point of sale", text: "Sales in store" },
  { left: "20%", top: "82%", Icon: BagIcon, title: "Online store", text: "Orders from the web" },
  { left: "80%", top: "82%", Icon: TruckIcon, title: "Delivery", text: "Orders on the way" },
];

/** Syncly: four modules connected to one shared inventory hub. */
export function SynclyDiagram({ bare = false }: { bare?: boolean }) {
  return (
    <div
      className={bare ? "diagram reveal bare" : "diagram reveal"}
      role="img"
      aria-label="Syncly: warehouse, point of sale, online store and delivery, all connected to one shared inventory"
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="20" y1="18" x2="50" y2="50" />
        <line x1="80" y1="18" x2="50" y2="50" />
        <line x1="20" y1="82" x2="50" y2="50" />
        <line x1="80" y1="82" x2="50" y2="50" />
      </svg>
      {NODES.map(({ left, top, Icon, title, text }) => (
        <div key={title} className="node" style={{ left, top }}>
          <Icon />
          <b>{title}</b>
          <span>{text}</span>
        </div>
      ))}
      <div className="hub">Shared inventory</div>
    </div>
  );
}

/** EventCard: text on one side, a stylised phone showing an invitation on the other. */
export function EventCardItem() {
  return (
    <div className="work-item prod flip">
      <div className="reveal">
        <span className="kicker">Digital invitations</span>
        <h3 className="proj">EventCard</h3>
        <p className="lead">
          Wedding invitations guests open on their phone: event details with a map, RSVP with guest
          numbers and messages, gift information and background music, in Arabic and English.
        </p>
        <div className="actions">
          <a className="btn btn-primary" href={EVENTCARD_DEMO_URL}>
            View live demo <ArrowIcon />
          </a>
          <Link className="btn btn-ghost" href="/#contact">
            Ask about EventCard
          </Link>
        </div>
      </div>
      <div className="invite-art reveal" aria-hidden="true">
        <div className="phone">
          <div className="inv">
            <div className="mono"><RingsIcon /></div>
            <span className="bar t" style={{ width: "62%" }} />
            <span className="bar" style={{ width: "78%" }} />
            <span className="bar" style={{ width: "46%" }} />
            <div className="inv-row">
              <PinIcon />
              <span className="bar" style={{ width: "70%" }} />
            </div>
            <div className="inv-row">
              <ClockIcon />
              <span className="bar" style={{ width: "45%" }} />
            </div>
            <div className="map"><PinIcon /></div>
            <div className="rsvp">RSVP</div>
          </div>
        </div>
      </div>
    </div>
  );
}
