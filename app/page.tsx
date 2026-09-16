import { ControlRoom } from "@/components/control-room";
import { HomeContinuation } from "@/components/home-continuation";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return <><SiteHeader /><main><ControlRoom /><HomeContinuation /></main></>;
}
